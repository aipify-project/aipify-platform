/** Phase 585 — Checkout VAT constants */

export const NORWAY_VAT_RATE = 25;

export const EU_COUNTRY_CODES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
] as const;

export const CHECKOUT_PRODUCT_TYPES = [
  "subscription",
  "domain_license",
  "business_pack",
  "user_license",
  "connector_addon",
  "growth_partner_service",
  "enterprise_upgrade",
  "custom",
] as const;

export type CheckoutCustomerType = "private" | "business";

export type ValidationStatus =
  | "waiting"
  | "validating"
  | "valid"
  | "invalid"
  | "service_unavailable"
  | "not_required";

export type ValidationSource = "brreg" | "vies" | "manual" | "none";

export const LEGAL_REVIEW_NOTE =
  "This checkout tax engine must be reviewed with accounting and legal before public launch.";

export function isEuCountry(country: string): boolean {
  return EU_COUNTRY_CODES.includes(country.toUpperCase() as (typeof EU_COUNTRY_CODES)[number]);
}

export function normalizeOrgNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export function splitVatNumber(value: string): { countryCode: string; vatNumber: string } | null {
  const cleaned = value.replace(/\s/g, "").toUpperCase();
  const match = cleaned.match(/^([A-Z]{2})(.+)$/);
  if (match) return { countryCode: match[1], vatNumber: match[2] };
  return null;
}
