/**
 * APP customer storefront view-model — Feature owner: CUSTOMER APP.
 *
 * Shared presentation contract for Agent 1 Partner reuse:
 * - APP mode strips commission and keeps checkout fail-closed CTAs.
 * - SALE/Partner mode may attach seller-authorized commission + Info/Del separately
 *   via PremiumProductCatalogCard mode="sale" (no seller buy button).
 *
 * Authoritative APP listing = csp_list_app_store_products (publish_app + master_active).
 */

import { resolveStoreCategoryId, sortStoreCategoryIds } from "@/lib/app-portal/customer-catalog/categories";
import type { UnifiedCatalogProduct } from "./types";
import { resolveAppCheckoutCta, type CatalogCheckoutCta } from "./checkout-readiness";

export type AppStorefrontProduct = {
  productKey: string;
  title: string;
  tagline: string;
  description: string;
  storeCategoryId: string;
  productType: string | null;
  dependsOnProductKeys: string[];
  dependencySemantics: "all";
  logoSrc: string | null;
  heroImagePath: string | null;
  localeApproved: boolean;
  entitlementActive: boolean;
  purchaseReadiness: UnifiedCatalogProduct["purchaseReadiness"];
  /** Never includes partner commission. */
  customerPrice: UnifiedCatalogProduct["customerPrice"];
  variants: UnifiedCatalogProduct["variants"];
  openHref: string | null;
  /** Checkout CTA sealed fail-closed for recommended/default interval. */
  checkoutCta: CatalogCheckoutCta;
};

export type AppStorefrontViewModel = {
  coreChannelApplied: boolean;
  dependencySemantics: "all";
  products: AppStorefrontProduct[];
  categories: string[];
  empty: boolean;
};

/** Strip commission and seal checkout CTA for APP customers. */
export function toAppStorefrontProduct(
  product: UnifiedCatalogProduct,
): AppStorefrontProduct {
  const variants = product.variants.filter((v) => v.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const recommended = variants.find((v) => v.recommended) ?? variants[0] ?? null;
  return {
    productKey: product.productKey,
    title: product.title,
    tagline: product.tagline,
    description: product.description,
    storeCategoryId: resolveStoreCategoryId({
      productKey: product.productKey,
      category: product.storeCategoryId || product.category,
    }),
    productType: product.productType,
    dependsOnProductKeys: product.dependsOnProductKeys,
    dependencySemantics: "all",
    logoSrc: product.logoSrc,
    heroImagePath: product.heroImagePath,
    localeApproved: product.localeApproved,
    entitlementActive: product.entitlementActive,
    purchaseReadiness: product.purchaseReadiness,
    customerPrice: product.customerPrice,
    variants: product.variants,
    openHref: product.openHref,
    checkoutCta: resolveAppCheckoutCta({
      product,
      variant: recommended,
      interval: "month",
    }),
  };
}

export function buildAppStorefrontViewModel(input: {
  products: UnifiedCatalogProduct[];
  coreChannelApplied: boolean;
  categoryFilter?: string | null;
}): AppStorefrontViewModel {
  const mapped = input.products.map(toAppStorefrontProduct);
  const categories = sortStoreCategoryIds([
    "all",
    ...mapped.map((p) => p.storeCategoryId),
  ]);
  const filter = (input.categoryFilter ?? "all").trim().toLowerCase() || "all";
  const products =
    filter === "all" ? mapped : mapped.filter((p) => p.storeCategoryId === filter);

  return {
    coreChannelApplied: input.coreChannelApplied,
    dependencySemantics: "all",
    products,
    categories,
    empty: products.length === 0,
  };
}

/**
 * Partner reuse notes (Agent 1):
 * - Reuse PremiumProductCatalogCard with mode="sale".
 * - Attach seller-authorized variant commission from Partner-only RPCs — never from APP view-model.
 * - Show Info/Del; never a seller buy button.
 * - Customer prices/variants/images come from the same UnifiedCatalogProduct fields.
 */
export const PARTNER_STOREFRONT_REUSE_CONTRACT = {
  sharedCard: "components/shared/product-catalog/PremiumProductCatalogCard.tsx",
  appViewModel: "lib/product-catalog/app-storefront-view-model.ts",
  appModeStripsCommission: true,
  partnerModeAllowsCommission: true,
  noSellerBuyButton: true,
  dependencySemantics: "all",
} as const;
