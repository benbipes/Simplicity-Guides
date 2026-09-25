import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { SocialPost } from '../data/socialPosts';

export interface SocialBrandOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'custom';
  customX?: number; // 0 - 100%
  customY?: number; // 0 - 100%
  scale?: number; // 0.6 - 1.6, default 1.0
  replaceTopLogo?: boolean; // if true and post has existing top logo, covers it
  format?: 'jpg' | 'png';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Render a branded 1024x1024 canvas for a social post
 */
export async function renderSocialPostCanvas(
  post: SocialPost,
  logoDataUrl: string,
  options: SocialBrandOptions = {}
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Load base graphic
  const baseSrc = post.customImageDataUrl || `${import.meta.env.BASE_URL}social-posts/${post.filename}`;
  const baseImg = await loadImage(baseSrc);
  ctx.drawImage(baseImg, 0, 0, 1024, 1024);

  if (!logoDataUrl) {
    return canvas;
  }

  // 2. Load agent logo
  const logoImg = await loadImage(logoDataUrl);

  const scale = options.scale ?? 1.0;
  const position = options.position ?? post.defaultPlacement.position;
  const replaceTopLogo = options.replaceTopLogo ?? true;

  // 3. Calculate logo dimensions preserving aspect ratio
  const baseMaxW = (post.defaultPlacement.maxWidth || 280) * scale;
  const baseMaxH = (post.defaultPlacement.maxHeight || 75) * scale;
  const logoAspect = logoImg.width / logoImg.height;

  let drawW = baseMaxW;
  let drawH = drawW / logoAspect;
  if (drawH > baseMaxH) {
    drawH = baseMaxH;
    drawW = drawH * logoAspect;
  }

  // Margin from canvas borders
  const marginX = 60;
  const marginY = 55;

  // Calculate center coordinates for logo placement
  let centerX = 512;
  let centerY = 512;

  if (position === 'top-left') {
    centerX = marginX + drawW / 2;
    centerY = marginY + drawH / 2;
  } else if (position === 'top-right') {
    centerX = 1024 - marginX - drawW / 2;
    centerY = marginY + drawH / 2;
  } else if (position === 'bottom-left') {
    centerX = marginX + drawW / 2;
    centerY = 1024 - marginY - drawH / 2 - 25; // sits safely above bottom copyright
  } else if (position === 'bottom-right') {
    centerX = 1024 - marginX - drawW / 2;
    centerY = 1024 - marginY - drawH / 2 - 25; // sits safely above bottom copyright
  } else if (position === 'top-center') {
    centerX = 512;
    centerY = 125;
  } else if (position === 'custom') {
    centerX = (1024 * (options.customX ?? post.defaultPlacement.xPercent)) / 100;
    centerY = (1024 * (options.customY ?? post.defaultPlacement.yPercent)) / 100;
  }

  // 4. If post has an existing top logo and we are replacing it at top-center, cover it smoothly
  if (post.hasExistingTopLogo && post.coverPatch && replaceTopLogo && position === 'top-center') {
    ctx.save();
    const patch = post.coverPatch;

    // Draw smooth blended backdrop over the existing logo
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      10,
      centerX,
      centerY,
      patch.width / 1.7
    );
    gradient.addColorStop(0, patch.color);
    gradient.addColorStop(0.75, patch.color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(patch.x - 30, patch.y - 15, patch.width + 60, patch.height + 30);
    ctx.restore();
  }

  // 5. Draw Agent Logo
  ctx.drawImage(
    logoImg,
    centerX - drawW / 2,
    centerY - drawH / 2,
    drawW,
    drawH
  );

  return canvas;
}

/**
 * Generate a Blob for a branded social media post
 */
export async function brandSocialPostBlob(
  post: SocialPost,
  logoDataUrl: string,
  options: SocialBrandOptions = {}
): Promise<Blob> {
  const canvas = await renderSocialPostCanvas(post, logoDataUrl, options);
  const format = options.format || 'jpg';
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'png' ? undefined : 0.95;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate image blob from canvas'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Download a single branded social post
 */
export async function downloadSingleSocialPost(
  post: SocialPost,
  logoDataUrl: string,
  options: SocialBrandOptions = {}
): Promise<void> {
  const blob = await brandSocialPostBlob(post, logoDataUrl, options);
  const ext = options.format || 'jpg';
  const filename = `${post.id}-branded.${ext}`;
  saveAs(blob, filename);
}

/**
 * Batch download all social posts as a ZIP archive
 */
export async function downloadAllSocialPostsZip(
  posts: SocialPost[],
  logoDataUrl: string,
  options: SocialBrandOptions = {},
  onProgress?: (current: number, total: number, title: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('Branded_Social_Media_Graphics');
  const ext = options.format || 'jpg';

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (onProgress) {
      onProgress(i + 1, posts.length, post.title);
    }
    const blob = await brandSocialPostBlob(post, logoDataUrl, options);
    const filename = `${String(i + 1).padStart(2, '0')}_${post.id}.${ext}`;
    folder?.file(filename, blob);
  }

  // Add README instruction file
  folder?.file(
    'READ_ME_SHARING_TIPS.txt',
    `BRANDED CLIENT-FACING SOCIAL MEDIA GRAPHICS
--------------------------------------------------
Image Specifications:
- Resolution: 1024 x 1024 Square (Optimal for LinkedIn, Instagram, Facebook, & X)
- Color Space: sRGB
- File Format: ${ext.toUpperCase()}

Best Practices for Sharing:
1. LinkedIn & Facebook: Pair these graphics with your custom commentary, educational insights, and link to your booking URL.
2. Instagram: Share directly to your feed or story.
3. Email Newsletters: Insert these graphics as visual headers to engage clients and drive guide downloads.

Generated via Simplicity Group Co-Branding Studio.
`
  );

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'Simplicity_Branded_Social_Posts.zip');
}
