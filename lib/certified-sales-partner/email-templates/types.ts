/** Marketing email template contract for Aipify’s own Certified Sales Partners. */

export const CSP_EMAIL_TEMPLATE_TYPES = [
  "product_introduction",
  "follow_up",
  "meeting_request",
  "product_information",
] as const;
export type CspEmailTemplateType = (typeof CSP_EMAIL_TEMPLATE_TYPES)[number];

export const CSP_EMAIL_TEMPLATE_PRODUCTS = ["kompis_web", "kompis_bedrift"] as const;
export type CspEmailTemplateProduct = (typeof CSP_EMAIL_TEMPLATE_PRODUCTS)[number];

/** Marketing language — never silent-fallback to English when missing. */
export const CSP_EMAIL_TEMPLATE_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
export type CspEmailTemplateLocale = (typeof CSP_EMAIL_TEMPLATE_LOCALES)[number];

export const CSP_EMAIL_PLACEHOLDERS = [
  "seller_display_name",
  "seller_avatar_url",
  "seller_company",
  "seller_contact",
  "product_name",
  "product_description",
  "referral_url",
  "company_branding",
] as const;
export type CspEmailPlaceholder = (typeof CSP_EMAIL_PLACEHOLDERS)[number];

export type CspEmailLocalizedFields = {
  subject: string;
  preheader: string;
  body: string;
  ctaLabel: string;
};

export type CspEmailTemplateDefinition = {
  id: string;
  type: CspEmailTemplateType;
  productKey: CspEmailTemplateProduct;
  version: number;
  /** Platform publish state for this code registry entry. */
  published: boolean;
  /** Locale → fields. Missing locale = unavailable (never invent). */
  locales: Partial<Record<CspEmailTemplateLocale, CspEmailLocalizedFields>>;
};

export type CspEmailPlaceholderValues = Record<CspEmailPlaceholder, string>;

export const CSP_EMAIL_OUTBOUND_STATUSES = [
  "draft",
  "queued",
  "accepted_by_provider",
  "delivered",
  "bounced",
  "failed",
] as const;
export type CspEmailOutboundStatus = (typeof CSP_EMAIL_OUTBOUND_STATUSES)[number];

export const CSP_EMAIL_CRM_LEAD_STATUSES = [
  "new_inquiry",
  "contacted",
  "interested",
  "meeting_scheduled",
  "offer_sent",
  "converted",
  "closed",
] as const;
export type CspEmailCrmLeadStatus = (typeof CSP_EMAIL_CRM_LEAD_STATUSES)[number];
