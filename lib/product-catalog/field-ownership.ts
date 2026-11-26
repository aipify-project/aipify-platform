/**
 * Authoritative field ownership for the unified product catalog.
 * Code must not invent a second source of truth for these fields.
 */

export type ProductCatalogFieldOwner =
  | "canonical_registry"
  | "core_csp_sales_products"
  | "core_channel_sql_pending"
  | "tenant_entitlement"
  | "planned_catalog_reference"
  | "blocked_needs_owner_contract";

export const PRODUCT_CATALOG_FIELD_OWNERSHIP = {
  productKey: "canonical_registry",
  sku: "canonical_registry",
  category: "canonical_registry",
  copy: "canonical_registry",
  logoSrc: "canonical_registry",
  heroImagePath: "canonical_registry",
  moduleKey: "canonical_registry",
  openHref: "canonical_registry",
  defaultAppPublished: "canonical_registry",
  defaultSaleEligible: "canonical_registry",
  salePublished: "core_csp_sales_products",
  fixedCommissionAmount: "core_csp_sales_products",
  currency: "core_csp_sales_products",
  coreProductId: "core_csp_sales_products",
  publishApp: "core_channel_sql_pending",
  publishSale: "core_channel_sql_pending",
  localeCopyApproved: "core_channel_sql_pending",
  mediaPathsPersisted: "core_channel_sql_pending",
  entitlementActive: "tenant_entitlement",
  customerPrice: "planned_catalog_reference",
  checkoutLive: "blocked_needs_owner_contract",
  percentCommission: "blocked_needs_owner_contract",
} as const satisfies Record<string, ProductCatalogFieldOwner>;
