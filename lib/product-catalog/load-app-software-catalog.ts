/**
 * Shared APP software catalog loader — list + detail pages.
 * Feature owner: CUSTOMER APP.
 */

import { createClient } from "@/lib/supabase/server";
import { loadSubscriptionProductReads } from "@/lib/commercial-packages/load-kompis-product-access";
import {
  buildUnifiedCatalog,
  filterAppStoreProducts,
  loadAppStoreCoreProducts,
  type ProductCatalogLocaleCode,
  type UnifiedCatalogProduct,
} from "@/lib/product-catalog";
import {
  applyAuthoritativeCorePricing,
  loadAuthoritativeVariantsForProducts,
} from "@/lib/product-catalog/authoritative-pricing";
import { enrichCatalogProductsWithApprovedMedia } from "@/lib/product-catalog/content-media-enrich";

export type AppSoftwareCatalogLoad = {
  products: UnifiedCatalogProduct[];
  coreChannelApplied: boolean;
  corePending: boolean;
  activeProductKeys: Set<string>;
};

export async function loadAppSoftwareCatalog(
  locale: ProductCatalogLocaleCode,
): Promise<AppSoftwareCatalogLoad> {
  const [productReads, supabase] = await Promise.all([
    loadSubscriptionProductReads(),
    createClient(),
  ]);
  const access = productReads.access;
  const webActive = access.webKind === "known_plan" && Boolean(access.webPlan);
  const bedriftActive = access.bedrift === "licensed";

  const coreLoad = await loadAppStoreCoreProducts(supabase);
  const coreChannelApplied = coreLoad.ok;
  const coreProducts = coreLoad.ok ? coreLoad.products : null;

  let products = filterAppStoreProducts(
    buildUnifiedCatalog({
      locale,
      coreProducts,
      coreChannelApplied,
      entitlements: [
        { productKey: "kompis_web", active: webActive },
        { productKey: "kompis_bedrift", active: bedriftActive },
      ],
    }),
  );

  let corePending = !coreLoad.ok && coreLoad.reason === "missing";

  if (coreChannelApplied && products.length > 0) {
    const loaded = await loadAuthoritativeVariantsForProducts(
      supabase,
      products.map((p) => p.productKey),
    );
    if (loaded.ok) {
      const map = { ...loaded.variantsByProductKey };
      for (const product of products) {
        if (!Object.prototype.hasOwnProperty.call(map, product.productKey)) {
          map[product.productKey] = [];
        }
      }
      products = applyAuthoritativeCorePricing({
        products,
        coreVariantsByKey: map,
        coreVariantsResolved: true,
        stripCommission: true,
      });
      if (loaded.failedKeys.length > 0) corePending = true;
    } else {
      products = applyAuthoritativeCorePricing({
        products,
        coreVariantsByKey: Object.fromEntries(products.map((p) => [p.productKey, []])),
        coreVariantsResolved: true,
        stripCommission: true,
      });
      corePending = true;
    }

    try {
      products = await enrichCatalogProductsWithApprovedMedia(supabase, {
        products,
        locale,
        channel: "app",
      });
    } catch {
      // Soft-fail: registry presentation only.
    }
  }

  const activeProductKeys = new Set(
    products.filter((p) => p.entitlementActive).map((p) => p.productKey),
  );

  return { products, coreChannelApplied, corePending, activeProductKeys };
}
