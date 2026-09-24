import { PDFDocument, PDFName, PDFString, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function testExactPdfDesign() {
  const buf = fs.readFileSync('public/guides/important-birthdays-over-50.pdf');
  const doc = await PDFDocument.load(buf);
  const totalPages = doc.getPageCount();
  const contactIdx = totalPages - 3;
  const discIdx = totalPages - 1;

  const logoBuf = fs.readFileSync('public/images/simplicity-logo-color.png');
  const newLogo = await doc.embedPng(logoBuf);

  // 1. COVER PAGE: Lower left corner
  // The placeholder logo was at x: 54, y: 28.9, width: 123.3, height: 36.0
  const p1 = doc.getPage(0);
  const res1 = p1.node.Resources();
  const xObj1 = res1.lookup(PDFName.of('XObject'));
  if (xObj1) {
    xObj1.set(PDFName.of('Im0'), newLogo.ref);
  }

  // 2. CONTACT PAGE: Exact design
  const contactPage = doc.getPage(contactIdx);
  const { width } = contactPage.getSize();
  const resContact = contactPage.node.Resources();
  const xObjContact = resContact.lookup(PDFName.of('XObject'));
  if (xObjContact) {
    xObjContact.set(PDFName.of('Im5'), newLogo.ref);
  }

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  // Clear and update website (exact position: Y = 206)
  contactPage.drawRectangle({
    x: 180,
    y: 202,
    width: 252,
    height: 20,
    color: rgb(1, 1, 1),
  });

  const website = 'apexwealthpartners.com';
  const webSize = 14;
  const webW = fontBold.widthOfTextAtSize(website, webSize);
  const webX = (width - webW) / 2;
  const webColor = rgb(0.0, 0.282, 0.486); // Exact #00487C

  contactPage.drawText(website, {
    x: webX,
    y: 206,
    size: webSize,
    font: fontBold,
    color: webColor,
  });

  const webAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [webX - 2, 204, webX + webW + 2, 222],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of('https://' + website) },
  });
  contactPage.node.addAnnot(doc.context.register(webAnnot));

  // Clear and update Phone & Email (exact position: Y = 178)
  contactPage.drawRectangle({
    x: 120,
    y: 175,
    width: 372,
    height: 20,
    color: rgb(1, 1, 1),
  });

  const phone = '(312) 555-0199';
  const email = 'info@apexwealthpartners.com';
  const contactLine = `${phone} | ${email}`;
  const contactSize = 10.5;
  const cLineW = fontRegular.widthOfTextAtSize(contactLine, contactSize);
  const cLineX = (width - cLineW) / 2;

  contactPage.drawText(contactLine, {
    x: cLineX,
    y: 178,
    size: contactSize,
    font: fontRegular,
    color: webColor,
  });

  // Link for phone
  const phoneW = fontRegular.widthOfTextAtSize(phone, contactSize);
  const phoneAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [cLineX - 2, 176, cLineX + phoneW + 2, 192],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(`tel:${phone}`) },
  });
  contactPage.node.addAnnot(doc.context.register(phoneAnnot));

  // Link for email
  const sepW = fontRegular.widthOfTextAtSize(`${phone} | `, contactSize);
  const emailW = fontRegular.widthOfTextAtSize(email, contactSize);
  const emailAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [cLineX + sepW - 2, 176, cLineX + sepW + emailW + 2, 192],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(`mailto:${email}`) },
  });
  contactPage.node.addAnnot(doc.context.register(emailAnnot));

  // Clear and update Address (exact position: Y = 153)
  contactPage.drawRectangle({
    x: 80,
    y: 148,
    width: 452,
    height: 20,
    color: rgb(1, 1, 1),
  });

  const address = '200 South Wacker Dr | Suite 3100 | Chicago, IL, 60606';
  const addrSize = 9.5;
  const addrW = fontRegular.widthOfTextAtSize(address, addrSize);
  const addrX = (width - addrW) / 2;

  contactPage.drawText(address, {
    x: addrX,
    y: 153,
    size: addrSize,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2), // Dark gray
  });

  // Wire Link Annotations on the 5 existing social icons (exact coordinates)
  const socialAnnots = [
    { url: 'https://youtube.com/@apexwealth', rect: [157.04, 68.65, 193.99, 105.6] },
    { url: 'https://instagram.com/apexwealth', rect: [222.28, 68.65, 259.23, 105.6] },
    { url: 'https://facebook.com/apexwealth', rect: [287.52, 68.65, 324.47, 105.6] },
    { url: 'https://linkedin.com/in/apexwealth', rect: [352.76, 68.65, 389.71, 105.6] },
    { url: 'https://x.com/apexwealth', rect: [418.01, 68.65, 454.96, 105.6] },
  ];

  for (const s of socialAnnots) {
    const annot = doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: s.rect,
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(s.url) },
    });
    contactPage.node.addAnnot(doc.context.register(annot));
  }

  // "Learn More" button link (exact position: [225, 405, 387, 455])
  const btnAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [225, 405, 387, 455],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of('https://apexwealthpartners.com/schedule') },
  });
  contactPage.node.addAnnot(doc.context.register(btnAnnot));

  // 3. DISCLOSURE PAGE: Add Agent Logo and Disclosure after standard disclosure
  const discPage = doc.getPage(discIdx);
  const startY = 460;

  discPage.drawLine({
    start: { x: 54, y: startY },
    end: { x: 558, y: startY },
    color: rgb(0.85, 0.85, 0.85),
    thickness: 1,
  });

  // Draw agent logo on disclosure page
  discPage.drawImage(newLogo, {
    x: 54,
    y: startY - 45,
    width: 100,
    height: 28,
  });

  discPage.drawText('ADVISOR & FIRM DISCLOSURE', {
    x: 170,
    y: startY - 30,
    size: 9,
    font: fontBold,
    color: webColor,
  });

  const discText = 'Investment advisory services offered through Apex Wealth Partners LLC. Insurance products and services offered through licensed independent agents. Not affiliated with or endorsed by any government agency.';
  discPage.drawText(discText, {
    x: 54,
    y: startY - 65,
    size: 7,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  const outBytes = await doc.save();
  fs.writeFileSync('scratch/test_exact_design.pdf', outBytes);
  console.log('Successfully saved test_exact_design.pdf! Size:', outBytes.length);
}

testExactPdfDesign().catch(console.error);
