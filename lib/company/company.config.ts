/**
 * Aipify Group AS — Company Identity & Legal Standard
 * Single source of truth for platform provider / owner identity in Aipify Core.
 * Not APP tenant or customer organization data — update official details here only.
 *
 * @see AIPIFY_COMPANY_IDENTITY_LEGAL_STANDARD.md
 */

export type PlatformCompanyIdentity = {
  readonly companyName: string;
  readonly postalCode: string;
  readonly city: string;
  readonly countryCode: string;
  readonly countryName: string;
  readonly supportEmail: string;
  readonly organizationNumber: string;
  readonly organizationNumberDisplay: string;
};

export const COMPANY_CONFIG = {
  legalCompanyName: "Aipify Group AS",
  brandName: "Aipify",
  organizationNumber: "937978960",
  organizationNumberDisplay: "937 978 960",
  postalCode: "5008",
  city: "Bergen",
  countryCode: "NO",
  headquartersAddress: "5008 Bergen",
  country: "Norway",
  contactEmail: "contact@aipify.ai",
  supportEmail: "support@aipify.ai",
  privacyContactEmail: "contact@aipify.ai",
  billingContactEmail: "contact@aipify.ai",
  website: "https://aipify.ai",
  brandStatement: "We help your business.",
  corporateSignature: "Bergen. Norway. For the world.",
} as const;

/** Canonical Aipify platform owner identity — import for legal, support, billing, and company surfaces. */
export const PLATFORM_COMPANY_IDENTITY: PlatformCompanyIdentity = {
  companyName: COMPANY_CONFIG.legalCompanyName,
  postalCode: COMPANY_CONFIG.postalCode,
  city: COMPANY_CONFIG.city,
  countryCode: COMPANY_CONFIG.countryCode,
  countryName: COMPANY_CONFIG.country,
  supportEmail: COMPANY_CONFIG.supportEmail,
  organizationNumber: COMPANY_CONFIG.organizationNumber,
  organizationNumberDisplay: COMPANY_CONFIG.organizationNumberDisplay,
};

export type CompanyConfig = typeof COMPANY_CONFIG;

/** @deprecated Use COMPANY_CONFIG — preserved for existing imports */
export const companyConfig = COMPANY_CONFIG;
