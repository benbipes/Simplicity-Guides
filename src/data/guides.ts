import { FinancialGuide } from '../types/index';
import { SAMPLE_LOGO_COLOR, SAMPLE_LOGO_WHITE } from './sampleLogos';
import { DEFAULT_TEAM_MEMBERS } from './wealthMaterials';

export const INITIAL_GUIDES: FinancialGuide[] = [
  {
    id: '01-birthdays-over-50',
    filename: 'important-birthdays-over-50.pdf',
    title: 'Important Birthdays Over 50',
    subtitle: 'Critical Milestones from Age 50 to 73: Catch-up Contributions, Social Security & RMDs',
    category: 'Retirement Milestones',
    pages: 13,
    contactPageNumber: 11,
    disclosurePageNumber: 13,
    themeColor: '#1d4ed8',
    topics: [
      'Age 50 Catch-Up Contributions & SECURE 2.0 Limits',
      'Age 55 Penalty-Free 401(k) / 403(b) Separation Withdrawals',
      'Age 59½ Penalty-Free Distributions & In-Service Rules',
      'Age 62 to 70 Social Security Claiming Windows & COLA',
      'Age 65 Medicare Initial Enrollment Window & Gaps',
      'Age 73 Required Minimum Distributions (RMDs) Calculations'
    ]
  },
  {
    id: '02-long-term-care',
    filename: 'short-introduction-to-long-term-care.pdf',
    title: 'A Short Introduction to Long-Term Care',
    subtitle: 'Understanding Living Options, Costs, Medicare Limitations & Hybrid Insurance Solutions',
    category: 'Healthcare & Care',
    pages: 20,
    contactPageNumber: 18,
    disclosurePageNumber: 20,
    themeColor: '#059669',
    topics: [
      'Average Long-Term Care Costs: Home, Assisted Living, & Nursing Homes',
      'Medicare Part A & B Coverage Limits vs. Out-of-Pocket Traps',
      'Medicaid Asset Transfer Rules & Spend-Down Complexities',
      'Hybrid Asset-Based Life / LTC Policies & Cash Value Riders',
      'HSA Tax Deductions & Tax-Advantaged Premiums',
      'Veterans Aid & Attendance (A&A) Pension Opportunities'
    ]
  },
  {
    id: '03-age-5-to-55-finances',
    filename: 'age-5-to-55-kids-finances.pdf',
    title: 'Age 5 to 55: What Your Kids Need to Know About Finances',
    subtitle: 'Teaching Children & Young Adults Wealth-Building, 529 College Plans & Roth IRAs',
    category: 'Family Wealth',
    pages: 16,
    contactPageNumber: 14,
    disclosurePageNumber: 16,
    themeColor: '#0369a1',
    topics: [
      'Ages 5-13: Teaching Delayed Gratification, Chores & Banking Basics',
      'Ages 14-17: College Tuition Planning, FAFSA Guidelines & Credit Habits',
      'Ages 18-22: Budgeting First Incomes & Starting a Roth IRA Early',
      'The Power of Compounding Interest: The Rule of 72 Explained',
      'Ages 23-29: 401(k) Contributions, Long-Term Investing & Healthcare Proxies',
      'Ages 30-55: 529 Grandchildren Plans & Multi-Generational Wealth Transfer'
    ]
  },
  {
    id: '04-legacy-estate-planning',
    filename: 'legacy-and-estate-planning.pdf',
    title: 'Legacy & Estate Planning: Understanding the Basics',
    subtitle: 'Wills, Revocable vs. Irrevocable Trusts, Estate Taxes & Generational Wealth Transfer',
    category: 'Estate Planning',
    pages: 15,
    contactPageNumber: 13,
    disclosurePageNumber: 15,
    themeColor: '#6d28d9',
    topics: [
      'The $124 Trillion Generational Wealth Transfer to Gen X & Millennials',
      'Federal Estate Tax Exemption ($15M Individual / $30M Married) in 2026',
      'Wills vs. Revocable Living Trusts: Avoiding Costly Probate Delays',
      'Irrevocable Trusts: Asset Protection & State Tax Nuances',
      'Healthcare Proxies, Living Wills & Durable Financial Power of Attorney',
      'Annual $19,000 Gift Tax Exclusions & Charitable Remainder Trusts'
    ]
  },
  {
    id: '05-pensions-buyouts-retirement',
    filename: 'pensions-buyouts-retirement-income.pdf',
    title: 'Pensions, Buyouts, & Retirement Income',
    subtitle: 'Defined-Benefit vs. Defined-Contribution, Buyout Evaluation & Lifetime Income Options',
    category: 'Retirement Income',
    pages: 17,
    contactPageNumber: 15,
    disclosurePageNumber: 17,
    themeColor: '#0f766e',
    topics: [
      'Recent History of Pensions & Defined-Benefit vs. 401(k) Differences',
      'Evaluating Pension Buyouts: Lump Sum vs. Monthly Lifetime Payments',
      'Longevity Risk Management & Spousal Benefit Protection Options',
      'Rolling Lump Sums to IRAs & Strategic Roth Conversions',
      'Transforming Savings into Guaranteed Lifetime Income via Annuities',
      'Inflation Protection Strategies to Preserve Purchasing Power'
    ]
  },
  {
    id: '06-exit-business-retirement',
    filename: 'exit-your-business-enter-retirement.pdf',
    title: 'How to Exit Your Business and Enter Retirement',
    subtitle: 'Your Guide to Planning Both Life-Changing Events: Valuation, Taxes, and Succession',
    category: 'Business & Succession',
    pages: 17,
    contactPageNumber: 15,
    disclosurePageNumber: 17,
    themeColor: '#78350f',
    topics: [
      'Business Succession Planning: Identifying Successors & Roles',
      'Business Valuation vs. Inventory and Asset Liquidation',
      'Structuring Installment Sales & Capital Gains Tax Optimization',
      'Passing on a Family Business & Step-Up in Basis Rules',
      'SECURE Act 2.0 Changes: Starter 401(k)s, Auto-Enrollment & Tax Credits',
      'Transitioning from Business Cash Flow to Guaranteed Retirement Income'
    ]
  }
];

