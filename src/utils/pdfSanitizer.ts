/**
 * PDF Text Sanitizer for pdf-lib standard fonts (WinAnsi / Windows-1252)
 *
 * pdf-lib StandardFonts (Helvetica, TimesRoman, Courier) strictly require Windows-1252 (WinAnsi)
 * encoding. Characters outside this character set (such as Unicode Variation Selector-16 \uFE0F,
 * zero-width spaces, emojis, or unsupported unicode symbols) trigger fatal exceptions:
 * "Error: WinAnsi cannot encode ... (0xfe0f)".
 *
 * This utility safely cleans and normalizes all incoming user input (disclosures, advisor names,
 * company names, titles, addresses, bios, event info) before passing them to pdf-lib.
 */

import { AgentProfile } from '../types/index';

// Complete set of valid character code points in pdf-lib's WinAnsiEncoding:
// - Printable ASCII: 32 to 126
// - Latin-1 Supplement: 160 to 255
// - Windows-1252 extensions: 338, 339, 352, 353, 376, 381, 382, 402, 710, 732,
//   8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8226, 8230,
//   8240, 8249, 8250, 8364, 8482
export const WIN_ANSI_CODES = new Set<number>([
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
  72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
  92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
  110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126,
  160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175,
  176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191,
  192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207,
  208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223,
  224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239,
  240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255,
  338, 339, 352, 353, 376, 381, 382, 402, 710, 732, 8211, 8212, 8216, 8217, 8218,
  8220, 8221, 8222, 8224, 8225, 8226, 8230, 8240, 8249, 8250, 8364, 8482
]);

export interface SanitizeOptions {
  allowNewlines?: boolean;
}

/**
 * Clean a string so that every character is guaranteed encodable by WinAnsi / pdf-lib StandardFonts.
 */
export function sanitizeForPdf(
  text: string | null | undefined,
  options: SanitizeOptions = {}
): string {
  if (!text) return '';
  const allowNewlines = !!options.allowNewlines;

  let s = String(text);

  // 1. Strip variation selectors (U+FE00 to U+FE0F, e.g. \uFE0F in ©️, ®️)
  s = s.replace(/[\uFE00-\uFE0F]/g, '');

  // 2. Strip zero-width & invisible formatting characters
  s = s.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');

  // 3. Strip soft hyphens
  s = s.replace(/\u00AD/g, '');

  // 4. Map special unicode spaces (including non-breaking spaces) to regular space
  s = s.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');

  // 5. Map unsupported dashes / minus signs to standard ASCII dash
  s = s.replace(/[\u2010\u2011\u2012\u2015\u2212]/g, '-');

  // 6. Map unsupported quotes/primes to standard quotes
  s = s.replace(/[\u201F\u2033\u00AB\u00BB]/g, '"');
  s = s.replace(/[\u201B\u2032\u02BC]/g, "'");

  // 7. Map bullets and symbols
  s = s.replace(/[\u2023\u25E6\u2043\u2219]/g, '•');
  s = s.replace(/[\u2605\u2606]/g, '*');
  s = s.replace(/[\u2713\u2714\u2611]/g, '[x]');

  // 8. Map common math, fractions & marks
  s = s.replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/≠/g, '!=');
  s = s.replace(/½/g, '1/2').replace(/¼/g, '1/4').replace(/¾/g, '3/4');
  s = s.replace(/℠/g, '(SM)');

  // 9. Strip surrogate pairs (emojis)
  s = s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');

  // 10. Handle newlines and tabs
  if (allowNewlines) {
    s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\t/g, '  ');
  } else {
    s = s.replace(/[\r\n\t]+/g, ' ');
  }

  // 11. Final strict filter: preserve only characters in WinAnsi (or \n if allowNewlines)
  let result = '';
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (WIN_ANSI_CODES.has(code) || (allowNewlines && code === 10)) {
      result += s[i];
    }
  }

  return result.trim();
}

/**
 * Wrap sanitized text into lines that are guaranteed safe for pdf-lib page.drawText()
 * and font.widthOfTextAtSize().
 *
 * Each line returned is guaranteed:
 * 1. Free of newlines (\n, \r)
 * 2. 100% encodable in WinAnsi
 * 3. Wrapped on word boundaries according to maxCharsPerLine
 */
