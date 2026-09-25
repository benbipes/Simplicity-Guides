import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const guides = [
  { file: 'important-birthdays-over-50.pdf', title: 'Important Birthdays Over 50', pages: 13, contact: 11, disclosure: 13 },
  { file: 'short-introduction-to-long-term-care.pdf', title: 'A Short Introduction to Long-Term Care', pages: 20, contact: 18, disclosure: 20 },
  { file: 'age-5-to-55-kids-finances.pdf', title: 'Age 5 to 55: What Your Kids Need to Know About Finances', pages: 16, contact: 14, disclosure: 16 },
  { file: 'legacy-and-estate-planning.pdf', title: 'Legacy & Estate Planning: Understanding the Basics', pages: 15, contact: 13, disclosure: 15 },
  { file: 'pensions-buyouts-retirement-income.pdf', title: 'Pensions, Buyouts, & Retirement Income', pages: 17, contact: 15, disclosure: 17 },
  { file: 'exit-your-business-enter-retirement.pdf', title: 'How to Exit Your Business and Enter Retirement', pages: 17, contact: 15, disclosure: 17 },
  { file: 'staying-disciplined-during-market-volatility.pdf', title: 'Staying Disciplined During Market Volatility', pages: 13, contact: 11, disclosure: 13 }
];

async function verifyAll() {
  console.log("Verifying the 6 selected Simplicity master guides...");
  for (const g of guides) {
    const filePath = path.resolve('public/guides', g.file);
    if (!fs.existsSync(filePath)) {
      console.error(`MISSING: ${g.file}`);
      process.exit(1);
    }
    const bytes = fs.readFileSync(filePath);
    const doc = await PDFDocument.load(bytes);
    const total = doc.getPageCount();
    if (total !== g.pages) {
      console.error(`Page count mismatch for ${g.file}: expected ${g.pages}, got ${total}`);
      process.exit(1);
    }
    const coverPage = doc.getPage(0);
    const contactPage = doc.getPage(g.contact - 1);
    const discPage = doc.getPage(g.disclosure - 1);
    console.log(`  ✓ ${g.title} (${g.file}) | Total: ${total}, Contact: Pg ${g.contact}, Disclosure: Pg ${g.disclosure}`);
  }
  console.log("\nALL SEVEN MASTER GUIDES VERIFIED SUCCESSFULLY!");
}

verifyAll().catch(e => {
  console.error(e);
  process.exit(1);
});
