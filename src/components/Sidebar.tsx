import React from 'react';
import {
  BookOpen,
  ThumbsUp,
  CandlestickChart,
  Lock,
  ShieldCheck,
  FolderUp,
  Sparkles,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';

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
  // Navigation menu items matching user design specification
  const navItems = [
    {
      id: 'guides' as const,
      label: 'Financial Guides',
      subtitle: 'Choose from 6 Master PDFs',
      icon: BookOpen,
    },
    {
      id: 'social' as const,
      label: 'Social Media Posts',
      subtitle: '1024x1024 client-facing graphics',
      icon: ThumbsUp,
    },
    {
      id: 'wealth' as const,
      label: 'Simplicity Wealth',
      subtitle: 'Materials to market your firm',
      icon: CandlestickChart,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full select-none bg-[#004372]">
      {/* Brand Header */}
      <div className="p-6 sm:p-7 pb-4">
        <div className="flex items-center justify-between">
          {/* Simplicity Group Logo */}
          <div className="flex items-center">
            <img
              src={`${import.meta.env.BASE_URL}images/simplicity-logo-white.png`}
              alt="Simplicity Group"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Studio Title & Subtitle */}
        <div className="mt-5 space-y-1">
          <h1 className="text-2xl sm:text-[25px] font-extrabold text-white tracking-wide uppercase leading-tight">
            CO-BRANDING STUDIO
          </h1>
          <p className="text-base sm:text-lg font-bold text-white leading-snug">
            A Simplicity Marketing Suite
          </p>
        </div>

        {/* Crisp White Divider Line */}
        <hr className="border-t border-white/40 mt-5 mb-1" />
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-2 space-y-4">
        
        {/* The 3 Primary Workspaces Cards */}
        <nav className="space-y-3.5">
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
                className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center space-x-4 cursor-pointer shadow-sm group ${
                  isActive
                    ? 'bg-[#0076BD] text-white shadow-md ring-2 ring-white/30'
                    : 'bg-[#003459] hover:bg-[#005a94] text-white'
                }`}
              >
                {/* Left Icon (w-8 h-8) */}
                <div className="shrink-0 text-white">
                  <Icon className="w-8 h-8 stroke-[1.75]" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                    {item.label}
                  </div>
                  <div className="text-xs sm:text-sm text-white/90 font-normal mt-0.5 leading-snug">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Divider Line before Admin */}
        <hr className="border-t border-white/25 my-5" />

        {/* Section 2: Differentiated Admin Menu */}
        <div className="space-y-2.5">
          <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-sky-200/80">
            Admin & Resource Controls
          </div>

          {isAdmin ? (
            /* Logged In Admin Section */
            <div className="bg-[#002e4d] rounded-2xl p-4 border border-emerald-400/40 shadow-sm space-y-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-300 border border-emerald-400/30 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Administrator</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Admin Actions */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={onOpenUploader}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-[#0076BD] text-white border border-white/15 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <FolderUp className="w-4 h-4 text-emerald-300" />
                    <span>Master Guide PDFs</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-[#0076BD] text-white border border-white/15 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Load Demo Advisor</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out Admin Card */
            <div className="bg-[#002e4d] rounded-2xl p-4 border border-white/15 text-center space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto text-sky-200">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Administrator Access
                </div>
                <p className="text-[10px] text-sky-200/80 leading-relaxed mt-0.5">
                  Sign in to manage master guide PDFs & demo profiles.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="w-full inline-flex items-center justify-center px-3 py-2 text-xs font-bold rounded-xl text-white bg-[#0076BD] hover:bg-[#00629e] shadow-sm transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5" />
                <span>Admin Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 px-6 border-t border-[#00355a] bg-[#00385c] text-[10px] text-sky-200/70 flex items-center justify-between">
        <span>Simplicity Group Brand Standards</span>
        <span className="text-[9px] bg-white/15 px-1.5 py-0.5 rounded text-white font-semibold">v2.0</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (w-80) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:shrink-0 bg-[#004372] border-r border-[#00355a] text-white min-h-screen sticky top-0 h-screen z-30 shadow-lg">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-[#004372] text-white shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
