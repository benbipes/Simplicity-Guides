import { PDFDocument, PDFName, PDFString, rgb, StandardFonts, PDFImage } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { AgentProfile, WealthMaterial, TeamMemberBio } from '../types/index';

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
 * Brand a Simplicity Wealth PDF material with advisor logo, contact info, headshots, and bios
 */
export async function brandWealthMaterialPdf(
  material: WealthMaterial,
  profile: AgentProfile
): Promise<Uint8Array> {
  const url = `${import.meta.env.BASE_URL}wealth/${material.filename}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load wealth master document: ${material.filename}`);
  }
  const originalBytes = await response.arrayBuffer();

  // If this is PPTX, return bytes directly
  if (material.format === 'pptx') {
    return new Uint8Array(originalBytes);
  }

  const doc = await PDFDocument.load(originalBytes);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Logo selection: prefer color logo on white pages, fallback to white or profile logo
  const logoDataUrl = profile.logoDataUrl || profile.logoWhiteDataUrl;
  const embeddedLogo = await embedImage(doc, logoDataUrl);

  const teamMembers = profile.teamMembers && profile.teamMembers.length > 0
    ? profile.teamMembers
    : [
        {
          id: 'primary',
          name: profile.name || 'Primary Wealth Advisor',
          title: profile.title || 'Managing Director',
          email: profile.email || 'advisor@firm.com',
          phone: profile.phone || '800-555-0199',
          bio: 'Dedicated to providing holistic wealth advisory, retirement planning, and personalized fiduciary portfolio oversight.',
          headshotDataUrl: undefined,
        },
      ];

  const primaryAdvisor = teamMembers[0];
  const secondAdvisor = teamMembers.length > 1 ? teamMembers[1] : null;

  // Stamping based on material ID / structure
  if (material.id === 'our-team-brochure') {
    // 1. Page 1 (Cover co-branding block at bottom right)
    const page1 = doc.getPage(0);
    const p1Height = page1.getHeight();

    // Cover bottom right placeholder
    page1.drawRectangle({
      x: 410,
      y: 40,
      width: 220,
      height: 120,
      color: rgb(1, 1, 1),
    });

    if (embeddedLogo) {
      const maxW = 160;
      const maxH = 45;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      page1.drawImage(embeddedLogo, {
        x: 430,
        y: 110,
        width: w,
        height: h,
      });
      if (profile.website) {
        addClickableLink(doc, page1, 430, 110, w, h, profile.website);
      }
    } else {
      page1.drawText(profile.company || profile.name || 'Simplicity Wealth Partner', {
        x: 430,
        y: 135,
        size: 11,
        font: helveticaBold,
        color: rgb(0, 0.26, 0.45),
      });
    }

    // Contact lines on cover
    const contactLines = [
      profile.address,
      profile.phone,
      profile.website,
    ].filter(Boolean);

    let curY = 95;
    for (const line of contactLines) {
      page1.drawText(line, {
        x: 430,
        y: curY,
        size: 8,
        font: helvetica,
        color: rgb(0.2, 0.25, 0.3),
      });
      curY -= 12;
    }

    // 2. Page 5: Dedicated Advisor Bios & Headshots
    if (doc.getPageCount() >= 5) {
      const page5 = doc.getPage(4); // 0-indexed page 5
      const p5Height = page5.getHeight();

      // ADVISOR 1 (Upper section)
      // Cover placeholder John Smith photo (x: 54, y: 594, width: 104, height: 104)
      page5.drawRectangle({
        x: 52,
        y: 590,
        width: 108,
        height: 110,
        color: rgb(1, 1, 1),
      });

      // Cover placeholder John Smith info block
      page5.drawRectangle({
        x: 170,
        y: 630,
        width: 420,
        height: 75,
        color: rgb(1, 1, 1),
      });

      // Cover placeholder John Smith bio
      page5.drawRectangle({
        x: 52,
        y: 380,
        width: 545,
        height: 195,
        color: rgb(1, 1, 1),
      });

      // Draw Advisor 1 photo or sleek avatar card
      const adv1Headshot = await embedImage(doc, primaryAdvisor.headshotDataUrl);
      if (adv1Headshot) {
        const aspect = adv1Headshot.width / adv1Headshot.height;
        let w = 104;
        let h = 104;
        if (aspect > 1) {
          h = w / aspect;
        } else {
          w = h * aspect;
        }
        page5.drawImage(adv1Headshot, {
          x: 54 + (104 - w) / 2,
          y: 594 + (104 - h) / 2,
          width: w,
          height: h,
        });
      } else {
        // Subtle styled photo placeholder frame
        page5.drawRectangle({
          x: 54,
          y: 594,
          width: 104,
          height: 104,
          color: rgb(0.93, 0.95, 0.98),
          borderColor: rgb(0.8, 0.85, 0.9),
          borderWidth: 1,
        });
        const initials = primaryAdvisor.name
          .split(/\s+/)
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'AD';
        page5.drawText(initials, {
          x: 90,
          y: 638,
          size: 24,
          font: helveticaBold,
          color: rgb(0, 0.26, 0.45),
        });
      }

      // Draw Advisor 1 Name & Title
      page5.drawText(primaryAdvisor.name || profile.name || 'Wealth Advisor', {
        x: 175,
        y: 685,
        size: 13,
        font: helveticaBold,
        color: rgb(0, 0.26, 0.45),
      });
      page5.drawText(primaryAdvisor.title || profile.title || 'Managing Partner', {
        x: 175,
        y: 670,
        size: 10,
        font: helveticaBold,
        color: rgb(0.15, 0.2, 0.25),
      });
      page5.drawText(`E: ${primaryAdvisor.email || profile.email}`, {
        x: 175,
        y: 652,
        size: 8.5,
        font: helvetica,
        color: rgb(0.3, 0.35, 0.4),
      });
      page5.drawText(`P: ${primaryAdvisor.phone || profile.phone}`, {
        x: 175,
        y: 638,
        size: 8.5,
        font: helvetica,
        color: rgb(0.3, 0.35, 0.4),
      });

      // Draw Advisor 1 Bio Paragraphs
      const adv1BioText = primaryAdvisor.bio || 'Provides comprehensive financial planning, retirement income optimization, and tax-efficient fiduciary wealth management to help clients achieve lasting peace of mind.';
      const bioLines1 = wrapText(adv1BioText, 95);
      let bioY1 = 555;
      for (const line of bioLines1) {
        if (bioY1 < 390) break;
        page5.drawText(line, {
          x: 54,
          y: bioY1,
          size: 8.5,
          font: helvetica,
          color: rgb(0.2, 0.25, 0.3),
        });
        bioY1 -= 13;
      }

      // ADVISOR 2 (Lower section)
      // Cover placeholder Caroline Jensen photo (x: 54, y: 249, width: 104, height: 104)
      page5.drawRectangle({
        x: 52,
        y: 245,
        width: 108,
        height: 110,
        color: rgb(1, 1, 1),
      });

      // Cover placeholder Caroline Jensen info block
      page5.drawRectangle({
        x: 170,
        y: 285,
        width: 420,
        height: 75,
        color: rgb(1, 1, 1),
      });

      // Cover placeholder Caroline Jensen bio
      page5.drawRectangle({
        x: 52,
        y: 75,
        width: 545,
        height: 165,
        color: rgb(1, 1, 1),
      });

      if (secondAdvisor) {
        // Draw Advisor 2 photo
        const adv2Headshot = await embedImage(doc, secondAdvisor.headshotDataUrl);
        if (adv2Headshot) {
          const aspect = adv2Headshot.width / adv2Headshot.height;
          let w = 104;
          let h = 104;
          if (aspect > 1) {
            h = w / aspect;
          } else {
            w = h * aspect;
          }
          page5.drawImage(adv2Headshot, {
            x: 54 + (104 - w) / 2,
            y: 249 + (104 - h) / 2,
            width: w,
            height: h,
          });
        } else {
          page5.drawRectangle({
            x: 54,
            y: 249,
            width: 104,
            height: 104,
            color: rgb(0.93, 0.95, 0.98),
            borderColor: rgb(0.8, 0.85, 0.9),
            borderWidth: 1,
          });
          const initials = secondAdvisor.name
            .split(/\s+/)
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'AD';
          page5.drawText(initials, {
            x: 90,
            y: 293,
            size: 24,
            font: helveticaBold,
            color: rgb(0, 0.26, 0.45),
          });
        }

        // Draw Advisor 2 Name & Title
        page5.drawText(secondAdvisor.name, {
          x: 175,
          y: 340,
          size: 13,
          font: helveticaBold,
          color: rgb(0, 0.26, 0.45),
        });
        page5.drawText(secondAdvisor.title || 'Associate Wealth Advisor', {
          x: 175,
          y: 325,
          size: 10,
          font: helveticaBold,
          color: rgb(0.15, 0.2, 0.25),
        });
        page5.drawText(`E: ${secondAdvisor.email || profile.email}`, {
          x: 175,
          y: 307,
          size: 8.5,
          font: helvetica,
          color: rgb(0.3, 0.35, 0.4),
        });
        page5.drawText(`P: ${secondAdvisor.phone || profile.phone}`, {
          x: 175,
          y: 293,
          size: 8.5,
          font: helvetica,
          color: rgb(0.3, 0.35, 0.4),
        });

        // Draw Advisor 2 Bio
        const adv2BioText = secondAdvisor.bio || 'Focuses on holistic wealth planning, asset protection strategies, and client relationship management.';
        const bioLines2 = wrapText(adv2BioText, 95);
        let bioY2 = 210;
        for (const line of bioLines2) {
          if (bioY2 < 80) break;
          page5.drawText(line, {
            x: 54,
            y: bioY2,
            size: 8.5,
            font: helvetica,
            color: rgb(0.2, 0.25, 0.3),
          });
          bioY2 -= 13;
        }
      }
    }
  } else if (material.id === 'wealth-management-brochure') {
    // Flagship Wealth Management Brochure (8 pages)
    // Page 1 contact block
    const page1 = doc.getPage(0);
    // Cover placeholder address at x: 306, y: 100
    page1.drawRectangle({
      x: 300,
      y: 95,
      width: 250,
      height: 105,
      color: rgb(1, 1, 1),
    });

    if (embeddedLogo) {
      const maxW = 150;
      const maxH = 45;
      const aspect = embeddedLogo.width / embeddedLogo.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      page1.drawImage(embeddedLogo, {
        x: 306,
        y: 155,
        width: w,
        height: h,
      });
      if (profile.website) {
        addClickableLink(doc, page1, 306, 155, w, h, profile.website);
      }
    } else {
      page1.drawText(profile.company || profile.name, {
        x: 306,
        y: 175,
        size: 11,
        font: helveticaBold,
        color: rgb(0, 0.26, 0.45),
      });
    }

    const lines = [
      profile.address,
      profile.phone,
      profile.website,
    ].filter(Boolean);

    let yPos = 140;
    for (const line of lines) {
      page1.drawText(line, {
        x: 306,
        y: yPos,
        size: 8,
        font: helvetica,
        color: rgb(0.2, 0.25, 0.3),
      });
      yPos -= 12;
    }
  } else {
    // General Flyers & Questionnaires (IS flyers, AssetLock FAQs, Start Smart, RTQ, FCPQ)
    const totalPages = doc.getPageCount();
    for (let pIdx = 0; pIdx < totalPages; pIdx++) {
      const page = doc.getPage(pIdx);
      const pageW = page.getWidth();
      const pageH = page.getHeight();

      // Check if this page has a contact block at top (Flyers)
      if (material.category === 'flyer' || material.id.startsWith('is-')) {
        // Header block at top
        page.drawRectangle({
          x: 40,
          y: pageH - 85,
          width: 530,
          height: 70,
          color: rgb(1, 1, 1),
        });

        // Stamp Advisor Logo on left
        if (embeddedLogo) {
          const maxW = 140;
          const maxH = 45;
          const aspect = embeddedLogo.width / embeddedLogo.height;
          let w = maxW;
          let h = w / aspect;
          if (h > maxH) {
            h = maxH;
            w = h * aspect;
          }
          page.drawImage(embeddedLogo, {
            x: 50,
            y: pageH - 75,
            width: w,
            height: h,
          });
          if (profile.website) {
            addClickableLink(doc, page, 50, pageH - 75, w, h, profile.website);
          }
        } else {
          page.drawText(profile.company || profile.name, {
            x: 50,
            y: pageH - 55,
            size: 11,
            font: helveticaBold,
            color: rgb(0, 0.26, 0.45),
          });
        }

        // Stamp Contact info on right
        page.drawText(profile.company || profile.name, {
          x: 215,
          y: pageH - 35,
          size: 8.5,
          font: helveticaBold,
          color: rgb(0, 0.26, 0.45),
        });
        if (profile.address) {
          page.drawText(profile.address, {
            x: 215,
            y: pageH - 47,
            size: 7.5,
            font: helvetica,
            color: rgb(0.2, 0.25, 0.3),
          });
        }
        if (profile.phone) {
          page.drawText(profile.phone, {
            x: 215,
            y: pageH - 59,
            size: 7.5,
            font: helvetica,
            color: rgb(0.2, 0.25, 0.3),
          });
        }
        if (profile.website) {
          page.drawText(profile.website, {
            x: 215,
            y: pageH - 71,
            size: 7.5,
            font: helvetica,
            color: rgb(0, 0.46, 0.74),
          });
          addClickableLink(doc, page, 215, pageH - 73, 150, 10, profile.website);
        }
      } else if (pIdx === totalPages - 1 && (material.id.includes('assetlock') || material.id.includes('fcpq'))) {
        // Bottom contact block on last page of AssetLock / FCPQ
        page.drawRectangle({
          x: 200,
          y: 110,
          width: 320,
          height: 90,
          color: rgb(1, 1, 1),
        });

        if (embeddedLogo) {
          const maxW = 120;
          const maxH = 40;
          const aspect = embeddedLogo.width / embeddedLogo.height;
          let w = maxW;
          let h = w / aspect;
          if (h > maxH) {
            h = maxH;
            w = h * aspect;
          }
          page.drawImage(embeddedLogo, {
            x: 210,
            y: 155,
            width: w,
            height: h,
          });
        }

        const lines = [
          profile.company || profile.name,
          profile.address,
          profile.phone,
          profile.website,
        ].filter(Boolean);

        let yPos = 145;
        for (const line of lines) {
          page.drawText(line, {
            x: 210,
            y: yPos,
            size: 7.5,
            font: helvetica,
            color: rgb(0.2, 0.25, 0.3),
          });
          yPos -= 11;
        }
      }
    }
  }

  return await doc.save();
}