export function wrapSanitizedText(
  text: string | null | undefined,
  maxCharsPerLine: number = 110
): string[] {
  const sanitized = sanitizeForPdf(text, { allowNewlines: true });
  if (!sanitized) return [];

  const paragraphs = sanitized.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) {
      // Empty line / paragraph spacing
      lines.push('');
      continue;
    }

    const words = trimmedPara.split(/\s+/);
    let curLine = '';

    for (const word of words) {
      const test = curLine ? `${curLine} ${word}` : word;
      if (test.length > maxCharsPerLine) {
        if (curLine) lines.push(curLine);
        curLine = word;
      } else {
        curLine = test;
      }
    }
    if (curLine) lines.push(curLine);
  }

  return lines;
}

/**
 * Wrap sanitized text into lines that fit within a precise point width (maxWidth),
 * measuring each line using font.widthOfTextAtSize().
 *
 * Each line returned is guaranteed:
 * 1. Sanitized for WinAnsi
 * 2. Free of newlines and carriage returns
 * 3. Formatted to extend all the way across the available width to the right margin
 * 4. Empty strings for paragraph breaks are preserved
 */
export function wrapTextToWidth(
  text: string | null | undefined,
  font: { widthOfTextAtSize: (text: string, size: number) => number },
  fontSize: number,
  maxWidth: number
): string[] {
  const sanitized = sanitizeForPdf(text, { allowNewlines: true });
  if (!sanitized) return [];

  const paragraphs = sanitized.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      lines.push('');
      continue;
    }

    const words = trimmed.split(/\s+/);
    let curLine = '';

    for (const word of words) {
      const testLine = curLine ? `${curLine} ${word}` : word;
      if (font.widthOfTextAtSize(testLine, fontSize) <= maxWidth) {
        curLine = testLine;
      } else {
        if (curLine) {
          lines.push(curLine);
          curLine = '';
        }
        if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
          curLine = word;
        } else {
          // Break oversized word character-by-character
          let sub = '';
          for (const ch of word) {
            if (font.widthOfTextAtSize(sub + ch, fontSize) > maxWidth) {
              lines.push(sub);
              sub = ch;
            } else {
              sub += ch;
            }
          }
          curLine = sub;
        }
      }
    }
    if (curLine) lines.push(curLine);
  }

  return lines;
}

/**
 * Create a sanitized copy of an AgentProfile guaranteed safe for PDF generation.
 */
export function sanitizeProfile(profile: AgentProfile): AgentProfile {
  return {
    ...profile,
    name: sanitizeForPdf(profile.name),
    title: sanitizeForPdf(profile.title),
    company: sanitizeForPdf(profile.company),
    phone: sanitizeForPdf(profile.phone),
    email: sanitizeForPdf(profile.email),
    website: sanitizeForPdf(profile.website),
    bookingUrl: profile.bookingUrl ? sanitizeForPdf(profile.bookingUrl) : undefined,
    license: sanitizeForPdf(profile.license),
    address: sanitizeForPdf(profile.address, { allowNewlines: true }),
    disclaimer: sanitizeForPdf(profile.disclaimer, { allowNewlines: true }),
    workshopEvent: profile.workshopEvent
      ? {
          title: profile.workshopEvent.title ? sanitizeForPdf(profile.workshopEvent.title) : undefined,
          date: sanitizeForPdf(profile.workshopEvent.date),
          time: sanitizeForPdf(profile.workshopEvent.time),
          locationName: sanitizeForPdf(profile.workshopEvent.locationName),
          locationAddress: sanitizeForPdf(profile.workshopEvent.locationAddress, { allowNewlines: true }),
        }
      : undefined,
    teamMembers: profile.teamMembers?.map((m) => ({
      ...m,
      name: sanitizeForPdf(m.name),
      title: sanitizeForPdf(m.title),
      email: sanitizeForPdf(m.email),
      phone: sanitizeForPdf(m.phone),
      bio: sanitizeForPdf(m.bio, { allowNewlines: true }),
    })),
  };
}
