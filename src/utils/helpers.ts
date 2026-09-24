import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { AgentProfile, BrandingOptions, FinancialGuide } from '../types';
import { brandFinancialGuidePdf } from './pdfBrander';

const PROFILE_STORAGE_KEY = 'agentbrand_advisor_profile';
const OPTIONS_STORAGE_KEY = 'agentbrand_branding_options';

export function saveProfileToStorage(profile: AgentProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

export function loadProfileFromStorage(defaultProfile: AgentProfile): AgentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      return { ...defaultProfile, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to load profile from localStorage:', err);
  }
  return defaultProfile;
}

export function saveOptionsToStorage(options: BrandingOptions): void {
  try {
    localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options));
  } catch (err) {
    console.error('Failed to save options to localStorage:', err);
  }
}

export function loadOptionsFromStorage(defaultOptions: BrandingOptions): BrandingOptions {
  try {
    const raw = localStorage.getItem(OPTIONS_STORAGE_KEY);
    if (raw) {
      return { ...defaultOptions, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to load options from localStorage:', err);
  }
  return defaultOptions;
}

import { SAMPLE_LOGO_COLOR, SAMPLE_LOGO_WHITE } from '../data/sampleLogos';

// Return sample logos (both color and white versions)
export function getSampleLogos() {
  return {
    color: SAMPLE_LOGO_COLOR,
    white: SAMPLE_LOGO_WHITE,
  };
}

export function generateSampleLogoDataUrl(companyName?: string, brandColor?: string): string {
  return SAMPLE_LOGO_COLOR;
}

// Download single branded PDF
export async function downloadSingleGuide(
  guide: FinancialGuide,
  profile: AgentProfile,
  options: BrandingOptions
): Promise<void> {
  const brandedBytes = await brandFinancialGuidePdf(guide, profile, options);
  const blob = new Blob([brandedBytes], { type: 'application/pdf' });
  
  const cleanAdvisor = (profile.company || profile.name || 'Advisor')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 25);
  const cleanTitle = guide.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  const filename = `${cleanAdvisor}_${cleanTitle}.pdf`;

  saveAs(blob, filename);
}

// Batch download selected guides as a single ZIP archive
export async function downloadGuidesZip(
  guides: FinancialGuide[],
  profile: AgentProfile,
  options: BrandingOptions,
  onProgress?: (current: number, total: number, guideTitle: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folderName = `${(profile.company || profile.name || 'Advisor').replace(/[^a-zA-Z0-9]/g, '_')}_Financial_Guides`;
  const guideFolder = zip.folder(folderName) || zip;

  const total = guides.length;
  for (let i = 0; i < total; i++) {
    const guide = guides[i];
    if (onProgress) {
      onProgress(i + 1, total, guide.title);
    }
    const brandedBytes = await brandFinancialGuidePdf(guide, profile, options);
    const cleanTitle = guide.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${(i + 1).toString().padStart(2, '0')}_${cleanTitle}.pdf`;
    guideFolder.file(filename, brandedBytes);
  }

  // Add README with agent details
  const readme = `FINANCIAL GUIDES CLIENT EDUCATION PACKAGE
=====================================================
Custom Branded For: ${profile.name}
Agency/Firm: ${profile.company}
Phone: ${profile.phone}
Email: ${profile.email}
Website: ${profile.website}
License/NPN: ${profile.license}
Generated On: ${new Date().toLocaleDateString()}

INCLUDED GUIDES (${total} Total):
${guides.map((g, idx) => `${idx + 1}. ${g.title} (${g.category})`).join('\n')}

All guides are embedded with active clickable links to your phone number, email address, website, and social media profiles.
=====================================================
`;
  guideFolder.file('GUIDE_PACKAGE_INDEX.txt', readme);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${folderName}.zip`);
}
