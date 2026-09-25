import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  Share2,
  Trash2,
  Check,
  RefreshCw,
  Eye,
  FileCheck2,
  Maximize2
} from 'lucide-react';
import { AgentProfile } from '../types';
import { SOCIAL_POSTS, SocialPost } from '../data/socialPosts';
import {
  renderSocialPostCanvas,
  downloadSingleSocialPost,
  downloadAllSocialPostsZip,
  SocialBrandOptions
} from '../utils/socialBrander';

interface SocialMediaStudioProps {
  profile: AgentProfile;
  onUpdateProfile: (updated: AgentProfile) => void;
  brandColor?: string;
  posts?: SocialPost[];
}

export const SocialMediaStudio: React.FC<SocialMediaStudioProps> = ({
  profile,
  onUpdateProfile,
  brandColor = '#0076BD',
  posts
}) => {
  const allPosts = posts || SOCIAL_POSTS;

  // Active post
  const [activePost, setActivePost] = useState<SocialPost>(allPosts[0]);

  // Keep activePost updated if posts state changes (e.g. admin custom upload)
  useEffect(() => {
    if (posts) {
      const match = posts.find((p) => p.id === activePost.id);
      if (match) setActivePost(match);
    }
  }, [posts]);

  // Logo version toggle: prefer white logo on dark backgrounds, but allow color
  const [logoVariant, setLogoVariant] = useState<'white' | 'color'>(() => {
    return profile.logoWhiteDataUrl ? 'white' : 'color';
  });

  // Selected logo data URL based on variant
  const activeLogoDataUrl =
    logoVariant === 'white'
      ? profile.logoWhiteDataUrl || profile.logoDataUrl || ''
      : profile.logoDataUrl || profile.logoWhiteDataUrl || '';

  // Branding options
  const [placement, setPlacement] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(
    allPosts[0].defaultPlacement.position
  );
  const [logoScale, setLogoScale] = useState<number>(1.0);
  const [replaceTopLogo, setReplaceTopLogo] = useState<boolean>(true);
  const [downloadFormat, setDownloadFormat] = useState<'jpg' | 'png'>('jpg');

  // Preview canvas & rendering status
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; title: string } | null>(null);

  // When active post changes, set its recommended default placement
  const handleSelectPost = (post: SocialPost) => {
    setActivePost(post);
    setPlacement(post.defaultPlacement.position);
  };

  // Re-render canvas whenever post, logo, or options change
  useEffect(() => {
    let isCancelled = false;

    const render = async () => {
      setIsRendering(true);
      try {
        const options: SocialBrandOptions = {
          position: placement,
          scale: logoScale,
          replaceTopLogo,
          format: downloadFormat
        };

        const renderedCanvas = await renderSocialPostCanvas(activePost, activeLogoDataUrl, options);
        if (isCancelled) return;

        const targetCanvas = canvasRef.current;
        if (targetCanvas) {
          targetCanvas.width = 1024;
          targetCanvas.height = 1024;
          const ctx = targetCanvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 1024, 1024);
            ctx.drawImage(renderedCanvas, 0, 0);
          }
        }
      } catch (err) {
        console.error('Failed to render social post canvas preview:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    render();

    return () => {
      isCancelled = true;
    };
  }, [activePost, activeLogoDataUrl, placement, logoScale, replaceTopLogo, downloadFormat]);

  // Handle direct logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (logoVariant === 'white') {
        onUpdateProfile({ ...profile, logoWhiteDataUrl: dataUrl });
      } else {
        onUpdateProfile({ ...profile, logoDataUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle single download
  const handleDownloadActive = async () => {
    try {
      const options: SocialBrandOptions = {
        position: placement,
        scale: logoScale,
        replaceTopLogo,
        format: downloadFormat
      };
      await downloadSingleSocialPost(activePost, activeLogoDataUrl, options);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    }
  };

  // Handle batch download
  const handleBatchDownloadAll = async () => {
    setIsBatchDownloading(true);
    setBatchProgress({ current: 0, total: allPosts.length, title: 'Initializing...' });

    try {
      const options: SocialBrandOptions = {
        position: placement,
        scale: logoScale,
        replaceTopLogo,
        format: downloadFormat
      };

      await downloadAllSocialPostsZip(
        allPosts,
        activeLogoDataUrl,
        options,
        (current, total, title) => {
          setBatchProgress({ current, total, title });
        }
      );
    } catch (err: any) {
      alert(`Batch download failed: ${err.message}`);
    } finally {
      setIsBatchDownloading(false);
      setBatchProgress(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Studio Header Banner - Full Width Background */}
      <section
        className="w-full bg-[#efefef] shadow-sm relative overflow-hidden"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/90 shadow-xs px-3 py-1 rounded-full text-xs font-semibold text-[#004372]">
            <Share2 className="w-3.5 h-3.5 text-[#0076BD]" />
            <span>Client-Facing Social Media Graphics Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-[#004372] leading-tight">
            Brand Social Media Posts with Your Logo
          </h1>
          <p className="text-black/70 text-xs sm:text-sm leading-relaxed max-w-4xl">
            Effortlessly stamp your agency logo onto all {allPosts.length} square (1024×1024) social media graphics. No contact forms or complex setups required—just your logo, ready to download and publish to LinkedIn, Facebook, Instagram, or X.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-black/70">
            <span className="flex items-center gap-1.5 bg-white/90 shadow-xs px-2.5 py-1 rounded-md text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              1024×1024 Square HD Format
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 shadow-xs px-2.5 py-1 rounded-md text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              White Knockout & Color Logo Support
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 shadow-xs px-2.5 py-1 rounded-md text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              1-Click Batch ZIP Export
            </span>
          </div>
        </div>
      </section>

      {/* Main Studio Body - Constrained Site Width */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Main Studio Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Controls & Logo Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-5 bg-white p-5 sm:p-6 rounded-2xl shadow-sm">
          
          {/* Logo Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Your Logo
              </label>
              <span className="text-[11px] text-slate-500">
                Synchronized with your profile
              </span>
            </div>

            {/* Logo Variant Switcher (White vs Color) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setLogoVariant('white')}
                className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  logoVariant === 'white'
                    ? 'bg-[#004372] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white"></span>
                White Knockout (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setLogoVariant('color')}
                className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  logoVariant === 'color'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#0076BD]"></span>
                Color Logo
              </button>
            </div>

            {/* Logo Preview Tile */}
            <div
              className={`relative group w-full h-24 rounded-xl flex items-center justify-center p-3 transition-colors ${
                logoVariant === 'white'
                  ? 'bg-[#004372]'
                  : 'bg-slate-100'
              }`}
            >
              {activeLogoDataUrl ? (
                <>
                  <img
                    src={activeLogoDataUrl}
                    alt="Active Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Replace this logo"
                      className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6 mb-1 text-slate-400" />
                  <span className="text-xs">No Logo Uploaded</span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                {activeLogoDataUrl ? 'Upload / Replace Logo' : 'Upload Your Logo (PNG / JPG)'}
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Placement Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Logo Placement
              </label>
              {activePost.defaultPlacement.position === placement && (
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Recommended for this post
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPlacement('top-left')}
                className={`p-2.5 text-xs font-semibold rounded-xl text-left flex items-center justify-between transition-all ${
                  placement === 'top-left'
                    ? 'bg-[#0076BD]/10 text-[#0076BD] font-bold shadow-xs ring-2 ring-[#0076BD]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Top Left</span>
                {placement === 'top-left' && <Check className="w-4 h-4 text-[#0076BD]" />}
              </button>

              <button
                type="button"
                onClick={() => setPlacement('top-right')}
                className={`p-2.5 text-xs font-semibold rounded-xl text-left flex items-center justify-between transition-all ${
                  placement === 'top-right'
                    ? 'bg-[#0076BD]/10 text-[#0076BD] font-bold shadow-xs ring-2 ring-[#0076BD]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Top Right</span>
                {placement === 'top-right' && <Check className="w-4 h-4 text-[#0076BD]" />}
              </button>

              <button
                type="button"
                onClick={() => setPlacement('bottom-left')}
                className={`p-2.5 text-xs font-semibold rounded-xl text-left flex items-center justify-between transition-all ${
                  placement === 'bottom-left'
                    ? 'bg-[#0076BD]/10 text-[#0076BD] font-bold shadow-xs ring-2 ring-[#0076BD]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Bottom Left</span>
                {placement === 'bottom-left' && <Check className="w-4 h-4 text-[#0076BD]" />}
              </button>

              <button
                type="button"
                onClick={() => setPlacement('bottom-right')}
                className={`p-2.5 text-xs font-semibold rounded-xl text-left flex items-center justify-between transition-all ${
                  placement === 'bottom-right'
                    ? 'bg-[#0076BD]/10 text-[#0076BD] font-bold shadow-xs ring-2 ring-[#0076BD]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Bottom Right</span>
                {placement === 'bottom-right' && <Check className="w-4 h-4 text-[#0076BD]" />}
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Logo Size Scale Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Logo Scale ({Math.round(logoScale * 100)}%)
              </label>
              {logoScale !== 1.0 && (
                <button
                  type="button"
                  onClick={() => setLogoScale(1.0)}
                  className="text-[11px] text-[#0076BD] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset 100%
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">70%</span>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.05"
                value={logoScale}
                onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                className="w-full accent-[#0076BD] cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">150%</span>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Download Actions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Export
              </span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100">
                <button
                  type="button"
                  onClick={() => setDownloadFormat('jpg')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                    downloadFormat === 'jpg'
                      ? 'bg-white shadow-xs text-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  JPG
                </button>
                <button
                  type="button"
                  onClick={() => setDownloadFormat('png')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                    downloadFormat === 'png'
                      ? 'bg-white shadow-xs text-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  PNG
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadActive}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-[#0076BD] hover:bg-[#00629e] shadow-md shadow-[#0076BD]/20 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Current Graphic ({downloadFormat.toUpperCase()})
            </button>

            <button
              type="button"
              onClick={handleBatchDownloadAll}
              disabled={isBatchDownloading}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl text-[#004372] bg-[#004372]/10 hover:bg-[#004372]/20 transition-all"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {isBatchDownloading
                ? `Creating ZIP (${batchProgress?.current || 0}/${allPosts.length})...`
                : `Download All ${allPosts.length} Graphics (ZIP)`}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Real-Time Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Preview Navigation Tabs */}
          <div className="px-4 py-3 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#0076BD]" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Live Graphic Preview (1024×1024)
              </span>
            </div>

            <span className="text-[11px] font-medium text-slate-500">
              {activePost.categoryLabel}
            </span>
          </div>

          {/* Post Selection Tabs */}
          <div className="px-4 py-2.5 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            {allPosts.map((post, idx) => (
              <button
                key={post.id}
                type="button"
                onClick={() => handleSelectPost(post)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activePost.id === post.id
                    ? 'bg-[#0076BD] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{idx + 1}.</span>
                <span className="max-w-[130px] sm:max-w-[180px] truncate">{post.title}</span>
              </button>
            ))}
          </div>

          {/* Canvas Preview Area */}
          <div className="p-4 sm:p-6 bg-slate-100/80 flex items-center justify-center min-h-[460px] sm:min-h-[540px]">
            <div className="relative max-w-[500px] w-full aspect-square bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain block"
              />

              {isRendering && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold">
                  Updating preview...
                </div>
              )}
            </div>
          </div>

          {/* Caption & Post Details */}
          <div className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                {activePost.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {activePost.description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadActive}
              className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Post
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Gallery of All Social Graphics */}
      <section className="pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#0076BD] mb-1">
              <Layers className="w-4 h-4" />
              <span>Full Social Media Post Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              All {allPosts.length} Client-Ready Social Media Graphics
            </h2>
            <p className="text-xs text-slate-500">
              Click any graphic to load it into the live editor above, or download directly.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBatchDownloadAll}
            disabled={isBatchDownloading}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-[#0076BD] hover:bg-[#00629e] text-white shadow-xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download All {allPosts.length} (ZIP)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {allPosts.map((post, idx) => {
            const isSelected = activePost.id === post.id;
            return (
              <div
                key={post.id}
                onClick={() => {
                  handleSelectPost(post);
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
                className={`bg-white rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-[#0076BD]'
                    : ''
                }`}
              >
                <div>
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-900 mb-2.5">
                    <img
                      src={`${import.meta.env.BASE_URL}social-posts/${post.filename}`}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      #{idx + 1}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#0076BD] uppercase tracking-wide">
                    {post.categoryLabel}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">
                    {post.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    {isSelected ? 'Editing' : 'Click to Edit'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const opts: SocialBrandOptions = {
                        position: post.defaultPlacement.position,
                        scale: logoScale,
                        replaceTopLogo,
                        format: downloadFormat
                      };
                      downloadSingleSocialPost(post, activeLogoDataUrl, opts);
                    }}
                    title={`Download ${post.title}`}
                    className="p-1.5 text-[#0076BD] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      </div>
    </div>
  );
};
