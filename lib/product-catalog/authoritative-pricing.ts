/**
 * Authoritative Core variant pricing for Product Center / APP / SALE surfaces.
 * Source: get_csp_product_variants_bundle → csp_product_variants + csp_product_variant_prices.
 * Never treats planned/hardcoded catalog prices as Core truth once Core has been resolved.
 * null / missing amount ≠ 0. Explicit 0 is valid. APP must strip commission.
 */

import { callCspRpc, type CspRpcClient } from "@/lib/certified-sales-partner/core-rpc";
import {
  mapCoreBundleToVariantDefinitions,
  type CoreVariantsBundle,
} from "@/lib/product-catalog/variant-commission-core";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog/types";
import type { ProductVariantDefinition, ProductVariantPrice } from "@/lib/product-catalog/variants";

export const AUTHORITATIVE_PRICING_RPC = "get_csp_product_variants_bundle" as const;

function stripPriceCommission(price: ProductVariantPrice | null): ProductVariantPrice | null {
  if (!price) return null;
  return { ...price, commission: null };
}

/** Remove seller commission from variant prices (APP customer surfaces). */
export function stripVariantCommission(
  variants: ProductVariantDefinition[],
): ProductVariantDefinition[] {
  return variants.map((variant) => ({
    ...variant,
    monthlyPrice: stripPriceCommission(variant.monthlyPrice),
    yearlyPrice: stripPriceCommission(variant.yearlyPrice),
    oneTimePrice: stripPriceCommission(variant.oneTimePrice),
  }));
}

/**
 * Derive customer reference price from Core variants only.
 * Does not invent amounts. Explicit 0 is kept. Missing → unavailable.
 */
export function deriveCustomerPriceFromCoreVariants(
  variants: ProductVariantDefinition[],
): UnifiedCatalogProduct["customerPrice"] {
  const active = variants.filter((v) => v.active);
  const monthAmounts = active
    .map((v) => v.monthlyPrice?.amountMajor)
    .filter((a): a is number => typeof a === "number" && Number.isFinite(a));
  const yearAmounts = active
    .map((v) => v.yearlyPrice?.amountMajor)
    .filter((a): a is number => typeof a === "number" && Number.isFinite(a));
  const currency =
    active.find((v) => v.monthlyPrice?.currency)?.monthlyPrice?.currency ||
    active.find((v) => v.yearlyPrice?.currency)?.yearlyPrice?.currency ||
    active.find((v) => v.oneTimePrice?.currency)?.oneTimePrice?.currency ||
    "NOK";

  if (monthAmounts.length === 0 && yearAmounts.length === 0) {
    return {
      currency: currency.toUpperCase(),
      fromMonthly: null,
      fromYearly: null,
      status: "unavailable",
    };
  }

  return {
    currency: currency.toUpperCase(),
    fromMonthly: monthAmounts.length > 0 ? Math.min(...monthAmounts) : null,
    fromYearly: yearAmounts.length > 0 ? Math.min(...yearAmounts) : null,
    // Core-sourced reference; checkout remains fail-closed until purchasable.
    status: "planned_not_stripe_live",
  };
}

const UNAVAILABLE_PRICE: UnifiedCatalogProduct["customerPrice"] = {
  currency: "NOK",
  fromMonthly: null,
  fromYearly: null,
  status: "unavailable",
};

/**
 * When Core variant read succeeded, replace planned/registry prices with Core rows.
 * Missing product keys after a successful resolve → honest empty variants (never planned fallback).
 */
export function applyAuthoritativeCorePricing(input: {
  products: UnifiedCatalogProduct[];
  coreVariantsByKey: Record<string, ProductVariantDefinition[]> | null | undefined;
  /** True after a successful Core variants read for this catalog request. */
  coreVariantsResolved: boolean;
  /** APP must strip; SALE may keep configured commission on prices. */
  stripCommission: boolean;
}): UnifiedCatalogProduct[] {
  if (!input.coreVariantsResolved) {
    return input.products;
  }
  const map = input.coreVariantsByKey ?? {};
  return input.products.map((product) => {
    const raw = map[product.productKey];
    const hasCoreRow = Object.prototype.hasOwnProperty.call(map, product.productKey);
    const coreVariants = hasCoreRow ? raw ?? [] : [];
    const variants = input.stripCommission
      ? stripVariantCommission(coreVariants)
      : coreVariants;
    return {
      ...product,
      variants,
      customerPrice: deriveCustomerPriceFromCoreVariants(variants),
      // APP never carries partner commission on the product model either.
      commission: input.stripCommission ? { kind: "unknown" as const } : product.commission,
    };
  });
}

/** Load Core variant+price bundles for product keys — no persist gate. */
export async function loadAuthoritativeVariantsForProducts(
  supabase: CspRpcClient,
  productKeys: string[],
): Promise<
  | {
      ok: true;
      variantsByProductKey: Record<string, ProductVariantDefinition[]>;
      failedKeys: string[];
    }
  | { ok: false; error: string }
> {
  const unique = [...new Set(productKeys.map((k) => k.trim()).filter(Boolean))];
  const variantsByProductKey: Record<string, ProductVariantDefinition[]> = {};
  const failedKeys: string[] = [];

  for (const productKey of unique) {
    const result = await callCspRpc<CoreVariantsBundle>(supabase, AUTHORITATIVE_PRICING_RPC, {
      p_product_key: productKey,
    });
    if (!result.ready) {
      failedKeys.push(productKey);
      continue;
    }
    const bundle = (result.data ?? {}) as CoreVariantsBundle;
    variantsByProductKey[productKey] = mapCoreBundleToVariantDefinitions(bundle, productKey);
  }

  // Partial failures: still ok with failedKeys listed — caller decides fail-closed vs partial.
  if (unique.length > 0 && failedKeys.length === unique.length) {
    return { ok: false, error: "variants_bundle_unavailable" };
  }

  return { ok: true, variantsByProductKey, failedKeys };
}

export function isExplicitZeroAmount(amount: number | null | undefined): boolean {
  return amount === 0;
}

export function isMissingAmount(amount: number | null | undefined): boolean {
  return amount == null || !Number.isFinite(amount);
}
