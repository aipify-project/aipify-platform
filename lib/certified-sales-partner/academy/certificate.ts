/**
 * CSP Academy — certificate metadata and reversible IDs (client-safe).
 * PDF rendering lives in `certificate-pdf.ts` (server-only: node:fs + pdf-lib).
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

const CERTIFICATE_ID_PATTERN = /^[0-9a-zA-Z_-]{8,64}$/;
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

const PARTNER_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PRODUCT_KEY_RE = /^[a-z0-9_]{2,32}$/;

/**
 * Stable, reversible certificate id: `{productKey}-{partnerUuid}`.
 * Enables O(1) public verify without scanning certification rows.
 * Used by submit, download, Admin drawer, and public verification so the id never diverges.
 */
export function deriveCspCertificateId(partnerId: string, productKey: string): string {
  const partner = partnerId.trim();
  const product = productKey.trim().toLowerCase();
  if (!PARTNER_UUID_RE.test(partner) || !PRODUCT_KEY_RE.test(product)) {
    // Fail closed to a deterministic but non-reversible legacy shape only for invalid inputs
    // (tests / defensive); production callers always pass a UUID partner id.
    return deriveCertificateId(`csp-certificate|${partner}|${product}`);
  }
  return `${product}-${partner}`;
}

/** Parses a reversible certificate id into product key + partner id. */
export function parseCspCertificateId(
  certificateId: string,
): { productKey: string; partnerId: string } | null {
  const id = certificateId.trim();
  const match = /^([a-z0-9_]{2,32})-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(
    id,
  );
  if (!match) return null;
  return { productKey: match[1].toLowerCase(), partnerId: match[2].toLowerCase() };
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

export type CertificatePdfCopy = {
  title: string;
  partnerTitle: string;
  certifiesThat: string;
  completedAssessment: string;
  productName: string;
  certificateId: string;
  datePassed: string;
  issuedBy: string;
  orgNumberLabel: string;
  verify: string;
  /** Visual gold-seal word only — not a legal/state accreditation claim. */
  certifiedSeal: string;
};

export function certificatePdfCopy(locale: Locale): CertificatePdfCopy {
  switch (locale) {
    case "no":
      return {
        title: "Sertifikat for produktsertifisering",
        partnerTitle: "Certified Aipify Sales Partner",
        certifiesThat: "Dette bekrefter at",
        completedAssessment: "har bestått godkjent produktsertifisering for",
        productName: "Kompis Web",
        certificateId: "Sertifikat-ID",
        datePassed: "Dato",
        issuedBy: "Utstedt av",
        orgNumberLabel: "Org.nr.",
        verify: "Verifiser",
        certifiedSeal: "SERTIFISERT",
      };
    case "sv":
      return {
        title: "Intyg om produktcertifiering",
        partnerTitle: "Certified Aipify Sales Partner",
        certifiesThat: "Detta intygar att",
        completedAssessment: "har klarat godkänd produktcertifiering för",
        productName: "Kompis Web",
        certificateId: "Certifikat-ID",
        datePassed: "Datum",
        issuedBy: "Utfärdat av",
        orgNumberLabel: "Org.nr.",
        verify: "Verifiera",
        certifiedSeal: "CERTIFIERAD",
      };
    case "da":
      return {
        title: "Certifikat for produktcertificering",
        partnerTitle: "Certified Aipify Sales Partner",
        certifiesThat: "Dette bekræfter, at",
        completedAssessment: "har bestået godkendt produktcertificering for",
        productName: "Kompis Web",
        certificateId: "Certifikat-ID",
        datePassed: "Dato",
        issuedBy: "Udstedt af",
        orgNumberLabel: "CVR",
        verify: "Verificér",
        certifiedSeal: "CERTIFICERET",
      };
    case "pl":
      return {
        title: "Certyfikat ukończenia produktu",
        partnerTitle: "Certified Aipify Sales Partner",
        certifiesThat: "Niniejszym potwierdza się, że",
        completedAssessment: "pomyślnie ukończył(a) certyfikację produktu",
        productName: "Kompis Web",
        certificateId: "ID certyfikatu",
        datePassed: "Data",
        issuedBy: "Wystawca",
        orgNumberLabel: "Nr org.",
        verify: "Weryfikuj",
        certifiedSeal: "CERTYFIKOWANY",
      };
    case "uk":
      return {
        title: "Сертифікат про сертифікацію продукту",
        partnerTitle: "Certified Aipify Sales Partner",
        certifiesThat: "Цим підтверджується, що",
        completedAssessment: "успішно пройшов(ла) сертифікацію продукту",
        productName: "Kompis Web",
        certificateId: "ID сертифіката",
        datePassed: "Дата",
        issuedBy: "Видавець",
        orgNumberLabel: "Орг. №",
        verify: "Перевірити",
        certifiedSeal: "СЕРТИФІКОВАНО",
      };
    case "es":
      return {
        title: "Certificado de certificación de producto",
        partnerTitle: "Certified Aipify Sales Partner",
        certifiesThat: "Se certifica que",
        completedAssessment: "ha completado con éxito la certificación de producto de",
        productName: "Kompis Web",
        certificateId: "ID del certificado",
        datePassed: "Fecha",
        issuedBy: "Emitido por",
        orgNumberLabel: "N.º org.",
        verify: "Verificar",
        certifiedSeal: "CERTIFICADO",
      };
    default:
      return {
        title: "Certificate of Completion",
        partnerTitle: "Certified Aipify Sales Partner",
        certifiesThat: "This certifies that",
        completedAssessment: "has successfully completed the product certification assessment for",
        productName: "Kompis Web",
        certificateId: "Certificate ID",
        datePassed: "Date passed",
        issuedBy: "Issued by",
        orgNumberLabel: "Org. no.",
        verify: "Verify",
        certifiedSeal: "CERTIFIED",
      };
  }
}

/** Identity helper for Unicode certificate text (no transliteration). */
export function toPdfSafeText(value: string): string {
  return value.normalize("NFC");
}

/**
 * Short, deterministic display reference derived from the reversible certificate id.
 * Full id remains authoritative for verify routes — this is presentation only.
 */
export function formatCertificateDisplayRef(certificateId: string): string {
  const parsed = parseCspCertificateId(certificateId);
  if (!parsed) {
    const id = certificateId.trim();
    if (id.length <= 22) return id;
    return `${id.slice(0, 10)}…${id.slice(-8)}`;
  }
  return `${parsed.productKey} · ${parsed.partnerId.slice(-8)}`;
}

/** Canonical public origin for partner certificate verification links. */
export const CSP_CERTIFICATE_PUBLIC_ORIGIN = "https://app.aipify.ai" as const;

/** Full HTTPS verification URL for a certificate verify path or absolute URL. */
export function buildCertificateVerifyUrl(verifyPathOrUrl: string): string {
  const value = verifyPathOrUrl.trim();
  if (/^https:\/\//i.test(value)) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${CSP_CERTIFICATE_PUBLIC_ORIGIN}${path}`;
}
