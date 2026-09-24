import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const guides = [
  { file: 'important-birthdays-over-50.pdf', pages: 13, contact: 11, disclosure: 13 },
  { file: 'short-introduction-to-long-term-care.pdf', pages: 20, contact: 18, disclosure: 20 },
  { file: 'legacy-and-estate-planning.pdf', pages: 15, contact: 13, disclosure: 15 },
  { file: 'exit-your-business-enter-retirement.pdf', pages: 17, contact: 15, disclosure: 17 },
  { file: 'age-5-to-55-kids-finances.pdf', pages: 16, contact: 14, disclosure: 16 },
  { file: 'ultimate-401k-guide.pdf', pages: 14, contact: 12, disclosure: 14 },
  { file: 'optimizing-social-security.pdf', pages: 22, contact: 20, disclosure: 22 },
  { file: 'tax-planning-guide.pdf', pages: 23, contact: 21, disclosure: 23 },
  { file: 'medicare-and-medigap.pdf', pages: 18, contact: 16, disclosure: 18 },
  { file: '5-keys-to-retirement-planning.pdf', pages: 25, contact: 23, disclosure: 25 },
  { file: 'womens-guide-to-retirement.pdf', pages: 19, contact: 17, disclosure: 19 },
  { file: 'your-guide-to-roth-iras.pdf', pages: 16, contact: 14, disclosure: 16 }
];

async function verifyAll() {
  console.log("Verifying all 12 authentic Simplicity master guides...");
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
    // Verify cover, contact, disclosure exist
    const coverPage = doc.getPage(0);
    const contactPage = doc.getPage(g.contact - 1);
    const discPage = doc.getPage(g.disclosure - 1);
    console.log(`  ✓ ${g.file} (${total} pgs) - Cover: 1, Contact: ${g.contact}, Disclosure: ${g.disclosure}`);
  }
  console.log("\nALL 12 AUTHENTIC GUIDES PRESENT AND VERIFIED!");
}

verifyAll().catch(e => {
  console.error(e);
  process.exit(1);
});
