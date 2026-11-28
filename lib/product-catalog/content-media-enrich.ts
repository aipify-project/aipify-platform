/**
 * Server-side enrichment: Core approved locale + short-lived signed media.
 * Keep I/O here so pure presentation helpers stay unit-testable without Supabase.
 */

import type { CspRpcClient } from "@/lib/certified-sales-partner/core-rpc";
import {
  enrichUnifiedCatalogProduct,
  type EnrichedCatalogProduct,
} from "./content-media-presentation";
import {
  loadApprovedProductContent,
  type ApprovedProductContent,
  type ProductContentChannel,
} from "./locale-media-core";
import { createChannelProductMediaSignedUrl } from "./product-media-signed-url";
import type { UnifiedCatalogProduct } from "./types";

export async function loadApprovedContentForProducts(
  supabase: CspRpcClient,
  input: {
    productKeys: string[];
    locale: string;
    channel: ProductContentChannel;
  },
): Promise<Map<string, ApprovedProductContent | null>> {
  const out = new Map<string, ApprovedProductContent | null>();
  const keys = [...new Set(input.productKeys.map((k) => k.trim().toLowerCase()).filter(Boolean))];
  await Promise.all(
    keys.map(async (productKey) => {
      const loaded = await loadApprovedProductContent(supabase, {
        productKey,
        locale: input.locale,
        channel: input.channel,
      });
      out.set(productKey, loaded.ok ? loaded.content : null);
    }),
  );
  return out;
}

/**
 * Enrich catalog products with Core approved locale copy + short-lived signed media.
 * Fail soft per product: RPC/sign errors leave registry fallback; never invent prices/URLs.
 */
export async function enrichCatalogProductsWithApprovedMedia(
  supabase: CspRpcClient,
  input: {
    products: UnifiedCatalogProduct[];
    locale: string;
    channel: ProductContentChannel;
  },
): Promise<EnrichedCatalogProduct[]> {
  if (input.products.length === 0) return [];
  const approvedMap = await loadApprovedContentForProducts(supabase, {
    productKeys: input.products.map((p) => p.productKey),
    locale: input.locale,
    channel: input.channel,
  });

  return Promise.all(
    input.products.map(async (product) => {
      const approved = approvedMap.get(product.productKey) ?? null;
      let signedLogoUrl: string | null = null;
      let signedHeroUrl: string | null = null;
      if (approved && !approved.contentMissing) {
        if (approved.logoPath) {
          const logo = await createChannelProductMediaSignedUrl({
            supabase,
            productKey: product.productKey,
            locale: input.locale,
            channel: input.channel,
            kind: "logo",
          });
          if (logo.ok) signedLogoUrl = logo.url;
        }
        if (approved.heroPath) {
          const hero = await createChannelProductMediaSignedUrl({
            supabase,
            productKey: product.productKey,
            locale: input.locale,
            channel: input.channel,
            kind: "hero",
          });
          if (hero.ok) signedHeroUrl = hero.url;
        }
      }
      return enrichUnifiedCatalogProduct({
        product,
        approved,
        signedLogoUrl,
        signedHeroUrl,
      });
    }),
  );
}
