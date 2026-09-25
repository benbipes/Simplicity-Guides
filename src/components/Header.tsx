import React from 'react';
import { Download, Menu, ShieldCheck } from 'lucide-react';
import { SOCIAL_POSTS } from '../data/socialPosts';
import { WEALTH_MATERIALS } from '../data/wealthMaterials';

interface HeaderProps {
  selectedCount: number;
  totalCount: number;
  onBatchDownload: () => void;
  isGenerating: boolean;
  isAdmin: boolean;
  activeStudioTab: 'guides' | 'social' | 'wealth';
  onSocialBatchDownload?: () => void;
  onWealthBatchDownload?: () => void;
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCount,
  totalCount,
  onBatchDownload,
  isGenerating,
  isAdmin,
  activeStudioTab,
  onSocialBatchDownload,
  onWealthBatchDownload,
  onToggleMobileNav,
}) => {
  return (
    <header className="bg-[#004372] border-b border-[#00355a] text-white sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* Left: Mobile Menu Toggle + Breadcrumbs/Studio Title */}
          <div className="flex items-center space-x-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={onToggleMobileNav}
              className="lg:hidden p-2 rounded-xl text-sky-200 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Simplicity Logo */}
            <div className="lg:hidden flex items-center shrink-0 mr-1">
              <img
                src={`${import.meta.env.BASE_URL}images/simplicity-logo-white.png`}
                alt="Simplicity Group"
                className="h-6 w-auto object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {activeStudioTab === 'guides' && 'Financial Guides Co-Branding Studio'}
                  {activeStudioTab === 'social' && 'Social Media Co-Branding Studio'}
                  {activeStudioTab === 'wealth' && 'Simplicity Wealth Studio'}
                </span>

                {isAdmin && (
                  <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-200 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Admin
                  </span>
                )}
              </div>

              <p className="hidden md:block text-[11px] text-sky-200 truncate">
                {activeStudioTab === 'guides' && `Brand up to ${totalCount} guides with your logo, contact info, and disclosures.`}
                {activeStudioTab === 'social' && `Stamp your agency logo onto all ${SOCIAL_POSTS.length} client-facing square graphics.`}
                {activeStudioTab === 'wealth' && `Brand all ${WEALTH_MATERIALS.length} institutional brochures, flyers, questionnaires & slides.`}
              </p>
            </div>
          </div>

          {/* Right: Contextual Action Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {activeStudioTab === 'guides' && (
              <button
                onClick={onBatchDownload}
                disabled={selectedCount === 0 || isGenerating}
                className={`inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all ${
                  selectedCount === 0 || isGenerating
                    ? 'bg-slate-700/60 text-slate-400 cursor-not-allowed border border-white/10'
                    : 'bg-[#0076BD] hover:bg-[#00629e] text-white shadow-[#0076BD]/30 active:scale-95 cursor-pointer'
                }`}
              >
                <Download className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Download {selectedCount} {selectedCount === 1 ? 'Guide' : 'Guides'} (ZIP)</span>
                <span className="sm:hidden">ZIP ({selectedCount})</span>
              </button>
            )}

            {activeStudioTab === 'social' && (
              <button
                onClick={onSocialBatchDownload || onBatchDownload}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-md bg-[#0076BD] hover:bg-[#00629e] text-white shadow-[#0076BD]/30 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Download {SOCIAL_POSTS.length} Social Posts (ZIP)</span>
                <span className="sm:hidden">ZIP ({SOCIAL_POSTS.length})</span>
              </button>
            )}

            {activeStudioTab === 'wealth' && (
              <button
                onClick={onWealthBatchDownload || onBatchDownload}
                disabled={isGenerating}
                className={`inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-md bg-[#0076BD] hover:bg-[#00629e] text-white shadow-[#0076BD]/30 active:scale-95 transition-all cursor-pointer ${
                  isGenerating ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Download className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Download All {WEALTH_MATERIALS.length} Wealth Materials (ZIP)</span>
                <span className="sm:hidden">ZIP ({WEALTH_MATERIALS.length})</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
