import { KOMPIS_WEB_PLANNED_CATALOG } from "@/lib/certified-sales-partner/academy/kompis-web-lessons";
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

function appChannel(def: NonNullable<ReturnType<typeof getCanonicalProduct>>): UnifiedProductChannelState {
  if (def.defaultAppPublished) {
    return { status: "published", visibleInStore: true };
  }
  return { status: "unpublished", visibleInStore: false };
}

function saleChannel(
  def: NonNullable<ReturnType<typeof getCanonicalProduct>>,
  core: CoreSalesProductRow | undefined
): UnifiedProductChannelState {
  if (core) {
    return core.published
      ? { status: "published", visibleInStore: true }
      : { status: "draft", visibleInStore: false };
  }
  if (def.defaultSaleEligible) {
    return { status: "not_configured", visibleInStore: false };
  }
  return { status: "unpublished", visibleInStore: false };
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

/**
 * Merge canonical registry with Core SALE rows and optional APP entitlements.
 * Does not invent Core publication — SALE visibility requires Core `published` when a row exists.
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
      app: appChannel(def),
      sale: saleChannel(def, core),
      customerPrice: customerPrice(def.productKey),
      commission:
        core?.fixedCommissionAmount != null && core.currency
          ? {
              kind: "fixed" as const,
              amount: core.fixedCommissionAmount,
              currency: core.currency,
            }
          : ({ kind: "unknown" } as const),
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
} {
  const appOnlyKeys = products
    .filter((p) => p.app.visibleInStore && !p.sale.visibleInStore)
    .map((p) => p.productKey);
  const saleOnlyKeys = products
    .filter((p) => p.sale.visibleInStore && !p.app.visibleInStore)
    .map((p) => p.productKey);
  return { appOnlyKeys, saleOnlyKeys };
}
