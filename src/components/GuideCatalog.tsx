import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  Download,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { FinancialGuide } from '../types';
import { GuideCard } from './GuideCard';

interface GuideCatalogProps {
  guides: FinancialGuide[];
  selectedGuideIds: string[];
  activePreviewGuideId: string;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPreview: (guide: FinancialGuide) => void;
  onDownload: (guide: FinancialGuide) => void;
  onUploadCustomPdf: (guideId: string, file: File) => void;
  onBatchDownload: () => void;
  brandColor: string;
  isGenerating: boolean;
  isAdmin?: boolean;
}

export const GuideCatalog: React.FC<GuideCatalogProps> = ({
  guides,
  selectedGuideIds,
  activePreviewGuideId,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onPreview,
  onDownload,
  onUploadCustomPdf,
  onBatchDownload,
  brandColor,
  isGenerating,
  isAdmin = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set(guides.map((g) => g.category));
    return ['All', ...Array.from(set)];
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesSearch =
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'All' || guide.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [guides, searchQuery, selectedCategory]);

  const allSelected = selectedGuideIds.length === guides.length;

  return (
    <div className="space-y-5">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides by title, category, or strategy..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0076BD] focus:border-[#0076BD] outline-none"
            />
          </div>

          {/* Selection Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-xl bg-[#E6E6E6] hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {allSelected ? (
                <>
                  <Square className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Deselect All
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-[#0076BD]" />
                  Select All ({guides.length})
                </>
              )}
            </button>

            <button
              onClick={onBatchDownload}
              disabled={selectedGuideIds.length === 0 || isGenerating}
              className={`inline-flex items-center px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all ${
                selectedGuideIds.length === 0 || isGenerating
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-[#0076BD] hover:bg-[#00629e] text-white shadow-[#0076BD]/20'
              }`}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download {selectedGuideIds.length} Selected (ZIP)
            </button>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center">
            <Filter className="w-3 h-3 mr-1 text-[#0076BD]" />
            Topic:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#004372] text-white shadow-xs'
                    : 'bg-[#E6E6E6]/60 hover:bg-[#E6E6E6] text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guide Cards Grid */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No guides found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search terms or filter to view the available financial guides.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              index={guides.findIndex((g) => g.id === guide.id)}
              isSelected={selectedGuideIds.includes(guide.id)}
              isPreviewActive={activePreviewGuideId === guide.id}
              onToggleSelect={onToggleSelect}
              onPreview={onPreview}
              onDownload={onDownload}
              onUploadCustomPdf={onUploadCustomPdf}
              brandColor={brandColor}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};
