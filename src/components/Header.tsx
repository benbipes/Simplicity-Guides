import React from 'react';
import { Download, Sparkles, FolderUp, Lock, ShieldCheck, LogOut } from 'lucide-react';
import { AgentProfile } from '../types';

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
}) => {
  return (
    <header className="bg-[#004372] border-b border-[#00355a] text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Simplicity Group Logo & Platform Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img
                src={`${import.meta.env.BASE_URL}images/simplicity-logo-white.png`}
                alt="Simplicity Group"
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>
            
            <div className="hidden sm:block h-7 w-px bg-white/20" />

            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold tracking-wide text-white uppercase">
                  Guide Co-Branding Studio
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#0076BD] text-white">
                  Independent Advisor Platform
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                Brand up to 12 guides with your business logo, contact information, and disclosures.
              </p>
            </div>
          </div>

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
                className="inline-flex items-center p-2 rounded-lg text-sky-200/80 hover:text-white hover:bg-white/10 transition-colors text-xs"
              >
                <Lock className="w-3.5 h-3.5 mr-1 text-sky-300" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Standard Advisor Action: Download Batch ZIP */}
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
          </div>

        </div>
      </div>
    </header>
  );
};
