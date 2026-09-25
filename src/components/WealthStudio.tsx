import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Users,
  CheckCircle2,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  Presentation,
  Check,
  FileCheck2,
  BookOpen,
  ArrowUpRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AgentProfile, BrandingOptions, WealthMaterial } from '../types/index';
import { WEALTH_MATERIALS } from '../data/wealthMaterials';
import { brandWealthMaterialPdf, downloadSingleWealthMaterial } from '../utils/wealthBrander';
import { AgentProfileForm } from './AgentProfileForm';

// Set worker source for pdfjsLib
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`;
}

interface WealthStudioProps {
  profile: AgentProfile;
  onUpdateProfile: (updated: AgentProfile) => void;
  onSaveProfile: () => void;
  onResetProfile: () => void;
  saveStatus: string | null;
  options: BrandingOptions;
  onOptionsChange: (updated: BrandingOptions) => void;
  onBatchDownloadAll: () => void;
  isBatchGenerating: boolean;
  materials?: WealthMaterial[];
}

export const WealthStudio: React.FC<WealthStudioProps> = ({
  profile,
  onUpdateProfile,
  onSaveProfile,
  onResetProfile,
  saveStatus,
  options,
  onOptionsChange,
  onBatchDownloadAll,
  isBatchGenerating,
  materials,
}) => {
  const allMaterials = materials || WEALTH_MATERIALS;

  // Active material state
  const [activeMaterial, setActiveMaterial] = useState<WealthMaterial>(allMaterials[0]);

  // Keep activeMaterial updated if materials state changes (e.g. admin custom upload)
  useEffect(() => {
    if (materials) {
      const match = materials.find((m) => m.id === activeMaterial.id);
      if (match) setActiveMaterial(match);
    }
  }, [materials]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Preview & Pagination State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(activeMaterial.teamPageNumber || 1);
  const [totalPages, setTotalPages] = useState<number>(activeMaterial.pages);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloadingSingle, setIsDownloadingSingle] = useState(false);

  // ResizeObserver to automatically calculate full-page fit
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // When material changes, set default page (Page 5 for team brochure, Page 1 for others)
  useEffect(() => {
    if (activeMaterial.hasTeamSection && activeMaterial.teamPageNumber) {
      setCurrentPage(activeMaterial.teamPageNumber);
    } else {
      setCurrentPage(1);
    }
  }, [activeMaterial.id]);

  // Load and brand PDF using wealthBrander & pdfjs-dist
  useEffect(() => {
    if (activeMaterial.format !== 'pdf') {
      setIsLoading(false);
      setPdfDoc(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    async function loadBrandedDoc() {
      try {
        const brandedBytes = await brandWealthMaterialPdf(activeMaterial, profile);
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
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Failed to render Wealth PDF preview:', err);
          setError(err.message || 'Error generating branded PDF preview');
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
  }, [activeMaterial, profile]);

  // Render current page onto canvas
  useEffect(() => {
    let renderTask: any = null;
    let isCancelled = false;

    async function renderPage() {
      if (!pdfDoc || !canvasRef.current || activeMaterial.format !== 'pdf') return;

      try {
        const safePageNum = Math.max(1, Math.min(currentPage, pdfDoc.numPages));
        const page = await pdfDoc.getPage(safePageNum);
        if (isCancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const baseViewport = page.getViewport({ scale: 1.0 });
        const containerWidth = containerRef.current ? Math.max(280, containerRef.current.clientWidth - 40) : 500;
        const containerHeight = containerRef.current ? Math.max(380, containerRef.current.clientHeight - 40) : 650;

        const scaleW = containerWidth / baseViewport.width;
        const scaleH = containerHeight / baseViewport.height;
        const autoFitScale = Math.min(scaleW, scaleH);
        const finalScale = autoFitScale * scale;

        const pixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: finalScale });

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });

        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException' && !isCancelled) {
          console.warn('Canvas render interrupted:', err);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale, containerSize, activeMaterial.format]);

  // Single download handler
  const handleDownloadActive = async () => {
    try {
      setIsDownloadingSingle(true);
      await downloadSingleWealthMaterial(activeMaterial, profile);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    } finally {
      setIsDownloadingSingle(false);
    }
  };

  // Filtered materials for bottom gallery
  const filteredMaterials = allMaterials.filter((mat) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'brochure') return mat.category === 'brochure';
    if (selectedCategory === 'specialization') return mat.categoryLabel === 'Investment Specializations';
    if (selectedCategory === 'flyer') return mat.categoryLabel === 'Flyers & FAQs';
    if (selectedCategory === 'questionnaire') return mat.category === 'questionnaire';
    if (selectedCategory === 'presentation') return mat.category === 'presentation';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Studio Header Banner - Full Width Background */}
      <section className="w-full bg-gradient-to-r from-[#004372] via-[#005c99] to-[#0076BD] text-white shadow-md relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-sky-200">
            <Briefcase className="w-3.5 h-3.5 text-sky-300" />
            <span>Simplicity Wealth Institutional Advisor Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-white leading-tight">
            Co-Brand Simplicity Wealth Materials with Your Logo, Bios & Headshots
          </h1>

          <p className="text-sky-100 text-xs sm:text-sm leading-relaxed max-w-5xl">
            Customize all {allMaterials.length} institutional materials—including prestige brochures, investment specialization flyers, client questionnaires, and presentation decks. Upload your headshot(s), add personalized advisor biographies, and stamp your firm logo and contact details across every asset.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-sky-200">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              14 Institutional Wealth Assets
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Advisor Photos & Bios Customization
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              1-Click Batch ZIP Export
            </span>
          </div>
        </div>
      </section>

      {/* Main Studio Body - Constrained Site Width */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Main Studio Two-Column Workspace */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Advisor Profile & Team Bios Form (5 cols) */}
          <div className="lg:col-span-5 h-[840px] sm:h-[880px] lg:h-[900px]">
            <AgentProfileForm
              profile={profile}
              onChange={onUpdateProfile}
              options={options}
              onOptionsChange={onOptionsChange}
              onSave={onSaveProfile}
              onReset={onResetProfile}
              saveStatus={saveStatus}
              initialTab="team"
            />
          </div>

          {/* Right Column: Live Interactive Preview Pane (7 cols) */}
          <div className="lg:col-span-7 h-[840px] sm:h-[880px] lg:h-[900px] flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
            
            {/* Top Info Bar */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#0076BD]/10 text-[#0076BD]">
                  {activeMaterial.categoryLabel}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                  {activeMaterial.format === 'pptx' ? `${activeMaterial.pages} Slides` : `${activeMaterial.pages} Pages`}
                </span>
                {activeMaterial.hasTeamSection && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-600" />
                    Custom Bios & Photos
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 truncate" title={activeMaterial.title}>
                {activeMaterial.title}
              </h2>
            </div>

            {/* Download Single Button */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadActive}
                disabled={isDownloadingSingle}
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-[#0076BD] hover:bg-[#00629e] shadow-xs active:scale-95 transition-all"
              >
                {isDownloadingSingle ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                )}
                <span>Download {activeMaterial.format.toUpperCase()}</span>
              </button>
            </div>
          </div>

          {/* Quick Page Jump Navigation (For Multi-Page Brochures & Flyers) */}
          {activeMaterial.format === 'pdf' && (
            <div className="px-4 py-2 bg-white flex items-center justify-between gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">Quick Jump:</span>
                
                {/* Page 1 (Cover) */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    currentPage === 1
                      ? 'bg-[#004372] text-white shadow-2xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Page 1 (Cover)
                </button>

                {/* If Team Brochure, emphasize Page 5 Team Bios */}
                {activeMaterial.id === 'our-team-brochure' && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(5)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${
                      currentPage === 5
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    <span>Page 5 (Advisor Team & Bios)</span>
                  </button>
                )}

                {/* Back / Contact Page */}
                {activeMaterial.pages > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(activeMaterial.pages)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      currentPage === activeMaterial.pages
                        ? 'bg-[#004372] text-white shadow-2xs font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Page {activeMaterial.pages} (Contact)
                  </button>
                )}
              </div>

              {/* Standard Page Switcher & Zoom */}
              <div className="flex items-center space-x-1.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-[11px] font-bold text-slate-700 min-w-16 text-center">
                  {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="h-3 w-px bg-slate-200 mx-1" />

                <button
                  type="button"
                  onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
                  className="p-1 rounded-md text-slate-600 hover:bg-slate-100"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.min(2.0, s + 0.15))}
                  className="p-1 rounded-md text-slate-600 hover:bg-slate-100"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setScale(1.0)}
                  className="p-1 rounded-md text-slate-600 hover:bg-slate-100"
                  title="Reset Fit"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Live Preview Canvas Container */}
          <div
            ref={containerRef}
            className="flex-1 bg-slate-100/80 p-4 flex items-center justify-center overflow-auto relative"
          >
            {activeMaterial.format === 'pdf' ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-10 space-y-2">
                    <Loader2 className="w-8 h-8 text-[#0076BD] animate-spin" />
                    <span className="text-xs font-semibold text-slate-700">
                      Branding Simplicity Wealth document...
                    </span>
                  </div>
                )}

                {error ? (
                  <div className="max-w-md p-4 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                    <div className="text-xs font-bold text-rose-900">Preview Error</div>
                    <div className="text-[11px] text-rose-700">{error}</div>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    className="shadow-md rounded-md bg-white transition-all duration-150"
                  />
                )}
              </>
            ) : (
              /* PowerPoint Presentation Deck Interactive Card */
              <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-md text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Presentation className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    33-Slide Executive Slide Deck (.pptx)
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Investment Partnership Presentation
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    A comprehensive slide deck introducing your firm and Simplicity Wealth. Designed for executive client meetings, seminars, and pitch presentations.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2.5 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#0076BD]" />
                    <span>Presentation Highlights & Structure:</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
                    <li><strong className="text-slate-800">Slide 1 (Title):</strong> Ready for your firm logo co-branding.</li>
                    <li><strong className="text-slate-800">Slides 2–14:</strong> Fiduciary philosophy & portfolio architecture.</li>
                    <li><strong className="text-slate-800">Slides 15–26:</strong> AssetLock downside protection & direct indexing.</li>
                    <li><strong className="text-slate-800">Slide 33 (Contact):</strong> Direct advisor contact block and disclosures.</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadActive}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-[#0076BD] hover:bg-[#00629e] shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Presentation Deck (.PPTX)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar inside preview pane */}
          <div className="px-4 py-2.5 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Changes in profile form update preview automatically
            </span>
            <span className="text-slate-400">
              Format: {activeMaterial.format.toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Catalog of all 14 Simplicity Wealth Materials */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#0076BD] mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Simplicity Wealth Materials Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Browse All 14 Client-Facing Assets
            </h2>
            <p className="text-xs text-slate-500">
              Click any card to load its live interactive preview or download the co-branded document immediately.
            </p>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            Showing <strong className="text-slate-900">{filteredMaterials.length}</strong> of {allMaterials.length} materials
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All (${allMaterials.length})` },
            { id: 'brochure', label: 'Brochures (3)' },
            { id: 'specialization', label: 'Investment Specializations (5)' },
            { id: 'flyer', label: 'Flyers & FAQs (2)' },
            { id: 'questionnaire', label: 'Questionnaires (3)' },
            { id: 'presentation', label: 'Presentations (1)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#004372] text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Materials Grid (14 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMaterials.map((mat) => {
            const isSelected = activeMaterial.id === mat.id;
            const thumbnailPath = `${import.meta.env.BASE_URL}wealth_thumbnails/${mat.id}.png`;

            return (
              <div
                key={mat.id}
                onClick={() => {
                  setActiveMaterial(mat);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className={`bg-white rounded-2xl transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-[#0076BD]'
                    : ''
                }`}
              >
                {/* Thumbnail Preview Banner */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                  {mat.format === 'pptx' ? (
                    <div className="w-full h-full bg-gradient-to-tr from-[#003152] via-[#004372] to-[#0076BD] flex flex-col items-center justify-center p-4 text-white text-center">
                      <Presentation className="w-12 h-12 text-amber-300 mb-2" />
                      <div className="text-xs font-bold uppercase tracking-wider">
                        Executive Slide Deck
                      </div>
                      <div className="text-[10px] text-sky-200">33 Presentation Slides</div>
                    </div>
                  ) : (
                    <img
                      src={thumbnailPath}
                      alt={mat.title}
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}

                  {/* Active selection badge */}
                  {isSelected && (
                    <div className="absolute top-2 left-2 bg-[#0076BD] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Active Preview</span>
                    </div>
                  )}

                  {/* Page count pill */}
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {mat.format === 'pptx' ? `${mat.pages} Slides` : `${mat.pages} Pages`}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#0076BD] truncate">
                        {mat.categoryLabel}
                      </span>
                      {mat.hasTeamSection && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                          Bio & Photo
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0076BD] transition-colors leading-snug">
                      {mat.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {mat.description}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMaterial(mat);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center text-xs font-semibold text-[#0076BD] hover:text-[#005c99] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSingleWealthMaterial(mat, profile);
                      }}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-[#0076BD] text-slate-700 hover:text-white transition-all shadow-2xs cursor-pointer"
                      title={`Download ${mat.title}`}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      <span>{mat.format.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      </div>
    </div>
  );
};
