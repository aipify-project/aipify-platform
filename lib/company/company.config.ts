/**
 * Aipify Group AS — Company Identity & Legal Standard
 * Single source of truth for all company-related information.
 * Update official details here only — no other file should require modification.
 *
 * @see AIPIFY_COMPANY_IDENTITY_LEGAL_STANDARD.md
 */

export const COMPANY_CONFIG = {
  legalCompanyName: "Aipify Group AS",
  brandName: "Aipify",
  organizationNumber: "TO_BE_UPDATED",
  headquartersAddress: "5008 Bergen",
  country: "Norway",
  contactEmail: "contact@aipify.ai",
  supportEmail: "contact@aipify.ai",
  privacyContactEmail: "contact@aipify.ai",
  billingContactEmail: "contact@aipify.ai",
  website: "https://aipify.ai",
  brandStatement: "We help your business.",
  corporateSignature: "Bergen. Norway. For the world.",
} as const;

export type CompanyConfig = typeof COMPANY_CONFIG;

/** @deprecated Use COMPANY_CONFIG — preserved for existing imports */
export const companyConfig = COMPANY_CONFIG;
