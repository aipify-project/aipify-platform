/**
 * CSP Academy — certificate metadata and a minimal hand-rolled PDF (pure, no dependencies).
 *
 * Issuer identity comes ONLY from `COMPANY_CONFIG` (authoritative legal name, org number, country).
 * If the organization number is missing the certificate is blocked (fail closed) — a certificate
 * without a verifiable issuer must never be produced.
 */
import { COMPANY_CONFIG } from "@/lib/company/company.config";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

export const CSP_CERTIFICATE_PRODUCT_LABEL = "Certified Aipify Sales Partner – Kompis Web" as const;
export const CSP_CERTIFICATE_VERIFY_PATH_PREFIX = "/partners/academy/verify/" as const;

export const CSP_CERTIFICATE_BLOCKED = {
  orgNumberMissing: "csp_certificate_blocked_org_number_missing",
  issuerMissing: "csp_certificate_blocked_issuer_missing",
  invalidName: "csp_certificate_invalid_full_name",
  invalidPassedAt: "csp_certificate_invalid_passed_at",
  invalidLocale: "csp_certificate_invalid_locale",
  invalidCertificateId: "csp_certificate_invalid_certificate_id",
} as const;

/** Issuer identity source — `COMPANY_CONFIG` satisfies this shape; tests may inject a variant. */
export type CspCertificateIssuerSource = {
  readonly legalCompanyName: string;
  readonly organizationNumber: string;
  readonly country: string;
};

export type CspCertificateMeta = {
  fullName: string;
  productLabel: typeof CSP_CERTIFICATE_PRODUCT_LABEL;
  certificateId: string;
  /** ISO 8601 (UTC). */
  passedAt: string;
  issuer: string;
  orgNumber: string;
  country: string;
  locale: Locale;
  verifyPath: string;
};

export type CspCertificateInput = {
  fullName: string;
  passedAt: string | Date;
  locale?: string;
  /** Preferred: a server-generated UUID. When omitted, an id is derived deterministically (see below). */
  certificateId?: string;
  /** Extra entropy for derived ids (e.g. partner id + attempt id). Never shown to users. */
  derivationSeed?: string;
};

const CERTIFICATE_ID_PATTERN = /^[0-9a-zA-Z-]{8,64}$/;
const MAX_NAME_LENGTH = 120;

