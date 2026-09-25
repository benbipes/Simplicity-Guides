import { PDFDocument, PDFName, PDFString, rgb, StandardFonts, PDFImage } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { AgentProfile, CollegeMaterial } from '../types/index';

export function addClickableLink(
  doc: PDFDocument,
  page: any,
  x: number,
  y: number,
  width: number,
  height: number,
  url: string
) {
  try {
    if (!url || !url.trim()) return;
    let cleanUrl = url.trim();
    if (
      !cleanUrl.startsWith('http://') &&
      !cleanUrl.startsWith('https://') &&
      !cleanUrl.startsWith('mailto:') &&
      !cleanUrl.startsWith('tel:')
    ) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const linkAnnot = doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [x, y, x + width, y + height],
      Border: [0, 0, 0],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(cleanUrl),
      },
    });

    const linkRef = doc.context.register(linkAnnot);
    page.node.addAnnot(linkRef);
  } catch (err) {
    console.warn('Could not add clickable link annotation:', url, err);
  }
}

export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || dataUrl;
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function embedImage(doc: PDFDocument, dataUrl: string | null | undefined): Promise<PDFImage | null> {
  if (!dataUrl) return null;
  try {
    const bytes = dataUrlToUint8Array(dataUrl);
    if (dataUrl.includes('image/png')) {
      return await doc.embedPng(bytes);
    } else {
      return await doc.embedJpg(bytes);
    }
  } catch (e) {
    console.warn('Failed to embed image, falling back:', e);
    try {
      const bytes = dataUrlToUint8Array(dataUrl);
      return await doc.embedPng(bytes);
    } catch {
      try {
        const bytes = dataUrlToUint8Array(dataUrl);
        return await doc.embedJpg(bytes);
      } catch {
        return null;
      }
    }
  }
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Brand a Simplifying College Planning document with advisor profile data
 */
export async function brandCollegeDocument(
  material: CollegeMaterial,
  profile: AgentProfile
): Promise<Uint8Array> {
  if (material.format === 'pptx') {
    if (material.customFileBytes) {
      return material.customFileBytes;
    }
    const response = await fetch(`${import.meta.env.BASE_URL}college/${material.filename}`);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }

  // Load Base PDF
  let pdfBytes: Uint8Array;
  if (material.customFileBytes) {
    pdfBytes = material.customFileBytes;
  } else {
    const response = await fetch(`${import.meta.env.BASE_URL}college/${material.filename}`);
    const buffer = await response.arrayBuffer();
    pdfBytes = new Uint8Array(buffer);
  }

  const doc = await PDFDocument.load(pdfBytes);
  const totalPages = doc.getPageCount();

  // Load fonts
  const fontHelvetica = await doc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Embed Logo (prefer color for white sheets)
  const logoData = profile.logoDataUrl || profile.logoWhiteDataUrl;
  let embeddedLogo: PDFImage | null = null;
  if (logoData) {
    embeddedLogo = await embedImage(doc, logoData);
  }

  // Embed Headshots (for bio sheets)
  const primaryAdvisor = profile.teamMembers?.[0];
  const secondaryAdvisor = profile.teamMembers?.[1];

  let embeddedHeadshot1: PDFImage | null = null;
  if (primaryAdvisor?.headshotDataUrl) {
    embeddedHeadshot1 = await embedImage(doc, primaryAdvisor.headshotDataUrl);
  }

  let embeddedHeadshot2: PDFImage | null = null;
  if (secondaryAdvisor?.headshotDataUrl) {
    embeddedHeadshot2 = await embedImage(doc, secondaryAdvisor.headshotDataUrl);
  }

  // 1. WORKSHOP OVERVIEW & INVITATION FLYER
  if (material.id === 'scp-workshop-overview-flyer' && totalPages >= 1) {
    const page = doc.getPage(0);
    const { width } = page.getSize();

    // Entire Event Details & Logo Row: Seamless whiteout covering X: 30 to 585, Y: 105 to 183
    page.drawRectangle({
      x: 30,
      y: 105,
      width: 555,
      height: 78,
      color: rgb(1, 1, 1),
    });

    const eventTitle = profile.workshopEvent?.title || 'Simplifying College Planning';
    const eventDateTime = profile.workshopEvent?.date
      ? `${profile.workshopEvent.date}${profile.workshopEvent.time ? ` at ${profile.workshopEvent.time}` : ''}`
      : 'October 20, 2026 at 6:00pm';
    const locationName = profile.workshopEvent?.locationName || "Piattino's Italian Restaurant";
    const locationAddress = profile.workshopEvent?.locationAddress || '900 Summit Avenue\nSummit, New Jersey 07901';

    page.drawText(eventTitle, {
      x: 36,
      y: 158,
      size: 13,
      font: fontHelveticaBold,
      color: rgb(0.05, 0.1, 0.2),
    });

    page.drawText(eventDateTime, {
      x: 36,
      y: 142,
      size: 10,
      font: fontHelvetica,
      color: rgb(0.3, 0.35, 0.4),
    });

    // Divider line inside details box
    page.drawLine({
      start: { x: 220, y: 115 },
      end: { x: 220, y: 170 },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    // Location text
    page.drawText(locationName, {
      x: 235,
      y: 158,
      size: 10,
      font: fontHelveticaBold,
      color: rgb(0.2, 0.25, 0.3),
    });

    const locLines = locationAddress.split('\n');
    let locY = 143;
    for (const l of locLines) {
      page.drawText(l, {
        x: 235,
        y: locY,
        size: 9,
        font: fontHelvetica,
        color: rgb(0.35, 0.4, 0.45),
      });
      locY -= 12;
    }

    // Logo Area on right side: X: 410 to 575
    if (embeddedLogo) {
      const maxW = 165;
      const maxH = 55;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      const lx = 410 + (maxW - w) / 2;
      const ly = 115 + (maxH - h) / 2;
      page.drawImage(embeddedLogo, { x: lx, y: ly, width: w, height: h });
      if (profile.website) {
        addClickableLink(doc, page, lx, ly, w, h, profile.website);
      }
    } else if (profile.company) {
      page.drawText(profile.company, {
        x: 410,
        y: 145,
        size: 13,
        font: fontHelveticaBold,
        color: rgb(0, 0.26, 0.45),
      });
    }

    // Bottom Royal Blue Contact Banner: covers Y: 65 to 105 (height 42)
    page.drawRectangle({
      x: 0,
      y: 65,
      width: width,
      height: 42,
      color: rgb(0.0, 0.46, 0.74), // #0076BD
    });

    const advisorContactName = profile.name || 'Your Financial Advisor';
    const advisorContactPhone = profile.phone || '800-555-5555';
    const contactLine = `For additional information please contact ${advisorContactName} at ${advisorContactPhone}.`;

    const textWidth = fontHelveticaBold.widthOfTextAtSize(contactLine, 11);
    const textX = Math.max(20, (width - textWidth) / 2);
    page.drawText(contactLine, {
      x: textX,
      y: 80,
      size: 11,
      font: fontHelveticaBold,
      color: rgb(1, 1, 1),
    });
  }

  // 2. ADVISOR & TEAM BIO SHEET
  else if (material.id === 'scp-advisor-team-bio' && totalPages >= 1) {
    const page = doc.getPage(0);
    const { width } = page.getSize();

    // Top Header: Whiteout entire top row from X: 30 to 585, Y: 635 to 735 (height 100)
    page.drawRectangle({
      x: 30,
      y: 635,
      width: 555,
      height: 100,
      color: rgb(1, 1, 1),
    });

    if (embeddedLogo) {
      const maxW = 195;
      const maxH = 65;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      page.drawImage(embeddedLogo, { x: 35, y: 650, width: w, height: h });
      if (profile.website) {
        addClickableLink(doc, page, 35, 650, w, h, profile.website);
      }
    } else if (profile.company) {
      page.drawText(profile.company, {
        x: 35,
        y: 685,
        size: 16,
        font: fontHelveticaBold,
        color: rgb(0, 0.26, 0.45),
      });
    }

    let topContactY = 715;
    if (profile.address) {
      const addrLines = profile.address.split('\n');
      for (const al of addrLines.slice(0, 2)) {
        page.drawText(al, {
          x: 260,
          y: topContactY,
          size: 9.5,
          font: fontHelvetica,
          color: rgb(0.2, 0.25, 0.3),
        });
        topContactY -= 13;
      }
    }
    if (profile.phone) {
      page.drawText(profile.phone, {
        x: 260,
        y: topContactY,
        size: 9.5,
        font: fontHelveticaBold,
        color: rgb(0.1, 0.15, 0.2),
      });
      topContactY -= 13;
    }
    if (profile.website) {
      page.drawText(profile.website, {
        x: 260,
        y: topContactY,
        size: 9.5,
        font: fontHelvetica,
        color: rgb(0.0, 0.46, 0.74),
      });
      addClickableLink(doc, page, 260, topContactY - 2, 200, 12, profile.website);
    }

    // Advisor 1 Section: Presenter
    // Whiteout Advisor 1 photo & bio area: X: 30, Y: 310, width: 555, height: 285
    page.drawRectangle({
      x: 30,
      y: 310,
      width: 555,
      height: 285,
      color: rgb(1, 1, 1),
    });

    // Draw Headshot 1
    if (embeddedHeadshot1) {
      page.drawImage(embeddedHeadshot1, {
        x: 35,
        y: 465,
        width: 110,
        height: 120,
      });
    }

    // Name & Title
    const adv1Name = primaryAdvisor?.name || profile.name || 'John Smith';
    const adv1Title = primaryAdvisor?.title || profile.title || 'Founder and President';

    page.drawText(adv1Name, {
      x: embeddedHeadshot1 ? 160 : 35,
      y: 575,
      size: 15,
      font: fontHelveticaBold,
      color: rgb(0.0, 0.26, 0.45),
    });

    page.drawText(adv1Title, {
      x: embeddedHeadshot1 ? 160 : 35,
      y: 558,
      size: 11,
      font: fontHelveticaBold,
      color: rgb(0.2, 0.25, 0.3),
    });

    // Bio text
    const defaultBio = `${adv1Name} is an experienced financial educator dedicated to guiding families through critical college and retirement planning decisions. With comprehensive experience in financial planning and college cost optimization, ${adv1Name} helps families maximize eligibility for financial aid while protecting core family retirement assets.`;
    const adv1Bio = primaryAdvisor?.bio || defaultBio;
    const bioLines = wrapText(adv1Bio, embeddedHeadshot1 ? 75 : 88);
    let bioY = 535;
    for (const line of bioLines.slice(0, 12)) {
      const lineX = (embeddedHeadshot1 && bioY > 450) ? 160 : 35;
      page.drawText(line, {
        x: lineX,
        y: bioY,
        size: 9.5,
        font: fontHelvetica,
        color: rgb(0.25, 0.28, 0.32),
      });
      bioY -= 13.5;
    }

    // Advisor 2 Section: Team Member
    // Whiteout Advisor 2 photo & bio area: X: 30, Y: 90, width: 555, height: 215
    page.drawRectangle({
      x: 30,
      y: 90,
      width: 555,
      height: 215,
      color: rgb(1, 1, 1),
    });

    if (secondaryAdvisor && (secondaryAdvisor.name || secondaryAdvisor.headshotDataUrl)) {
      if (embeddedHeadshot2) {
        page.drawImage(embeddedHeadshot2, {
          x: 35,
          y: 180,
          width: 110,
          height: 120,
        });
      }

      const adv2Name = secondaryAdvisor.name || 'Associate Wealth Advisor';
      const adv2Title = secondaryAdvisor.title || 'Client Advisory Services';

      page.drawText(adv2Name, {
        x: embeddedHeadshot2 ? 160 : 35,
        y: 285,
        size: 14,
        font: fontHelveticaBold,
        color: rgb(0.0, 0.26, 0.45),
      });

      page.drawText(adv2Title, {
        x: embeddedHeadshot2 ? 160 : 35,
        y: 270,
        size: 10.5,
        font: fontHelveticaBold,
        color: rgb(0.2, 0.25, 0.3),
      });

      const defaultBio2 = `${adv2Name} oversees client services and event operations, ensuring attendees and families receive personalized planning communications and workshop scheduling assistance.`;
      const adv2Bio = secondaryAdvisor.bio || defaultBio2;
      const bioLines2 = wrapText(adv2Bio, embeddedHeadshot2 ? 75 : 88);
      let bio2Y = 250;
      for (const line of bioLines2.slice(0, 9)) {
        const lineX = (embeddedHeadshot2 && bio2Y > 165) ? 160 : 35;
        page.drawText(line, {
          x: lineX,
          y: bio2Y,
          size: 9.5,
          font: fontHelvetica,
          color: rgb(0.25, 0.28, 0.32),
        });
        bio2Y -= 13.5;
      }
    }

    // Bottom Footer Disclosure: X: 0 to width, Y: 0 to 52
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 52,
      color: rgb(0.0, 0.26, 0.45),
    });

    const discLines = wrapText(
      profile.disclaimer || 'Investment advisory services offered through custom registered investment advisory firms.',
      115
    );
    let discY = Math.min(35, 15 + discLines.length * 5);
    for (const dl of discLines.slice(0, 3)) {
      const dWidth = fontHelvetica.widthOfTextAtSize(dl, 7.5);
      page.drawText(dl, {
        x: Math.max(20, (width - dWidth) / 2),
        y: discY,
        size: 7.5,
        font: fontHelvetica,
        color: rgb(0.85, 0.9, 0.95),
      });
      discY -= 9.5;
    }
  }

  // 3. FINANCIAL QUESTIONNAIRE
  else if (material.id === 'scp-financial-questionnaire' && totalPages >= 1) {
    const page = doc.getPage(0);
    // Top Left Logo Area: X: 30, Y: 690, W: 240, H: 80
    page.drawRectangle({
      x: 30,
      y: 690,
      width: 240,
      height: 80,
      color: rgb(1, 1, 1),
    });

    if (embeddedLogo) {
      const maxW = 200;
      const maxH = 58;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      page.drawImage(embeddedLogo, { x: 35, y: 705, width: w, height: h });
      if (profile.website) {
        addClickableLink(doc, page, 35, 705, w, h, profile.website);
      }
    } else if (profile.company) {
      page.drawText(profile.company, {
        x: 35,
        y: 725,
        size: 14,
        font: fontHelveticaBold,
        color: rgb(0, 0.26, 0.45),
      });
    }
  }

  // 4. VALUE PIECE / WHITE PAPER (Cover Page)
  else if (material.id === 'scp-value-piece' && totalPages >= 1) {
    const page = doc.getPage(0);
    // Lower left branding block: X: 30, Y: 65, W: 335, H: 100
    page.drawRectangle({
      x: 30,
      y: 65,
      width: 335,
      height: 100,
      color: rgb(1, 1, 1),
    });

    if (embeddedLogo) {
      const maxW = 145;
      const maxH = 55;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      page.drawImage(embeddedLogo, { x: 35, y: 85, width: w, height: h });
      if (profile.website) {
        addClickableLink(doc, page, 35, 85, w, h, profile.website);
      }
    }

    // Text details adjacent to logo
    const textStartX = embeddedLogo ? 190 : 40;
    let valY = 140;
    if (profile.name) {
      page.drawText(profile.name, {
        x: textStartX,
        y: valY,
        size: 9.5,
        font: fontHelveticaBold,
        color: rgb(0.15, 0.2, 0.25),
      });
      valY -= 12;
    }
    if (profile.company) {
      page.drawText(profile.company, {
        x: textStartX,
        y: valY,
        size: 8.5,
        font: fontHelvetica,
        color: rgb(0.3, 0.35, 0.4),
      });
      valY -= 12;
    }
    if (profile.phone) {
      page.drawText(profile.phone, {
        x: textStartX,
        y: valY,
        size: 8.5,
        font: fontHelvetica,
        color: rgb(0.3, 0.35, 0.4),
      });
      valY -= 12;
    }
    if (profile.website) {
      page.drawText(profile.website, {
        x: textStartX,
        y: valY,
        size: 8.5,
        font: fontHelvetica,
        color: rgb(0.0, 0.46, 0.74),
      });
      addClickableLink(doc, page, textStartX, valY - 2, 130, 11, profile.website);
    }
  }

  // 5. APPOINTMENT CARD (Avery 5889 2-Up Cards)
  else if (material.id === 'scp-appointment-card' && totalPages >= 1) {
    const page = doc.getPage(0);
    const { width } = page.getSize();

    // Card 1: Logo & Footer
    // Logo 1: X: 180, Y: 585, W: 260, H: 75
    page.drawRectangle({
      x: 180,
      y: 585,
      width: 260,
      height: 75,
      color: rgb(1, 1, 1),
    });
    if (embeddedLogo) {
      const maxW = 180;
      const maxH = 52;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      const lx = 180 + (260 - w) / 2;
      page.drawImage(embeddedLogo, { x: lx, y: 595, width: w, height: h });
    }

    // Footer 1: X: 50, Y: 415, W: 510, H: 50 (leaves Date, Time, Location labels untouched!)
    page.drawRectangle({
      x: 50,
      y: 415,
      width: 510,
      height: 50,
      color: rgb(0.0, 0.26, 0.45),
    });
    const contactLine1 = [
      profile.address?.replace('\n', ', ') || '86 Summit Avenue, Suite 303, Summit, NJ 07901',
      profile.phone || '800-866-8666',
      profile.email || 'info@custominsurance.com',
      profile.website || 'www.custominsurance.com',
    ].filter(Boolean).join(' | ');

    const c1Width = fontHelvetica.widthOfTextAtSize(contactLine1, 8.5);
    page.drawText(contactLine1, {
      x: Math.max(55, (width - c1Width) / 2),
      y: 438,
      size: 8.5,
      font: fontHelvetica,
      color: rgb(1, 1, 1),
    });

    // Card 2: Logo & Footer
    // Logo 2: X: 180, Y: 260, W: 260, H: 75
    page.drawRectangle({
      x: 180,
      y: 260,
      width: 260,
      height: 75,
      color: rgb(1, 1, 1),
    });
    if (embeddedLogo) {
      const maxW = 180;
      const maxH = 52;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      const lx = 180 + (260 - w) / 2;
      page.drawImage(embeddedLogo, { x: lx, y: 270, width: w, height: h });
    }

    // Footer 2: X: 50, Y: 90, W: 510, H: 50
    page.drawRectangle({
      x: 50,
      y: 90,
      width: 510,
      height: 50,
      color: rgb(0.0, 0.26, 0.45),
    });
    const c2Width = fontHelvetica.widthOfTextAtSize(contactLine1, 8.5);
    page.drawText(contactLine1, {
      x: Math.max(55, (width - c2Width) / 2),
      y: 114,
      size: 8.5,
      font: fontHelvetica,
      color: rgb(1, 1, 1),
    });
  }

  // 6. OFFICE DIRECTIONS SHEET
  else if (material.id === 'scp-office-directions' && totalPages >= 1) {
    const page = doc.getPage(0);
    const { width } = page.getSize();

    // Callout Box on Map: X: 35, Y: 430, W: 280, H: 95
    page.drawRectangle({
      x: 35,
      y: 430,
      width: 280,
      height: 95,
      color: rgb(0.0, 0.26, 0.45),
    });

    const companyName = profile.company || profile.name || 'Custom Insurance Branding';
    page.drawText(companyName, {
      x: 48,
      y: 495,
      size: 13,
      font: fontHelveticaBold,
      color: rgb(1, 1, 1),
    });

    const addr = profile.workshopEvent?.locationAddress || profile.address || '86 Summit Avenue, Suite 303\nSummit, New Jersey 07901';
    let dirY = 472;
    for (const al of addr.split('\n')) {
      page.drawText(al, {
        x: 48,
        y: dirY,
        size: 9.5,
        font: fontHelvetica,
        color: rgb(0.9, 0.95, 1),
      });
      dirY -= 13;
    }

    // Bottom Right Logo: X: 310, Y: 185, W: 245, H: 85
    page.drawRectangle({
      x: 310,
      y: 185,
      width: 245,
      height: 85,
      color: rgb(1, 1, 1),
    });

    if (embeddedLogo) {
      const maxW = 200;
      const maxH = 65;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      const lx = 310 + (245 - w) / 2;
      const ly = 185 + (85 - h) / 2;
      page.drawImage(embeddedLogo, { x: lx, y: ly, width: w, height: h });
      if (profile.website) {
        addClickableLink(doc, page, lx, ly, w, h, profile.website);
      }
    }

    // Bottom strip phone number: X: 0, Y: 0, W: width, H: 48
    if (profile.phone) {
      page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: 48,
        color: rgb(0.0, 0.26, 0.45),
      });
      const phoneLine = `For directions or parking questions, please call ${profile.phone}.`;
      const pWidth = fontHelveticaBold.widthOfTextAtSize(phoneLine, 11);
      page.drawText(phoneLine, {
        x: Math.max(20, (width - pWidth) / 2),
        y: 20,
        size: 11,
        font: fontHelveticaBold,
        color: rgb(1, 1, 1),
      });
    }
  }

  // 7. NOTES SHEET
  else if (material.id === 'scp-notes-sheet' && totalPages >= 1) {
    const page = doc.getPage(0);
    const { width } = page.getSize();

    // Top Logo: X: 170, Y: 645, W: 275, H: 85
    page.drawRectangle({
      x: 170,
      y: 645,
      width: 275,
      height: 85,
      color: rgb(1, 1, 1),
    });

    if (embeddedLogo) {
      const maxW = 220;
      const maxH = 65;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      const lx = 170 + (275 - w) / 2;
      const ly = 645 + (85 - h) / 2;
      page.drawImage(embeddedLogo, { x: lx, y: ly, width: w, height: h });
      if (profile.website) {
        addClickableLink(doc, page, lx, ly, w, h, profile.website);
      }
    }

    // Footer navy strip: X: 0, Y: 0, W: width, H: 55
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 55,
      color: rgb(0.0, 0.26, 0.45),
    });

    const footerText = [
      profile.address?.replace('\n', ', ') || '86 Summit Avenue, Suite 303, Summit, NJ 07901',
      profile.phone || '800-866-8666',
      profile.email || 'info@custominsurance.com',
      profile.website || 'www.custominsurance.com',
    ].filter(Boolean).join(' | ');

    const ftWidth = fontHelvetica.widthOfTextAtSize(footerText, 9);
    page.drawText(footerText, {
      x: Math.max(20, (width - ftWidth) / 2),
      y: 26,
      size: 9,
      font: fontHelvetica,
      color: rgb(1, 1, 1),
    });
  }

  // 8. WORKSHOP RESPONSE FORM
  else if (material.id === 'scp-workshop-response-form' && totalPages >= 1) {
    const page = doc.getPage(0);
    const { width } = page.getSize();
    // Top Left Logo: X: 30, Y: 600, W: 245, H: 85
    page.drawRectangle({
      x: 30,
      y: 600,
      width: 245,
      height: 85,
      color: rgb(1, 1, 1),
    });

    if (embeddedLogo) {
      const maxW = 200;
      const maxH = 65;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      const lx = 30 + (245 - w) / 2;
      const ly = 600 + (85 - h) / 2;
      page.drawImage(embeddedLogo, { x: lx, y: ly, width: w, height: h });
      if (profile.website) {
        addClickableLink(doc, page, lx, ly, w, h, profile.website);
      }
    }

    // Bottom Disclosure placeholder replacement: covers Y: 25 to 60 (covers "ADD DISCLOSURE FOR SECURITIES LICENSED ADVISOR")
    page.drawRectangle({
      x: 0,
      y: 25,
      width: width,
      height: 35,
      color: rgb(0.0, 0.26, 0.45),
    });

    const discText = profile.disclaimer || 'Investment advisory services offered through licensed registered representatives and advisory firms.';
    const discLines = wrapText(discText, 115);
    let rDiscY = 44;
    for (const dl of discLines.slice(0, 2)) {
      const dWidth = fontHelvetica.widthOfTextAtSize(dl, 7.5);
      page.drawText(dl, {
        x: Math.max(20, (width - dWidth) / 2),
        y: rDiscY,
        size: 7.5,
        font: fontHelvetica,
        color: rgb(1, 1, 1),
      });
      rDiscY -= 9;
    }
  }

  // 9. AFES WORKBOOK / STANDARD WORKBOOK (Page 19 Instructor / Contact Info)
  else if ((material.id === 'afes-workbook' || material.id === 'scp-workbook') && totalPages >= 19) {
    const page = doc.getPage(18); // 0-indexed Page 19
    const { width } = page.getSize();

    // Whiteout lower contact block: X: 30, Y: 60, W: 555, H: 170
    page.drawRectangle({
      x: 30,
      y: 60,
      width: 555,
      height: 170,
      color: rgb(1, 1, 1),
    });

    const callout = material.id === 'afes-workbook'
      ? 'If you have any questions regarding college planning and your individual\nfinancial situation, please contact your AFES instructor.'
      : 'If you have any questions regarding college planning and your individual\nfinancial situation, please contact your financial professional.';

    let wbY = 210;
    for (const cl of callout.split('\n')) {
      page.drawText(cl, {
        x: 35,
        y: wbY,
        size: 11,
        font: fontHelveticaBold,
        color: rgb(0.0, 0.26, 0.45),
      });
      wbY -= 15;
    }

    wbY -= 6;
    if (profile.name) {
      page.drawText(profile.name, {
        x: 35,
        y: wbY,
        size: 11,
        font: fontHelveticaBold,
        color: rgb(0.2, 0.25, 0.3),
      });
      wbY -= 14;
    }

    if (profile.address) {
      for (const al of profile.address.split('\n')) {
        page.drawText(al, {
          x: 35,
          y: wbY,
          size: 10,
          font: fontHelvetica,
          color: rgb(0.3, 0.35, 0.4),
        });
        wbY -= 13;
      }
    }

    if (profile.phone) {
      page.drawText(`Phone: ${profile.phone}`, {
        x: 35,
        y: wbY,
        size: 10,
        font: fontHelvetica,
        color: rgb(0.3, 0.35, 0.4),
      });
      wbY -= 13;
    }

    if (profile.email) {
      page.drawText(`Email: ${profile.email}`, {
        x: 35,
        y: wbY,
        size: 10,
        font: fontHelvetica,
        color: rgb(0.0, 0.46, 0.74),
      });
    }
  }

  // 10. AFES SYLLABUS (Page 2 Instructor Block)
  else if (material.id === 'afes-syllabus' && totalPages >= 2) {
    const page = doc.getPage(1); // Page 2

    // Whiteout Instructor Headshot & Contact Area: X: 140, Y: 260, W: 400, H: 165
    page.drawRectangle({
      x: 140,
      y: 260,
      width: 400,
      height: 165,
      color: rgb(1, 1, 1),
    });

    if (embeddedHeadshot1) {
      page.drawImage(embeddedHeadshot1, {
        x: 145,
        y: 285,
        width: 100,
        height: 115,
      });
    }

    const sylName = primaryAdvisor?.name || profile.name || 'Advisor Name';
    const sylTitle = primaryAdvisor?.title || 'AFES Instructor';

    page.drawText(sylName, {
      x: embeddedHeadshot1 ? 265 : 150,
      y: 385,
      size: 14,
      font: fontHelveticaBold,
      color: rgb(0.0, 0.46, 0.74),
    });

    page.drawText(sylTitle, {
      x: embeddedHeadshot1 ? 265 : 150,
      y: 368,
      size: 10.5,
      font: fontHelveticaBold,
      color: rgb(0.25, 0.3, 0.35),
    });

    let sylContactY = 345;
    if (profile.phone) {
      page.drawText(`Phone: ${profile.phone}`, {
        x: embeddedHeadshot1 ? 265 : 150,
        y: sylContactY,
        size: 10,
        font: fontHelvetica,
        color: rgb(0.3, 0.35, 0.4),
      });
      sylContactY -= 14;
    }
    if (profile.email) {
      page.drawText(`Email: ${profile.email}`, {
        x: embeddedHeadshot1 ? 265 : 150,
        y: sylContactY,
        size: 10,
        font: fontHelvetica,
        color: rgb(0.0, 0.46, 0.74),
      });
    }
  }

  // 11. AFES COURSE EVALUATION (Page 3 Advisor Disclaimer)
  else if (material.id === 'afes-course-evaluation' && totalPages >= 3) {
    const page = doc.getPage(2); // Page 3

    // Whiteout disclaimer text area: X: 30, Y: 410, W: 555, H: 100
    page.drawRectangle({
      x: 30,
      y: 410,
      width: 555,
      height: 100,
      color: rgb(1, 1, 1),
    });

    const advName = profile.name || 'ADVISOR NAME';
    const compName = profile.company || 'COMPANY NAME';
    const evalDisc = `Please be advised that ${advName} is employed as an insurance agent, and/or Registered Representative or Investment Advisor Representative, and financial products may be discussed. ${compName} is not affiliated with AFES.`;

    const evalLines = wrapText(evalDisc, 84);
    let evalY = 485;
    for (const el of evalLines) {
      page.drawText(el, {
        x: 35,
        y: evalY,
        size: 9.5,
        font: fontHelvetica,
        color: rgb(0.35, 0.38, 0.42),
      });
      evalY -= 13;
    }
  }

  // 12. SOCIAL POST OPTIONS (Stamp logo on all pages)
  else if (material.id === 'scp-social-post-options') {
    if (embeddedLogo) {
      for (let i = 0; i < totalPages; i++) {
        const p = doc.getPage(i);
        const { width } = p.getSize();
        // Top right placement
        const maxW = 180;
        const maxH = 65;
        const aspect = embeddedLogo.width / embeddedLogo.height;
        let w = maxW;
        let h = w / aspect;
        if (h > maxH) {
          h = maxH;
          w = h * aspect;
        }
        const lx = width - w - 40;
        const ly = 1200 - h - 40;
        p.drawImage(embeddedLogo, { x: lx, y: ly, width: w, height: h });
      }
    }
  }

  return await doc.save();
}

