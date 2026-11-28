"use client";

/**
 * Provisjonspriser — shared VariantCommissionFields draft when Core persist is closed.
 * No hardcoded product prices. Preview only; never claims save.
 */

import { useState } from "react";
import {
  emptyVariantCommissionRule,
  type VariantIntervalCommissionRule,
} from "@/lib/product-catalog/variant-commission";
import {
  VariantCommissionFields,
  type VariantCommissionFieldsLabels,
} from "@/components/platform/sellers/VariantCommissionFields";

const INTERVALS = ["month", "year", "one_time"] as const;

export function CommissionRatesVariantDraft({
  labels,
  intervalTitles,
  persistenceBlocked,
}: {
  labels: VariantCommissionFieldsLabels;
  intervalTitles: { month: string; year: string; one_time: string };
  persistenceBlocked: string;
}) {
  const [rules, setRules] = useState<Record<(typeof INTERVALS)[number], VariantIntervalCommissionRule>>(
    () => ({
      month: emptyVariantCommissionRule("NOK"),
      year: emptyVariantCommissionRule("NOK"),
      one_time: emptyVariantCommissionRule("NOK"),
    }),
  );

  return (
    <div className="mb-6 space-y-3 rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4">
      <p
        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
        role="status"
      >
        {persistenceBlocked}
      </p>
      {INTERVALS.map((key) => (
        <div key={key}>
          <p className="mb-1 text-sm font-semibold text-[color:var(--aipify-text-primary)]">
            {intervalTitles[key]}
          </p>
          <VariantCommissionFields
            interval={key}
            currency="NOK"
            priceAmountMajor={null}
            value={rules[key]}
            labels={labels}
            onChange={(next) => setRules((prev) => ({ ...prev, [key]: next }))}
          />
        </div>
      ))}
    </div>
  );
}
