/** Unified Seller Bridge V1 — CSP authoritative, GP App as capability layer. */

export const UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE =
  "docs/platform/sql-candidates/NOT_APPLIED_growth_partners_unified_seller_bridge_v1.sql";

export const UNIFIED_SELLER_BRIDGE_RPC = {
  ensureForCsp: "ensure_growth_partner_app_profile_for_csp_partner",
  ensureOwn: "ensure_own_growth_partner_app_profile_from_csp",
  syncFromCsp: "sync_growth_partner_app_status_from_csp",
  getOwnLinks: "get_own_unified_seller_sales_links",
} as const;

/** Stable API / Core codes for dual-registration guards. */
export const CSP_SELLER_EXISTS_CODE = "csp_seller_exists" as const;
export const GROWTH_PARTNER_EXISTS_CODE = "growth_partner_exists" as const;

export const PARTNERS_PORTAL_REDIRECT = "/partners" as const;