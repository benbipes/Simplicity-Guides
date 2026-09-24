import { PDFDocument, PDFName, PDFString, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function testClickableLogosDirect() {
  const guidePath = 'public/guides/important-birthdays-over-50.pdf';
  const buf = fs.readFileSync(guidePath);
  const doc = await PDFDocument.load(buf);

  const websiteUrl = 'https://www.sterlingcrestfp.com';
  const logoBuf = fs.readFileSync('public/images/simplicity-logo-color.png');
  const embeddedLogo = await doc.embedPng(logoBuf);

  // 1. Cover Page (Page 0)
  const p1 = doc.getPage(0);
  const res1 = p1.node.Resources();
  const xObj1 = res1 ? (res1.lookup(PDFName.of('XObject'))) : null;
  if (xObj1 && typeof xObj1.set === 'function') {
    xObj1.set(PDFName.of('Im0'), embeddedLogo.ref);
  }
  // Add link annotation on Cover
  const coverAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [54, 28.9, 177.3, 64.9],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(websiteUrl) }
  });
  p1.node.addAnnot(doc.context.register(coverAnnot));

  // 2. Contact Page (Page 10)
  const pContact = doc.getPage(10);
  const contactAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [200, 245, 412, 315],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(websiteUrl) }
  });
  pContact.node.addAnnot(doc.context.register(contactAnnot));

  // 3. Disclosure Page (Page 12)
  const pDisc = doc.getPage(12);
  const discAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [54, 400, 174, 434],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(websiteUrl) }
  });
  pDisc.node.addAnnot(doc.context.register(discAnnot));

  const outBytes = await doc.save();
  const testDoc = await PDFDocument.load(outBytes);

  console.log('Testing Clickable Logos across all 3 pages:');
  const p1Annots = testDoc.getPage(0).node.Annots();
  let hasCoverLink = false;
  for (let i = 0; i < p1Annots.size(); i++) {
    const uri = p1Annots.lookup(i).lookup(PDFName.of('A'))?.lookup(PDFName.of('URI'))?.toString();
    if (uri && uri.includes('sterlingcrestfp.com')) hasCoverLink = true;
  }
  console.log('  1. Cover Page Logo Link:      ', hasCoverLink ? 'VERIFIED ✓' : 'FAILED ✗');

  const pCAnnots = testDoc.getPage(10).node.Annots();
  let hasContactLink = false;
  for (let i = 0; i < pCAnnots.size(); i++) {
    const uri = pCAnnots.lookup(i).lookup(PDFName.of('A'))?.lookup(PDFName.of('URI'))?.toString();
    if (uri && uri.includes('sterlingcrestfp.com')) hasContactLink = true;
  }
  console.log('  2. Contact Page Logo Link:    ', hasContactLink ? 'VERIFIED ✓' : 'FAILED ✗');

  const pDAnnots = testDoc.getPage(12).node.Annots();
  let hasDiscLink = false;
  for (let i = 0; i < pDAnnots.size(); i++) {
    const uri = pDAnnots.lookup(i).lookup(PDFName.of('A'))?.lookup(PDFName.of('URI'))?.toString();
    if (uri && uri.includes('sterlingcrestfp.com')) hasDiscLink = true;
  }
  console.log('  3. Disclosure Page Logo Link: ', hasDiscLink ? 'VERIFIED ✓' : 'FAILED ✗');

  if (hasCoverLink && hasContactLink && hasDiscLink) {
    console.log('\nAll 3 logo placements are clickable and verified to navigate to agent website!');
  }
}

testClickableLogosDirect().catch(console.error);
