import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Loader2,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { AgentProfile, BrandingOptions, FinancialGuide } from '../types';
import { brandFinancialGuidePdf } from '../utils/pdfBrander';

// Set worker source to the worker file copied to public
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`;
}

interface LivePreviewProps {
  guide: FinancialGuide;
  profile: AgentProfile;
  options: BrandingOptions;
  allGuides: FinancialGuide[];
  onSelectGuide: (guide: FinancialGuide) => void;
  onDownloadCurrent: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  guide,
  profile,
  options,
  allGuides,
  onSelectGuide,
  onDownloadCurrent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(guide.pages || 13);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [renderCounter, setRenderCounter] = useState<number>(0);

  // When guide changes, default to Cover Page (Page 1)
  useEffect(() => {
    setCurrentPage(1);
  }, [guide.id]);

  // 1. Generate branded PDF bytes and load into PDF.js
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    async function loadBrandedDoc() {
      try {
        const brandedBytes = await brandFinancialGuidePdf(guide, profile, options);
        if (isCancelled) return;

        const loadingTask = pdfjsLib.getDocument({
          data: brandedBytes.slice(),
          cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setRenderCounter((prev) => prev + 1);
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Failed to render PDF preview:', err);
          setError(err.message || 'Error generating PDF preview');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    const timer = setTimeout(loadBrandedDoc, 250);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [guide, profile, options]);

  // 2. Render current page on canvas
  useEffect(() => {
    let renderTask: any = null;
    let isCancelled = false;

    async function renderPage() {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const safePageNum = Math.max(1, Math.min(currentPage, pdfDoc.numPages));
        const page = await pdfDoc.getPage(safePageNum);
        if (isCancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Auto-scale to fit container width nicely (approx 480-540px width)
        const baseViewport = page.getViewport({ scale: 1.0 });
        const containerWidth = containerRef.current ? containerRef.current.clientWidth - 48 : 500;
        const targetWidth = Math.min(containerWidth, 540);
        const autoScale = (targetWidth / baseViewport.width) * scale;

        const viewport = page.getViewport({ scale: Math.max(0.6, autoScale) });

        // High-DPI crisp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(1, 0, 0, 1, 0, 0); // reset
        context.scale(dpr, dpr);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.warn('Page render error:', err);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask && renderTask.cancel) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale, renderCounter]);

  // Jump handlers
  const contactPageNum = Math.max(1, totalPages - 2); // N-2 (e.g. 13 - 2 = 11)
  const disclosurePageNum = totalPages;               // N   (e.g. 13)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Top Bar with Guide Selector & Direct Jump Controls */}
      <div className="border-b border-slate-200 bg-white p-3.5 sm:px-6 space-y-3">
        {/* Row 1: Title & Page Badge */}
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-[#0076BD]" />
          <span className="text-sm font-bold text-slate-900">Guide Preview</span>
          <span className="text-xs bg-sky-100 text-[#0076BD] px-2.5 py-0.5 rounded-full font-bold">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Row 2: Guide Dropdown & Page Jump Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <select
            value={guide.id}
            onChange={(e) => {
              const selected = allGuides.find((g) => g.id === e.target.value);
              if (selected) onSelectGuide(selected);
            }}
            className="text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800 outline-none flex-1 max-w-sm shadow-xs"
          >
            {allGuides.map((g, idx) => (
              <option key={g.id} value={g.id}>
                {idx + 1}. {g.title}
              </option>
            ))}
          </select>

          {/* Jump to Critical Pages: Cover, Contact, Disclosure */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold border border-slate-200/60 self-start sm:self-auto">
            <button
              onClick={() => setCurrentPage(1)}
              title="View cover page"
              className={`px-3 py-1 rounded-md transition-all ${
                currentPage === 1
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cover
            </button>
            <button
              onClick={() => setCurrentPage(contactPageNum)}
              title="View contact page"
              className={`px-3 py-1 rounded-md transition-all ${
                currentPage === contactPageNum
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => setCurrentPage(disclosurePageNum)}
              title="View disclosure page"
              className={`px-3 py-1 rounded-md transition-all ${
                currentPage === disclosurePageNum
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Disclosure
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area: Renders the EXACT Real PDF Document */}
      <div
        ref={containerRef}
        className="flex-1 bg-slate-100/90 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center relative min-h-[500px]"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-xs flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-[#0076BD] animate-spin mb-2" />
            <span className="text-xs font-bold text-slate-700">Rendering Actual PDF...</span>
          </div>
        )}

        {error ? (
          <div className="bg-white p-6 rounded-xl border border-red-200 text-center max-w-sm">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Preview Error</h4>
            <p className="text-xs text-slate-500 mt-1">{error}</p>
          </div>
        ) : (
          <div className="shadow-2xl rounded-lg overflow-hidden border border-slate-300 bg-white">
            <canvas ref={canvasRef} className="block mx-auto" />
          </div>
        )}
      </div>

      {/* Interactive Bottom Control Bar */}
      <div className="border-t border-slate-100 p-3 sm:px-6 bg-white flex flex-wrap items-center justify-between gap-3">
        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || isLoading}
            className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-xs"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-700 min-w-[90px] text-center">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || isLoading}
            className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-xs"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setScale((s) => Math.max(0.7, s - 0.15))}
            className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors shadow-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-600 w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(1.8, s + 0.15))}
            className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors shadow-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(1.0)}
            className="px-2 py-1 text-[11px] rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors shadow-xs"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>

        {/* Download Button */}
        <button
          onClick={onDownloadCurrent}
          className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-[#0076BD] hover:bg-[#00629e] text-white shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download This PDF
        </button>
      </div>
    </div>
  );
};
