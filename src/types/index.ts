export interface AgentProfile {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  bookingUrl?: string; // Link for "Learn More" button
  license: string;
  address: string;
  disclaimer: string; // Custom disclosure text
  uploadedDisclosure?: {
    fileName: string;
    fileType: 'pdf' | 'image' | 'text';
    dataUrl?: string;
    pdfBytes?: Uint8Array;
  } | null;
  logoDataUrl: string | null; // Color version (for white/light contact page)
  logoWhiteDataUrl?: string | null; // White/reversed version (for dark covers)
  brandColor: string;
  socialLinks: {
    linkedin: string;
    facebook: string;
    twitter: string;
    youtube: string;
    instagram: string;
  };
}

export interface FinancialGuide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  pages: number;
  filename: string;
  contactPageNumber: number; // 1-indexed
  disclosurePageNumber: number; // 1-indexed
  topics: string[];
  themeColor: string;
  customPdfBytes?: Uint8Array;
  isCustom?: boolean;
}

export interface BrandingOptions {
  updateContactPage: boolean;
  appendCustomDisclosure: boolean;
  callToActionUrl: string;
}

export interface BatchProgress {
  isGenerating: boolean;
  currentStep: number;
  totalSteps: number;
  currentGuideTitle: string;
  error?: string;
}
