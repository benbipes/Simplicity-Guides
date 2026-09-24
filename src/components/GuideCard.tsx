import React, { useRef } from 'react';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Upload,
  BookOpen,
  Layers,
  Sparkles
} from 'lucide-react';
import { FinancialGuide } from '../types';

interface GuideCardProps {
  guide: FinancialGuide;
  index: number;
  isSelected: boolean;
  isPreviewActive: boolean;
  onToggleSelect: (id: string) => void;
  onPreview: (guide: FinancialGuide) => void;
  onDownload: (guide: FinancialGuide) => void;
  onUploadCustomPdf: (guideId: string, file: File) => void;
  brandColor: string;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  index,
  isSelected,
  isPreviewActive,
  onToggleSelect,
  onPreview,
  onDownload,
  onUploadCustomPdf,
  brandColor,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onUploadCustomPdf(guide.id, file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        isPreviewActive
          ? 'ring-2 ring-[#0076BD] border-[#0076BD]'
          : isSelected
          ? 'border-[#0076BD]/50'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Header Card Strip */}
        <div
          className="h-2 w-full transition-colors"
          style={{ backgroundColor: isSelected ? brandColor || '#0076BD' : '#cbd5e1' }}
        />

        <div className="p-4 sm:p-5">
          {/* Top metadata row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(guide.id)}
                className="w-4 h-4 rounded text-[#0076BD] focus:ring-[#0076BD] border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-500">
                #{String(index + 1).padStart(2, '0')}
              </span>
            </label>

            <div className="flex items-center space-x-1.5">
              {guide.isCustom ? (
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Custom PDF
                </span>
              ) : guide.filename.startsWith('important-') ||
                guide.filename.startsWith('short-') ||
                guide.filename.startsWith('legacy-') ||
                guide.filename.startsWith('exit-') ||
                guide.filename.startsWith('age-5-') ? (
                <span className="text-[10px] font-bold bg-[#004372]/10 text-[#004372] border border-[#004372]/20 px-2 py-0.5 rounded-full">
                  Official PDF
                </span>
              ) : (
                <span className="text-[10px] font-medium bg-[#E6E6E6] text-slate-700 px-2 py-0.5 rounded-full">
                  Template
                </span>
              )}
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                style={{
                  backgroundColor: `${guide.themeColor}15`,
                  color: guide.themeColor,
                }}
              >
                {guide.category}
              </span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mb-1">
            {guide.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {guide.subtitle}
          </p>

          {/* Key Topics */}
          <div className="bg-[#E6E6E6]/30 rounded-xl p-3 border border-slate-200/60 mb-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-[#0076BD]" />
              Core Strategies
            </div>
            <ul className="space-y-1">
              {guide.topics.slice(0, 3).map((topic, i) => (
                <li key={i} className="text-[11px] text-slate-600 flex items-start truncate">
                  <span className="text-[#0076BD] mr-1.5 font-bold">•</span>
                  <span className="truncate">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center font-medium">
              <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {guide.pages} Pages
            </span>
            <span className="text-[10px] bg-[#E6E6E6] text-slate-700 font-semibold px-2 py-0.5 rounded">
              Contact Pg {guide.contactPageNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="border-t border-slate-100 bg-[#E6E6E6]/25 p-3 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPreview(guide)}
            title="Preview co-branded output"
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isPreviewActive
                ? 'bg-[#0076BD] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Preview
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Replace master PDF with your own file"
            className="inline-flex items-center p-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => onDownload(guide)}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-[#0076BD]/40 text-[#0076BD] hover:bg-[#0076BD]/10 shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 mr-1 text-[#0076BD]" />
          Download
        </button>
      </div>
    </div>
  );
};
