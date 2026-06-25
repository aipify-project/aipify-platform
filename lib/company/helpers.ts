import { COMPANY_CONFIG } from "./company.config";

export function getCompanyConfig() {
  return COMPANY_CONFIG;
}

export function formatHeadquartersLine(): string {
  return `${COMPANY_CONFIG.headquartersAddress}, ${COMPANY_CONFIG.country}`;
}

export function formatCopyrightLine(year = new Date().getFullYear()): string {
  return `© ${year} ${COMPANY_CONFIG.legalCompanyName}`;
}

export function formatCopyrightNotice(): string {
  return `${COMPANY_CONFIG.legalCompanyName}. All rights reserved.`;
}

export function formatLegalEntityLine(): string {
  const org = `${COMPANY_CONFIG.legalCompanyName} · Org. ${COMPANY_CONFIG.organizationNumber}`;
  return `${org} · ${formatHeadquartersLine()}`;
}

export function companyMailto(
  kind: "contact" | "support" | "privacy" | "billing" = "contact",
  subject?: string,
): string {
  const email = {
    contact: COMPANY_CONFIG.contactEmail,
    support: COMPANY_CONFIG.supportEmail,
    privacy: COMPANY_CONFIG.privacyContactEmail,
    billing: COMPANY_CONFIG.billingContactEmail,
  }[kind];
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

export function formatSoftwareLicenseNotice(): string {
  return `${COMPANY_CONFIG.brandName} is proprietary software owned by ${COMPANY_CONFIG.legalCompanyName}. Customers receive a license to use the service — not ownership of the software.`;
}

export function formatPrivacyContactLine(): string {
  return `Privacy questions: ${COMPANY_CONFIG.privacyContactEmail}`;
}

export function formatLegalContactLine(): string {
  return `Legal inquiries: ${COMPANY_CONFIG.contactEmail}`;
}

export function formatCompanyLegalReference(): string {
  return `${COMPANY_CONFIG.legalCompanyName} · ${COMPANY_CONFIG.corporateSignature}`;
}

export function formatCompanyProductLine(): string {
  return `${COMPANY_CONFIG.brandName} is developed by ${COMPANY_CONFIG.legalCompanyName}. ${COMPANY_CONFIG.corporateSignature}`;
}

export function formatInvoiceIssuerHeader(): string {
  return `${COMPANY_CONFIG.legalCompanyName} — Enterprise Invoice`;
}

/** Legacy AIPIFY_GROUP shape for branding components */
export function toLegacyBrandGroup() {
  return {
    legalName: COMPANY_CONFIG.legalCompanyName,
    brandName: COMPANY_CONFIG.brandName,
    organizationNumber: COMPANY_CONFIG.organizationNumber,
    headquarters: formatHeadquartersLine(),
    headquartersCity: COMPANY_CONFIG.headquartersAddress.replace(/^\d+\s*/, "") || "Bergen",
    headquartersCountry: COMPANY_CONFIG.country,
    website: COMPANY_CONFIG.website,
    contactEmail: COMPANY_CONFIG.contactEmail,
    supportEmail: COMPANY_CONFIG.supportEmail,
    privacyEmail: COMPANY_CONFIG.privacyContactEmail,
    billingEmail: COMPANY_CONFIG.billingContactEmail,
    brandStatement: COMPANY_CONFIG.brandStatement,
    officialStatementLines: COMPANY_CONFIG.corporateSignature.split(". ").filter(Boolean).map((s) => `${s.trim()}.`) as readonly string[],
    marketingSignature: COMPANY_CONFIG.corporateSignature,
    shortSignature: COMPANY_CONFIG.corporateSignature.replace(/^Bergen\.\s*/, ""),
    foundingPrinciple: "Our ambition is global. Our values remain Norwegian.",
    footerDescription: COMPANY_CONFIG.brandStatement,
    investorLine: `Founded in ${formatHeadquartersLine()}. Building operational business systems for organizations worldwide.`,
    principles: [
      "Humble enough to listen.",
      "Ambitious enough to think globally.",
      "Disciplined enough to build for the long term.",
      "Responsible enough to earn trust.",
      "Curious enough to keep improving.",
    ] as const,
    internalReminder: [
      "Never pretend to be bigger than we are.",
      "Be proud of where we come from.",
      "Build products worthy of being used around the world.",
    ] as const,
  };
}