/** FNV-1a 32-bit hash with a salt so four independent words can be produced. */
function fnv32(input: string, salt: number): number {
  let h = (0x811c9dc5 ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Derives a UUID-shaped id from the inputs (deterministic — same input, same id).
 * Prefer passing a real UUID from the server; this keeps the builder pure.
 */
export function deriveCertificateId(seed: string): string {
  const hex = [0, 1, 2, 3].map((salt) => fnv32(seed, salt).toString(16).padStart(8, "0")).join("");
  const variantNibble = "89ab"[parseInt(hex[16], 16) % 4];
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${variantNibble}${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join("-");
}

/**
 * Stable certificate id for a partner + product (UUID-shaped, deterministic).
 * Used by both the submit response and the certificate download so the id never diverges.
 */
export function deriveCspCertificateId(partnerId: string, productKey: string): string {
  return deriveCertificateId(`csp-certificate|${partnerId}|${productKey}`);
}

function normaliseLocale(locale: string | undefined): Locale {
  if (locale === undefined) return DEFAULT_LOCALE;
  if ((LOCALES as readonly string[]).includes(locale)) return locale as Locale;
  throw new Error(CSP_CERTIFICATE_BLOCKED.invalidLocale);
}

/**
 * Builds certificate metadata. Throws (blocks) when the issuer organization number is missing.
 *
 * @param company defaults to the authoritative `COMPANY_CONFIG`.
 */
export function buildCertificateMeta(
  input: CspCertificateInput,
  company: CspCertificateIssuerSource = COMPANY_CONFIG,
): CspCertificateMeta {
  const orgNumber = (company.organizationNumber ?? "").trim();
  if (!orgNumber) throw new Error(CSP_CERTIFICATE_BLOCKED.orgNumberMissing);
  const issuer = (company.legalCompanyName ?? "").trim();
  const country = (company.country ?? "").trim();
  if (!issuer || !country) throw new Error(CSP_CERTIFICATE_BLOCKED.issuerMissing);

  const fullName = (input.fullName ?? "").replace(/\s+/g, " ").trim();
  if (!fullName || fullName.length > MAX_NAME_LENGTH) throw new Error(CSP_CERTIFICATE_BLOCKED.invalidName);

  const passed = input.passedAt instanceof Date ? input.passedAt : new Date(input.passedAt);
  if (Number.isNaN(passed.getTime())) throw new Error(CSP_CERTIFICATE_BLOCKED.invalidPassedAt);
  const passedAt = passed.toISOString();

  const locale = normaliseLocale(input.locale);

  const certificateId =
    input.certificateId !== undefined
      ? input.certificateId
      : deriveCertificateId([fullName, passedAt, locale, input.derivationSeed ?? ""].join("|"));
  if (!CERTIFICATE_ID_PATTERN.test(certificateId)) throw new Error(CSP_CERTIFICATE_BLOCKED.invalidCertificateId);

  return {
    fullName,
    productLabel: CSP_CERTIFICATE_PRODUCT_LABEL,
    certificateId,
    passedAt,
    issuer,
    orgNumber,
    country,
    locale,
    verifyPath: `${CSP_CERTIFICATE_VERIFY_PATH_PREFIX}${certificateId}`,
  };
}

// ───────────────────────── Localized PDF copy ─────────────────────────

type CertificatePdfCopy = {
  title: string;
  certifiesThat: string;
  completedAssessment: string;
  certificateId: string;
  datePassed: string;
  issuedBy: string;
  verify: string;
};

function certificatePdfCopy(locale: Locale): CertificatePdfCopy {
  switch (locale) {
    case "no":
      return {
        title: "Sertifikat for produktsertifisering",
        certifiesThat: "Dette bekrefter at",
        completedAssessment: "har bestått godkjent produktsertifisering for",
        certificateId: "Sertifikat-ID",
        datePassed: "Dato",
        issuedBy: "Utstedt av",
        verify: "Verifiser",
      };
    case "sv":
      return {
        title: "Intyg om produktcertifiering",
        certifiesThat: "Detta intygar att",
        completedAssessment: "har klarat godkänd produktcertifiering för",
        certificateId: "Certifikat-ID",
        datePassed: "Datum",
        issuedBy: "Utfärdat av",
        verify: "Verifiera",
      };
    case "da":
      return {
        title: "Certifikat for produktcertificering",
        certifiesThat: "Dette bekræfter, at",
        completedAssessment: "har bestået godkendt produktcertificering for",
        certificateId: "Certifikat-ID",
        datePassed: "Dato",
        issuedBy: "Udstedt af",
        verify: "Verificér",
      };
    case "pl":
      return {
        title: "Certyfikat ukończenia produktu",
        certifiesThat: "Niniejszym potwierdza się, że",
        completedAssessment: "pomyślnie ukończył(a) certyfikację produktu",
        certificateId: "ID certyfikatu",
        datePassed: "Data",
        issuedBy: "Wystawca",
        verify: "Weryfikuj",
      };
    case "uk":
      return {
        title: "Сертифікат про сертифікацію продукту",
        certifiesThat: "Цим підтверджується, що",
        completedAssessment: "успішно пройшов(ла) сертифікацію продукту",
        certificateId: "ID сертифіката",
        datePassed: "Дата",
        issuedBy: "Видавець",
        verify: "Перевірити",
      };
    case "es":
      return {
        title: "Certificado de certificación de producto",
        certifiesThat: "Se certifica que",
        completedAssessment: "ha completado con éxito la certificación de producto de",
        certificateId: "ID del certificado",
        datePassed: "Fecha",
        issuedBy: "Emitido por",
        verify: "Verificar",
      };
    default:
      return {
        title: "Certificate of Completion",
        certifiesThat: "This certifies that",
        completedAssessment: "has successfully completed the product certification assessment for",
        certificateId: "Certificate ID",
        datePassed: "Date passed",
        issuedBy: "Issued by",
        verify: "Verify",
      };
  }
}

// ───────────────────────── Minimal PDF writer ─────────────────────────

const CYRILLIC_TO_LATIN: Readonly<Record<string, string>> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh", з: "z", и: "y", і: "i",
  ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu", я: "ya", ы: "y", э: "e", ё: "yo", ъ: "",
};

/**
 * Standard PDF fonts only cover WinAnsi (Latin-1 + a few symbols). Characters outside it are
 * transliterated (Cyrillic) or stripped of diacritics (Polish, etc.); anything left becomes "?".
 * Latin-1 letters such as æ ø å ä ö ü é are kept as-is.
 */
export function toPdfSafeText(value: string): string {
  let out = "";
  for (const ch of value.normalize("NFC")) {
    const code = ch.charCodeAt(0);
    if (ch === "–") {
      out += ch; // en dash — encoded as WinAnsi 0x96
    } else if (code < 32) {
      out += " ";
    } else if (code <= 255) {
      out += ch;
    } else {
      const lower = ch.toLowerCase();
      const cyr = CYRILLIC_TO_LATIN[lower];
      if (cyr !== undefined) {
        out += ch === lower ? cyr : cyr.charAt(0).toUpperCase() + cyr.slice(1);
      } else if (ch === "ł" || ch === "Ł") {
        out += ch === "ł" ? "l" : "L";
      } else {
        const base = ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        out += base.length > 0 && base.charCodeAt(0) <= 255 ? base : "?";
      }
    }
  }
  return out;
}

/** Encodes text as an ASCII-only PDF literal string body (non-ASCII as octal escapes). */
function pdfLiteral(value: string): string {
  let out = "";
  for (const ch of toPdfSafeText(value)) {
    if (ch === "–") out += "\\226";
    else if (ch === "\\" || ch === "(" || ch === ")") out += `\\${ch}`;
    else {
      const code = ch.charCodeAt(0);
      out += code < 127 ? ch : `\\${code.toString(8).padStart(3, "0")}`;
    }
  }
  return out;
}

type PdfLine = { text: string; size: number; bold?: boolean; y: number };

function centeredTextOps(line: PdfLine, pageWidth: number): string {
  const approxWidth = toPdfSafeText(line.text).length * line.size * (line.bold ? 0.56 : 0.5);
  const x = Math.max(36, Math.round((pageWidth - approxWidth) / 2));
  return `BT /${line.bold ? "F2" : "F1"} ${line.size} Tf ${x} ${line.y} Td (${pdfLiteral(line.text)}) Tj ET`;
}

/**
 * Generates a minimal, valid single-page PDF (A4 landscape, standard Helvetica fonts) as bytes.
 * No dependencies. Contains: title, name, product, certificate id, date, issuer + org number.
 */
export function buildCertificatePdfText(meta: CspCertificateMeta): Uint8Array {
  const pageWidth = 842;
  const pageHeight = 595;
  const copy = certificatePdfCopy(meta.locale);
  const lines: PdfLine[] = [
    { text: copy.title, size: 30, bold: true, y: 470 },
    { text: "Certified Aipify Sales Partner", size: 14, y: 430 },
    { text: copy.certifiesThat, size: 14, y: 390 },
    { text: meta.fullName, size: 28, bold: true, y: 350 },
    { text: copy.completedAssessment, size: 13, y: 305 },
    { text: "Kompis Web", size: 22, bold: true, y: 270 },
    { text: meta.productLabel, size: 12, y: 245 },
    { text: `${copy.certificateId}: ${meta.certificateId}`, size: 11, y: 200 },
    { text: `${copy.datePassed}: ${meta.passedAt.slice(0, 10)} (UTC)`, size: 11, y: 180 },
    { text: `${copy.issuedBy} ${meta.issuer} · Org.nr. ${meta.orgNumber} · ${meta.country}`, size: 11, y: 160 },
    { text: `${copy.verify}: ${meta.verifyPath}`, size: 10, y: 125 },
  ];

  const content = [
    "0.95 0.96 0.99 rg 0 0 842 595 re f",
    "0.447 0.325 0.918 RG 2.5 w 28 28 786 539 re S",
    "0.447 0.325 0.918 RG 1 w 36 36 770 523 re S",
    "0.118 0.137 0.216 g",
    ...lines.map((line) => centeredTextOps(line, pageWidth)),
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
      "/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  // Everything written is ASCII, so string length equals byte length (valid xref offsets).
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0x7f;
  return bytes;
}
