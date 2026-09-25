export interface SocialPostPlacement {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  xPercent: number; // Center X as percentage (0 - 100)
  yPercent: number; // Center Y as percentage (0 - 100)
  maxWidth: number; // Max width in pixels on 1024x1024
  maxHeight: number; // Max height in pixels on 1024x1024
}

export interface SocialPost {
  id: string;
  title: string;
  headline: string;
  description: string;
  filename: string;
  category: string;
  categoryLabel: string;
  defaultPlacement: SocialPostPlacement;
  hasExistingTopLogo: boolean;
  coverPatch?: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
}

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'fraud-awareness-week',
    title: 'Fraud Awareness Week (2FA & Security)',
    headline: '4 Crucial Security Checks for Retirees & Families',
    description: 'Educate clients on International Fraud Awareness Week with key digital access protection tips.',
    filename: 'fraud-awareness-week.jpg',
    category: 'fraud-awareness',
    categoryLabel: 'Cybersecurity & Fraud',
    defaultPlacement: {
      position: 'bottom-right',
      xPercent: 80,
      yPercent: 88,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: false,
  },
  {
    id: 'download-guides-today',
    title: 'Download Guides Today',
    headline: 'Download today to start sharing these with your clients.',
    description: 'Promote your complimentary client-ready financial education guides.',
    filename: 'download-guides-today.jpg',
    category: 'guides',
    categoryLabel: 'Financial Guides',
    defaultPlacement: {
      position: 'top-right',
      xPercent: 80,
      yPercent: 12,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: true,
    coverPatch: {
      x: 320,
      y: 75,
      width: 384,
      height: 95,
      color: '#0076BD', // Matching Simplicity blue
    },
  },
  {
    id: 'client-ready-breakdowns',
    title: 'Client-Ready Breakdowns',
    headline: 'Provide client-ready breakdowns without the complex jargon.',
    description: 'Showcase your ability to demystify complex financial strategies for everyday families.',
    filename: 'client-ready-breakdowns.jpg',
    category: 'guides',
    categoryLabel: 'Client Communication',
    defaultPlacement: {
      position: 'top-right',
      xPercent: 80,
      yPercent: 12,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: true,
    coverPatch: {
      x: 320,
      y: 75,
      width: 384,
      height: 95,
      color: '#02385c', // Matching dark blue background
    },
  },
  {
    id: 'life-insurance-misconceptions',
    title: 'Life Insurance Misconceptions',
    headline: 'Address common life insurance misconceptions.',
    description: 'Engage clients on common myths and the true living benefits of proper coverage.',
    filename: 'life-insurance-misconceptions.jpg',
    category: 'life-insurance',
    categoryLabel: 'Life Insurance',
    defaultPlacement: {
      position: 'top-right',
      xPercent: 80,
      yPercent: 12,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: true,
    coverPatch: {
      x: 320,
      y: 75,
      width: 384,
      height: 95,
      color: '#012e4d', // Matching dark blue background
    },
  },
  {
    id: 'protect-assets-healthcare',
    title: 'Protect Client Assets from Healthcare Costs',
    headline: 'Help protect client assets from unexpected healthcare costs.',
    description: 'Highlight long-term care and healthcare risk planning in retirement.',
    filename: 'protect-assets-healthcare.jpg',
    category: 'healthcare',
    categoryLabel: 'Healthcare & Retirement',
    defaultPlacement: {
      position: 'top-right',
      xPercent: 80,
      yPercent: 12,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: true,
    coverPatch: {
      x: 320,
      y: 75,
      width: 384,
      height: 95,
      color: '#023456', // Matching dark blue background
    },
  },
  {
    id: 'thanksgiving-pumpkin-leaves',
    title: 'Thanksgiving Wishes (Warm Gathering)',
    headline: 'Wishing you a warm, wonderful Thanksgiving.',
    description: 'Share heartfelt holiday gratitude with clients, colleagues, and families.',
    filename: 'thanksgiving-pumpkin-leaves.jpg',
    category: 'holiday',
    categoryLabel: 'Holiday & Seasonal',
    defaultPlacement: {
      position: 'top-right',
      xPercent: 80,
      yPercent: 12,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: false,
  },
  {
    id: 'thanksgiving-autumn-orange',
    title: 'Thanksgiving Gratitude (Autumn Harvest)',
    headline: 'Gratitude turns what we have into enough.',
    description: 'Celebrate Thanksgiving with a message of gratitude and appreciation for your clients.',
    filename: 'thanksgiving-autumn-orange.jpg',
    category: 'holiday',
    categoryLabel: 'Holiday & Seasonal',
    defaultPlacement: {
      position: 'bottom-right',
      xPercent: 80,
      yPercent: 88,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: false,
  },
  {
    id: 'align-people-tech-process',
    title: 'Align People, Technology & Process',
    headline: 'Align your people, technology, and process.',
    description: 'Empower modern advisory operations with streamlined workflow integration.',
    filename: 'align-people-tech-process.jpg',
    category: 'practice-management',
    categoryLabel: 'Practice Growth',
    defaultPlacement: {
      position: 'top-right',
      xPercent: 80,
      yPercent: 12,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: true,
    coverPatch: {
      x: 320,
      y: 75,
      width: 384,
      height: 95,
      color: '#002848',
    },
  },
  {
    id: 'price-of-independence',
    title: 'The Price of Independence',
    headline: 'Frustration shouldn\'t be the price of independence.',
    description: 'Inspire independent financial professionals to achieve autonomy without operational friction.',
    filename: 'price-of-independence.jpg',
    category: 'advisory-independence',
    categoryLabel: 'Advisory Independence',
    defaultPlacement: {
      position: 'top-right',
      xPercent: 80,
      yPercent: 12,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: true,
    coverPatch: {
      x: 320,
      y: 75,
      width: 384,
      height: 95,
      color: '#002848',
    },
  },
  {
    id: 'higher-production-less-time',
    title: 'Higher Production in Less Time',
    headline: 'Higher level of production in less time.',
    description: 'Highlight growth, efficiency, and scaled advisor performance.',
    filename: 'higher-production-less-time.jpg',
    category: 'practice-management',
    categoryLabel: 'Practice Growth',
    defaultPlacement: {
      position: 'top-right',
      xPercent: 80,
      yPercent: 12,
      maxWidth: 290,
      maxHeight: 75,
    },
    hasExistingTopLogo: true,
    coverPatch: {
      x: 320,
      y: 75,
      width: 384,
      height: 95,
      color: '#002848',
    },
  },
];
