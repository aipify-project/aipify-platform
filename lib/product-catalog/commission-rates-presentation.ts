/**
 * Read-only Provisjonspriser presentation — Feature owner: PLATFORM ADMIN.
 * Groups Core variant commission versions per product. Never invents prices or legacy fallbacks.
 * null slots are absent from Core list; explicit 0 remains 0. Percent estimate only when price known.
 */

import { getCanonicalProduct } from "@/lib/product-catalog/registry";
import {
  previewVariantCommissionExVat,
  VARIANT_COMMISSION_PERCENT_BASIS,
  type VariantIntervalCommissionRule,
} from "@/lib/product-catalog/variant-commission";
import type { VariantCommissionListRow } from "@/lib/product-catalog/variant-commission-core";
import type { ProductBillingInterval, ProductVariantDefinition } from "@/lib/product-catalog/variants";
import type { ProductCatalogLocaleCode } from "@/lib/product-catalog/types";

export type CustomerPriceLookupKey = string;

export function customerPriceLookupKey(
  productKey: string,
  variantKey: string,
  interval: ProductBillingInterval,
): CustomerPriceLookupKey {
  return `${productKey}::${variantKey}::${interval}`;
}

export type CustomerPriceHint = {
  amountMajor: number | null;
  currency: string;
  variantLabel: string | null;
};

export function buildCustomerPriceHints(
  productKey: string,
  variants: ProductVariantDefinition[],
): Record<CustomerPriceLookupKey, CustomerPriceHint> {
  const out: Record<CustomerPriceLookupKey, CustomerPriceHint> = {};
  for (const variant of variants) {
    const label = variant.customerLabel?.trim() || variant.adminName?.trim() || variant.variantKey;
    for (const interval of ["month", "year", "one_time"] as const) {
      const price =
        interval === "month"
          ? variant.monthlyPrice
          : interval === "year"
            ? variant.yearlyPrice
            : variant.oneTimePrice;
      out[customerPriceLookupKey(productKey, variant.variantKey, interval)] = {
        amountMajor: price?.amountMajor ?? null,
        currency: (price?.currency || "NOK").toUpperCase(),
        variantLabel: label,
      };
    }
  }
  return out;
}

export type CommissionPresentationStatus = "fixed" | "percent" | "explicit_zero";

export type CommissionPresentationRow = {
  id: string;
  productKey: string;
  productTitle: string;
  variantKey: string;
  variantLabel: string;
  billingInterval: ProductBillingInterval;
  customerPriceMajor: number | null;
  customerPriceCurrency: string | null;
  customerPriceKnown: boolean;
  status: CommissionPresentationStatus;
  amountMajor: number | null;
  ratePct: number | null;
  estimatedAmountMajor: number | null;
  currency: string;
  effectiveFrom: string | null;
  isCurrent: boolean;
  editHref: string;
};

export type CommissionProductSection = {
  productKey: string;
  productTitle: string;
  editHref: string;
  currentRows: CommissionPresentationRow[];
  historicalRows: CommissionPresentationRow[];
};

function productTitleFor(productKey: string, locale: ProductCatalogLocaleCode): string {
  const def = getCanonicalProduct(productKey);
  if (!def) return productKey;
  const copy = def.copy[locale] ?? def.copy.en;
  return copy?.title?.trim() || productKey;
}

function naturalKey(row: VariantCommissionListRow): string {
  return `${row.productKey ?? row.productId}::${row.variantKey}::${row.billingInterval}`;
}

function toRule(row: VariantCommissionListRow): VariantIntervalCommissionRule {
  if (row.model === "percent") {
    return {
      active: row.active,
      model: "percent",
      amountMajor: null,
      ratePct: row.ratePct,
      currency: row.currency,
      percentBasis: VARIANT_COMMISSION_PERCENT_BASIS,
    };
  }
  return {
    active: row.active,
    model: "fixed",
    amountMajor: row.amount,
    ratePct: null,
    currency: row.currency,
    percentBasis: VARIANT_COMMISSION_PERCENT_BASIS,
  };
}