/**
 * Download a single branded Simplicity Wealth material
 */
export async function downloadSingleWealthMaterial(
  material: WealthMaterial,
  profile: AgentProfile
): Promise<void> {
  const bytes = await brandWealthMaterialPdf(material, profile);
  const blob = new Blob([bytes], {
    type: material.format === 'pptx' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'application/pdf',
  });
  saveAs(blob, `${material.id}-branded.${material.format}`);
}

/**
 * Batch download all 14 Simplicity Wealth materials as a ZIP archive
 */
export async function downloadAllWealthMaterialsZip(
  materials: WealthMaterial[],
  profile: AgentProfile,
  onProgress?: (current: number, total: number, title: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('Simplicity_Wealth_Branded_Materials');

  for (let i = 0; i < materials.length; i++) {
    const mat = materials[i];
    if (onProgress) {
      onProgress(i + 1, materials.length, mat.title);
    }
    try {
      const bytes = await brandWealthMaterialPdf(mat, profile);
      const filename = `${String(i + 1).padStart(2, '0')}_${mat.id}.${mat.format}`;
      folder?.file(filename, bytes);
    } catch (err) {
      console.warn(`Could not brand ${mat.title}, bundling master file:`, err);
      const res = await fetch(`${import.meta.env.BASE_URL}wealth/${mat.filename}`);
      const buf = await res.arrayBuffer();
      folder?.file(`${String(i + 1).padStart(2, '0')}_${mat.id}.${mat.format}`, buf);
    }
  }

  // Include comprehensive Sharing Tips & Advisor Guide
  folder?.file(
    'READ_ME_WEALTH_MATERIALS.txt',
    `SIMPLICITY WEALTH CO-BRANDED ADVISOR MATERIALS
==================================================
Materials Included:
1. Our Team Prestige Brochure (8 Pages - with your customized Bio and Headshot)
2. Wealth Management Comprehensive Brochure (8 Pages)
3. AssetLock® Investor Overview Brochure
4. AssetLock® Investor FAQs
5. Investment Specialization: Direct Indexing & Tax-Loss Harvesting
6. Investment Specialization: ESG & SRI Sustainable Investing
7. Investment Specialization: Comprehensive Planning Process
8. Investment Specialization: Research & Due Diligence Process
9. Investment Specialization: Tax-Optimized Transition Strategy
10. Risk Tolerance Questionnaire (RTQ)
11. Start Smart VaR Client Instructions
12. Financial Planning Considerations Questionnaire (Short Form)
13. Financial Planning Considerations Questionnaire (Comprehensive Form)
14. Investment Partnership Presentation Deck

Co-Branded for:
Advisor / Firm: ${profile.company || profile.name}
Phone: ${profile.phone}
Email: ${profile.email}
Website: ${profile.website}

Generated via Simplicity Group Co-Branding Studio.
`
  );

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'Simplicity_Wealth_Branded_Materials.zip');
}
