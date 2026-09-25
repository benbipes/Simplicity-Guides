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
  AlertCircle,
  Calendar,
  MapPin,
  Clock,
  Share2
} from 'lucide-react';
import { AgentProfile, BrandingOptions, CollegeMaterial } from '../types/index';
import { COLLEGE_MATERIALS } from '../data/collegeMaterials';
import { brandCollegeDocument, downloadBrandedCollegeMaterial } from '../utils/collegeBrander';
import { AgentProfileForm } from './AgentProfileForm';

// Set worker source for pdfjsLib
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`;
}

interface CollegePlanningStudioProps {
  profile: AgentProfile;
  onUpdateProfile: (updated: AgentProfile) => void;
  onSaveProfile: () => void;
  onResetProfile: () => void;
  saveStatus: string | null;
  options: BrandingOptions;
  onOptionsChange: (updated: BrandingOptions) => void;
  onBatchDownloadAll: () => void;
  isBatchGenerating: boolean;
  materials?: CollegeMaterial[];
}

export const CollegePlanningStudio: React.FC<CollegePlanningStudioProps> = ({
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
  const allMaterials = materials || COLLEGE_MATERIALS;

  // Active material state
  const [activeMaterial, setActiveMaterial] = useState<CollegeMaterial>(allMaterials[0]);

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

  // When material changes, set default page
  useEffect(() => {
    if (activeMaterial.hasTeamSection && activeMaterial.teamPageNumber) {
      setCurrentPage(activeMaterial.teamPageNumber);
    } else {
      setCurrentPage(1);
    }
  }, [activeMaterial.id]);

  // Load and brand PDF using collegeBrander & pdfjs-dist
  useEffect(() => {
    if (activeMaterial.format !== 'pdf') {
      setIsLoading(false);
      setPdfDoc(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    const loadAndRender = async () => {
      try {
        const brandedBytes = await brandCollegeDocument(activeMaterial, profile);
        if (isCancelled) return;

        const loadingTask = pdfjsLib.getDocument({ data: brandedBytes });
        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load College Planning document preview:', err);
        if (!isCancelled) {
          setError('Failed to render preview. The file may be loading or formatting.');
          setIsLoading(false);
        }
      }
    };

    loadAndRender();

    return () => {
      isCancelled = true;
    };
  }, [
    activeMaterial.id,
    activeMaterial.customFileBytes,
    profile.name,
    profile.company,
    profile.title,
    profile.phone,
    profile.email,
    profile.website,
    profile.address,
    profile.logoDataUrl,
    profile.logoWhiteDataUrl,
    profile.disclaimer,
    profile.workshopEvent?.date,
    profile.workshopEvent?.time,
    profile.workshopEvent?.locationName,
    profile.workshopEvent?.locationAddress,
    JSON.stringify(profile.teamMembers),
  ]);

  // Render active page to canvas with full-page fit
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || activeMaterial.format !== 'pdf') return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled || !canvasRef.current) return;

        const baseViewport = page.getViewport({ scale: 1.0 });

        let fitScale = 1.0;
        if (containerSize.width > 0 && containerSize.height > 0) {
          const availW = Math.max(containerSize.width - 32, 280);
          const availH = Math.max(containerSize.height - 32, 380);
          fitScale = Math.min(availW / baseViewport.width, availH / baseViewport.height);
          fitScale = Math.max(fitScale, 0.4);
        }

        const effectiveScale = fitScale * scale;
        const viewport = page.getViewport({ scale: effectiveScale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Canvas render page error:', err);
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPage, scale, containerSize]);

  // Download active document handler
  const handleDownloadActive = async () => {
    setIsDownloadingSingle(true);
    try {
      await downloadBrandedCollegeMaterial(activeMaterial, profile);
    } catch (err) {
      console.error('Failed to download single college material:', err);
    } finally {
      setIsDownloadingSingle(false);
    }
  };

  // Filter materials by category
  const filteredMaterials = allMaterials.filter((mat) => {
    if (selectedCategory === 'all') return true;
    return mat.category === selectedCategory;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Studio Header Banner - Full Width Background */}
      <section
        className="w-full bg-[#efefef] shadow-sm relative overflow-hidden"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/90 shadow-xs px-3 py-1 rounded-full text-xs font-semibold text-[#004372]">
            <Presentation className="w-3.5 h-3.5 text-[#0076BD]" />
            <span>Simplifying College Planning Consumer Workshop Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-[#004372] leading-tight">
            Workshops, Presentation & Marketing Materials Studio
          </h1>

          <p className="text-black/70 text-xs sm:text-sm leading-relaxed max-w-5xl">
            Brand and customize all {allMaterials.length} turnkey workshop materials—including the 54-slide consumer presentation deck, client invitation flyers, student course workbooks, discovery questionnaires, presenter bio sheets, appointment cards, and AFES educational track collateral.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-black/70">
            <span className="flex items-center gap-1.5 bg-white/90 shadow-xs px-3 py-1.5 rounded-lg text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              16 Turnkey Workshop Assets
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 shadow-xs px-3 py-1.5 rounded-lg text-slate-700">
              <Presentation className="w-3.5 h-3.5 text-emerald-600" />
              54-Slide Presentation Deck
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 shadow-xs px-3 py-1.5 rounded-lg text-slate-700">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              Presenter Photos & Biographies
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 shadow-xs px-3 py-1.5 rounded-lg text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              1-Click Batch ZIP Export
            </span>
          </div>
        </div>
      </section>

      {/* Main Studio Body - Constrained Site Width */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Main Studio Two-Column Workspace */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Advisor Profile & Workshop Event Form (5 cols) */}
          <div className="lg:col-span-5 h-[840px] sm:h-[880px] lg:h-[900px] flex flex-col space-y-4">
            <div className="flex-1 overflow-hidden">
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
                      Presenter Bios & Photos
                    </span>
                  )}
                  {activeMaterial.hasEventDetails && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-600" />
                      Event Details
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
                  className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-[#0076BD] hover:bg-[#00629e] shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  {isDownloadingSingle ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download {activeMaterial.format.toUpperCase()}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Jump Navigation for Multi-Page Materials */}
            {activeMaterial.pages > 1 && activeMaterial.format === 'pdf' && (
              <div className="px-4 py-2 bg-slate-100/80 flex items-center justify-between text-xs text-slate-600 overflow-x-auto">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-2">
                  Quick Jumps:
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                      currentPage === 1 ? 'bg-[#0076BD] text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Page 1
                  </button>

                  {activeMaterial.teamPageNumber && (
                    <button
                      type="button"
                      onClick={() => setCurrentPage(activeMaterial.teamPageNumber!)}
                      className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                        currentPage === activeMaterial.teamPageNumber ? 'bg-[#0076BD] text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Presenter Bios (P{activeMaterial.teamPageNumber})
                    </button>
                  )}

                  {activeMaterial.contactPages?.filter(p => p !== 1 && p !== activeMaterial.teamPageNumber).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                        currentPage === p ? 'bg-[#0076BD] text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Contact (P{p})
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage(activeMaterial.pages)}
                    className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                      currentPage === activeMaterial.pages ? 'bg-[#0076BD] text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Final Page (P{activeMaterial.pages})
                  </button>
                </div>
              </div>
            )}

            {/* Canvas / Presentation Preview Pane */}
            <div
              ref={containerRef}
              className="flex-1 bg-slate-100/90 relative overflow-auto flex items-center justify-center p-4 min-h-[460px]"
            >
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#0076BD] animate-spin mb-2" />
                  <p className="text-xs font-semibold text-slate-600">Generating live branded preview...</p>
                </div>
              )}

              {error && (
                <div className="text-center p-6 bg-red-50 rounded-xl text-red-600 max-w-sm">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <p className="text-xs font-semibold">{error}</p>
                </div>
              )}

              {activeMaterial.format === 'pptx' ? (
                /* PowerPoint Presentation Deck Preview Card */
                <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-xs">
                    <Presentation className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                      Microsoft PowerPoint Deck
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{activeMaterial.title}</h3>
                    <p className="text-xs text-slate-500">{activeMaterial.subtitle}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3.5 text-left text-xs space-y-2 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Total Slides:</span>
                      <strong className="text-slate-900 font-bold">54 Slides</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Slide 1 (Title):</span>
                      <strong className="text-slate-900 font-bold">Advisor Logo Stamped</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Slide 54 (End):</span>
                      <strong className="text-slate-900 font-bold">Advisor Credentials</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadActive}
                    disabled={isDownloadingSingle}
                    className="w-full py-2.5 px-4 bg-[#0076BD] hover:bg-[#00629e] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download PowerPoint Presentation (.pptx)
                  </button>
                </div>
              ) : (
                /* Live Canvas for PDF Materials */
                <canvas ref={canvasRef} className="shadow-lg rounded-sm bg-white" />
              )}
            </div>

            {/* Bottom Controls Bar */}
            {activeMaterial.format === 'pdf' && (
              <div className="p-3 bg-white flex items-center justify-between text-xs text-slate-600">
                {/* Pagination Controls */}
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-semibold text-slate-700 min-w-16 text-center">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] font-semibold text-slate-600 min-w-10 text-center">
                    {Math.round(scale * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() => setScale((s) => Math.min(2.0, s + 0.1))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setScale(1.0)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors ml-1 cursor-pointer"
                    title="Fit to Page"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Section: College Planning Materials Catalog & Gallery */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#0076BD] mb-1">
                <Presentation className="w-4 h-4" />
                <span>Simplifying College Planning Workshop Toolkit</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Choose Workshop Materials to Brand & Download
              </h2>
              <p className="text-xs text-slate-500">
                All 16 presentation decks, flyers, workbooks, meeting packets, and social assets are customized with your firm brand.
              </p>
            </div>

            {/* Batch ZIP Export Button */}
            <button
              type="button"
              onClick={onBatchDownloadAll}
              disabled={isBatchGenerating}
              className="inline-flex items-center px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-[#0076BD] hover:bg-[#00629e] shadow-md transition-all active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              {isBatchGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating All 16 Branded Files...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download All 16 College Materials (ZIP)
                </>
              )}
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: `All Materials (${allMaterials.length})` },
              { id: 'presentation', label: 'Presentation (1)' },
              { id: 'flyer', label: 'Marketing & Invitations (2)' },
              { id: 'workbook', label: 'Workbooks & Guides (2)' },
              { id: 'packet', label: 'Meeting Packets (6)' },
              { id: 'social', label: 'Social Posts (1)' },
              { id: 'afes', label: 'AFES Educational Track (4)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0076BD] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((mat) => {
              const isSelected = activeMaterial.id === mat.id;

              return (
                <div
                  key={mat.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-200 group ${
                    isSelected ? 'ring-2 ring-[#0076BD] shadow-md' : 'hover:shadow-md'
                  }`}
                >
                  {/* Thumbnail / Header Preview */}
                  <div
                    onClick={() => {
                      setActiveMaterial(mat);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}college_thumbnails/${mat.id}.png`}
                      alt={mat.title}
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback placeholder if image not rendered
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />

                    {/* Format Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white">
                        {mat.format.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                        {mat.format === 'pptx' ? `${mat.pages} Slides` : `${mat.pages} Pages`}
                      </span>
                    </div>

                    {mat.badge && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0076BD] text-white shadow-xs">
                          {mat.badge}
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#004372]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#004372] font-bold text-xs shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        Preview Document
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#0076BD]">
                        {mat.categoryLabel}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0076BD] transition-colors line-clamp-1">
                        {mat.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {mat.description}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMaterial(mat);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0076BD] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Currently Viewing' : 'Select & Preview'}
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          await downloadBrandedCollegeMaterial(mat, profile);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Download Branded Material"
                      >
                        <Download className="w-4 h-4" />
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
