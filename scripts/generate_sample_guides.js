import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const guides = [
  {
    id: '01-retirement-income',
    filename: '01-retirement-income-roadmap.pdf',
    title: 'The Retirement Income Roadmap',
    subtitle: 'Navigating Guaranteed Lifetime Income & Sequence of Returns',
    category: 'Retirement Planning',
    pages: 4,
    color: [0.08, 0.28, 0.48], // Deep Navy
    topics: [
      'The 4% Rule vs. Dynamic Withdrawal Strategies',
      'Mitigating Sequence-of-Returns Risk in the Fragile Decade',
      'Creating a Personal Pension with Guaranteed Lifetime Income',
      'The 3-Bucket Asset Allocation Model: Now, Soon, Later'
    ]
  },
  {
    id: '02-social-security',
    filename: '02-social-security-maximization.pdf',
    title: 'Maximizing Social Security Benefits',
    subtitle: 'Strategic Claiming, Spousal Strategies & Tax Optimization',
    category: 'Social Security',
    pages: 4,
    color: [0.15, 0.35, 0.25], // Forest Emerald
    topics: [
      'Full Retirement Age (FRA) vs. Age 62 vs. Age 70',
      'Spousal & Survivor Benefit Coordination',
      'The Taxation of Social Security: Provisional Income Rules',
      'Why Delaying Yields an 8% Annual Guaranteed Boost'
    ]
  },
  {
    id: '03-tax-efficient-wealth',
    filename: '03-tax-efficient-wealth-strategies.pdf',
    title: 'Tax-Efficient Wealth Strategies',
    subtitle: 'Minimizing Taxes in Accumulation and Distribution',
    category: 'Tax Planning',
    pages: 4,
    color: [0.45, 0.2, 0.15], // Rich Burgundy
    topics: [
      'The Three Tax Buckets: Taxable, Tax-Deferred, Tax-Free',
      'Roth Conversions: Optimal Timing and Bracket Bumping',
      'Managing Required Minimum Distributions (RMDs)',
      'Asset Location: Placing the Right Assets in the Right Accounts'
    ]
  },
  {
    id: '04-modern-annuity-guide',
    filename: '04-the-modern-annuity-guide.pdf',
    title: 'The Modern Annuity Guide',
    subtitle: 'Fixed, Indexed & Variable Solutions for Market Protection',
    category: 'Income & Protection',
    pages: 4,
    color: [0.12, 0.38, 0.55], // Ocean Blue
    topics: [
      'Fixed Index Annuities (FIAs): 0% Floors & Cap Rates',
      'Multi-Year Guaranteed Annuities (MYGA) as CD Alternatives',
      'Lifetime Income Benefit Riders (LIBR): Predictable Cash Flow',
      'Debunking Common Annuity Myths and Understanding Fee Structures'
    ]
  },
  {
    id: '05-estate-legacy-planning',
    filename: '05-estate-and-legacy-planning.pdf',
    title: 'Estate & Legacy Planning Essentials',
    subtitle: 'Protecting Generational Wealth, Trusts & Beneficiary Design',
    category: 'Estate Planning',
    pages: 4,
    color: [0.32, 0.18, 0.42], // Deep Purple
    topics: [
      'Wills vs. Revocable Living Trusts: Avoiding Probate',
      'Power of Attorney and Healthcare Directives',
      'Beneficiary Designation Pitfalls on Retirement Accounts',
      'The SECURE Act 2.0 and the 10-Year Inherited IRA Rule'
    ]
  },
  {
    id: '06-long-term-care',
    filename: '06-long-term-care-essentials.pdf',
    title: 'Long-Term Care Essentials',
    subtitle: 'Asset Protection & Hybrid Life/LTC Solutions',
    category: 'Healthcare & Care',
    pages: 4,
    color: [0.5, 0.25, 0.1], // Amber Bronze
    topics: [
      'The True Cost of Long-Term Care and Medicare Limitations',
      'Traditional LTC Insurance vs. Asset-Based Hybrid Policies',
      'The "Use-It-or-Don\'t-Lose-It" Life Insurance LTC Riders',
      'Protecting the Healthy Spouse from Financial Depletion'
    ]
  },
  {
    id: '07-market-volatility',
    filename: '07-navigating-market-volatility.pdf',
    title: 'Navigating Market Volatility',
    subtitle: 'Risk Management, Asset Allocation & Emotional Discipline',
    category: 'Wealth Management',
    pages: 4,
    color: [0.2, 0.3, 0.4], // Slate Steel
    topics: [
      'Historical Perspective: Market Corrections vs. Bear Markets',
      'The Hidden Danger of Market Timing and Missing Best Days',
      'Rebalancing Strategies: Buying Low and Selling High Systematically',
      'Building an All-Weather Portfolio for Retirement Resilience'
    ]
  },
  {
    id: '08-life-insurance-asset-class',
    filename: '08-life-insurance-as-an-asset-class.pdf',
    title: 'Life Insurance as an Asset Class',
    subtitle: 'Living Benefits, Cash Value & Tax-Free Growth',
    category: 'Life Insurance',
    pages: 4,
    color: [0.1, 0.4, 0.35], // Pine Teal
    topics: [
      'Indexed Universal Life (IUL) & Whole Life Fundamentals',
      'Tax-Free Cash Accumulation & Policy Loan Distributions',
      'Living Benefits: Critical, Chronic, and Terminal Illness',
      'Executive Bonus & Buy-Sell Business Funding'
    ]
  },
  {
    id: '09-medicare-healthcare',
    filename: '09-medicare-and-healthcare-in-retirement.pdf',
    title: 'Medicare & Healthcare in Retirement',
    subtitle: 'Coverage Choices, Medigap & Out-of-Pocket Traps',
    category: 'Healthcare & Care',
    pages: 4,
    color: [0.18, 0.35, 0.52], // Royal Blue
    topics: [
      'Medicare Part A, B, C (Advantage), and D (Prescriptions)',
      'Medigap Supplement Plans vs. Medicare Advantage Pros & Cons',
      'Understanding IRMAA Surcharges for Higher Incomes',
      'The 7-Month Initial Enrollment Window and Late Penalties'
    ]
  },
  {
    id: '10-business-owner-retirement',
    filename: '10-business-owner-retirement-solutions.pdf',
    title: 'Business Owner Retirement Solutions',
    subtitle: 'Defined Benefit Plans, SEPs, SIMPLEs & Safe Harbor 401(k)s',
    category: 'Business & Executive',
    pages: 4,
    color: [0.38, 0.28, 0.15], // Rich Earth
    topics: [
      'Cash Balance & Defined Benefit Plans: Sheltering $100k+ Annually',
      'Safe Harbor 401(k) Plans with Profit Sharing Optimization',
      'SEP IRAs vs. Solo 401(k)s for Independent Contractors',
      'Key Person Insurance and Succession Planning Strategies'
    ]
  },
  {
    id: '11-high-net-worth',
    filename: '11-high-net-worth-wealth-preservation.pdf',
    title: 'High-Net-Worth Wealth Preservation',
    subtitle: 'Multi-Generational Wealth, Dynasty Trusts & Tax Gifting',
    category: 'Estate Planning',
    pages: 4,
    color: [0.28, 0.18, 0.25], // Deep Plum
    topics: [
      'Unified Lifetime Gift & Estate Tax Exemptions',
      'Irrevocable Life Insurance Trusts (ILIT) for Estate Liquidity',
      'Charitable Remainder Trusts (CRT) & Family Foundations',
      'Valuation Discounts and Family Limited Partnerships'
    ]
  },
  {
    id: '12-college-funding',
    filename: '12-college-funding-and-529-plans.pdf',
    title: 'College Funding Strategies',
    subtitle: '529 Plans, Financial Aid Nuances & SECURE 2.0 Rollovers',
    category: 'Family Wealth',
    pages: 4,
    color: [0.15, 0.38, 0.42], // Deep Cyan
    topics: [
      '529 College Savings Plans: Growth, Distributions & State Deductions',
      'SECURE Act 2.0: Rolling Unused 529 Funds into a Roth IRA',
      'FAFSA Asset Formula: Student vs. Parent vs. Grandparent Assets',
      'Balancing Retirement Goals with Child Education Funding'
    ]
  }
];

