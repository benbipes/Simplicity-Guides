import React from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { FinancialGuide } from '../types';

interface MasterGuideUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  guides: FinancialGuide[];
  onUploadCustomPdf: (guideId: string, file: File) => void;
  onResetToDefaults: () => void;
}

export const MasterGuideUploader: React.FC<MasterGuideUploaderProps> = ({
  isOpen,
  onClose,
  guides,
  onUploadCustomPdf,
  onResetToDefaults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              Master Guide PDF Manager
            </h3>
            <p className="text-xs text-slate-500">
              Replace any of the 6 built-in financial guides with your own company master PDFs
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-800 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong>How Custom PDFs Work:</strong> When you upload your master PDF, our engine keeps all original content intact and dynamically stamps your agent co-branding (front cover badge and back cover showcase card) onto the specified pages.
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {guides.map((guide, idx) => (
              <div
                key={guide.id}
                className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-slate-600">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {guide.title}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                      <span>{guide.filename}</span>
                      <span>•</span>
                      <span>{guide.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {guide.isCustom ? (
                    <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Custom Uploaded
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Default Built-in</span>
                  )}

                  <label className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-xs">
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

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onResetToDefaults}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Reset All to Built-in Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
