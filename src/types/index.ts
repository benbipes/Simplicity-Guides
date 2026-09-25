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
  teamMembers?: TeamMemberBio[];
  workshopEvent?: {
    date: string;
    time: string;
    locationName: string;
    locationAddress: string;
  };
}

export interface TeamMemberBio {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  headshotDataUrl?: string;
}

export interface CollegeMaterial {
  id: string;
  title: string;
  subtitle: string;
  category: 'presentation' | 'flyer' | 'workbook' | 'value-piece' | 'packet' | 'social' | 'afes' | string;
  categoryLabel: string;
  filename: string;
  pages: number;
  format: 'pdf' | 'pptx';
  hasTeamSection?: boolean;
  teamPageNumber?: number;
  contactPages?: number[];
  hasEventDetails?: boolean;
  description: string;
  badge?: string;
  customFileBytes?: Uint8Array;
  isCustom?: boolean;
}

export interface WealthMaterial {
  id: string;
  title: string;
  subtitle: string;
  category: 'flyer' | 'brochure' | 'questionnaire' | 'presentation' | string;
  categoryLabel: string;
  filename: string;
  pages: number;
  format: 'pdf' | 'pptx';
  hasTeamSection?: boolean;
  teamPageNumber?: number; // e.g. 5 for Our Team brochure
  contactPages?: number[]; // pages that have contact blocks (e.g. [1, 2] or [1, 8])
  description: string;
  badge?: string;
  customFileBytes?: Uint8Array;
  isCustom?: boolean;
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Super Admin' | 'Admin';
  isSuperAdmin?: boolean;
  createdAt: string;
  addedBy?: string;
}

