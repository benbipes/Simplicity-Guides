import { PDFDocument, PDFName, PDFString, rgb, StandardFonts, PDFImage } from 'pdf-lib';
import { AgentProfile, BrandingOptions, FinancialGuide } from '../types/index';
import { sanitizeProfile, wrapSanitizedText } from './pdfSanitizer';

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

async function embedLogo(doc: PDFDocument, logoDataUrl: string | null | undefined): Promise<PDFImage | null> {
  if (!logoDataUrl) return null;
  try {
    const bytes = dataUrlToUint8Array(logoDataUrl);
    if (logoDataUrl.includes('image/png')) {
      return await doc.embedPng(bytes);
    } else if (logoDataUrl.includes('image/jpeg') || logoDataUrl.includes('image/jpg')) {
      return await doc.embedJpg(bytes);
    } else {
      try {
        return await doc.embedPng(bytes);
      } catch {
        return await doc.embedJpg(bytes);
      }
    }
  } catch (err) {
    console.warn('Could not embed custom logo image:', err);
    return null;
  }
}

export async function brandFinancialGuidePdf(
  guide: FinancialGuide,
  profile: AgentProfile,
  options: BrandingOptions = {
    updateContactPage: true,
    appendCustomDisclosure: true,
    callToActionUrl: '',
  }
): Promise<Uint8Array> {
  // 1. Fetch raw PDF bytes
  let pdfBytes: Uint8Array;
  if (guide.customPdfBytes) {
    pdfBytes = guide.customPdfBytes;
  } else {
    const response = await fetch(`${import.meta.env.BASE_URL}guides/${guide.filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load master guide: ${guide.filename}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    pdfBytes = new Uint8Array(arrayBuffer);
  }

  // 2. Sanitize user profile to ensure complete WinAnsi compatibility
  const cleanProfile = sanitizeProfile(profile);

  // 3. Load PDF document
  const doc = await PDFDocument.load(pdfBytes);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const totalPages = doc.getPageCount();
  const contactPageIndex = Math.max(0, Math.min(totalPages - 3, guide.contactPageNumber - 1));
  const disclosurePageIndex = totalPages - 1;

  // Exact design colors extracted from original PDF
  const pdfNavyColor = rgb(0.0, 0.282, 0.486); // Exact #00487C used for website, phone, email
  const pdfGrayColor = rgb(0.2, 0.2, 0.2);     // Exact dark gray used for address

  const embeddedColorLogo = await embedLogo(doc, cleanProfile.logoDataUrl);
  const embeddedWhiteLogo = await embedLogo(doc, cleanProfile.logoWhiteDataUrl);

  // Cover Page: Placed on dark color background in lower-left corner -> Prefer White Logo, fallback to Color
  const coverLogo = embeddedWhiteLogo || embeddedColorLogo;

  // Contact Page & Disclosure Page: Placed on white background -> Prefer Color Logo, fallback to White
  const lightBgLogo = embeddedColorLogo || embeddedWhiteLogo;

  // ============================================================
  // 1. COVER PAGE: LOWER LEFT CORNER AGENT LOGO
  // ============================================================
  if (coverLogo && totalPages > 0) {
    const page1 = doc.getPage(0);
    const res1 = page1.node.Resources();
    const xObj1 = res1 ? (res1.lookup(PDFName.of('XObject')) as any) : null;

    // In the PDF design, Im0 is the logo in the lower left corner (x: 54, y: 28.898, width: 123.3, height: 36.0)
    if (xObj1 && typeof xObj1.set === 'function') {
      xObj1.set(PDFName.of('Im0'), coverLogo.ref);
    } else {
      page1.drawImage(coverLogo, {
        x: 54,
        y: 28.9,
        width: 123.3,
        height: 36.0,
      });
    }

    // Make Cover Logo clickable to agent website URL
    if (cleanProfile.website) {
      addClickableLink(doc, page1, 54, 28.9, 123.3, 36.0, cleanProfile.website);
    }
  }

  // ============================================================
  // 2. CONTACT PAGE: EXACT DESIGN (PAGE N-2)
  // ============================================================
  if (options.updateContactPage && contactPageIndex < totalPages) {
    const contactPage = doc.getPage(contactPageIndex);
    const { width } = contactPage.getSize();
    const resContact = contactPage.node.Resources();
    const xObjContact = resContact ? (resContact.lookup(PDFName.of('XObject')) as any) : null;

    // A. Logo (Center, Y ≈ 255.5): Replace Im5 if present
    if (lightBgLogo && xObjContact && typeof xObjContact.set === 'function') {
      xObjContact.set(PDFName.of('Im5'), lightBgLogo.ref);
    } else if (lightBgLogo) {
      contactPage.drawRectangle({
        x: 200,
        y: 250,
        width: 212,
        height: 65,
        color: rgb(1, 1, 1),
      });
      const maxW = 188;
      const maxH = 55;
      const scale = Math.min(maxW / lightBgLogo.width, maxH / lightBgLogo.height, 1);
      const imgW = lightBgLogo.width * scale;
      const imgH = lightBgLogo.height * scale;
      contactPage.drawImage(lightBgLogo, {
        x: (width - imgW) / 2,
        y: 255 + (maxH - imgH) / 2,
        width: imgW,
        height: imgH,
      });
    } else if (cleanProfile.company || cleanProfile.name) {
      // If no image uploaded, draw company name centered in exact #00487C
      contactPage.drawRectangle({
        x: 180,
        y: 250,
        width: 252,
        height: 60,
        color: rgb(1, 1, 1),
      });
      const compName = (cleanProfile.company || cleanProfile.name).toUpperCase();
      const compW = fontBold.widthOfTextAtSize(compName, 14);
      contactPage.drawText(compName, {
        x: (width - compW) / 2,
        y: 275,
        size: 14,
        font: fontBold,
        color: pdfNavyColor,
      });
    }

    // Make Contact Page Logo clickable to agent website URL
    if (cleanProfile.website) {
      addClickableLink(doc, contactPage, 200, 245, 212, 70, cleanProfile.website);
    }

    // B. Website (Y = 206): Replace businessgroup.com
    contactPage.drawRectangle({
      x: 150,
      y: 202,
      width: 312,
      height: 20,
      color: rgb(1, 1, 1),
    });

    const webText = cleanProfile.website
      ? cleanProfile.website.replace(/^https?:\/\//, '')
      : 'yourcompany.com';
    const webSize = 14;
    const webW = fontBold.widthOfTextAtSize(webText, webSize);
    const webX = (width - webW) / 2;

    contactPage.drawText(webText, {
      x: webX,
      y: 206,
      size: webSize,
      font: fontBold,
      color: pdfNavyColor,
    });

    if (cleanProfile.website) {
      addClickableLink(doc, contactPage, webX - 4, 204, webW + 8, 20, cleanProfile.website);
    }

    // C. Phone & Email (Y = 178): Replace (000) 000-0000 | info@businessgroup.com
    contactPage.drawRectangle({
      x: 100,
      y: 175,
      width: 412,
      height: 20,
      color: rgb(1, 1, 1),
    });

    const phoneVal = cleanProfile.phone || '(000) 000-0000';
    const emailVal = cleanProfile.email || 'info@yourcompany.com';
    const contactLine = `${phoneVal} | ${emailVal}`;
    const contactSize = 10.5;
    const cLineW = fontRegular.widthOfTextAtSize(contactLine, contactSize);
    const cLineX = (width - cLineW) / 2;

    contactPage.drawText(contactLine, {
      x: cLineX,
      y: 178,
      size: contactSize,
      font: fontRegular,
      color: pdfNavyColor,
    });

    if (cleanProfile.phone) {
      const pW = fontRegular.widthOfTextAtSize(phoneVal, contactSize);
      addClickableLink(doc, contactPage, cLineX - 2, 176, pW + 4, 16, `tel:${cleanProfile.phone}`);
    }

    if (cleanProfile.email) {
      const sepW = fontRegular.widthOfTextAtSize(`${phoneVal} | `, contactSize);
      const eW = fontRegular.widthOfTextAtSize(emailVal, contactSize);
      addClickableLink(doc, contactPage, cLineX + sepW - 2, 176, eW + 4, 16, `mailto:${cleanProfile.email}`);
    }

    // D. Address (Y = 153): Replace 000 Meeting Street | Suite # | City, ST, 00000
    contactPage.drawRectangle({
      x: 60,
      y: 148,
      width: 492,
      height: 20,
      color: rgb(1, 1, 1),
    });

    const addrVal = cleanProfile.address || '000 Meeting Street | Suite # | City, ST, 00000';
    const addrSize = 9.5;
    const addrW = fontRegular.widthOfTextAtSize(addrVal, addrSize);
    const addrX = (width - addrW) / 2;

    contactPage.drawText(addrVal, {
      x: addrX,
      y: 153,
      size: addrSize,
      font: fontRegular,
      color: pdfGrayColor,
    });

    // E. Social Media Icons (Exact coordinates from PDF: Y = 68.65)
    const socialAnnots = [
      { url: cleanProfile.socialLinks.youtube, rect: [157.04, 68.65, 193.99, 105.6] },
      { url: cleanProfile.socialLinks.instagram, rect: [222.28, 68.65, 259.23, 105.6] },
      { url: cleanProfile.socialLinks.facebook, rect: [287.52, 68.65, 324.47, 105.6] },
      { url: cleanProfile.socialLinks.linkedin, rect: [352.76, 68.65, 389.71, 105.6] },
      { url: cleanProfile.socialLinks.twitter, rect: [418.01, 68.65, 454.96, 105.6] },
    ];

    for (const s of socialAnnots) {
      if (s.url && s.url.trim().length > 0) {
        const [x1, y1, x2, y2] = s.rect;
        addClickableLink(doc, contactPage, x1, y1, x2 - x1, y2 - y1, s.url);
      }
    }

    // F. "Learn More" Button Link (Exact coordinate box: [225, 405, 387, 455])
    const ctaUrl = cleanProfile.bookingUrl || cleanProfile.website || options.callToActionUrl;
    if (ctaUrl) {
      addClickableLink(doc, contactPage, 225, 405, 162, 50, ctaUrl);
    }
  }

  // ============================================================
  // 3. DISCLOSURE PAGE: AGENT LOGO & CUSTOM DISCLOSURE
  // ============================================================
  if (options.appendCustomDisclosure && disclosurePageIndex < totalPages) {
    // If agent uploaded a multi-page PDF disclosure document, append it directly
    if (cleanProfile.uploadedDisclosure?.fileType === 'pdf' && cleanProfile.uploadedDisclosure?.pdfBytes) {
      try {
        const customDoc = await PDFDocument.load(cleanProfile.uploadedDisclosure.pdfBytes);
        const copied = await doc.copyPages(customDoc, customDoc.getPageIndices());
        for (const p of copied) {
          doc.addPage(p);
        }
      } catch (err) {
        console.warn('Failed to append custom PDF disclosure:', err);
      }
    } else {
      const customText = cleanProfile.disclaimer?.trim();
      const hasLogo = !!lightBgLogo;

      if (customText || hasLogo) {
        const discPage = doc.getPage(disclosurePageIndex);
        const { width } = discPage.getSize();

        // Safe placement below standard disclosure text (Y = 460)
        const startY = 460;

        discPage.drawLine({
          start: { x: 54, y: startY },
          end: { x: width - 54, y: startY },
          color: rgb(0.85, 0.85, 0.85),
          thickness: 1,
        });

        let curY = startY - 20;

        // Draw Agent Logo on Disclosure Page if present
        if (lightBgLogo) {
          const maxLogoW = 120;
          const maxLogoH = 34;
          const scale = Math.min(maxLogoW / lightBgLogo.width, maxLogoH / lightBgLogo.height, 1);
          const lw = lightBgLogo.width * scale;
          const lh = lightBgLogo.height * scale;

          discPage.drawImage(lightBgLogo, {
            x: 54,
            y: curY - lh,
            width: lw,
            height: lh,
          });

          // Make Disclosure Logo clickable to agent website URL
          if (cleanProfile.website) {
            addClickableLink(doc, discPage, 54, curY - lh, lw, lh, cleanProfile.website);
          }

          curY -= (lh + 16);
        }

        // Render custom disclosure text if provided
        if (customText) {
          const lines = wrapSanitizedText(customText, 110);

          let lineIdx = 0;
          while (lineIdx < lines.length && curY >= 95) {
            const line = lines[lineIdx];
            if (line) {
              discPage.drawText(line, {
                x: 54,
                y: curY,
                size: 7.2,
                font: fontRegular,
                color: pdfGrayColor,
              });
            }
            curY -= 11.5;
            lineIdx++;
          }

          // If text overflows, add continuation page
          if (lineIdx < lines.length) {
            const contPage = doc.addPage([612, 792]);
            const { height: contH } = contPage.getSize();

            let contY = contH - 60;
            while (lineIdx < lines.length && contY >= 60) {
              const line = lines[lineIdx];
              if (line) {
                contPage.drawText(line, {
                  x: 54,
                  y: contY,
                  size: 7.2,
                  font: fontRegular,
                  color: pdfGrayColor,
                });
              }
              contY -= 11.5;
              lineIdx++;
            }
          }
        }
      }
    }
  }

  return await doc.save();
}
