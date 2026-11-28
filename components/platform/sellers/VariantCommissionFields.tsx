"use client";

/**
 * Shared seller-commission controls for Opprett/Rediger produkt and Provisjonspriser.
 * null = not configured (never auto-saved as 0). Explicit rule with amount 0 = free variant OK.
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
  notConfigured: string;
  configure: string;
  clearConfiguration: string;
};

export function VariantCommissionFields({
  interval,
  currency,
  priceAmountMajor,
  value,
  labels,
  onChange,
  compactVat = false,
  fieldId,
}: {
  interval: ProductBillingInterval;
  currency: string;
  priceAmountMajor: number | null;
  value: VariantIntervalCommissionRule | null | undefined;
  labels: VariantCommissionFieldsLabels;
  onChange: (next: VariantIntervalCommissionRule | null) => void;
  /** When true, skip repeating ex-VAT lines already shown on the parent price card. */
  compactVat?: boolean;
  /** Unique per variant×interval so radio groups do not collide across variants. */
  fieldId?: string;
}) {
  const radioName = `commission-model-${fieldId ?? interval}`;
  if (value == null) {
    return (
      <div
        className="mt-2 space-y-2 rounded-xl border border-dashed border-[color:var(--aipify-border)] bg-white/60 p-3"
        data-interval={interval}
        data-commission-state="not_configured"
      >
        <p className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">{labels.title}</p>
        <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.notConfigured}</p>
        <button
          type="button"
          className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-1.5 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
          onClick={() => onChange(emptyVariantCommissionRule(currency))}
        >
          {labels.configure}
        </button>
      </div>
    );
  }

  const rule = normalizeVariantCommissionRule(value, currency);
  const preview = previewVariantCommissionExVat({
    rule,
    priceAmountMajor,
  });

  return (
    <div
      className="mt-2 space-y-2 rounded-xl border border-[color:var(--aipify-border)] bg-white/80 p-3"
      data-interval={interval}
      data-commission-state="configured"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">{labels.title}</p>
        <div className="flex flex-wrap items-center gap-3">
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
          <button
            type="button"
            className="text-xs font-semibold text-[color:var(--aipify-text-secondary)] underline"
            onClick={() => onChange(null)}
          >
            {labels.clearConfiguration}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={radioName}
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
            name={radioName}
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
          {!compactVat || rule.amountMajor === 0 ? (
            <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
              {compactVat ? null : labels.exVat}
              {rule.amountMajor === 0 ? `${compactVat ? "" : " · "}${labels.freeHint}` : ""}
            </span>
          ) : null}
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
            {compactVat ? null : ` · ${labels.exVat}`}
          </span>
        </label>
      )}

      <p className="text-xs text-[color:var(--aipify-text-secondary)]">
        {preview.inactive
          ? labels.previewInactive
          : preview.amountMajor == null
            ? labels.preview
            : `${labels.preview}: ${preview.amountMajor.toLocaleString()} ${preview.currency ?? currency}${
                compactVat ? "" : ` (${labels.exVat})`
              }`}
      </p>
    </div>
  );
}

/** Prefer null for not configured; do not invent 0 kr. */
export function ensureIntervalCommission(
  current: VariantIntervalCommissionRule | null | undefined,
  currency: string,
): VariantIntervalCommissionRule | null {
  return current ? normalizeVariantCommissionRule(current, currency) : null;
}
