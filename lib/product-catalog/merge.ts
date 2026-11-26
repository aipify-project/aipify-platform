import { KOMPIS_WEB_PLANNED_CATALOG } from "@/lib/certified-sales-partner/academy/kompis-web-lessons";
import { PERCENT_COMMISSION_BLOCKED_REASON } from "./percent-commission-contract";
import { getCanonicalProduct, CANONICAL_PRODUCT_REGISTRY } from "./registry";
import type {
  ProductCatalogLocaleCode,
  UnifiedCatalogProduct,
  UnifiedProductChannelState,
} from "./types";

export type CoreSalesProductRow = {
  id: string;
  productKey: string;
  title?: string | null;
  currency: string | null;
  fixedCommissionAmount: number | null;
  published: boolean;
  updatedAt?: string | null;
  /**
   * Present only after Core channel SQL. `null`/`undefined` = column not available —
   * APP visibility may use controlled registry fallback (never pretend Core persisted it).
   */
  publishApp?: boolean | null;
  /** Present only after Core channel SQL; until then SALE uses legacy `published`. */
  publishSale?: boolean | null;
};

export type AppEntitlementHint = {
  productKey: string;
  active: boolean;
};

function resolveCopy(
  def: ReturnType<typeof getCanonicalProduct>,
  locale: ProductCatalogLocaleCode
) {
  if (!def) {
    return {
      title: "Unknown product",
      tagline: "",
      description: "",
      localeApproved: false,
    };
  }
  const exact = def.copy[locale];
  if (exact) return exact;
  const en = def.copy.en;
  if (en) {
    return { ...en, localeApproved: false };
  }
  return {
    title: def.productKey,
    tagline: "",
    description: "",
    localeApproved: false,
  };
}

/**
 * APP channel: Core `publish_app` wins when present.
 * If a Core product row exists but the channel flag is absent from the payload,
 * never invent APP publication from registry defaults (Platform overview may omit
 * the flag until channel RPC enrichment lands).
 * Registry fallback applies only when there is no Core product row at all.
 */
function appChannel(
  def: NonNullable<ReturnType<typeof getCanonicalProduct>>,
  core: CoreSalesProductRow | undefined
): UnifiedProductChannelState {
  if (core && typeof core.publishApp === "boolean") {
    return core.publishApp
      ? { status: "published", visibleInStore: true, source: "core" }
      : { status: "unpublished", visibleInStore: false, source: "core" };
  }
  if (core) {
    return {
      status: "blocked_needs_sql",
      visibleInStore: false,
      source: "none",
    };
  }
  if (def.defaultAppPublished) {
    return {
      status: "blocked_needs_sql",
      visibleInStore: true,
      source: "registry_fallback",
    };
  }
  return { status: "unpublished", visibleInStore: false, source: "none" };
}

function saleChannel(
  def: NonNullable<ReturnType<typeof getCanonicalProduct>>,
  core: CoreSalesProductRow | undefined
): UnifiedProductChannelState {
  if (core) {
    const salePublished =
      typeof core.publishSale === "boolean" ? core.publishSale : core.published;
    return salePublished
      ? { status: "published", visibleInStore: true, source: "core" }
      : { status: "draft", visibleInStore: false, source: "core" };
  }
  if (def.defaultSaleEligible) {
    return { status: "not_configured", visibleInStore: false, source: "none" };
  }
  return { status: "unpublished", visibleInStore: false, source: "none" };
}

function customerPrice(productKey: string): UnifiedCatalogProduct["customerPrice"] {
  if (productKey === "kompis_web") {
    return {
      currency: KOMPIS_WEB_PLANNED_CATALOG.currency,
      fromMonthly: KOMPIS_WEB_PLANNED_CATALOG.standard.monthlyPriceNok,
      status: "planned_not_stripe_live",
    };
  }
  return { currency: "NOK", fromMonthly: null, status: "unavailable" };
}

function purchaseReadiness(
  productKey: string,
  entitlement: AppEntitlementHint | undefined
): UnifiedCatalogProduct["purchaseReadiness"] {
  if (entitlement?.active) return "active_open";
  // Checkout is fail-closed in Production for these products today.
  if (productKey === "aipify_voice") return "info_only";
  return "contact";
}

function resolveCommission(core: CoreSalesProductRow | undefined): UnifiedCatalogProduct["commission"] {
  if (core?.fixedCommissionAmount != null && core.currency) {
    return {
      kind: "fixed",
      amount: core.fixedCommissionAmount,
      currency: core.currency,
    };
  }
  // Percent is never synthesised — callers may show blocked UI via helper below.
  return { kind: "unknown" };
}

/** Explicit blocked percent model for Platform honesty (never computed in UI). */
export function blockedPercentCommission(): Extract<
  UnifiedCatalogProduct["commission"],
  { kind: "percent" }
> {
  return { kind: "percent", blockedReason: PERCENT_COMMISSION_BLOCKED_REASON };
}

/**
 * Merge canonical registry with Core SALE rows and optional APP entitlements.
 * Does not invent Core APP publication — registry fallback is labelled explicitly.
 */
export function buildUnifiedCatalog(input: {
  locale: ProductCatalogLocaleCode;
  coreProducts?: CoreSalesProductRow[] | null;
  entitlements?: AppEntitlementHint[];
}): UnifiedCatalogProduct[] {
  const coreByKey = new Map((input.coreProducts ?? []).map((row) => [row.productKey, row]));
  const entitlementByKey = new Map((input.entitlements ?? []).map((row) => [row.productKey, row]));

  return CANONICAL_PRODUCT_REGISTRY.map((def) => {
    const core = coreByKey.get(def.productKey);
    const copy = resolveCopy(def, input.locale);
    const entitlement = entitlementByKey.get(def.productKey);
    return {
      productKey: def.productKey,
      sku: def.sku,
      category: def.category,
      title: copy.title,
      tagline: copy.tagline,
      description: copy.description,
      localeApproved: copy.localeApproved,
      logoSrc: def.logoSrc,
      heroImagePath: def.heroImagePath,
      accent: def.accent,
      letter: def.letter,
      openHref: def.openHref,
      moduleKey: def.moduleKey,
      app: appChannel(def, core),
      sale: saleChannel(def, core),
      customerPrice: customerPrice(def.productKey),
      commission: resolveCommission(core),
      coreProductId: core?.id ?? null,
      purchaseReadiness: purchaseReadiness(def.productKey, entitlement),
      updatedAt: core?.updatedAt ?? null,
    };
  });
}

export function filterAppStoreProducts(products: UnifiedCatalogProduct[]): UnifiedCatalogProduct[] {
  return products.filter((p) => p.app.visibleInStore);
}

export function filterSalesCatalogProducts(products: UnifiedCatalogProduct[]): UnifiedCatalogProduct[] {
  return products.filter((p) => p.sale.visibleInStore);
}

export function assertChannelIsolation(products: UnifiedCatalogProduct[]): {
  appOnlyKeys: string[];
  saleOnlyKeys: string[];
  registryFallbackAppKeys: string[];
} {
  const appOnlyKeys = products
    .filter((p) => p.app.visibleInStore && !p.sale.visibleInStore)
    .map((p) => p.productKey);
  const saleOnlyKeys = products
    .filter((p) => p.sale.visibleInStore && !p.app.visibleInStore)
    .map((p) => p.productKey);
  const registryFallbackAppKeys = products
    .filter((p) => p.app.source === "registry_fallback")
    .map((p) => p.productKey);
  return { appOnlyKeys, saleOnlyKeys, registryFallbackAppKeys };
}
