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
    filename: '10-business-owner-retirement-solutions.pdf',
    title: 'The Ultimate 401(k) Guide',
    subtitle: 'Contribution Limits, Safe Harbor Plans, Catch-Ups & Rollover Rules',
    category: 'Retirement Plans',
    pages: 14,
    contactPageNumber: 12,
    disclosurePageNumber: 14,
    themeColor: '#0f766e',
    topics: [
      '2026 Contribution Limits: $24,500 Standard + $8,000 Catch-Up',
      'Roth 401(k) vs. Traditional Pre-Tax 401(k) Comparisons',
      'Auto-Enrollment & Safe Harbor Match Formulas',
      'Rollover Strategies: Rolling an Old 401(k) to an IRA Penalty-Free'
    ]
  },
  {
    id: '07-social-security-maximization',
    filename: '02-social-security-maximization.pdf',
    title: 'Maximizing Social Security Benefits',
    subtitle: 'Strategic Claiming, Spousal Benefits & Provisional Tax Rules',
    category: 'Social Security',
    pages: 14,
    contactPageNumber: 12,
    disclosurePageNumber: 14,
    themeColor: '#166534',
    topics: [
      'Claiming at Age 62 vs. Full Retirement Age (FRA) vs. Age 70',
      '8% Annual Guaranteed Benefit Increase for Delaying Past FRA',
      'Spousal & Survivor Benefit Coordination Rules',
      'Provisional Income Calculation & Minimizing Social Security Taxes'
    ]
  },
  {
    id: '08-tax-efficient-wealth',
    filename: '03-tax-efficient-wealth-strategies.pdf',
    title: 'Tax-Efficient Wealth & Distribution Strategies',
    subtitle: 'Minimizing Lifetime Taxes across Taxable, Tax-Deferred & Tax-Free Buckets',
    category: 'Tax Planning',
    pages: 15,
    contactPageNumber: 13,
    disclosurePageNumber: 15,
    themeColor: '#881337',
    topics: [
      'The Three Tax Buckets: Taxable, Tax-Deferred, Tax-Free',
      'Roth Conversions: Optimal Timing and Bracket Bumping',
      'Managing Required Minimum Distributions (RMDs)',
      'Asset Location: Placing the Right Assets in the Right Accounts'
    ]
  },
  {
    id: '09-modern-annuity-guide',
    filename: '04-the-modern-annuity-guide.pdf',
    title: 'The Modern Annuity Guide',
    subtitle: 'Fixed, Indexed & Variable Solutions for Market Protection and Lifetime Income',
    category: 'Income & Protection',
    pages: 16,
    contactPageNumber: 14,
    disclosurePageNumber: 16,
    themeColor: '#075985',
    topics: [
      'Fixed Index Annuities (FIAs): 0% Floors & Cap Rates',
      'Multi-Year Guaranteed Annuities (MYGA) as CD Alternatives',
      'Lifetime Income Benefit Riders (LIBR): Predictable Cash Flow',
      'Debunking Common Annuity Myths and Understanding Fee Structures'
    ]
  },
  {
    id: '10-medicare-healthcare',
    filename: '09-medicare-and-healthcare-in-retirement.pdf',
    title: 'Medicare & Healthcare Costs in Retirement',
    subtitle: 'Coverage Choices, Medigap vs. Medicare Advantage & Out-of-Pocket Caps',
    category: 'Healthcare & Care',
    pages: 15,
    contactPageNumber: 13,
    disclosurePageNumber: 15,
    themeColor: '#1e3a8a',
    topics: [
      'Medicare Part A, B, C (Advantage), and D (Prescriptions)',
      'Medigap Supplement Plans vs. Medicare Advantage Pros & Cons',
      'Understanding IRMAA Surcharges for Higher Incomes',
      'The 7-Month Initial Enrollment Window and Late Penalties'
    ]
  },
  {
    id: '11-high-net-worth-wealth',
    filename: '11-high-net-worth-wealth-preservation.pdf',
    title: 'High-Net-Worth Wealth Preservation',
    subtitle: 'Multi-Generational Wealth, Dynasty Trusts & Tax Gifting',
    category: 'Estate Planning',
    pages: 16,
    contactPageNumber: 14,
    disclosurePageNumber: 16,
    themeColor: '#581c87',
    topics: [
      'Unified Lifetime Gift & Estate Tax Exemptions',
      'Irrevocable Life Insurance Trusts (ILIT) for Estate Liquidity',
      'Charitable Remainder Trusts (CRT) & Family Foundations',
      'Valuation Discounts and Family Limited Partnerships'
    ]
  },
  {
    id: '12-college-funding-529',
    filename: '12-college-funding-and-529-plans.pdf',
    title: 'College Funding Strategies & 529 Plans',
    subtitle: '529 Savings Plans, Financial Aid Nuances & SECURE 2.0 Roth Rollovers',
    category: 'Family Wealth',
    pages: 14,
    contactPageNumber: 12,
    disclosurePageNumber: 14,
    themeColor: '#0e7490',
    topics: [
      '529 College Savings Plans: Growth, Distributions & State Deductions',
      'SECURE Act 2.0: Rolling Unused 529 Funds into a Roth IRA',
      'FAFSA Asset Formula: Student vs. Parent vs. Grandparent Assets',
      'Balancing Retirement Goals with Child Education Funding'
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
