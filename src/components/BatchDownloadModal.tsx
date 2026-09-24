import React from 'react';
import { Loader2, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BatchProgress } from '../types';

interface BatchDownloadModalProps {
  progress: BatchProgress;
  onClose: () => void;
}

export const BatchDownloadModal: React.FC<BatchDownloadModalProps> = ({
  progress,
  onClose,
}) => {
  if (!progress.isGenerating && !progress.error) return null;

  const percent = progress.totalSteps > 0
    ? Math.round((progress.currentStep / progress.totalSteps) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 text-center">
        {progress.error ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Generation Error
            </h3>
            <p className="text-xs text-red-600 mb-4">{progress.error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>

            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Branding Your Financial Guides
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Embedding your logo, advisor contact info, and clickable social media links...
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
              <span className="font-semibold text-slate-700">
                Guide {progress.currentStep} of {progress.totalSteps}
              </span>
              <span className="font-mono font-bold text-sky-600">{percent}%</span>
            </div>

            <div className="text-[11px] text-slate-400 truncate bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              {progress.currentGuideTitle}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