/**
 * Download a single branded college planning material
 */
export async function downloadBrandedCollegeMaterial(
  material: CollegeMaterial,
  profile: AgentProfile
): Promise<void> {
  const bytes = await brandCollegeDocument(material, profile);
  const ext = material.format;
  const safeTitle = material.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${safeTitle}-Branded.${ext}`;
  const mimeType = ext === 'pptx' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'application/pdf';
  const blob = new Blob([bytes], { type: mimeType });
  saveAs(blob, filename);
}

/**
 * Generate and download a batch ZIP file of all Simplifying College Planning materials
 */
export async function downloadAllCollegeMaterialsZip(
  materials: CollegeMaterial[],
  profile: AgentProfile,
  onProgress?: (current: number, total: number, title: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('Simplifying_College_Planning_Branded');

  for (let i = 0; i < materials.length; i++) {
    const mat = materials[i];
    if (onProgress) {
      onProgress(i + 1, materials.length, mat.title);
    }

    try {
      const bytes = await brandCollegeDocument(mat, profile);
      const safeTitle = mat.title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${String(i + 1).padStart(2, '0')}_${safeTitle}.${mat.format}`;
      folder?.file(filename, bytes);
    } catch (err) {
      console.error(`Failed to brand ${mat.title} for ZIP:`, err);
    }
  }

  // Include README instructions
  const readme = `SIMPLIFYING COLLEGE PLANNING WORKSHOP MARKETING SUITE
Co-Branded for: ${profile.name || 'Valued Advisor'} (${profile.company || 'Financial Firm'})
Date Generated: ${new Date().toLocaleDateString()}

=======================================================
MATERIALS INCLUDED IN THIS PACKAGE:
=======================================================
1. Consumer Workshop Presentation (54 Slides PPTX)
2. Marketing & Invitation Flyers (Overview & Lead Gen)
3. Student & Parent Course Workbooks & White Papers
4. Strategy Session Packets (Bios, Questionnaire, Directions, Cards, Notes)
5. Social Media Graphics (5 HD Square Posts)
6. AFES Educational Non-Profit Track Materials

=======================================================
EVENT HOSTING & SHARING TIPS:
=======================================================
• Workshop Overview Flyer: Use for digital promotion, print distribution, or library/venue bulletin boards.
• Avery 5889 Appointment Cards: Print on standard 2-up postcard stock for post-event consultation confirmations.
• Presentation Deck: Compatible with PowerPoint, Google Slides, and Keynote for in-person or Zoom webinars.
• Compliance Disclosures: All documents feature your custom disclosures and firm contact details.
`;

  folder?.file('READ_ME_COLLEGE_PLANNING.txt', readme);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'Simplicity_College_Planning_Branded_Package.zip');
}
