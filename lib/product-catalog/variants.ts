/**
 * Product variants + billing periods for Product Center Premium Complete.
 * Quotas are data-driven feature quantities — never treated as prices.
 * Annual price is an independent amount (not 12× monthly).
 */

import { localizeQuotaUnit } from "./quota-labels";

export type ProductBillingInterval = "month" | "year" | "one_time";

export type ProductVariantQuotaKind =
  | "lifetime_total"
  | "monthly_renewing"
  | "annual_pool"
  | "unit_count"
  | "none";

export type ProductVariantPrice = {
  currency: string;
  /** Major units for display (e.g. 599). Never invent Stripe amounts client-side. */
  amountMajor: number | null;
  /** Minor units when known (e.g. 59900 øre). */
  amountMinor: number | null;
  interval: ProductBillingInterval;
  /** Display-only VAT note until checkout contract fixes tax. */
  vatLabel: "unknown" | "inclusive" | "exclusive";
  /** Provider price id when mapped — never create Stripe objects from UI. */
  providerPriceId: string | null;
  purchasable: boolean;
};

export type ProductVariantDefinition = {
  variantKey: string;
  productKey: string;
  /** Admin label */
  adminName: string;
  /** Customer-facing label (e.g. "2 500 svar") */
  customerLabel: string;
  sortOrder: number;
  active: boolean;
  recommended: boolean;
  quotaValue: number | null;
  quotaUnit: string | null;
  quotaKind: ProductVariantQuotaKind;
  /**
   * When true, an annual subscription still renews the quota monthly
   * (Kompis Web standard/pro). Never infer silently in UI.
   */
  annualRenewsQuotaMonthly: boolean;
  monthlyPrice: ProductVariantPrice | null;
  yearlyPrice: ProductVariantPrice | null;
  oneTimePrice: ProductVariantPrice | null;
  features: string[];
};

export type ProductCommissionEditorModel =
  | { mode: "fixed"; amountMajor: number; currency: string }
  | { mode: "percent"; rate: number; blocked: true; reason: "needs_core_contract" };

/** Resolve display amount for a selected interval — never invent from the other period. */
export function priceForInterval(
  variant: ProductVariantDefinition,
  interval: "month" | "year",
): ProductVariantPrice | null {
  return interval === "month" ? variant.monthlyPrice : variant.yearlyPrice;
}

export function formatVariantQuotaLabel(
  variant: ProductVariantDefinition,
  locale: string,
): string {
  if (variant.quotaValue == null) return variant.customerLabel;
  try {
    const qty = new Intl.NumberFormat(locale).format(variant.quotaValue);
    const unit = localizeQuotaUnit(variant.quotaUnit, locale);
    return unit ? `${qty} ${unit}` : qty;
  } catch {
    return variant.customerLabel;
  }
}
