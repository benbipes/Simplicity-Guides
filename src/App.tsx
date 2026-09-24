import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AgentProfileForm } from './components/AgentProfileForm';
import { LivePreview } from './components/LivePreview';
import { GuideCatalog } from './components/GuideCatalog';
import { MasterGuideUploader } from './components/MasterGuideUploader';
import { BatchDownloadModal } from './components/BatchDownloadModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import {
  AgentProfile,
  FinancialGuide,
  BrandingOptions,
  BatchProgress
} from './types';
import {
  INITIAL_GUIDES,
  DEMO_PROFILE
} from './data/guides';
import {
  loadProfileFromStorage,
  saveProfileToStorage,
  loadOptionsFromStorage,
  saveOptionsToStorage,
  downloadSingleGuide,
  downloadGuidesZip,
  generateSampleLogoDataUrl
} from './utils/helpers';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Share2,
  MousePointerClick
} from 'lucide-react';

const DEFAULT_OPTIONS: BrandingOptions = {
  updateContactPage: true,
  appendCustomDisclosure: true,
  callToActionUrl: '',
};

export const App: React.FC = () => {
  // 1. Advisor Profile State
  const [profile, setProfile] = useState<AgentProfile>(() => {
    const loaded = loadProfileFromStorage(DEMO_PROFILE as AgentProfile);
    if (!loaded.logoDataUrl) {
      loaded.logoDataUrl = generateSampleLogoDataUrl(loaded.company, loaded.brandColor);
    }
    return loaded;
  });

  // 2. Options State
  const [options, setOptions] = useState<BrandingOptions>(() =>
    loadOptionsFromStorage(DEFAULT_OPTIONS)
  );

  // 3. Financial Guides State
  const [guides, setGuides] = useState<FinancialGuide[]>(INITIAL_GUIDES);
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>(() =>
    INITIAL_GUIDES.map((g) => g.id)
  );

  // 4. Active Preview Guide
  const [activePreviewGuide, setActivePreviewGuide] = useState<FinancialGuide>(INITIAL_GUIDES[0]);

  // 5. UI Modals and Status
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('simplicity_is_admin') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('simplicity_is_admin', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('simplicity_is_admin');
    setIsUploaderOpen(false);
  };

  // 6. Batch Generation Progress
  const [batchProgress, setBatchProgress] = useState<BatchProgress>({
    isGenerating: false,
    currentStep: 0,
    totalSteps: 0,
    currentGuideTitle: '',
  });

  // Auto-save profile and options to browser storage
  useEffect(() => {
    saveProfileToStorage(profile);
  }, [profile]);

  useEffect(() => {
    saveOptionsToStorage(options);
  }, [options]);

  // Save profile to storage
  const handleSaveProfile = () => {
    saveProfileToStorage(profile);
    saveOptionsToStorage(options);
    setSaveStatus('Saved in Browser');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleResetProfile = () => {
    if (confirm('Reset form fields to blank?')) {
      const blank: AgentProfile = {
        name: '',
        title: '',
        company: '',
        phone: '',
        email: '',
        website: '',
        bookingUrl: '',
        license: '',
        address: '',
        disclaimer: 'Investment advisory services offered through an independent registered entity. Insurance products offered through licensed agencies. Not intended as specific tax or legal counsel.',
        uploadedDisclosure: null,
        logoDataUrl: null,
        brandColor: '#0076BD', // Simplicity Royal Blue
        socialLinks: {
          linkedin: '',
          facebook: '',
          twitter: '',
          youtube: '',
          instagram: '',
        },
      };
      setProfile(blank);
      saveProfileToStorage(blank);
    }
  };

  const handleLoadDemo = () => {
    const demo = { ...DEMO_PROFILE } as AgentProfile;
    demo.logoDataUrl = generateSampleLogoDataUrl(demo.company, demo.brandColor);
    setProfile(demo);
    saveProfileToStorage(demo);
    setSaveStatus('Demo Profile Loaded');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedGuideIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedGuideIds(guides.map((g) => g.id));
  };

  const handleDeselectAll = () => {
    setSelectedGuideIds([]);
  };

  // Single download
  const handleDownloadSingle = async (guideToDownload: FinancialGuide) => {
    try {
      await downloadSingleGuide(guideToDownload, profile, options);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    }
  };

  // Batch download
  const handleBatchDownload = async () => {
    const selected = guides.filter((g) => selectedGuideIds.includes(g.id));
    if (selected.length === 0) return;

    setBatchProgress({
      isGenerating: true,
      currentStep: 0,
      totalSteps: selected.length,
      currentGuideTitle: 'Initializing branding engine...',
    });

    try {
      await downloadGuidesZip(
        selected,
        profile,
        options,
        (current, total, guideTitle) => {
          setBatchProgress({
            isGenerating: true,
            currentStep: current,
            totalSteps: total,
            currentGuideTitle: guideTitle,
          });
        }
      );
      setTimeout(() => {
        setBatchProgress({
          isGenerating: false,
          currentStep: 0,
          totalSteps: 0,
          currentGuideTitle: '',
        });
      }, 800);
    } catch (err: any) {
      setBatchProgress((prev) => ({
        ...prev,
        error: `Batch generation failed: ${err.message}`,
      }));
    }
  };

  // Custom master PDF upload
  const handleUploadCustomPdf = async (guideId: string, file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const customBytes = new Uint8Array(arrayBuffer);

    setGuides((prev) =>
      prev.map((g) =>
        g.id === guideId
          ? { ...g, customPdfBytes: customBytes, isCustom: true }
          : g
      )
    );

    if (activePreviewGuide.id === guideId) {
      setActivePreviewGuide((prev) => ({
        ...prev,
        customPdfBytes: customBytes,
        isCustom: true,
      }));
    }

    alert(`Successfully loaded custom master PDF for ${file.name}!`);
  };

  const handleResetToDefaultGuides = () => {
    if (confirm('Reset all guides to default files?')) {
      setGuides(INITIAL_GUIDES);
      setActivePreviewGuide(INITIAL_GUIDES[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#0076BD] selection:text-white">
      {/* Platform Header with Simplicity Branding */}
      <Header
        profile={profile}
        selectedCount={selectedGuideIds.length}
        totalCount={guides.length}
        onBatchDownload={handleBatchDownload}
        onLoadDemo={handleLoadDemo}
        onOpenUploader={() => {
          if (isAdmin) setIsUploaderOpen(true);
        }}
        isGenerating={batchProgress.isGenerating}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Simplicity Group Branded Hero Banner */}
        <section className="bg-gradient-to-r from-[#00558f] via-[#006cae] to-[#0076BD] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#00355a] relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-white leading-tight">
              Welcome to the Complimentary Financial Guides Co-Branding Studio
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm leading-relaxed max-w-5xl">
              Upload your business logo, contact details, and social media handles to brand the <strong className="text-white font-bold">Contact Page</strong> of your chosen guide(s). Upload your compliance disclosure document (PDF, image, or text) to be automatically appended <strong className="text-white font-bold">directly after the standard disclosure</strong> at the end of the guide. All original guide content remains 100% authentic and untouched.
            </p>

            {/* 3 Steps - Full width grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#004372]/45 backdrop-blur-xs rounded-xl p-3.5 border border-white/15 flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#0076BD] border border-white/20 flex items-center justify-center font-bold text-xs text-white shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm">Contact Page Update</div>
                  <div className="text-[11px] text-sky-200">Logo, links & socials</div>
                </div>
              </div>

              <div className="bg-[#004372]/45 backdrop-blur-xs rounded-xl p-3.5 border border-white/15 flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#00355a] border border-white/20 flex items-center justify-center font-bold text-xs text-white shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm">Upload Disclosure</div>
                  <div className="text-[11px] text-sky-200">Appended after standard</div>
                </div>
              </div>

              <div className="bg-[#004372]/45 backdrop-blur-xs rounded-xl p-3.5 border border-white/15 flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm">Export & Deliver</div>
                  <div className="text-[11px] text-sky-200">Clickable PDFs / ZIP</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Studio Workspace: Profile Form (Left) & Real-time Live Preview (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Branding Form */}
          <div className="lg:col-span-6 xl:col-span-5 h-[650px] sm:h-[720px]">
            <AgentProfileForm
              profile={profile}
              onChange={setProfile}
              options={options}
              onOptionsChange={setOptions}
              onSave={handleSaveProfile}
              onReset={handleResetProfile}
              saveStatus={saveStatus}
            />
          </div>

          {/* Right: Live Interactive PDF Preview */}
          <div className="lg:col-span-6 xl:col-span-7 h-[650px] sm:h-[720px]">
            <LivePreview
              guide={activePreviewGuide}
              profile={profile}
              options={options}
              allGuides={guides}
              onSelectGuide={setActivePreviewGuide}
              onDownloadCurrent={() => handleDownloadSingle(activePreviewGuide)}
            />
          </div>
        </section>

        {/* Section 2: Guide Catalog */}
        <section className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#0076BD] mb-1">
                <BookOpen className="w-4 h-4" />
                <span>The 6 Financial Guides Catalog</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Choose Guides to Brand & Download
              </h2>
              <p className="text-xs text-slate-500">
                Select specific guides or all 6. Only the contact page and compliance disclosure are customized.
              </p>
            </div>

            <div className="text-xs text-slate-500">
              Selected: <strong className="text-slate-800">{selectedGuideIds.length}</strong> of {guides.length}
            </div>
          </div>

          <GuideCatalog
            guides={guides}
            selectedGuideIds={selectedGuideIds}
            activePreviewGuideId={activePreviewGuide.id}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onPreview={(g) => {
              setActivePreviewGuide(g);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
            onDownload={handleDownloadSingle}
            onUploadCustomPdf={handleUploadCustomPdf}
            onBatchDownload={handleBatchDownload}
            brandColor={profile.brandColor}
            isGenerating={batchProgress.isGenerating}
            isAdmin={isAdmin}
          />
        </section>
      </main>

      {/* Footer with Simplicity Group Branding & 10% black background accent */}
      <footer className="mt-16 border-t border-[#E6E6E6] bg-[#E6E6E6]/40 py-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={`${import.meta.env.BASE_URL}images/simplicity-logo-color.png`}
              alt="Simplicity Group"
              className="h-6 w-auto object-contain"
            />
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-slate-700">Financial Guide Co-Branding Studio</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
            <span>100% Client-Side PDF Generation • Simplicity Group Brand Standards Applied</span>
            <span className="text-slate-300">•</span>
            {isAdmin ? (
              <button
                onClick={handleAdminLogout}
                className="text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
              >
                Admin (Log Out)
              </button>
            ) : (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="text-slate-400 hover:text-slate-600 underline cursor-pointer"
              >
                Admin Sign In
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Custom Master PDFs Manager Modal (Admin Only) */}
      {isAdmin && (
        <MasterGuideUploader
          isOpen={isUploaderOpen}
          onClose={() => setIsUploaderOpen(false)}
          guides={guides}
          onUploadCustomPdf={handleUploadCustomPdf}
          onResetToDefaults={handleResetToDefaultGuides}
        />
      )}

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Batch Generation & Download Progress Modal */}
      <BatchDownloadModal
        progress={batchProgress}
        onClose={() =>
          setBatchProgress({
            isGenerating: false,
            currentStep: 0,
            totalSteps: 0,
            currentGuideTitle: '',
          })
        }
      />
    </div>
  );
};

export default App;
