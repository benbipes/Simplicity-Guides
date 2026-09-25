import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  BookOpen,
  ThumbsUp,
  CandlestickChart,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { FinancialGuide, WealthMaterial, CollegeMaterial } from '../types';
import { SocialPost } from '../data/socialPosts';

export interface MasterAssetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'guides' | 'social' | 'wealth' | 'college';
  guides: FinancialGuide[];
  onUploadCustomPdf: (guideId: string, file: File) => void;
  onResetGuides: () => void;
  socialPosts: SocialPost[];
  onUploadCustomSocialGraphic: (postId: string, file: File) => void;
  onResetSocialPosts: () => void;
  wealthMaterials: WealthMaterial[];
  onUploadCustomWealthMaterial: (materialId: string, file: File) => void;
  onResetWealthMaterials: () => void;
  collegeMaterials?: CollegeMaterial[];
  onUploadCustomCollegeMaterial?: (materialId: string, file: File) => void;
  onResetCollegeMaterials?: () => void;
}

export const MasterAssetManager: React.FC<MasterAssetManagerProps> = ({
  isOpen,
  onClose,
  initialTab = 'guides',
  guides,
  onUploadCustomPdf,
  onResetGuides,
  socialPosts,
  onUploadCustomSocialGraphic,
  onResetSocialPosts,
  wealthMaterials,
  onUploadCustomWealthMaterial,
  onResetWealthMaterials,
  collegeMaterials = [],
  onUploadCustomCollegeMaterial,
  onResetCollegeMaterials,
}) => {
  const [activeTab, setActiveTab] = useState<'guides' | 'social' | 'wealth' | 'college'>(initialTab);

  // Sync activeTab when initialTab changes when opening
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const customGuidesCount = guides.filter((g) => g.isCustom).length;
  const customSocialCount = socialPosts.filter((s) => s.isCustom).length;
  const customWealthCount = wealthMaterials.filter((w) => w.isCustom).length;
  const customCollegeCount = collegeMaterials.filter((c) => c.isCustom).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full mb-1">
              <span>Admin Master File Control</span>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-slate-900 font-serif">
              Master Asset & Template Manager
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Replace built-in master PDFs, social media graphics, wealth materials, and college planning workshop files
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'guides'
                ? 'border-[#0076BD] text-[#0076BD] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Financial Guides</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                customGuidesCount > 0
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {customGuidesCount > 0 ? `${customGuidesCount} Custom` : guides.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'social'
                ? 'border-[#0076BD] text-[#0076BD] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Social Media Graphics</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                customSocialCount > 0
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {customSocialCount > 0 ? `${customSocialCount} Custom` : socialPosts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wealth')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'wealth'
                ? 'border-[#0076BD] text-[#0076BD] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CandlestickChart className="w-4 h-4" />
            <span>Simplicity Wealth</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                customWealthCount > 0
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {customWealthCount > 0 ? `${customWealthCount} Custom` : wealthMaterials.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('college')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'college'
                ? 'border-[#0076BD] text-[#0076BD] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>College Planning</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                customCollegeCount > 0
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {customCollegeCount > 0 ? `${customCollegeCount} Custom` : collegeMaterials.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: FINANCIAL GUIDES */}
          {activeTab === 'guides' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-900 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Master Guide PDFs:</strong> When you replace a guide PDF, the co-branding engine will use your replacement PDF as the base, stamping advisor contact info on the designated contact page and attaching disclosures at the back.
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                {guides.map((guide, idx) => (
                  <div
                    key={guide.id}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-sky-800">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {guide.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                          <span className="truncate">{guide.filename}</span>
                          <span>•</span>
                          <span>{guide.category}</span>
                          <span>•</span>
                          <span>{guide.pages} pages</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                      {guide.isCustom ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Custom Uploaded
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Default Built-in</span>
                      )}

                      <label className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-xs hover:border-[#0076BD]">
                        <Upload className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Replace PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUploadCustomPdf(guide.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL MEDIA GRAPHICS */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-900 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Social Media Graphics:</strong> Upload custom 1024×1024 base images (PNG, JPG, or WEBP) to replace any default template. The social studio will immediately render advisor logos onto your replacement graphic at all 4 corners.
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                {socialPosts.map((post, idx) => {
                  const imageSrc =
                    post.customImageDataUrl || `${import.meta.env.BASE_URL}social-posts/${post.filename}`;

                  return (
                    <div
                      key={post.id}
                      className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                        {/* Thumbnail image */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-xs">
                          <img
                            src={imageSrc}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 bg-slate-900/70 text-white font-mono text-[9px] px-1 rounded-tl">
                            {idx + 1}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {post.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-md">
                            {post.headline}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span>{post.filename}</span>
                            <span>•</span>
                            <span className="capitalize">{post.categoryLabel || post.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                        {post.isCustom ? (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Custom Uploaded
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Default Built-in</span>
                        )}

                        <label className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-xs hover:border-[#0076BD]">
                          <Upload className="w-3.5 h-3.5 mr-1 text-slate-500" />
                          Replace Graphic
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/jpg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onUploadCustomSocialGraphic(post.id, file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SIMPLICITY WEALTH MATERIALS */}
          {activeTab === 'wealth' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-900 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Simplicity Wealth Materials:</strong> Replace any institutional PDF brochure, flyer, questionnaire, or presentation deck. PDF files will receive live advisor contact information and headshots; PPTX files are bundled directly in download archives.
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                {wealthMaterials.map((mat, idx) => (
                  <div
                    key={mat.id}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-indigo-800">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {mat.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                          <span className="truncate">{mat.filename}</span>
                          <span>•</span>
                          <span className="uppercase text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {mat.format}
                          </span>
                          <span>•</span>
                          <span>{mat.pages} {mat.pages === 1 ? 'page' : 'pages'}</span>
                          <span>•</span>
                          <span>{mat.categoryLabel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                      {mat.isCustom ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Custom Uploaded
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Default Built-in</span>
                      )}

                      <label className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-xs hover:border-[#0076BD]">
                        <Upload className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {mat.format === 'pptx' ? 'Replace Deck' : 'Replace PDF'}
                        <input
                          type="file"
                          accept={
                            mat.format === 'pptx'
                              ? '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation'
                              : 'application/pdf'
                          }
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUploadCustomWealthMaterial(mat.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COLLEGE PLANNING */}
          {activeTab === 'college' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-900 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>College Planning Workshop Materials:</strong> Replace any master workshop flyer, presentation deck, student workbook, AFES educational syllabus/evaluation, or client handouts. PDF files will receive live advisor contact information and disclosures; PPTX presentation decks are bundled directly into download archives.
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                {collegeMaterials.map((mat, idx) => (
                  <div
                    key={mat.id}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-amber-800">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {mat.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                          <span className="truncate">{mat.filename}</span>
                          <span>•</span>
                          <span className="uppercase text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {mat.format}
                          </span>
                          <span>•</span>
                          <span>{mat.pages} {mat.pages === 1 ? 'page' : 'pages'}</span>
                          <span>•</span>
                          <span>{mat.categoryLabel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                      {mat.isCustom ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Custom Uploaded
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Default Built-in</span>
                      )}

                      <label className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-xs hover:border-[#0076BD]">
                        <Upload className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {mat.format === 'pptx' ? 'Replace Deck' : 'Replace PDF'}
                        <input
                          type="file"
                          accept={
                            mat.format === 'pptx'
                              ? '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation'
                              : 'application/pdf'
                          }
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && onUploadCustomCollegeMaterial) onUploadCustomCollegeMaterial(mat.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {activeTab === 'guides' && (
              <button
                type="button"
                onClick={onResetGuides}
                className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline inline-flex items-center cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset Financial Guides to Defaults
              </button>
            )}
            {activeTab === 'social' && (
              <button
                type="button"
                onClick={onResetSocialPosts}
                className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline inline-flex items-center cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset Social Graphics to Defaults
              </button>
            )}
            {activeTab === 'wealth' && (
              <button
                type="button"
                onClick={onResetWealthMaterials}
                className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline inline-flex items-center cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset Wealth Materials to Defaults
              </button>
            )}
            {activeTab === 'college' && onResetCollegeMaterials && (
              <button
                type="button"
                onClick={onResetCollegeMaterials}
                className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline inline-flex items-center cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset College Planning Materials to Defaults
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#004372] hover:bg-[#003459] text-white shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
