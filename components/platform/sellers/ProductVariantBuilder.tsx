"use client";

/**
 * Platform Product Center — variant builder (monthly + yearly + one-time).
 * Staging Core may persist via products/variants API; Production stays fail-closed.
 * Never invents Stripe IDs or marks purchasable without provider mapping.
 * Never claims variant commission persistence while canPersist is false.
 */

import { useMemo } from "react";
import type { ProductVariantDefinition, ProductVariantPrice } from "@/lib/product-catalog/variants";
import {
  canPersistVariantCommissionRules,
  emptyVariantCommissionRule,
} from "@/lib/product-catalog/variant-commission";
import {
  VariantCommissionFields,
  type VariantCommissionFieldsLabels,
} from "@/components/platform/sellers/VariantCommissionFields";

export type ProductVariantBuilderLabels = {
  title: string;
  addVariant: string;
  adminName: string;
  customerLabel: string;
  quotaValue: string;
  quotaUnit: string;
  sortOrder: string;
  active: string;
  recommended: string;
  monthlyPrice: string;
  yearlyPrice: string;
  oneTimePrice: string;
  currency: string;
  /** Prefer exclusive VAT copy for new edits. */
  vatExclusive: string;
  providerPriceId: string;
  providerPriceHint: string;
  remove: string;
  empty: string;
  persistenceNote: string;
  commissionPersistenceBlocked: string;
  annualRenewsMonthly: string;
  commission: VariantCommissionFieldsLabels;
  commissionMonth: string;
  commissionYear: string;
  commissionOneTime: string;
};

type DraftVariant = ProductVariantDefinition;

function priceShell(
  interval: ProductVariantPrice["interval"],
  currency: string,
  amountMajor: number | null,
): ProductVariantPrice {
  return {
    currency,
    amountMajor,
    amountMinor: amountMajor != null && Number.isFinite(amountMajor) ? Math.round(amountMajor * 100) : null,
    interval,
    vatLabel: "exclusive",
    providerPriceId: null,
    purchasable: false,
    commission: emptyVariantCommissionRule(currency),
  };
}

function emptyVariant(productKey: string, index: number): DraftVariant {
  const currency = "NOK";
  return {
    variantKey: `${productKey || "product"}_variant_${index + 1}`,
    productKey: productKey || "product",
    adminName: "",
    customerLabel: "",
    sortOrder: index,
    active: true,
    recommended: false,
    quotaValue: null,
    quotaUnit: "answers",
    quotaKind: "monthly_renewing",
    annualRenewsQuotaMonthly: false,
    monthlyPrice: priceShell("month", currency, null),
    yearlyPrice: priceShell("year", currency, null),
    oneTimePrice: null,
    features: [],
  };
}

