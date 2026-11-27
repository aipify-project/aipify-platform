"use client";

/**
 * Platform Product Center — variant builder (monthly + yearly prices as separate fields).
 * Local editor state only until Core variant SQL is applied (PREPARED_ONLY).
 * Never invents Stripe IDs or marks purchasable without provider mapping.
 */

import { useMemo } from "react";
import type { ProductVariantDefinition } from "@/lib/product-catalog/variants";

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
  vatUnknown: string;
  providerPriceId: string;
  providerPriceHint: string;
  remove: string;
  empty: string;
  persistenceNote: string;
  annualRenewsMonthly: string;
};

type DraftVariant = ProductVariantDefinition;

function emptyVariant(productKey: string, index: number): DraftVariant {
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
    monthlyPrice: {
      currency: "NOK",
      amountMajor: null,
      amountMinor: null,
      interval: "month",
      vatLabel: "unknown",
      providerPriceId: null,
      purchasable: false,
    },
    yearlyPrice: {
      currency: "NOK",
      amountMajor: null,
      amountMinor: null,
      interval: "year",
      vatLabel: "unknown",
      providerPriceId: null,
      purchasable: false,
    },
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

  function patch(index: number, partial: Partial<DraftVariant>) {
    onChange(variants.map((row, i) => (i === index ? { ...row, ...partial } : row)));
  }

  function patchMonthly(index: number, amountMajor: string) {
    const n = amountMajor.trim() === "" ? null : Number(amountMajor);
    const row = variants[index];
    if (!row) return;
    patch(index, {
      monthlyPrice: {
        currency: row.monthlyPrice?.currency ?? "NOK",
        amountMajor: n != null && Number.isFinite(n) ? n : null,
        amountMinor: n != null && Number.isFinite(n) ? Math.round(n * 100) : null,
        interval: "month",
        vatLabel: "unknown",
        providerPriceId: row.monthlyPrice?.providerPriceId ?? null,
        purchasable: false,
      },
    });
  }

  function patchYearly(index: number, amountMajor: string) {
    const n = amountMajor.trim() === "" ? null : Number(amountMajor);
    const row = variants[index];
    if (!row) return;
    patch(index, {
      yearlyPrice: {
        currency: row.yearlyPrice?.currency ?? "NOK",
        amountMajor: n != null && Number.isFinite(n) ? n : null,
        amountMinor: n != null && Number.isFinite(n) ? Math.round(n * 100) : null,
        interval: "year",
        vatLabel: "unknown",
        providerPriceId: row.yearlyPrice?.providerPriceId ?? null,
        purchasable: false,
      },
    });
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="variants_json" value={serialized} readOnly />
      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.persistenceNote}</p>

      {variants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[color:var(--aipify-border)] p-4 text-sm text-[color:var(--aipify-text-secondary)]">
          {labels.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {variants.map((variant, index) => (
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
                    onChange={(event) => patchMonthly(index, event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                  />
                  <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                    {labels.vatUnknown}
                  </span>
                </label>
                <label className="text-sm">
                  <span className="font-medium">{labels.yearlyPrice}</span>
                  <input
                    type="number"
                    value={variant.yearlyPrice?.amountMajor ?? ""}
                    onChange={(event) => patchYearly(index, event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                  />
                  <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                    {labels.vatUnknown}
                  </span>
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
          ))}
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
