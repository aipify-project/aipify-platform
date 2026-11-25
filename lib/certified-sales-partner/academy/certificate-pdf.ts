/**
 * Server-only Unicode PDF builder for CSP academy certificates.
 * Do not import from client components — uses node:fs and pdf-lib.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import {
  certificatePdfCopy,
  type CspCertificateMeta,
} from "./certificate";

const ASSETS_DIR = join(
  /* turbopackIgnore: true */ process.cwd(),
  "lib/certified-sales-partner/academy/assets",
);

function loadAsset(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(ASSETS_DIR, name)));
}

/**
 * Generates a professional A4 landscape PDF with the official Aipify logo and Unicode fonts.
 * Preserves Norwegian/Polish/Ukrainian (and other) names and locale copy without transliteration.
 */
export async function buildCertificatePdfText(meta: CspCertificateMeta): Promise<Uint8Array> {
  const pageWidth = 842;
  const pageHeight = 595;
  const copy = certificatePdfCopy(meta.locale);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const regular = await pdfDoc.embedFont(loadAsset("NotoSans-Regular.ttf"), { subset: true });
  const bold = await pdfDoc.embedFont(loadAsset("NotoSans-Bold.ttf"), { subset: true });
  const logo = await pdfDoc.embedPng(loadAsset("aipify-logo-dark.png"));

  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(0.965, 0.969, 0.976),
  });
  page.drawRectangle({
    x: 28,
    y: 28,
    width: pageWidth - 56,
    height: pageHeight - 56,
    borderColor: rgb(0.447, 0.325, 0.918),
    borderWidth: 2.5,
  });
  page.drawRectangle({
    x: 36,
    y: 36,
    width: pageWidth - 72,
    height: pageHeight - 72,
    borderColor: rgb(0.447, 0.325, 0.918),
    borderWidth: 1,
  });

  const logoWidth = 150;
  const logoHeight = (logo.height / logo.width) * logoWidth;
  page.drawImage(logo, {
    x: 56,
    y: pageHeight - 56 - logoHeight,
    width: logoWidth,
    height: logoHeight,
  });

  const ink = rgb(0.118, 0.137, 0.216);
  const muted = rgb(0.38, 0.44, 0.54);
  const brand = rgb(0.447, 0.325, 0.918);

  const center = (text: string, size: number, font: typeof regular, y: number, color = ink) => {
    const width = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: Math.max(48, (pageWidth - width) / 2),
      y,
      size,
      font,
      color,
    });
  };

  center(copy.title, 26, bold, 430, brand);
  center("Certified Aipify Sales Partner", 14, regular, 398, muted);
  center(copy.certifiesThat, 13, regular, 360);
  center(meta.fullName, 26, bold, 320);
  center(copy.completedAssessment, 12, regular, 278, muted);
  center("Kompis Web", 22, bold, 246, brand);
  center(meta.productLabel, 11, regular, 220, muted);
  center(`${copy.certificateId}: ${meta.certificateId}`, 10, regular, 178);
  center(`${copy.datePassed}: ${meta.passedAt.slice(0, 10)} (UTC)`, 10, regular, 158);
  center(`${copy.issuedBy} ${meta.issuer} · Org.nr. ${meta.orgNumber} · ${meta.country}`, 10, regular, 138);
  center(`${copy.verify}: ${meta.verifyPath}`, 9, regular, 108, muted);

  const saved = await pdfDoc.save();
  return saved instanceof Uint8Array ? saved : new Uint8Array(saved);
}