function statusFor(row: VariantCommissionListRow): CommissionPresentationStatus {
  if (row.model === "percent") return "percent";
  if (row.amount === 0) return "explicit_zero";
  return "fixed";
}

/**
 * Build per-product sections. Current = newest effective_from per variant×interval.
 * Historical = older versions only (collapsible in UI). Never invents missing Core rates.
 */
export function buildCommissionRatesPresentation(input: {
  rows: VariantCommissionListRow[];
  priceHints?: Record<CustomerPriceLookupKey, CustomerPriceHint> | null;
  locale?: ProductCatalogLocaleCode;
}): CommissionProductSection[] {
  const locale = input.locale ?? "en";
  const hints = input.priceHints ?? {};
  const sorted = [...input.rows].sort((a, b) => {
    const ak = a.productKey ?? a.productId;
    const bk = b.productKey ?? b.productId;
    if (ak !== bk) return ak.localeCompare(bk);
    if (a.variantKey !== b.variantKey) return a.variantKey.localeCompare(b.variantKey);
    if (a.billingInterval !== b.billingInterval) {
      return a.billingInterval.localeCompare(b.billingInterval);
    }
    const at = a.effectiveFrom ?? "";
    const bt = b.effectiveFrom ?? "";
    return bt.localeCompare(at);
  });

  const seenCurrent = new Set<string>();
  const byProduct = new Map<string, CommissionProductSection>();

  for (const row of sorted) {
    const productKey = (row.productKey ?? "").trim() || row.productId;
    const title = productTitleFor(productKey, locale);
    const editHref = `/platform/sellers/products/${encodeURIComponent(productKey)}`;
    const key = naturalKey(row);
    const isCurrent = !seenCurrent.has(key);
    if (isCurrent) seenCurrent.add(key);

    const hint = hints[customerPriceLookupKey(productKey, row.variantKey, row.billingInterval)];
    const customerPriceMajor =
      hint && hint.amountMajor != null && Number.isFinite(hint.amountMajor) ? hint.amountMajor : null;
    const customerPriceKnown = customerPriceMajor != null;
    const rule = toRule(row);
    const preview = previewVariantCommissionExVat({
      rule,
      priceAmountMajor: customerPriceMajor,
    });
    const status = statusFor(row);
    const presentation: CommissionPresentationRow = {
      id: row.id,
      productKey,
      productTitle: title,
      variantKey: row.variantKey,
      variantLabel: hint?.variantLabel?.trim() || row.variantKey,
      billingInterval: row.billingInterval,
      customerPriceMajor,
      customerPriceCurrency: hint?.currency ?? row.currency,
      customerPriceKnown,
      status,
      amountMajor: row.model === "fixed" ? row.amount : null,
      ratePct: row.model === "percent" ? row.ratePct : null,
      estimatedAmountMajor:
        row.model === "percent" && customerPriceKnown && preview.amountMajor != null
          ? preview.amountMajor
          : null,
      currency: row.currency,
      effectiveFrom: row.effectiveFrom,
      isCurrent,
      editHref,
    };

    let section = byProduct.get(productKey);
    if (!section) {
      section = {
        productKey,
        productTitle: title,
        editHref,
        currentRows: [],
        historicalRows: [],
      };
      byProduct.set(productKey, section);
    }
    if (isCurrent) section.currentRows.push(presentation);
    else section.historicalRows.push(presentation);
  }

  return [...byProduct.values()].sort((a, b) => a.productKey.localeCompare(b.productKey));
}

/** True when a billing period has a configured customer price (incl. explicit 0). */
export function isConfiguredBillingPeriodPrice(
  amountMajor: number | null | undefined,
): boolean {
  return amountMajor != null && Number.isFinite(amountMajor);
}
