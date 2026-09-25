import React from 'react';
import {
  BookOpen,
  Share2,
  Briefcase,
  Lock,
  ShieldCheck,
  FolderUp,
  Sparkles,
  LogOut,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SOCIAL_POSTS } from '../data/socialPosts';
import { WEALTH_MATERIALS } from '../data/wealthMaterials';

interface SidebarProps {
  activeStudioTab: 'guides' | 'social' | 'wealth';
  onChangeStudioTab: (tab: 'guides' | 'social' | 'wealth') => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onLoadDemo: () => void;
  onOpenUploader: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeStudioTab,
  onChangeStudioTab,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout,
  onLoadDemo,
  onOpenUploader,
  isMobileOpen,
  onCloseMobile,
}) => {
  // Navigation menu items for Agent Users
  const navItems = [
    {
      id: 'guides' as const,
      label: 'Financial Guides',
      badge: '6 Master PDFs',
      description: 'Co-brand retirement & wealth guides with disclosures',
      icon: BookOpen,
    },
    {
      id: 'social' as const,
      label: 'Social Media Posts',
      badge: `${SOCIAL_POSTS.length} Graphics`,
      description: 'Square 1024×1024 client graphics stamped with logo',
      icon: Share2,
    },
    {
      id: 'wealth' as const,
      label: 'Simplicity Wealth',
      badge: `${WEALTH_MATERIALS.length} Assets`,
      description: 'Brochures, advisor bios & headshots, flyers & slides',
      icon: Briefcase,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#00233b] flex items-center justify-between bg-[#002b4a]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <img
              src={`${import.meta.env.BASE_URL}images/simplicity-logo-white.png`}
              alt="Simplicity Group"
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
              Co-Branding Studio
            </div>
            <div className="text-[10px] text-sky-200/70">
              Simplicity Marketing Suite
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
          title="Close Navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Section 1: Agent User Menu */}
        <div className="space-y-2">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-sky-300/70">
            Client Materials & Workspaces
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeStudioTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChangeStudioTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-start space-x-3 group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#0076BD] text-white shadow-md'
                      : 'text-sky-200 hover:text-white hover:bg-white/6'
                  }`}
                >
                  {/* Left Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                  )}

                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-sky-300 group-hover:text-white group-hover:bg-white/10'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">
                        {item.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                        isActive
                          ? 'bg-black/25 text-white'
                          : 'bg-white/10 text-sky-200'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-tight mt-1 line-clamp-1 ${
                      isActive ? 'text-sky-100' : 'text-sky-300/70'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Section 2: Differentiated Admin Menu */}
        <div className="space-y-2">
          <div className="px-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">
              Admin & Resource Controls
            </span>
            {isAdmin && (
              <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            )}
          </div>

          {isAdmin ? (
            /* Logged In Admin Section */
            <div className="bg-gradient-to-b from-[#00385c] to-[#002742] rounded-2xl p-3.5 border border-emerald-400/30 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-300 border border-emerald-400/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Administrator
                    </div>
                    <div className="text-[10px] text-emerald-200 truncate max-w-[140px]">
                      ben.bipes@simplicitygroup.com
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onAdminLogout}
                  title="Log out of Admin mode"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Admin Actions */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={onOpenUploader}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <FolderUp className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Master Guide PDFs</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-200 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Load Demo Advisor</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-200 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out Admin Card */
            <div className="bg-[#002540]/90 rounded-2xl p-3.5 border border-white/10 text-center space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-sky-300">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Administrator Portal
                </div>
                <p className="text-[10px] text-sky-200/70 leading-relaxed mt-0.5">
                  Sign in to manage master guide PDFs and preloaded demo credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="w-full inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
              >
                <Lock className="w-3 h-3 mr-1.5 text-sky-300" />
                <span>Admin Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#00233b] bg-[#002b4a] text-[10px] text-sky-200/60 flex items-center justify-between">
        <span>Simplicity Group Brand Standards</span>
        <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-sky-300">v2.0</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (w-72) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 bg-[#002f50] border-r border-[#00233b] text-white min-h-screen sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (with slide-over transition & backdrop) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-[#002f50] text-white shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
