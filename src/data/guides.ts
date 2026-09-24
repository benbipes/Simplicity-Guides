import { FinancialGuide } from '../types';

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
    id: '03-legacy-estate-planning',
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
    id: '04-exit-business-retirement',
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
  },
  {
    id: '05-age-5-to-55-finances',
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
    id: '06-ultimate-401k-guide',
    filename: 'ultimate-401k-guide.pdf',
    title: 'The Ultimate 401(k) Guide',
    subtitle: 'How to Take Control of Your 401(k) Before and After Retirement',
    category: 'Retirement Plans',
    pages: 14,
    contactPageNumber: 12,
    disclosurePageNumber: 14,
    themeColor: '#0f766e',
    topics: [
      '401(k) Contribution Limits & Catch-Up Opportunities',
      'Traditional vs. Roth 401(k) Options Explained',
      'Investment Allocation Strategies & Fee Awareness',
      'Rollover Rules and Options When Leaving an Employer'
    ]
  },
  {
    id: '07-optimizing-social-security',
    filename: 'optimizing-social-security.pdf',
    title: 'Optimizing Your Social Security in Today’s World',
    subtitle: 'Constructing a Cohesive Strategy & Strategic Benefit Claiming Timelines',
    category: 'Social Security',
    pages: 22,
    contactPageNumber: 20,
    disclosurePageNumber: 22,
    themeColor: '#166534',
    topics: [
      'Full Retirement Age (FRA) vs. Early & Delayed Claiming',
      'Maximizing Lifetime Cumulative Benefits',
      'Spousal and Survivor Benefit Optimization Rules',
      'Taxation of Social Security Benefits & Provisional Income'
    ]
  },
  {
    id: '08-tax-planning-guide',
    filename: 'tax-planning-guide.pdf',
    title: 'The Tax Planning Guide',
    subtitle: 'Your Roadmap to Reduced Taxes This Year and in the Future',
    category: 'Tax Planning',
    pages: 23,
    contactPageNumber: 21,
    disclosurePageNumber: 23,
    themeColor: '#881337',
    topics: [
      'Tax Deductions vs. Tax Credits Optimization',
      'Strategic Timing of Income and Capital Gains',
      'Managing Marginal Tax Brackets in Retirement',
      'Long-Term Tax Diversification Across Account Types'
    ]
  },
  {
    id: '09-medicare-and-medigap',
    filename: 'medicare-and-medigap.pdf',
    title: 'Navigating Medicare & Medigap Insurance',
    subtitle: 'Managing Healthcare Costs, Coverage Gaps & Medigap Supplements in Retirement',
    category: 'Healthcare & Care',
    pages: 18,
    contactPageNumber: 16,
    disclosurePageNumber: 18,
    themeColor: '#1e3a8a',
    topics: [
      'Medicare Parts A, B, C (Advantage), and D (Drugs)',
      'Understanding Out-of-Pocket Coverage Gaps & Deductibles',
      'Standardized Medigap Supplemental Policy Options',
      'Enrollment Deadlines & Avoiding Lifetime Late Penalties'
    ]
  },
  {
    id: '10-5-keys-retirement-planning',
    filename: '5-keys-to-retirement-planning.pdf',
    title: '5 Keys to Retirement Planning Today',
    subtitle: 'Essential Strategies for Modern Retirement Income, Investments & Longevity',
    category: 'Retirement Planning',
    pages: 25,
    contactPageNumber: 23,
    disclosurePageNumber: 25,
    themeColor: '#075985',
    topics: [
      'Constructing Reliable Guaranteed Lifetime Income Streams',
      'Balancing Risk Tolerance with Inflation Protection',
      'Tax-Efficient Withdrawal Sequencing in Distribution',
      'Healthcare and Long-Term Care Cost Preparation'
    ]
  },
  {
    id: '11-womens-guide-to-retirement',
    filename: 'womens-guide-to-retirement.pdf',
    title: 'The Women’s Guide to Retirement Planning',
    subtitle: 'Navigating Unique Longevity, Caregiving & Wealth Considerations for Women',
    category: 'Retirement Planning',
    pages: 19,
    contactPageNumber: 17,
    disclosurePageNumber: 19,
    themeColor: '#581c87',
    topics: [
      'Addressing the Longevity Gap & Longer Retirement Horizons',
      'Overcoming the Impact of Caregiving Breaks on Savings',
      'Maximizing Social Security as a Single, Married, or Widowed Woman',
      'Building Independent Financial Confidence and Wealth Security'
    ]
  },
  {
    id: '12-your-guide-to-roth-iras',
    filename: 'your-guide-to-roth-iras.pdf',
    title: 'Your Guide to Roth IRAs',
    subtitle: 'Conversions, Contribution Rules & Advanced Tax-Free Wealth Planning',
    category: 'Tax Planning',
    pages: 16,
    contactPageNumber: 14,
    disclosurePageNumber: 16,
    themeColor: '#0e7490',
    topics: [
      'Roth IRA Contribution Limits and Phaseout Income Rules',
      'Roth Conversion Strategies & Bracket Bumping Analysis',
      'The 5-Year Rule for Tax-Free and Penalty-Free Withdrawals',
      'Exemption from Required Minimum Distributions (RMDs)'
    ]
  }
];

export const DEMO_PROFILE = {
  name: 'Marcus Sterling, CFP®, ChFC®',
  title: 'Managing Principal & Wealth Advisor',
  company: 'Sterling Crest Financial Partners',
  phone: '(555) 782-4190',
  email: 'msterling@sterlingcrestfp.com',
  website: 'https://www.sterlingcrestfp.com',
  bookingUrl: 'https://www.sterlingcrestfp.com/schedule-review',
  license: 'CRD #4928104 / NPN #19827361',
  address: '400 North Michigan Avenue, Suite 1800, Chicago, IL 60611',
  disclaimer: 'Investment advisory services offered through Sterling Crest Capital Management LLC, an SEC Registered Investment Adviser. Insurance products offered through Sterling Crest Insurance Agency. Past performance does not guarantee future results. Not intended as specific tax or legal counsel.',
  uploadedDisclosure: null,
  logoDataUrl: null,
  brandColor: '#0076BD', // Simplicity Royal Blue
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/marcus-sterling-wealth',
    facebook: 'https://www.facebook.com/SterlingCrestFinancial',
    twitter: 'https://x.com/SterlingWealth',
    youtube: 'https://youtube.com/@SterlingCrestFinancial',
    instagram: 'https://instagram.com/sterlingcrestfp'
  }
};
