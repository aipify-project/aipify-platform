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
  buildCertificateVerifyUrl,
  certificatePdfCopy,
  formatCertificateDisplayRef,
  toPdfSafeText,
  type CspCertificateMeta,
} from "./certificate";
import { formatExamPassedAtDisplay } from "./exam-result-display";

const ASSETS_DIR = join(
  /* turbopackIgnore: true */ process.cwd(),
  "lib/certified-sales-partner/academy/assets",
);

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const CONTENT_MAX = 580;

const INK = rgb(0.118, 0.137, 0.216);
const MUTED = rgb(0.38, 0.44, 0.54);
const BRAND = rgb(0.486, 0.227, 0.929); // #7C3AED Companion Purple
const GOLD = rgb(0.78, 0.62, 0.22);
const GOLD_SOFT = rgb(0.9, 0.8, 0.48);
const PAPER = rgb(0.973, 0.969, 0.957);
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
    cursor -= size + 5;
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
  const outer = 58;
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
  const verifyUrl = buildCertificateVerifyUrl(meta.verifyPath);
  const displayRef = formatCertificateDisplayRef(meta.certificateId);
  const passedLabel = formatExamPassedAtDisplay(meta.passedAt, meta.locale);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const regular = await pdfDoc.embedFont(loadAsset("NotoSans-Regular.ttf"), { subset: true });
  const bold = await pdfDoc.embedFont(loadAsset("NotoSans-Bold.ttf"), { subset: true });
  const logo = await pdfDoc.embedPng(loadAsset("aipify-logo-dark.png"));
  const kompis = await pdfDoc.embedPng(loadAsset("aipify-kompis-avatar.png"));

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: PAPER,
  });

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

  page.drawRectangle({
    x: 22,
    y: 22,
    width: PAGE_WIDTH - 44,
    height: PAGE_HEIGHT - 44,
    borderColor: BRAND,
    borderWidth: 2.4,
    color: PAPER_INNER,
  });
  page.drawRectangle({
    x: 30,
    y: 30,
    width: PAGE_WIDTH - 60,
    height: PAGE_HEIGHT - 60,
    borderColor: GOLD,
    borderWidth: 1.15,
  });
  page.drawRectangle({
    x: 36,
    y: 36,
    width: PAGE_WIDTH - 72,
    height: PAGE_HEIGHT - 72,
    borderColor: BRAND,
    borderWidth: 0.7,
  });

  const logoWidth = 142;
  const logoHeight = (logo.height / logo.width) * logoWidth;
  page.drawImage(logo, {
    x: 54,
    y: PAGE_HEIGHT - 50 - logoHeight,
    width: logoWidth,
    height: logoHeight,
  });

  // Larger discrete Kompis — bottom-right, fills previously empty space
  const kompisSize = 132;
  page.drawImage(kompis, {
    x: PAGE_WIDTH - 54 - kompisSize,
    y: 48,
    width: kompisSize,
    height: kompisSize,
    opacity: 0.95,
  });

  drawGoldSeal(page, bold, copy.certifiedSeal, PAGE_WIDTH - 112, PAGE_HEIGHT - 108);

  let y = PAGE_HEIGHT - 108;
  y = drawCentered(page, copy.title, 23, bold, y, BRAND) - 2;
  y = drawCentered(page, copy.partnerTitle, 12, regular, y, MUTED) - 12;
  y = drawCentered(page, copy.certifiesThat, 12, regular, y, MUTED) - 4;

  const nameSize = fitSize(meta.fullName, bold, 27, 15, CONTENT_MAX);
  y = drawCentered(page, meta.fullName, nameSize, bold, y, INK) - 6;

  y = drawCentered(page, copy.completedAssessment, 12, regular, y, MUTED) - 2;
  y = drawCentered(page, copy.productName, 20, bold, y, BRAND) - 1;
  y = drawCentered(page, meta.productLabel, 10, regular, y, MUTED) - 16;

  const refLine = `${copy.certificateId}: ${displayRef}`;
  y = drawCentered(page, refLine, 11, bold, y, INK) - 1;
  const fullIdLine = meta.certificateId;
  const fullIdSize = fitSize(fullIdLine, regular, 8, 6, CONTENT_MAX - 40);
  y = drawCentered(page, fullIdLine, fullIdSize, regular, y, MUTED) - 4;

  const dateLine = `${copy.datePassed}: ${passedLabel}`;
  y = drawCentered(page, dateLine, 10, regular, y, INK) - 2;

  const issuerLine = `${copy.issuedBy} ${meta.issuer} · ${copy.orgNumberLabel} ${meta.orgNumber} · ${meta.country}`;
  const issuerSize = fitSize(issuerLine, regular, 10, 7, CONTENT_MAX);
  y = drawCentered(page, issuerLine, issuerSize, regular, y, MUTED) - 10;

  const verifyLine = `${copy.verify}: ${verifyUrl}`;
  const verifySize = fitSize(verifyLine, regular, 9, 6.5, CONTENT_MAX - 140);
  drawCentered(page, verifyLine, verifySize, regular, Math.min(y, 108), BRAND, CONTENT_MAX - 140);

  const saved = await pdfDoc.save();
  return saved instanceof Uint8Array ? saved : new Uint8Array(saved);
}
