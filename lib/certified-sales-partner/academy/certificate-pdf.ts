/**
 * Server-only Unicode PDF builder for CSP academy certificates.
 * Do not import from client components — uses node:fs and pdf-lib.
 *
 * Visual polish only — certificate IDs, issuer rules, and verify contracts stay unchanged.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  certificatePdfCopy,
  toPdfSafeText,
  type CspCertificateMeta,
} from "./certificate";

const ASSETS_DIR = join(
  /* turbopackIgnore: true */ process.cwd(),
  "lib/certified-sales-partner/academy/assets",
);

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const CONTENT_MAX = 620;

const INK = rgb(0.118, 0.137, 0.216);
const MUTED = rgb(0.38, 0.44, 0.54);
const BRAND = rgb(0.486, 0.227, 0.929); // #7C3AED Companion Purple
const GOLD = rgb(0.78, 0.62, 0.22);
const GOLD_SOFT = rgb(0.9, 0.8, 0.48);
const PAPER = rgb(0.973, 0.969, 0.957); // warm off-white
const PAPER_INNER = rgb(1, 1, 1);

function loadAsset(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(ASSETS_DIR, name)));
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const normalized = toPdfSafeText(text).trim();
  if (!normalized) return [];
  const words = normalized.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
    } else {
      // Hard-break oversized tokens (e.g. long IDs) without overflowing.
      let chunk = "";
      for (const ch of word) {
        const next = chunk + ch;
        if (font.widthOfTextAtSize(next, size) <= maxWidth) chunk = next;
        else {
          if (chunk) lines.push(chunk);
          chunk = ch;
        }
      }
      current = chunk;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function fitSize(
  text: string,
  font: PDFFont,
  preferred: number,
  min: number,
  maxWidth: number,
): number {
  let size = preferred;
  while (size > min && font.widthOfTextAtSize(toPdfSafeText(text), size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

function drawCentered(
  page: PDFPage,
  text: string,
  size: number,
  font: PDFFont,
  y: number,
  color = INK,
  maxWidth = CONTENT_MAX,
): number {
  const lines = wrapText(text, font, size, maxWidth);
  let cursor = y;
  for (const line of lines) {
    const width = font.widthOfTextAtSize(line, size);
    page.drawText(line, {
      x: Math.max(56, (PAGE_WIDTH - width) / 2),
      y: cursor,
      size,
      font,
      color,
    });
    cursor -= size + 6;
  }
  return cursor;
}

function drawGoldSeal(
  page: PDFPage,
  font: PDFFont,
  label: string,
  cx: number,
  cy: number,
): void {
  const outer = 54;
  page.drawCircle({ x: cx, y: cy, size: outer, color: GOLD_SOFT, borderColor: GOLD, borderWidth: 2.2 });
  page.drawCircle({ x: cx, y: cy, size: outer - 7, borderColor: GOLD, borderWidth: 1.2, color: PAPER_INNER });
  page.drawCircle({ x: cx, y: cy, size: outer - 14, borderColor: GOLD, borderWidth: 0.8 });

  const sealSize = fitSize(label, font, 9, 6, outer * 1.55);
  const width = font.widthOfTextAtSize(label, sealSize);
  page.drawText(label, {
    x: cx - width / 2,
    y: cy - sealSize / 3,
    size: sealSize,
    font,
    color: GOLD,
  });
}

/**
 * Generates a premium A4 landscape PDF with official Aipify branding, Kompis figure,
 * and a decorative gold “Certified” seal. Does not alter certificate validity rules.
 */
export async function buildCertificatePdfText(meta: CspCertificateMeta): Promise<Uint8Array> {
  const copy = certificatePdfCopy(meta.locale);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const regular = await pdfDoc.embedFont(loadAsset("NotoSans-Regular.ttf"), { subset: true });
  const bold = await pdfDoc.embedFont(loadAsset("NotoSans-Bold.ttf"), { subset: true });
  const logo = await pdfDoc.embedPng(loadAsset("aipify-logo-dark.png"));
  const kompis = await pdfDoc.embedPng(loadAsset("aipify-kompis-avatar.png"));

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Warm paper canvas
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: PAPER,
  });

  // Soft brand ribbon
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 10,
    width: PAGE_WIDTH,
    height: 10,
    color: BRAND,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: 8,
    color: GOLD_SOFT,
  });

  // Double frame — purple outer, gold inner accent
  page.drawRectangle({
    x: 24,
    y: 24,
    width: PAGE_WIDTH - 48,
    height: PAGE_HEIGHT - 48,
    borderColor: BRAND,
    borderWidth: 2.4,
    color: PAPER_INNER,
  });
  page.drawRectangle({
    x: 32,
    y: 32,
    width: PAGE_WIDTH - 64,
    height: PAGE_HEIGHT - 64,
    borderColor: GOLD,
    borderWidth: 1.1,
  });
  page.drawRectangle({
    x: 38,
    y: 38,
    width: PAGE_WIDTH - 76,
    height: PAGE_HEIGHT - 76,
    borderColor: BRAND,
    borderWidth: 0.7,
  });

  // Official logo (top-left)
  const logoWidth = 148;
  const logoHeight = (logo.height / logo.width) * logoWidth;
  page.drawImage(logo, {
    x: 56,
    y: PAGE_HEIGHT - 52 - logoHeight,
    width: logoWidth,
    height: logoHeight,
  });

  // Discrete Kompis figure (bottom-right) — keeps center text readable
  const kompisSize = 92;
  page.drawImage(kompis, {
    x: PAGE_WIDTH - 56 - kompisSize,
    y: 52,
    width: kompisSize,
    height: kompisSize,
    opacity: 0.92,
  });

  // Decorative gold seal (visual only)
  drawGoldSeal(page, bold, copy.certifiedSeal, PAGE_WIDTH - 118, PAGE_HEIGHT - 118);

  let y = PAGE_HEIGHT - 118;
  y = drawCentered(page, copy.title, 24, bold, y, BRAND) - 4;
  y = drawCentered(page, copy.partnerTitle, 13, regular, y, MUTED) - 10;
  y = drawCentered(page, copy.certifiesThat, 12, regular, y, MUTED) - 6;

  const nameSize = fitSize(meta.fullName, bold, 28, 16, CONTENT_MAX);
  y = drawCentered(page, meta.fullName, nameSize, bold, y, INK) - 8;

  y = drawCentered(page, copy.completedAssessment, 12, regular, y, MUTED) - 4;
  y = drawCentered(page, copy.productName, 20, bold, y, BRAND) - 2;
  y = drawCentered(page, meta.productLabel, 10, regular, y, MUTED) - 14;

  const idLine = `${copy.certificateId}: ${meta.certificateId}`;
  const idSize = fitSize(idLine, regular, 10, 7, CONTENT_MAX);
  y = drawCentered(page, idLine, idSize, regular, y, INK) - 2;

  const dateLine = `${copy.datePassed}: ${meta.passedAt.slice(0, 10)} (UTC)`;
  y = drawCentered(page, dateLine, 10, regular, y, INK) - 2;

  const issuerLine = `${copy.issuedBy} ${meta.issuer} · ${copy.orgNumberLabel} ${meta.orgNumber} · ${meta.country}`;
  const issuerSize = fitSize(issuerLine, regular, 10, 7, CONTENT_MAX);
  y = drawCentered(page, issuerLine, issuerSize, regular, y, MUTED) - 8;

  // Leave clear space above Kompis for the verify URL
  const verifyLine = `${copy.verify}: ${meta.verifyPath}`;
  const verifySize = fitSize(verifyLine, regular, 9, 6.5, CONTENT_MAX - 110);
  drawCentered(page, verifyLine, verifySize, regular, Math.min(y, 96), MUTED, CONTENT_MAX - 110);

  const saved = await pdfDoc.save();
  return saved instanceof Uint8Array ? saved : new Uint8Array(saved);
}
