/**
 * Product terminology contract for ordinary APP surfaces.
 * Registered product names stay stable across locales.
 */

export const APP_PRODUCT_TERMINOLOGY = {
  /** General workplace companion inside APP */
  aipifyCompanion: "Aipify Companion",
  /** Website-specific operator (Website Kompis / Kompis) */
  websiteKompis: "Website Kompis",
  kompis: "Kompis",
  /** Briefing / overview */
  commandBrief: "Command Brief",
  /** Approval center */
  approvalCenter: "Approval Center",
  /** Analysis surface */
  intelligenceCenter: "Intelligence Center",
} as const;

export type AppProductTermKey = keyof typeof APP_PRODUCT_TERMINOLOGY;

/** Terms that must not be randomly translated or aliased in UI copy builders. */
export const REGISTERED_PRODUCT_NAMES = new Set<string>(Object.values(APP_PRODUCT_TERMINOLOGY));
