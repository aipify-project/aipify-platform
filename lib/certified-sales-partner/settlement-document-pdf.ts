/**
 * Server-only preview PDF. It never assigns a document number and never
 * changes settlement status.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { settlementPreviewLines, type SettlementDocumentModel } from "./settlement-document";

const ASSETS_DIR = join(
  /* turbopackIgnore: true */ process.cwd(),
  "lib/certified-sales-partner/academy/assets",
);

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

function loadAsset(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(ASSETS_DIR, name)));
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.normalize("NFC").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines;
}

function drawLines(page: PDFPage, font: PDFFont, lines: string[], x: number, y: number, size: number, maxWidth: number): number {
  let cursor = y;
  for (const line of lines) {
    for (const row of wrap(line, font, size, maxWidth)) {
      page.drawText(row, { x, y: cursor, size, font, color: rgb(0.12, 0.14, 0.22) });
      cursor -= size + 6;
    }
  }
  return cursor;
}

export async function renderSettlementPreviewPdf(model: SettlementDocumentModel): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const regular = await pdf.embedFont(loadAsset("NotoSans-Regular.ttf"), { subset: true });
  const bold = await pdf.embedFont(loadAsset("NotoSans-Bold.ttf"), { subset: true });
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: rgb(0.969, 0.965, 0.953) });
  page.drawRectangle({ x: 36, y: 36, width: PAGE_WIDTH - 72, height: PAGE_HEIGHT - 72, color: rgb(1, 1, 1) });
  page.drawText("PREVIEW", {
    x: 56,
    y: PAGE_HEIGHT - 78,
    size: 11,
    font: bold,
    color: rgb(0.486, 0.227, 0.929),
  });
  let y = PAGE_HEIGHT - 110;
  const [title, ...rest] = settlementPreviewLines(model);
  page.drawText(title ?? model.title, { x: 56, y, size: 22, font: bold, color: rgb(0.12, 0.14, 0.22) });
  y -= 36;
  y = drawLines(page, regular, rest.filter((line) => line.length > 0), 56, y, 11, PAGE_WIDTH - 120);
  y -= 12;
  page.drawText(model.issuer.website, { x: 56, y, size: 10, font: regular, color: rgb(0.38, 0.44, 0.54) });
  pdf.setTitle(model.title);
  pdf.setAuthor(model.issuer.legalName);
  return pdf.save();
}
