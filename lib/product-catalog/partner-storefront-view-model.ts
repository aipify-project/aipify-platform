/**
 * Partner SALE storefront view-model — Feature owner: CUSTOMER APP / AIPIFY PARTNER.
 *
 * Authoritative listing = csp_get_partner_overview products (publish_sale / published only).
 * Reuses buildUnifiedCatalog + filterSalesCatalogProducts + PremiumProductCatalogCard mode=sale.
 * Never seeds registry products when Core returns an empty published SALE set.
 * Commission attaches separately via partner-variant-commission-read (not APP view-model).
 */

import {
  buildUnifiedCatalog,
  filterSalesCatalogProducts,
  type CoreSalesProductRow,
} from "@/lib/product-catalog/merge";
import { applyAuthoritativeCorePricing } from "@/lib/product-catalog/authoritative-pricing";
import { PARTNER_STOREFRONT_REUSE_CONTRACT } from "@/lib/product-catalog/app-storefront-view-model";
import type { ProductCatalogLocaleCode, UnifiedCatalogProduct } from "@/lib/product-catalog/types";
import type { ProductVariantDefinition } from "@/lib/product-catalog/variants";
import type { CspOverviewProduct } from "@/lib/certified-sales-partner/partner-overview";

export { PARTNER_STOREFRONT_REUSE_CONTRACT };

export type PartnerStorefrontFilter = "all" | "kompis" | "voice";

export type PartnerStorefrontViewModel = {
  /** Core overview answered; listing is Core-authoritative (may be empty). */
  coreChannelApplied: boolean;
  dependencySemantics: "all";
  products: UnifiedCatalogProduct[];
  empty: boolean;
  /** True when Core overview was ready but published no SALE products. */
  authoritativeEmpty: boolean;
};

/** Map partner overview product rows into CoreSalesProductRow for unified merge. */
export function overviewProductsToCoreRows(
  products: readonly CspOverviewProduct[],
): CoreSalesProductRow[] {
  const rows: CoreSalesProductRow[] = [];
  for (const row of products) {
    if (!row.productKey) continue;
    rows.push({
      id: row.id ?? row.productKey,
      productKey: row.productKey,
      title: null,
      currency: row.currency,
      fixedCommissionAmount: row.fixedCommissionAmount,
      published: true,
      publishSale: true,
      publishApp: null,
    });
  }
  return rows;
}

export function matchesPartnerStorefrontFilter(
  product: UnifiedCatalogProduct,
  filter: PartnerStorefrontFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "kompis") {
    return (
      product.category === "kompis" ||
      product.storeCategoryId === "kompis" ||
      product.productKey.startsWith("kompis_")
    );
  }
  if (filter === "voice") {
    return product.category === "voice" || product.productKey === "aipify_voice";
  }
  return true;
}

/**
 * Build SALE catalog for sellers from Core overview products only.
 * No registry seeding when Core list is empty — honest empty storefront.
 */
export function buildPartnerStorefrontViewModel(input: {
  locale: ProductCatalogLocaleCode;
  overviewProducts: readonly CspOverviewProduct[];
  /** When false, caller should show error/not-ready — never invent an empty success. */
  coreReady: boolean;
  categoryFilter?: PartnerStorefrontFilter | null;
  /** Optional Core variants overlay (from get_csp_product_variants_bundle). */
  coreVariantsByKey?: Record<string, ProductVariantDefinition[]> | null;
  /**
   * True after a successful Core variants read for this request.
   * When true, planned/hardcoded prices are never kept as fallback.
   */
  coreVariantsResolved?: boolean;
}): PartnerStorefrontViewModel {
  if (!input.coreReady) {
    return {
      coreChannelApplied: false,
      dependencySemantics: "all",
      products: [],
      empty: true,
      authoritativeEmpty: false,
    };
  }

  const coreRows = overviewProductsToCoreRows(input.overviewProducts);
  const unified = buildUnifiedCatalog({
    locale: input.locale,
    coreProducts: coreRows,
    // SALE listing is Core-authoritative for published keys only.
    coreChannelApplied: true,
  });
  let products = filterSalesCatalogProducts(unified);

  // Never APP-only: drop anything that lost sale visibility after merge.
  products = products.filter((p) => p.sale.visibleInStore && p.sale.source === "core");

  const coreVariantsResolved = input.coreVariantsResolved === true;
  if (coreVariantsResolved) {
    // Ensure every SALE product key exists in the map so missing Core rows clear planned prices.
    const map: Record<string, ProductVariantDefinition[]> = {
      ...(input.coreVariantsByKey ?? {}),
    };
    for (const product of products) {
      if (!Object.prototype.hasOwnProperty.call(map, product.productKey)) {
        map[product.productKey] = [];
      }
    }
    products = applyAuthoritativeCorePricing({
      products,
      coreVariantsByKey: map,
      coreVariantsResolved: true,
      stripCommission: false,
    });
  }

  const filter = input.categoryFilter ?? "all";
  const filtered = products.filter((p) => matchesPartnerStorefrontFilter(p, filter));

  return {
    coreChannelApplied: true,
    dependencySemantics: "all",
    products: filtered,
    empty: filtered.length === 0,
    authoritativeEmpty: coreRows.length === 0,
  };
}

/** Product-level fixed commission for marked estimate only — never automatic variant rate. */
export function productLevelCommissionEstimate(
  product: UnifiedCatalogProduct,
): { amount: number; currency: string } | null {
  if (product.commission.kind !== "fixed") return null;
  if (!Number.isFinite(product.commission.amount)) return null;
  return { amount: product.commission.amount, currency: product.commission.currency };
}