async function createGuidePDF(guide, outputDir) {
  const doc = await PDFDocument.create();
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const [r, g, b] = guide.color;

  // PAGE 1: COVER PAGE
  const page1 = doc.addPage([612, 792]); // Standard US Letter
  const { width, height } = page1.getSize();

  // Top Accent Banner
  page1.drawRectangle({
    x: 0,
    y: height - 14,
    width: width,
    height: 14,
    color: rgb(r, g, b),
  });

  // Category Tag Box
  page1.drawRectangle({
    x: 54,
    y: height - 85,
    width: 140,
    height: 24,
    color: rgb(r * 0.2 + 0.8, g * 0.2 + 0.8, b * 0.2 + 0.8),
  });
  page1.drawText(guide.category.toUpperCase(), {
    x: 64,
    y: height - 78,
    size: 10,
    font: fontBold,
    color: rgb(r, g, b),
  });

  // Series Banner
  page1.drawText('INDEPENDENT CLIENT EDUCATION SERIES', {
    x: 210,
    y: height - 78,
    size: 9,
    font: fontBold,
    color: rgb(0.5, 0.55, 0.6),
  });

  // Main Title
  page1.drawText(guide.title, {
    x: 54,
    y: height - 160,
    size: 26,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.2),
  });

  // Subtitle
  page1.drawText(guide.subtitle, {
    x: 54,
    y: height - 192,
    size: 13,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.45),
  });

  // Decorative Rule
  page1.drawRectangle({
    x: 54,
    y: height - 215,
    width: 504,
    height: 3,
    color: rgb(r, g, b),
  });

  // Cover Feature Graphic Box
  page1.drawRectangle({
    x: 54,
    y: height - 440,
    width: 504,
    height: 200,
    color: rgb(0.96, 0.97, 0.98),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  page1.drawText('EXECUTIVE OVERVIEW & KEY STRATEGIES', {
    x: 74,
    y: height - 260,
    size: 12,
    font: fontBold,
    color: rgb(r, g, b),
  });

  let curY = height - 295;
  guide.topics.forEach((topic, i) => {
    // Bullet marker
    page1.drawCircle({
      x: 82,
      y: curY + 4,
      size: 4,
      color: rgb(r, g, b),
    });
    page1.drawText(topic, {
      x: 98,
      y: curY,
      size: 11,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.3),
    });
    curY -= 32;
  });

  // Guide Metadata
  page1.drawText('Comprehensive 2026 Edition  •  Updated for Current Tax & Financial Regulations', {
    x: 54,
    y: height - 480,
    size: 9.5,
    font: fontOblique,
    color: rgb(0.45, 0.5, 0.55),
  });

  // DESIGNATED COVER CO-BRANDING AREA (Bottom 170 points reserved for Agent Co-Brand)
  page1.drawRectangle({
    x: 54,
    y: 50,
    width: 504,
    height: 110,
    color: rgb(0.98, 0.99, 1.0),
    borderColor: rgb(0.82, 0.86, 0.9),
    borderWidth: 1,
  });

  page1.drawText('PRESENTED BY YOUR TRUSTED INDEPENDENT ADVISOR', {
    x: 74,
    y: 135,
    size: 8.5,
    font: fontBold,
    color: rgb(0.5, 0.55, 0.6),
  });

  page1.drawText('Personalized Guidance Built Around Your Financial Goals & Family Legacy', {
    x: 74,
    y: 118,
    size: 10,
    font: fontRegular,
    color: rgb(0.25, 0.3, 0.35),
  });

  page1.drawText('[AGENT / AGENCY CO-BRANDING PLACEMENT ZONE]', {
    x: 74,
    y: 80,
    size: 11,
    font: fontBold,
    color: rgb(0.65, 0.7, 0.75),
  });

  // PAGE 2: CORE ANALYSIS & METHODOLOGY
  const page2 = doc.addPage([612, 792]);
  page2.drawRectangle({ x: 0, y: height - 8, width: width, height: 8, color: rgb(r, g, b) });

  // Running Header
  page2.drawText(guide.title.toUpperCase(), {
    x: 54,
    y: height - 40,
    size: 8.5,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.5),
  });
  page2.drawText('Page 2', {
    x: 520,
    y: height - 40,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });

  page2.drawText('1. Strategic Context & Foundational Principles', {
    x: 54,
    y: height - 80,
    size: 16,
    font: fontBold,
    color: rgb(r, g, b),
  });

  const p2Text1 = [
    'Independent financial planning is built on the understanding that no two clients share identical goals, risk tolerances, or timeline horizons.',
    'Navigating the current economic landscape demands a synchronized approach across tax liabilities, market exposure, healthcare costs, and legacy objectives.',
    'A successful strategy requires distinguishing between market volatility (temporary price fluctuations) and permanent loss of purchasing power.',
    'By structuring assets into distinct operational phases, clients insulate their essential lifestyle needs from short-term market disruptions while keeping',
    'growth engines active for late-stage longevity and legacy transfer.'
  ];

  let p2Y = height - 110;
  for (const line of p2Text1) {
    page2.drawText(line, { x: 54, y: p2Y, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
    p2Y -= 17;
  }

  // Visual Framework Box
  p2Y -= 15;
  page2.drawRectangle({
    x: 54,
    y: p2Y - 140,
    width: 504,
    height: 140,
    color: rgb(0.95, 0.97, 0.99),
    borderColor: rgb(r * 0.3 + 0.7, g * 0.3 + 0.7, b * 0.3 + 0.7),
    borderWidth: 1,
  });

  page2.drawText('KEY PILLARS FOR EXECUTION', {
    x: 74,
    y: p2Y - 30,
    size: 11,
    font: fontBold,
    color: rgb(r, g, b),
  });

  const pillars = [
    '• Foundation of Certainty: Floor income mechanisms that cover non-negotiable living expenses.',
    '• Tax Optimization Matrix: Proactive Roth distributions, tax-bracket management, and capital gains timing.',
    '• Longevity & Healthcare Hedging: Transferring catastrophic health and care risks before retirement age.',
    '• Wealth Transfer Efficiency: Beneficiary alignment ensuring assets bypass unnecessary probate delays.'
  ];

  let pillarY = p2Y - 55;
  for (const p of pillars) {
    page2.drawText(p, { x: 74, y: pillarY, size: 9.5, font: fontRegular, color: rgb(0.25, 0.3, 0.35) });
    pillarY -= 22;
  }

  // Section 2
  p2Y -= 175;
  page2.drawText('2. Critical Decision Milestones', {
    x: 54,
    y: p2Y,
    size: 16,
    font: fontBold,
    color: rgb(r, g, b),
  });

  p2Y -= 25;
  const p2Text2 = [
    'Clients who achieve optimal financial independence consistently avoid emotional decision-making at market inflection points. Working alongside',
    'an independent fiduciary ensures your portfolio is stress-tested against historical bear markets, prolonged inflation cycles, and legislative shifts.',
    'Regular stress-testing allows timely adjustments to contribution formulas, withdrawal pacing, and asset protection covenants.'
  ];

  for (const line of p2Text2) {
    page2.drawText(line, { x: 54, y: p2Y, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
    p2Y -= 17;
  }

  // Footer
  page2.drawText('Educational material provided for client information purposes. Not individual tax or legal advice.', {
    x: 54,
    y: 35,
    size: 8,
    font: fontOblique,
    color: rgb(0.55, 0.6, 0.65),
  });

  // PAGE 3: ACTION PLAN & CHECKLIST
  const page3 = doc.addPage([612, 792]);
  page3.drawRectangle({ x: 0, y: height - 8, width: width, height: 8, color: rgb(r, g, b) });

  page3.drawText(guide.title.toUpperCase(), {
    x: 54,
    y: height - 40,
    size: 8.5,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.5),
  });
  page3.drawText('Page 3', {
    x: 520,
    y: height - 40,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });

  page3.drawText('3. Implementation Checklist & Questions to Ask', {
    x: 54,
    y: height - 80,
    size: 16,
    font: fontBold,
    color: rgb(r, g, b),
  });

  const checklistItems = [
    { title: 'Evaluate Cash Flow Requirements', desc: 'Determine baseline living expenses versus discretionary lifestyle spending in retirement.' },
    { title: 'Review Tax Bracket Thresholds', desc: 'Identify room in current tax brackets for strategic conversions or asset realignments.' },
    { title: 'Audit Beneficiary Designations', desc: 'Verify primary and contingent beneficiaries on all qualified plans, annuities, and life policies.' },
    { title: 'Assess Guaranteed Floor vs. Variable Growth', desc: 'Ensure predictable income streams cover fixed non-negotiable living expenses.' },
    { title: 'Stress-Test Longevity Risk', desc: 'Model out scenarios assuming life expectancy into age 95+ and potential long-term care needs.' }
  ];

  let cY = height - 120;
  checklistItems.forEach((item, index) => {
    // Checkbox box
    page3.drawRectangle({
      x: 54,
      y: cY - 4,
      width: 16,
      height: 16,
      color: rgb(0.96, 0.98, 1),
      borderColor: rgb(r, g, b),
      borderWidth: 1.5,
    });
    page3.drawText(`${index + 1}. ${item.title}`, {
      x: 80,
      y: cY + 2,
      size: 11,
      font: fontBold,
      color: rgb(0.15, 0.2, 0.25),
    });
    page3.drawText(item.desc, {
      x: 80,
      y: cY - 14,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.35, 0.4, 0.45),
    });
    cY -= 46;
  });

  // Callout Box
  cY -= 10;
  page3.drawRectangle({
    x: 54,
    y: cY - 110,
    width: 504,
    height: 110,
    color: rgb(0.98, 0.97, 0.95),
    borderColor: rgb(0.85, 0.75, 0.6),
    borderWidth: 1,
  });

  page3.drawText('THE VALUE OF INDEPENDENT ADVICE', {
    x: 74,
    y: cY - 25,
    size: 10,
    font: fontBold,
    color: rgb(0.5, 0.35, 0.1),
  });

  const valueText = [
    'Unlike captive agents representing single carriers or proprietary products, an independent advisor has access to the full marketplace.',
    'This fiduciary independence means solutions are curated exclusively to optimize your financial security, minimize fee friction,',
    'and protect what matters most to your family.'
  ];
  let vY = cY - 45;
  for (const line of valueText) {
    page3.drawText(line, { x: 74, y: vY, size: 9, font: fontRegular, color: rgb(0.3, 0.25, 0.2) });
    vY -= 16;
  }

  // Footer
  page3.drawText('Educational material provided for client information purposes. Not individual tax or legal advice.', {
    x: 54,
    y: 35,
    size: 8,
    font: fontOblique,
    color: rgb(0.55, 0.6, 0.65),
  });

  // PAGE 4: BACK COVER / DEDICATED AGENT CALLOUT & CO-BRANDING PROFILE
  const page4 = doc.addPage([612, 792]);
  page4.drawRectangle({ x: 0, y: height - 12, width: width, height: 12, color: rgb(r, g, b) });

  // Header
  page4.drawText(guide.title.toUpperCase(), {
    x: 54,
    y: height - 45,
    size: 9,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.5),
  });

  // Back page header
  page4.drawText('Taking the Next Step in Your Financial Journey', {
    x: 54,
    y: height - 90,
    size: 20,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.2),
  });

  page4.drawText('A personalized financial review helps you turn high-level strategies into an actionable plan.', {
    x: 54,
    y: height - 115,
    size: 11,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.45),
  });

  // Next steps 3-box row
  const steps = [
    { title: '1. Discovery Session', desc: 'Identify your priorities, lifestyle goals, and existing assets.' },
    { title: '2. Custom Stress Test', desc: 'Analyze inflation, tax exposure, and sequence of returns risk.' },
    { title: '3. Roadmap Delivery', desc: 'Receive your tailored, step-by-step financial blueprint.' }
  ];

  let stepX = 54;
  for (const step of steps) {
    page4.drawRectangle({
      x: stepX,
      y: height - 210,
      width: 158,
      height: 80,
      color: rgb(0.97, 0.98, 0.99),
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1,
    });
    page4.drawText(step.title, {
      x: stepX + 12,
      y: height - 150,
      size: 10,
      font: fontBold,
      color: rgb(r, g, b),
    });
    page4.drawText(step.desc.substring(0, 30), {
      x: stepX + 12,
      y: height - 170,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.35, 0.4, 0.45),
    });
    page4.drawText(step.desc.substring(30), {
      x: stepX + 12,
      y: height - 185,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.35, 0.4, 0.45),
    });
    stepX += 173;
  }

  // RESERVED AGENT PROFILE SHOWCASE BOX (Coordinates: x: 54, y: 120, width: 504, height: 350)
  page4.drawRectangle({
    x: 54,
    y: 130,
    width: 504,
    height: 380,
    color: rgb(0.99, 1, 1),
    borderColor: rgb(r * 0.4 + 0.6, g * 0.4 + 0.6, b * 0.4 + 0.6),
    borderWidth: 1.5,
  });

  // Agent Section Header inside Box
  page4.drawRectangle({
    x: 54,
    y: 470,
    width: 504,
    height: 40,
    color: rgb(r, g, b),
  });

  page4.drawText('PREPARED SPECIALLY FOR YOU BY YOUR INDEPENDENT ADVISOR', {
    x: 74,
    y: 486,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page4.drawText('[AGENT BRANDING & CONTACT PROFILE CARD WILL BE RENDERED HERE]', {
    x: 74,
    y: 350,
    size: 12,
    font: fontBold,
    color: rgb(0.6, 0.65, 0.7),
  });

  page4.drawText('Includes: Agency Logo, Headshot, Advisor Name & Credentials, Phone, Email, Office Address,', {
    x: 74,
    y: 320,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.45, 0.5, 0.55),
  });

  page4.drawText('State License / NPN #, Direct Website Link, and Clickable Social Media Handles (LinkedIn, etc.)', {
    x: 74,
    y: 300,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.45, 0.5, 0.55),
  });

  // Bottom Regulatory Disclaimer Zone
  page4.drawRectangle({
    x: 54,
    y: 50,
    width: 504,
    height: 65,
    color: rgb(0.96, 0.96, 0.97),
  });

  page4.drawText('COMPLIANCE & REGULATORY DISCLOSURE', {
    x: 64,
    y: 98,
    size: 7.5,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.5),
  });

  const discLines = [
    'This guide is provided for educational and informational purposes only and does not constitute financial, legal, or tax advice.',
    'Insurance and annuity products are subject to underwriting approval and carrier financial strength. Past performance is no guarantee of future results.',
    'Securities and advisory services may be offered through registered entities. Consult your personal financial advisor regarding your unique situation.'
  ];
  let dY = 86;
  for (const line of discLines) {
    page4.drawText(line, { x: 64, y: dY, size: 6.8, font: fontRegular, color: rgb(0.45, 0.5, 0.55) });
    dY -= 11;
  }

  // Write file
  const pdfBytes = await doc.save();
  const filePath = path.join(outputDir, guide.filename);
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`Generated: ${guide.filename} (${pdfBytes.length} bytes)`);
}

async function main() {
  const publicDir = path.resolve('public');
  const guidesDir = path.join(publicDir, 'guides');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }

  console.log(`Generating ${guides.length} financial guide master templates...`);
  for (const guide of guides) {
    await createGuidePDF(guide, guidesDir);
  }
  console.log('All 12 financial guides generated successfully!');
}

main().catch(console.error);
