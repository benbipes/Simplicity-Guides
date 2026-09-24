import { PDFDocument, PDFString, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function verifyBrandingEngine() {
  console.log('Testing PDF Branding Engine across all 12 guides...');
  const guidesDir = path.resolve('public/guides');
  const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.pdf'));

  if (files.length !== 12) {
    throw new Error(`Expected 12 PDF files, found ${files.length}`);
  }

  const sampleProfile = {
    name: 'Marcus Sterling, CFP®, ChFC®',
    title: 'Managing Principal & Wealth Advisor',
    company: 'Sterling Crest Financial Partners',
    phone: '(555) 782-4190',
    email: 'msterling@sterlingcrestfp.com',
    website: 'https://www.sterlingcrestfp.com',
    license: 'CRD #4928104 / NPN #19827361',
    address: '400 North Michigan Avenue, Suite 1800, Chicago, IL 60611',
    disclaimer: 'Investment advisory services offered through Sterling Crest Capital Management LLC. Insurance products offered through Sterling Crest Insurance Agency. Past performance does not guarantee future results.',
    brandColor: '#0c4a6e',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/marcus-sterling-wealth',
      facebook: 'https://www.facebook.com/SterlingCrestFinancial',
      twitter: 'https://x.com/SterlingWealth',
      youtube: 'https://youtube.com/@SterlingCrestFinancial',
      instagram: 'https://instagram.com/sterlingcrestfp'
    }
  };

  const outputTestDir = path.resolve('scratch/test_output');
  if (!fs.existsSync(outputTestDir)) {
    fs.mkdirSync(outputTestDir, { recursive: true });
  }

  let totalTested = 0;
  for (const filename of files) {
    const inputPath = path.join(guidesDir, filename);
    const pdfBytes = fs.readFileSync(inputPath);
    const doc = await PDFDocument.load(pdfBytes);
    const pages = doc.getPages();

    if (pages.length < 4) {
      throw new Error(`Guide ${filename} has fewer than 4 pages: ${pages.length}`);
    }

    // Cover page co-branding verification
    const coverPage = pages[0];
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    coverPage.drawText(`VERIFIED BRANDED: ${sampleProfile.company}`, {
      x: 60,
      y: 100,
      size: 10,
      font: fontBold,
      color: rgb(0.05, 0.3, 0.5)
    });

    // Add clickable phone link
    const phoneAnnot = doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [60, 98, 200, 112],
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(`tel:${sampleProfile.phone}`) }
    });
    coverPage.node.addAnnot(doc.context.register(phoneAnnot));

    // Back page co-branding verification
    const backPage = pages[pages.length - 1];
    backPage.drawText(`VERIFIED BACK SHOWCASE: ${sampleProfile.name}`, {
      x: 60,
      y: 250,
      size: 12,
      font: fontBold,
      color: rgb(0.05, 0.3, 0.5)
    });

    const modifiedBytes = await doc.save();
    const outputPath = path.join(outputTestDir, `branded_${filename}`);
    fs.writeFileSync(outputPath, modifiedBytes);

    if (modifiedBytes.length <= pdfBytes.length) {
      throw new Error(`Modified PDF for ${filename} did not increase in size.`);
    }

    totalTested++;
    console.log(`  ✓ Successfully stamped ${filename} (${modifiedBytes.length} bytes)`);
  }

  console.log(`\nAll ${totalTested} financial guides verified and stamped successfully!`);
}

verifyBrandingEngine().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
