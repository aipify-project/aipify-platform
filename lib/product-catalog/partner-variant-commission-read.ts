/**
 * Partner-safe read of variant × interval commission from Core.
 * Uses get_csp_product_variants_bundle (authenticated) — no persist gate,
 * no list_csp_variant_commission_rates (platform-admin only).
 *
 * Never treats legacy product-level fixed commission as an automatic variant rate.
 */

import { callCspRpc, type CspRpcClient } from "@/lib/certified-sales-partner/core-rpc";
import {
  isConfiguredVariantCommissionRule,
  type VariantIntervalCommissionRule,
} from "@/lib/product-catalog/variant-commission";
import {
  mapCoreBundleToVariantDefinitions,
  type CoreVariantsBundle,
} from "@/lib/product-catalog/variant-commission-core";
import { variantHasPaidCustomerPrice } from "@/lib/product-catalog/quota-labels";
import {
  priceForInterval,
  type ProductBillingInterval,
  type ProductVariantDefinition,
} from "@/lib/product-catalog/variants";

export type PartnerCommissionStatus =
  | "fixed"
  | "percent"
  | "explicit_zero"
  | "not_configured"
  | "free_variant";

export type PartnerVariantCommissionSlot = {
  productKey: string;
  variantKey: string;
  billingInterval: ProductBillingInterval;
  status: PartnerCommissionStatus;
  amountMajor: number | null;
  ratePct: number | null;
  currency: string | null;
};

export function partnerCommissionLookupKey(
  productKey: string,
  variantKey: string,
  interval: ProductBillingInterval,
): string {
  return `${productKey}::${variantKey}::${interval}`;
}

/** Map a Core-attached price.commission rule into a seller display slot. */
export function slotFromIntervalRule(input: {
  productKey: string;
  variantKey: string;
  billingInterval: ProductBillingInterval;
  rule: VariantIntervalCommissionRule | null | undefined;
}): PartnerVariantCommissionSlot {
  const { productKey, variantKey, billingInterval, rule } = input;
  if (!isConfiguredVariantCommissionRule(rule) || rule.active === false) {
    return {
      productKey,
      variantKey,
      billingInterval,
      status: "not_configured",
      amountMajor: null,
      ratePct: null,
      currency: null,
    };
  }
  if (rule.model === "percent") {
    return {
      productKey,
      variantKey,
      billingInterval,
      status: "percent",
      amountMajor: null,
      ratePct: rule.ratePct,
      currency: rule.currency,
    };
  }
  const amount = rule.amountMajor != null && Number.isFinite(rule.amountMajor) ? rule.amountMajor : null;
  if (amount === 0) {
    return {
      productKey,
      variantKey,
      billingInterval,
      status: "explicit_zero",
      amountMajor: 0,
      ratePct: null,
      currency: rule.currency,
    };
  }
  return {
    productKey,
    variantKey,
    billingInterval,
    status: "fixed",
    amountMajor: amount,
    ratePct: null,
    currency: rule.currency,
  };
}

export function extractPartnerCommissionSlots(
  productKey: string,
  variants: ProductVariantDefinition[],
): PartnerVariantCommissionSlot[] {
  const slots: PartnerVariantCommissionSlot[] = [];
  for (const variant of variants) {
    for (const interval of ["month", "year", "one_time"] as const) {
      const price = priceForInterval(variant, interval);
      slots.push(
        slotFromIntervalRule({
          productKey,
          variantKey: variant.variantKey,
          billingInterval: interval,
          rule: price?.commission ?? null,
        }),
      );
    }
  }
  return slots;
}

export function indexPartnerCommissionSlots(
  slots: PartnerVariantCommissionSlot[],
): Map<string, PartnerVariantCommissionSlot> {
  const map = new Map<string, PartnerVariantCommissionSlot>();
  for (const slot of slots) {
    map.set(
      partnerCommissionLookupKey(slot.productKey, slot.variantKey, slot.billingInterval),
      slot,
    );
  }
  return map;
}

