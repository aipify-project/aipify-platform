"use client";

/**
 * Shared seller-commission controls for Opprett/Rediger produkt and Provisjonspriser.
 * Preview only — never persists until Core RPC is owner-approved.
 */

import {
  emptyVariantCommissionRule,
  normalizeVariantCommissionRule,
  previewVariantCommissionExVat,
  type VariantIntervalCommissionRule,
} from "@/lib/product-catalog/variant-commission";
import type { ProductBillingInterval } from "@/lib/product-catalog/variants";

export type VariantCommissionFieldsLabels = {
  title: string;
  active: string;
  inactive: string;
  modelFixed: string;
  modelPercent: string;
  amountFixed: string;
  ratePercent: string;
  preview: string;
  previewInactive: string;
  exVat: string;
  percentBasis: string;
  freeHint: string;
};

export function VariantCommissionFields({
  interval,
  currency,
  priceAmountMajor,
  value,
  labels,
  onChange,
}: {
  interval: ProductBillingInterval;
  currency: string;
  priceAmountMajor: number | null;
  value: VariantIntervalCommissionRule | null | undefined;
  labels: VariantCommissionFieldsLabels;
  onChange: (next: VariantIntervalCommissionRule) => void;
}) {
  const rule = normalizeVariantCommissionRule(value, currency);
  const preview = previewVariantCommissionExVat({
    rule,
    priceAmountMajor,
  });

  return (
    <div
      className="mt-2 space-y-2 rounded-xl border border-[color:var(--aipify-border)] bg-white/80 p-3"
      data-interval={interval}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">{labels.title}</p>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={rule.active}
            onChange={(event) =>
              onChange(normalizeVariantCommissionRule({ ...rule, active: event.target.checked }, currency))
            }
          />
          {rule.active ? labels.active : labels.inactive}
        </label>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={`commission-model-${interval}`}
            checked={rule.model === "fixed"}
            disabled={!rule.active}
            onChange={() =>
              onChange(
                normalizeVariantCommissionRule(
                  {
                    ...rule,
                    model: "fixed",
                    amountMajor: rule.amountMajor ?? 0,
                    ratePct: null,
                  },
                  currency,
                ),
              )
            }
          />
          {labels.modelFixed}
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={`commission-model-${interval}`}
            checked={rule.model === "percent"}
            disabled={!rule.active}
            onChange={() =>
              onChange(
                normalizeVariantCommissionRule(
                  {
                    ...rule,
                    model: "percent",
                    ratePct: rule.ratePct ?? 0,
                    amountMajor: null,
                  },
                  currency,
                ),
              )
            }
          />
          {labels.modelPercent}
        </label>
      </div>

      {rule.model === "fixed" ? (
        <label className="block text-sm">
          <span className="font-medium">{labels.amountFixed}</span>
          <input
            type="number"
            min={0}
            step="0.01"
            disabled={!rule.active}
            value={rule.amountMajor ?? 0}
            onChange={(event) =>
              onChange(
                normalizeVariantCommissionRule(
                  {
                    ...rule,
                    amountMajor:
                      event.target.value.trim() === "" ? 0 : Number(event.target.value),
                  },
                  currency,
                ),
              )
            }
            className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 disabled:opacity-60"
          />
          <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
            {labels.exVat}
            {rule.amountMajor === 0 ? ` · ${labels.freeHint}` : ""}
          </span>
        </label>
      ) : (
        <label className="block text-sm">
          <span className="font-medium">{labels.ratePercent}</span>
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            disabled={!rule.active}
            value={rule.ratePct ?? 0}
            onChange={(event) =>
              onChange(
                normalizeVariantCommissionRule(
                  {
                    ...rule,
                    ratePct:
                      event.target.value.trim() === "" ? 0 : Number(event.target.value),
                  },
                  currency,
                ),
              )
            }
            className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 disabled:opacity-60"
          />
          <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
            {labels.percentBasis}
          </span>
        </label>
      )}

      <p className="text-xs text-[color:var(--aipify-text-secondary)]">
        {preview.inactive
          ? labels.previewInactive
          : preview.amountMajor == null
            ? labels.preview
            : `${labels.preview}: ${preview.amountMajor.toLocaleString()} ${preview.currency ?? currency} (${labels.exVat})`}
      </p>
    </div>
  );
}

export function ensureIntervalCommission(
  current: VariantIntervalCommissionRule | null | undefined,
  currency: string,
): VariantIntervalCommissionRule {
  return current ? normalizeVariantCommissionRule(current, currency) : emptyVariantCommissionRule(currency);
}