export function ProductVariantBuilder({
  productKey,
  variants,
  labels,
  onChange,
}: {
  productKey: string;
  variants: DraftVariant[];
  labels: ProductVariantBuilderLabels;
  onChange: (next: DraftVariant[]) => void;
}) {
  const serialized = useMemo(() => JSON.stringify(variants), [variants]);
  const canPersistCommission = canPersistVariantCommissionRules();

  function patch(index: number, partial: Partial<DraftVariant>) {
    onChange(variants.map((row, i) => (i === index ? { ...row, ...partial } : row)));
  }

  function patchPriceAmount(
    index: number,
    interval: "month" | "year" | "one_time",
    amountMajor: string,
  ) {
    const n = amountMajor.trim() === "" ? null : Number(amountMajor);
    const row = variants[index];
    if (!row) return;
    const currency =
      row.monthlyPrice?.currency ??
      row.yearlyPrice?.currency ??
      row.oneTimePrice?.currency ??
      "NOK";
    const amount = n != null && Number.isFinite(n) ? n : null;
    const existing =
      interval === "month"
        ? row.monthlyPrice
        : interval === "year"
          ? row.yearlyPrice
          : row.oneTimePrice;
    const nextPrice: ProductVariantPrice = {
      currency,
      amountMajor: amount,
      amountMinor: amount != null ? Math.round(amount * 100) : null,
      interval,
      vatLabel: "exclusive",
      providerPriceId: existing?.providerPriceId ?? null,
      purchasable: false,
      commission: existing?.commission ?? emptyVariantCommissionRule(currency),
    };
    if (interval === "month") patch(index, { monthlyPrice: nextPrice });
    else if (interval === "year") patch(index, { yearlyPrice: nextPrice });
    else patch(index, { oneTimePrice: nextPrice });
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="variants_json" value={serialized} readOnly />
      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.persistenceNote}</p>
      {!canPersistCommission ? (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
          role="status"
        >
          {labels.commissionPersistenceBlocked}
        </p>
      ) : null}

      {variants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:var(--aipify-border)] p-4 text-sm text-[color:var(--aipify-text-secondary)]">
          {labels.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {variants.map((variant, index) => {
            const currency =
              variant.monthlyPrice?.currency ??
              variant.yearlyPrice?.currency ??
              variant.oneTimePrice?.currency ??
              "NOK";
            return (
              <li
                key={variant.variantKey}
                className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface,#fafafa)] p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="font-medium">{labels.adminName}</span>
                    <input
                      value={variant.adminName}
                      onChange={(event) => patch(index, { adminName: event.target.value })}
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="font-medium">{labels.customerLabel}</span>
                    <input
                      value={variant.customerLabel}
                      onChange={(event) => patch(index, { customerLabel: event.target.value })}
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="font-medium">{labels.quotaValue}</span>
                    <input
                      type="number"
                      value={variant.quotaValue ?? ""}
                      onChange={(event) =>
                        patch(index, {
                          quotaValue:
                            event.target.value.trim() === "" ? null : Number(event.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="font-medium">{labels.quotaUnit}</span>
                    <input
                      value={variant.quotaUnit ?? ""}
                      onChange={(event) => patch(index, { quotaUnit: event.target.value || null })}
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="font-medium">{labels.monthlyPrice}</span>
                    <input
                      type="number"
                      value={variant.monthlyPrice?.amountMajor ?? ""}
                      onChange={(event) => patchPriceAmount(index, "month", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                    <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                      {labels.vatExclusive}
                    </span>
                    <VariantCommissionFields
                      interval="month"
                      currency={currency}
                      priceAmountMajor={variant.monthlyPrice?.amountMajor ?? null}
                      value={variant.monthlyPrice?.commission}
                      labels={{ ...labels.commission, title: labels.commissionMonth }}
                      onChange={(next) => {
                        const base =
                          variant.monthlyPrice ?? priceShell("month", currency, null);
                        patch(index, { monthlyPrice: { ...base, commission: next } });
                      }}
                    />
                  </label>
                  <label className="text-sm">
                    <span className="font-medium">{labels.yearlyPrice}</span>
                    <input
                      type="number"
                      value={variant.yearlyPrice?.amountMajor ?? ""}
                      onChange={(event) => patchPriceAmount(index, "year", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                    <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                      {labels.vatExclusive}
                    </span>
                    <VariantCommissionFields
                      interval="year"
                      currency={currency}
                      priceAmountMajor={variant.yearlyPrice?.amountMajor ?? null}
                      value={variant.yearlyPrice?.commission}
                      labels={{ ...labels.commission, title: labels.commissionYear }}
                      onChange={(next) => {
                        const base = variant.yearlyPrice ?? priceShell("year", currency, null);
                        patch(index, { yearlyPrice: { ...base, commission: next } });
                      }}
                    />
                  </label>
                  <label className="text-sm sm:col-span-2">
                    <span className="font-medium">{labels.oneTimePrice}</span>
                    <input
                      type="number"
                      value={variant.oneTimePrice?.amountMajor ?? ""}
                      onChange={(event) => patchPriceAmount(index, "one_time", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                    <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                      {labels.vatExclusive}
                    </span>
                    <VariantCommissionFields
                      interval="one_time"
                      currency={currency}
                      priceAmountMajor={variant.oneTimePrice?.amountMajor ?? null}
                      value={variant.oneTimePrice?.commission}
                      labels={{ ...labels.commission, title: labels.commissionOneTime }}
                      onChange={(next) => {
                        const base =
                          variant.oneTimePrice ?? priceShell("one_time", currency, null);
                        patch(index, { oneTimePrice: { ...base, commission: next } });
                      }}
                    />
                  </label>
                  <label className="text-sm sm:col-span-2">
                    <span className="font-medium">{labels.providerPriceId}</span>
                    <input
                      value={variant.monthlyPrice?.providerPriceId ?? ""}
                      readOnly
                      placeholder="—"
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] bg-white/70 px-3 py-2 font-mono text-sm"
                    />
                    <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                      {labels.providerPriceHint}
                    </span>
                  </label>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={variant.active}
                      onChange={(event) => patch(index, { active: event.target.checked })}
                    />
                    {labels.active}
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={variant.recommended}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        onChange(
                          variants.map((row, i) => ({
                            ...row,
                            recommended: i === index ? checked : checked ? false : row.recommended,
                          })),
                        );
                      }}
                    />
                    {labels.recommended}
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={variant.annualRenewsQuotaMonthly}
                      onChange={(event) =>
                        patch(index, { annualRenewsQuotaMonthly: event.target.checked })
                      }
                    />
                    {labels.annualRenewsMonthly}
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <span className="font-medium">{labels.sortOrder}</span>
                    <input
                      type="number"
                      value={variant.sortOrder}
                      onChange={(event) =>
                        patch(index, { sortOrder: Number(event.target.value) || 0 })
                      }
                      className="w-20 rounded-lg border border-[color:var(--aipify-border)] px-2 py-1"
                    />
                  </label>
                  <button
                    type="button"
                    className="ml-auto text-sm font-semibold text-red-700"
                    onClick={() => onChange(variants.filter((_, i) => i !== index))}
                  >
                    {labels.remove}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        className="rounded-xl border border-[color:var(--aipify-border-strong)] px-3 py-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
        onClick={() => onChange([...variants, emptyVariant(productKey, variants.length)])}
      >
        {labels.addVariant}
      </button>
    </div>
  );
}
