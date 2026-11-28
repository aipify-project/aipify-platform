/**
 * Unified product catalog — one product identity, two channel publications.
 * Persistence of APP channel / media / percent commission requires Core SQL (see docs).
 */

import type { ProductVariantDefinition } from "./variants";

export type ProductCatalogChannel = "app" | "sale";

export type ProductCatalogChannelStatus =
  | "published"
  | "draft"
  | "unpublished"
  | "not_configured"
  | "blocked_needs_sql";

export type ProductCatalogPurchaseReadiness =
  | "info_only"
  | "contact"
  | "checkout_ready"
  | "active_open";

export type ProductCatalogCommissionModel =
  | { kind: "fixed"; amount: number; currency: string }
  | { kind: "percent"; blockedReason: "needs_core_contract" }
  | { kind: "unknown" };

export type ProductCatalogLocaleCode = "en" | "no" | "sv" | "da" | "pl" | "uk" | "es";

export type ProductCatalogCopy = {
  title: string;
  tagline: string;
  description: string;
  /** True when approved locale copy exists (not silent English fallback for sales). */
  localeApproved: boolean;
};

export type CanonicalProductDefinition = {
  productKey: string;
  /** Internal SKU — reference format, not a payment entitlement by itself. */
  sku: string;
  category: "kompis" | "voice" | "platform";
  /** Default APP panel publication until Core channel flags exist. */
  defaultAppPublished: boolean;
  /** Default SALE panel intent — still gated by Core `published` when a CSP row exists. */
  defaultSaleEligible: boolean;
  moduleKey: string | null;
  openHref: string | null;
  logoSrc: string | null;
  heroImagePath: string | null;
  accent: "violet" | "indigo" | "emerald";
  letter: string;
  /** Locale → copy. Missing locales must surface as not publication-ready. */
  copy: Partial<Record<ProductCatalogLocaleCode, ProductCatalogCopy>>;
};

export type ProductCatalogPublicationSource = "core" | "registry_fallback" | "none";

export type UnifiedProductChannelState = {
  status: ProductCatalogChannelStatus;
  /** Whether the channel may appear in customer/partner storefronts. */
  visibleInStore: boolean;
  /**
   * APP: `registry_fallback` means Core `publish_app` is not available yet —
   * temporary controlled listing from canonical registry, not Core persistence.
   * SALE: normally `core` when a CSP row exists; otherwise `none` / not configured.
   */
  source: ProductCatalogPublicationSource;
};

export type UnifiedCatalogProduct = {
  productKey: string;
  sku: string;
  category: CanonicalProductDefinition["category"];
  /** Open store category id from Core taxonomy when set; else registry category. */
  storeCategoryId: string;
  /** Core product_type when configured; null = unconfigured. */
  productType: string | null;
  /** ALL-semantics dependency keys from Core; empty when none/unconfigured. */
  dependsOnProductKeys: string[];
  title: string;
  tagline: string;
  description: string;
  localeApproved: boolean;
  /** Approved Core benefits when present; empty when missing — never invented. */
  benefits?: string[];
  /** Whether title/tagline/description came from Core approved locale copy. */
  contentSource?: "core" | "registry_fallback";
  logoSrc: string | null;
  heroImagePath: string | null;
  accent: CanonicalProductDefinition["accent"];
  letter: string;
  openHref: string | null;
  moduleKey: string | null;
  app: UnifiedProductChannelState;
  sale: UnifiedProductChannelState;
  /** Customer reference price — planned until billing catalog is live. */
  customerPrice: {
    currency: string;
    fromMonthly: number | null;
    fromYearly: number | null;
    status: "planned_not_stripe_live" | "live" | "unavailable";
  };
  /**
   * Data-driven variants (plans). Quotas are quantities, not prices.
   * Empty when the product has no packaged variants yet.
   */
  variants: ProductVariantDefinition[];
  /**
   * Partner/Platform commission model from Core SALE row.
   * APP customer storefronts must strip this before client payload (use `toAppStorefrontProduct`).
   */
  commission: ProductCatalogCommissionModel;
  /** Core CSP row id when present. */
  coreProductId: string | null;
  purchaseReadiness: ProductCatalogPurchaseReadiness;
  /** Authoritative entitlement hint for this workspace when provided. */
  entitlementActive: boolean;
  updatedAt: string | null;
};
