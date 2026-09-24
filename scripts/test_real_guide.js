import { PDFDocument, PDFName, PDFString, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function testStampRealGuide() {
  const guidePath = 'public/guides/important-birthdays-over-50.pdf';
  const buf = fs.readFileSync(guidePath);
  const doc = await PDFDocument.load(buf);

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const totalPages = doc.getPageCount();
  const contactPageIndex = totalPages - 3;
  const disclosurePageIndex = totalPages - 1;

  console.log(`Guide has ${totalPages} pages. Contact page: ${contactPageIndex + 1}, Disclosure page: ${disclosurePageIndex + 1}`);

  const contactPage = doc.getPage(contactPageIndex);
  const { width, height } = contactPage.getSize();

  // Test Advisor Info
  const advisor = {
    name: 'Sarah Jenkins, CFP®, ChFC®',
    company: 'Apex Wealth Partners',
    phone: '(312) 555-0199',
    email: 'sarah@apexwealthpartners.com',
    website: 'https://www.apexwealthpartners.com',
    address: '200 South Wacker Dr, Suite 3100, Chicago, IL 60606',
    brandColor: [0.05, 0.28, 0.48], // Navy
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahjenkins-apex',
      facebook: 'https://facebook.com/apexwealth',
      twitter: 'https://x.com/apexwealth',
      youtube: 'https://youtube.com/@apexwealth',
      instagram: 'https://instagram.com/apexwealth'
    }
  };

  // 1. Remove/cover old logo and text on contact page
  // The area from Y = 60 to Y = 360 contains the old logo, website, phone/email, address, and social icons
  contactPage.drawRectangle({
    x: 80,
    y: 50,
    width: 452,
    height: 310,
    color: rgb(1, 1, 1),
  });

  // 2. Draw Advisor Company / Logo Monogram
  contactPage.drawRectangle({
    x: 236,
    y: 255,
    width: 140,
    height: 55,
    color: rgb(0.95, 0.97, 1.0),
    borderColor: rgb(0.8, 0.85, 0.9),
    borderWidth: 1,
  });

  contactPage.drawText(advisor.company.toUpperCase(), {
    x: 246,
    y: 278,
    size: 9,
    font: fontBold,
    color: rgb(...advisor.brandColor),
  });

  // 3. Draw Website
  const cleanWeb = advisor.website.replace(/^https?:\/\//, '');
  const webSize = 13;
  const webW = fontBold.widthOfTextAtSize(cleanWeb, webSize);
  const webX = (width - webW) / 2;
  const webY = 208;

  contactPage.drawText(cleanWeb, {
    x: webX,
    y: webY,
    size: webSize,
    font: fontBold,
    color: rgb(...advisor.brandColor),
  });

  // Add website link annotation
  const webAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [webX - 2, webY - 2, webX + webW + 2, webY + webSize + 2],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(advisor.website) },
  });
  contactPage.node.addAnnot(doc.context.register(webAnnot));

  // 4. Draw Phone & Email
  const contactLine = `${advisor.phone}  |  ${advisor.email}`;
  const contactSize = 11;
  const contactW = fontRegular.widthOfTextAtSize(contactLine, contactSize);
  const contactX = (width - contactW) / 2;
  const contactY = 182;

  contactPage.drawText(contactLine, {
    x: contactX,
    y: contactY,
    size: contactSize,
    font: fontRegular,
    color: rgb(0.1, 0.25, 0.45),
  });

  // Link for Phone
  const phoneW = fontRegular.widthOfTextAtSize(advisor.phone, contactSize);
  const phoneAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [contactX - 2, contactY - 2, contactX + phoneW + 2, contactY + contactSize + 2],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(`tel:${advisor.phone}`) },
  });
  contactPage.node.addAnnot(doc.context.register(phoneAnnot));

  // Link for Email
  const sepW = fontRegular.widthOfTextAtSize(`${advisor.phone}  |  `, contactSize);
  const emailW = fontRegular.widthOfTextAtSize(advisor.email, contactSize);
  const emailX = contactX + sepW;
  const emailAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [emailX - 2, contactY - 2, emailX + emailW + 2, contactY + contactSize + 2],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(`mailto:${advisor.email}`) },
  });
  contactPage.node.addAnnot(doc.context.register(emailAnnot));

  // 5. Draw Address
  const addrSize = 9.5;
  const addrW = fontRegular.widthOfTextAtSize(advisor.address, addrSize);
  const addrX = (width - addrW) / 2;
  const addrY = 156;
  contactPage.drawText(advisor.address, {
    x: addrX,
    y: addrY,
    size: addrSize,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.45),
  });

  // 6. Draw 5 Social Icons
  const socials = [
    { name: 'YouTube', url: advisor.socialLinks.youtube },
    { name: 'Instagram', url: advisor.socialLinks.instagram },
    { name: 'Facebook', url: advisor.socialLinks.facebook },
    { name: 'LinkedIn', url: advisor.socialLinks.linkedin },
    { name: 'X', url: advisor.socialLinks.twitter }
  ];

  const iconY = 78;
  const iconSpacing = 48;
  const totalIconsWidth = (socials.length - 1) * iconSpacing + 32;
  const startIconX = (width - totalIconsWidth) / 2;

  socials.forEach((soc, idx) => {
    const x = startIconX + idx * iconSpacing;
    // Circular icon background
    contactPage.drawCircle({
      x: x + 16,
      y: iconY + 16,
      size: 16,
      color: rgb(0.9, 0.93, 0.96),
      borderColor: rgb(0.75, 0.8, 0.88),
      borderWidth: 1,
    });
    // Icon label letter
    contactPage.drawText(soc.name[0], {
      x: x + 12,
      y: iconY + 11,
      size: 11,
      font: fontBold,
      color: rgb(...advisor.brandColor),
    });

    const sAnnot = doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [x, iconY, x + 32, iconY + 32],
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(soc.url) },
    });
    contactPage.node.addAnnot(doc.context.register(sAnnot));
  });

  // 7. Make "Learn More" button clickable
  // Button rectangle: X: 225 to 387, Y: 405 to 455
  const btnAnnot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [225, 405, 387, 455],
    Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(advisor.website) },
  });
  contactPage.node.addAnnot(doc.context.register(btnAnnot));

  // 8. DISCLOSURE PAGE: Append Agent Disclosure right after standard disclosure
  const discPage = doc.getPage(disclosurePageIndex);
  const agentDiscY = 560;

  // Divider
  discPage.drawLine({
    start: { x: 54, y: agentDiscY },
    end: { x: 558, y: agentDiscY },
    color: rgb(0.85, 0.88, 0.92),
    thickness: 1,
  });

  discPage.drawText('ADVISOR & FIRM DISCLOSURE', {
    x: 54,
    y: agentDiscY - 24,
    size: 10,
    font: fontBold,
    color: rgb(...advisor.brandColor),
  });

  const agentDiscText = [
    'Investment advisory services offered through Apex Wealth Partners LLC, an independent Registered Investment Adviser.',
    'Insurance products and services are offered and sold through independently licensed agents. Apex Wealth Partners and its',
    'affiliates are not affiliated with or endorsed by the Social Security Administration or any other government agency.'
  ];

  let dTextY = agentDiscY - 44;
  for (const line of agentDiscText) {
    discPage.drawText(line, {
      x: 54,
      y: dTextY,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.35, 0.4, 0.45),
    });
    dTextY -= 13;
  }

  const outputBytes = await doc.save();
  const testOut = 'scratch/test_stamped_real_guide.pdf';
  fs.writeFileSync(testOut, outputBytes);
  console.log(`Successfully stamped real guide! Output written to ${testOut} (${outputBytes.length} bytes)`);
}

testStampRealGuide().catch(console.error);