export const DEMO_PROFILE = {
  name: 'Marcus Sterling, CFP®, ChFC®',
  title: 'Managing Principal & Wealth Advisor',
  company: 'Custom Insurance Branding',
  phone: '(555) 782-4190',
  email: 'msterling@custominsurancebranding.com',
  website: 'https://www.custominsurancebranding.com',
  bookingUrl: 'https://www.custominsurancebranding.com/schedule-review',
  license: 'CRD #4928104 / NPN #19827361',
  address: '400 North Michigan Avenue, Suite 1800, Chicago, IL 60611',
  disclaimer: 'Investment advisory services offered through Custom Insurance Branding LLC, an SEC Registered Investment Adviser. Insurance products offered through licensed agencies. Past performance does not guarantee future results. Not intended as specific tax or legal counsel.',
  uploadedDisclosure: null,
  logoDataUrl: SAMPLE_LOGO_COLOR,
  logoWhiteDataUrl: SAMPLE_LOGO_WHITE,
  brandColor: '#0076BD', // Simplicity Royal Blue
  socialLinks: {
    linkedin: 'https://www.linkedin.com/company/custom-insurance-branding',
    facebook: 'https://www.facebook.com/custominsurancebranding',
    twitter: 'https://x.com/custominsbrand',
    youtube: 'https://youtube.com/@custominsurancebranding',
    instagram: 'https://instagram.com/custominsurancebranding'
  },
  teamMembers: DEFAULT_TEAM_MEMBERS,
  workshopEvent: {
    title: 'Simplifying College Planning',
    date: 'Tuesday, October 20, 2026',
    time: '6:00 PM - 7:30 PM',
    locationName: "Piattino's Italian Restaurant",
    locationAddress: '900 Summit Avenue\nSummit, New Jersey 07901',
  },
};
