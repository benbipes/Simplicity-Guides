import { PDFDocument, PDFName, PDFString, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function testPdfLibLink() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawText('Test Clickable Link Document', {
    x: 50,
    y: 700,
    size: 18,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.4)
  });

  const url = 'https://linkedin.com/in/sample-advisor';
  const text = 'Click here: LinkedIn Profile';
  const textX = 50;
  const textY = 650;
  const textSize = 12;
  const textWidth = font.widthOfTextAtSize(text, textSize);
  const textHeight = textSize;

  page.drawText(text, {
    x: textX,
    y: textY,
    size: textSize,
    font: font,
    color: rgb(0.05, 0.4, 0.8)
  });

  // Create link annotation
  const linkAnnotation = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [textX, textY - 2, textX + textWidth, textY + textHeight + 2],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: PDFString.of(url)
    }
  });

  const linkRef = doc.context.register(linkAnnotation);
  page.node.addAnnot(linkRef);

  const pdfBytes = await doc.save();
  fs.writeFileSync('test-link-output.pdf', pdfBytes);
  console.log('Successfully created test-link-output.pdf with length:', pdfBytes.length);
}

testPdfLibLink().catch(console.error);