/**
 * Resolve seller-facing commission text for the selected variant × period.
 * Product-level fixed amounts are never used as automatic variant commission;
 * they may appear only as a clearly marked estimate when the variant slot is unset.
 */
export function resolvePartnerSaleCommissionText(input: {
  variant: ProductVariantDefinition | null;
  interval: "month" | "year";
  slot: PartnerVariantCommissionSlot | null | undefined;
  productLevelEstimate: { amount: number; currency: string } | null;
  locale: string;
  labels: {
    commissionNone: string;
    commissionNotConfigured: string;
    commissionZero: string;
    commissionFixed: string;
    commissionPercent: string;
    commissionEstimate?: string;
    commissionPending: string;
  };
}): string {
  const { variant, interval, slot, productLevelEstimate, locale, labels } = input;
  if (!variant || !variantHasPaidCustomerPrice(variant)) {
    return labels.commissionNone;
  }
  if (!slot || slot.status === "not_configured") {
    const base = labels.commissionNotConfigured;
    if (
      productLevelEstimate &&
      labels.commissionEstimate &&
      Number.isFinite(productLevelEstimate.amount)
    ) {
      const formatted = formatMoney(productLevelEstimate.amount, productLevelEstimate.currency, locale);
      return `${base} · ${labels.commissionEstimate.replace("{amount}", formatted)}`;
    }
    return base;
  }
  if (slot.status === "explicit_zero") {
    const formatted = formatMoney(0, slot.currency || "NOK", locale);
    return labels.commissionZero.replace("{amount}", formatted);
  }
  if (slot.status === "fixed" && slot.amountMajor != null) {
    const formatted = formatMoney(slot.amountMajor, slot.currency || "NOK", locale);
    return labels.commissionFixed
      .replace("{amount}", formatted)
      .replace("{currency}", slot.currency || "NOK");
  }
  if (slot.status === "percent" && slot.ratePct != null) {
    return labels.commissionPercent.replace("{rate}", String(slot.ratePct));
  }
  return labels.commissionPending;
}

function formatMoney(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/** Partner read — no persist gate. Fail closed to empty variants on RPC miss. */
export async function loadPartnerProductVariantsBundle(
  supabase: CspRpcClient,
  productKey: string,
): Promise<
  | { ok: true; bundle: CoreVariantsBundle; variants: ProductVariantDefinition[] }
  | { ok: false; error: string }
> {
  const key = productKey.trim();
  if (!key) return { ok: false, error: "product_key_required" };
  const result = await callCspRpc<CoreVariantsBundle>(supabase, "get_csp_product_variants_bundle", {
    p_product_key: key,
  });
  if (!result.ready) {
    return { ok: false, error: result.error || "variants_bundle_unavailable" };
  }
  const bundle = (result.data ?? {}) as CoreVariantsBundle;
  return {
    ok: true,
    bundle,
    variants: mapCoreBundleToVariantDefinitions(bundle, key),
  };
}

export async function loadPartnerSaleVariantCommissions(
  supabase: CspRpcClient,
  productKeys: string[],
): Promise<{
  variantsByProductKey: Record<string, ProductVariantDefinition[]>;
  slots: PartnerVariantCommissionSlot[];
  failedKeys: string[];
}> {
  const variantsByProductKey: Record<string, ProductVariantDefinition[]> = {};
  const slots: PartnerVariantCommissionSlot[] = [];
  const failedKeys: string[] = [];
  const unique = [...new Set(productKeys.map((k) => k.trim()).filter(Boolean))];
  for (const productKey of unique) {
    const loaded = await loadPartnerProductVariantsBundle(supabase, productKey);
    if (!loaded.ok) {
      failedKeys.push(productKey);
      continue;
    }
    variantsByProductKey[productKey] = loaded.variants;
    slots.push(...extractPartnerCommissionSlots(productKey, loaded.variants));
  }
  return { variantsByProductKey, slots, failedKeys };
}
