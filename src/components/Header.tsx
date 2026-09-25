import React from 'react';
import { Download, Sparkles, FolderUp, Lock, ShieldCheck, BookOpen, Share2 } from 'lucide-react';
import { AgentProfile } from '../types';
import { SOCIAL_POSTS } from '../data/socialPosts';

interface HeaderProps {
  profile: AgentProfile;
  selectedCount: number;
  totalCount: number;
  onBatchDownload: () => void;
  onLoadDemo: () => void;
  onOpenUploader: () => void;
  isGenerating: boolean;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  activeStudioTab: 'guides' | 'social';
  onChangeStudioTab: (tab: 'guides' | 'social') => void;
  onSocialBatchDownload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  selectedCount,
  totalCount,
  onBatchDownload,
  onLoadDemo,
  onOpenUploader,
  isGenerating,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout,
  activeStudioTab,
  onChangeStudioTab,
  onSocialBatchDownload,
}) => {
  return (
    <header className="bg-[#004372] border-b border-[#00355a] text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Simplicity Group Logo & Platform Title */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            <div className="flex items-center">
              <img
                src={`${import.meta.env.BASE_URL}images/simplicity-logo-white.png`}
                alt="Simplicity Group"
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>
            
            <div className="hidden md:block h-7 w-px bg-white/20" />

            <div className="hidden md:block">
              <h1 className="text-sm font-bold tracking-wide text-white uppercase">
                {activeStudioTab === 'guides' ? 'Guide Co-Branding Studio' : 'Social Media Co-Branding Studio'}
              </h1>
              <p className="text-[11px] text-sky-200">
                {activeStudioTab === 'guides'
                  ? 'Brand up to 6 guides with your business logo, contact information, and disclosures.'
                  : `Brand ${SOCIAL_POSTS.length} client-facing social graphics with just your logo.`}
              </p>
            </div>
          </div>

          {/* Center: Studio Tabs Switcher */}
          <nav className="flex items-center p-1 bg-[#003152] rounded-xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => onChangeStudioTab('guides')}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeStudioTab === 'guides'
                  ? 'bg-[#0076BD] text-white shadow-xs'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Financial Guides</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeStudioTab('social')}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeStudioTab === 'social'
                  ? 'bg-[#0076BD] text-white shadow-xs'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Social Posts</span>
            </button>
          </nav>

          {/* Actions Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Admin-Only Tools */}
            {isAdmin ? (
              <>
                <div className="hidden md:flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-lg text-xs text-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-[11px]">Admin</span>
                  <button
                    onClick={onAdminLogout}
                    title="Log out of Admin mode"
                    className="ml-1 text-slate-300 hover:text-white underline text-[10px]"
                  >
                    Logout
                  </button>
                </div>

                <button
                  onClick={onLoadDemo}
                  title="Preload sample advisor credentials to test immediately"
                  className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  <span className="hidden sm:inline">Load Demo Advisor</span>
                  <span className="sm:hidden">Demo</span>
                </button>

                <button
                  onClick={onOpenUploader}
                  title="Manage or upload master guide PDFs"
                  className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                >
                  <FolderUp className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
                  <span className="hidden sm:inline">Master PDFs</span>
                  <span className="sm:hidden">PDFs</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                title="Admin Sign In"
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-sky-200/90 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 mr-1 text-sky-300" />
                <span>Admin</span>
              </button>
            )}

            {/* Contextual Action Button: Download Batch ZIP */}
            {activeStudioTab === 'guides' ? (
              <button
                onClick={onBatchDownload}
                disabled={selectedCount === 0 || isGenerating}
                className={`inline-flex items-center px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all ${
                  selectedCount === 0 || isGenerating
                    ? 'bg-slate-700/60 text-slate-400 cursor-not-allowed border border-white/10'
                    : 'bg-[#0076BD] hover:bg-[#00629e] text-white shadow-[#0076BD]/30 active:scale-95'
                }`}
              >
                <Download className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span>Download {selectedCount} {selectedCount === 1 ? 'Guide' : 'Guides'} (ZIP)</span>
              </button>
            ) : (
              <button
                onClick={onSocialBatchDownload || onBatchDownload}
                className="inline-flex items-center px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg shadow-md bg-[#0076BD] hover:bg-[#00629e] text-white shadow-[#0076BD]/30 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span>Download {SOCIAL_POSTS.length} Social Posts (ZIP)</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
