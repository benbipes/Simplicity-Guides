import { PDFDocument, PDFName, PDFString, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const REAL_GUIDES = [
  { name: 'Important Birthdays Over 50', file: 'important-birthdays-over-50.pdf', expectedPages: 13, contactPage: 11, discPage: 13 },
  { name: 'A Short Introduction to Long-Term Care', file: 'short-introduction-to-long-term-care.pdf', expectedPages: 20, contactPage: 18, discPage: 20 },
  { name: 'Legacy & Estate Planning', file: 'legacy-and-estate-planning.pdf', expectedPages: 15, contactPage: 13, discPage: 15 },
  { name: 'How to Exit Your Business and Enter Retirement', file: 'exit-your-business-enter-retirement.pdf', expectedPages: 17, contactPage: 15, discPage: 17 },
  { name: 'Age 5 to 55: What Your Kids Need to Know', file: 'age-5-to-55-kids-finances.pdf', expectedPages: 16, contactPage: 14, discPage: 16 }
];

async function runVerification() {
  console.log('--- Verifying Real User Guide Branding ---');
  const sampleProfile = {
    name: 'Marcus Sterling, CFP®',
    company: 'Sterling Crest Financial Partners',
    phone: '(555) 782-4190',
    email: 'msterling@sterlingcrestfp.com',
    website: 'https://www.sterlingcrestfp.com',
    bookingUrl: 'https://calendly.com/sterling-wealth/review',
    address: '400 North Michigan Avenue, Suite 1800, Chicago, IL 60611',
    disclaimer: 'Investment advisory services offered through Sterling Crest Capital Management LLC, an SEC Registered Investment Adviser. Insurance products offered through licensed agencies.',
    brandColor: [0.05, 0.29, 0.43],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/marcus-sterling-wealth',
      facebook: 'https://facebook.com/SterlingCrestFinancial',
      twitter: 'https://x.com/SterlingWealth',
      youtube: 'https://youtube.com/@SterlingCrestFinancial',
      instagram: 'https://instagram.com/sterlingcrestfp'
    }
  };

  const outputDir = path.resolve('scratch/verified_real_guides');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const g of REAL_GUIDES) {
    const inputPath = path.resolve('public/guides', g.file);
    if (!fs.existsSync(inputPath)) {
      throw new Error(`File missing: ${inputPath}`);
    }

    const buf = fs.readFileSync(inputPath);
    const doc = await PDFDocument.load(buf);
    const total = doc.getPageCount();

    if (total !== g.expectedPages) {
      throw new Error(`Page count mismatch for ${g.name}: expected ${g.expectedPages}, got ${total}`);
    }

    const contactIdx = total - 3;
    const discIdx = total - 1;

    // Contact page
    const contactPage = doc.getPage(contactIdx);
    const { width, height } = contactPage.getSize();

    // 1. Cover contact placeholder
    contactPage.drawRectangle({
      x: 60,
      y: 50,
      width: width - 120,
      height: 300,
      color: rgb(1, 1, 1),
    });

    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

    // 2. Company Name
    contactPage.drawText(sampleProfile.company.toUpperCase(), {
      x: 180,
      y: 280,
      size: 13,
      font: fontBold,
      color: rgb(...sampleProfile.brandColor),
    });

    // 3. Website
    const cleanWeb = sampleProfile.website.replace(/^https?:\/\//, '');
    const webW = fontBold.widthOfTextAtSize(cleanWeb, 13);
    const webX = (width - webW) / 2;
    contactPage.drawText(cleanWeb, {
      x: webX,
      y: 207,
      size: 13,
      font: fontBold,
      color: rgb(...sampleProfile.brandColor),
    });

    // Add website link annot
    const webAnnot = doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [webX - 2, 205, webX + webW + 2, 222],
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(sampleProfile.website) }
    });
    contactPage.node.addAnnot(doc.context.register(webAnnot));

    // 4. Phone & Email
    const line = `${sampleProfile.phone}  |  ${sampleProfile.email}`;
    const lineW = fontRegular.widthOfTextAtSize(line, 11);
    contactPage.drawText(line, {
      x: (width - lineW) / 2,
      y: 180,
      size: 11,
      font: fontRegular,
      color: rgb(0.1, 0.25, 0.45),
    });

    // 5. Address
    const addrW = fontRegular.widthOfTextAtSize(sampleProfile.address, 9.5);
    contactPage.drawText(sampleProfile.address, {
      x: (width - addrW) / 2,
      y: 153,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.35, 0.4, 0.45),
    });

    // 6. "Learn More" Button Link
    const btnAnnot = doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [225, 405, 387, 455],
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(sampleProfile.bookingUrl) }
    });
    contactPage.node.addAnnot(doc.context.register(btnAnnot));

    // 7. Disclosure Page: Append Agent Disclosure after standard disclosure
    const discPage = doc.getPage(discIdx);
    const dividerY = 490;
    discPage.drawLine({
      start: { x: 54, y: dividerY },
      end: { x: width - 54, y: dividerY },
      color: rgb(0.85, 0.88, 0.92),
      thickness: 1,
    });

    discPage.drawText('ADVISOR & FIRM SPECIFIC DISCLOSURE', {
      x: 54,
      y: dividerY - 22,
      size: 9,
      font: fontBold,
      color: rgb(...sampleProfile.brandColor),
    });

    discPage.drawText(sampleProfile.disclaimer, {
      x: 54,
      y: dividerY - 40,
      size: 7.2,
      font: fontRegular,
      color: rgb(0.35, 0.4, 0.45),
    });

    const outputBytes = await doc.save();
    const outPath = path.join(outputDir, `branded_${g.file}`);
    fs.writeFileSync(outPath, outputBytes);

    console.log(`✓ Verified ${g.name} (${outputBytes.length} bytes) - Contact on Pg ${contactIdx + 1}, Disclosure on Pg ${discIdx + 1}`);
  }

  console.log('\nAll 5 real user guides verified successfully!');
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
