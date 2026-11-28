"use client";

/**
 * Read-only Provisjonspriser presentation — one section per product.
 * Columns: Variant · Customer price ex VAT · Commission. Historical rates collapsible.
 * Never invents prices or applies legacy product rates as variant commission.
 */

import Link from "next/link";
import type { CommissionProductSection } from "@/lib/product-catalog/commission-rates-presentation";

export type CommissionRatesPresentationLabels = {
  colVariant: string;
  colCustomerPrice: string;
  colCommission: string;
  colInterval: string;
  notConfigured: string;
  calculatedAtPayment: string;
  editProduct: string;
  historicalTitle: string;
  emptyTitle: string;
  emptyBody: string;
  intervalMonth: string;
  intervalYear: string;
  intervalOneTime: string;
  fixedZero: string;
  percentOfNet: string;
  estimatedAmount: string;
  exVatNote: string;
};

function intervalLabel(
  interval: string,
  labels: CommissionRatesPresentationLabels,
): string {
  if (interval === "month") return labels.intervalMonth;
  if (interval === "year") return labels.intervalYear;
  if (interval === "one_time") return labels.intervalOneTime;
  return interval;
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

function commissionCell(
  row: CommissionProductSection["currentRows"][number],
  labels: CommissionRatesPresentationLabels,
  locale: string,
): string {
  if (row.status === "explicit_zero") {
    return labels.fixedZero.replace(
      "{amount}",
      formatMoney(0, row.currency, locale),
    );
  }
  if (row.status === "fixed" && row.amountMajor != null) {
    return formatMoney(row.amountMajor, row.currency, locale);
  }
  if (row.status === "percent" && row.ratePct != null) {
    const base = labels.percentOfNet.replace("{rate}", String(row.ratePct));
    if (row.estimatedAmountMajor != null) {
      return `${base} · ${labels.estimatedAmount.replace(
        "{amount}",
        formatMoney(row.estimatedAmountMajor, row.currency, locale),
      )}`;
    }
    return `${base} · ${labels.calculatedAtPayment}`;
  }
  return labels.notConfigured;
}

export function CommissionRatesPresentationPanel({
  sections,
  locale,
  labels,
}: {
  sections: CommissionProductSection[];
  locale: string;
  labels: CommissionRatesPresentationLabels;
}) {
  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--aipify-border)] bg-white p-5">
        <p className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">{labels.emptyTitle}</p>
        <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{labels.emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.exVatNote}</p>
      {sections.map((section) => (
        <article
          key={section.productKey}
          className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 shadow-sm"
          data-product-key={section.productKey}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-[color:var(--aipify-text-primary)]">
                {section.productTitle}
              </h3>
              <p className="font-mono text-xs text-[color:var(--aipify-text-muted)]">{section.productKey}</p>
            </div>
            <Link
              href={section.editHref}
              className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
            >
              {labels.editProduct}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <caption className="sr-only">{section.productTitle}</caption>
              <thead className="text-xs uppercase tracking-wide text-[color:var(--aipify-text-muted)]">
                <tr>
                  <th className="px-3 py-2 font-semibold">{labels.colVariant}</th>
                  <th className="px-3 py-2 font-semibold">{labels.colInterval}</th>
                  <th className="px-3 py-2 font-semibold">{labels.colCustomerPrice}</th>
                  <th className="px-3 py-2 font-semibold">{labels.colCommission}</th>
                </tr>
              </thead>
              <tbody>
                {section.currentRows.map((row) => (
                  <tr key={row.id} className="border-t border-[color:var(--aipify-border)]">
                    <td className="px-3 py-2">
                      <p className="font-medium text-[color:var(--aipify-text-primary)]">{row.variantLabel}</p>
                      <p className="font-mono text-xs text-[color:var(--aipify-text-muted)]">{row.variantKey}</p>
                    </td>
                    <td className="px-3 py-2">{intervalLabel(row.billingInterval, labels)}</td>
                    <td className="px-3 py-2">
                      {row.customerPriceKnown && row.customerPriceMajor != null
                        ? formatMoney(
                            row.customerPriceMajor,
                            row.customerPriceCurrency || row.currency,
                            locale,
                          )
                        : labels.notConfigured}
                    </td>
                    <td className="px-3 py-2">{commissionCell(row, labels, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {section.historicalRows.length > 0 ? (
            <details className="mt-3 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface,#fafafa)] p-3">
              <summary className="cursor-pointer text-sm font-semibold text-[color:var(--aipify-text-primary)]">
                {labels.historicalTitle} ({section.historicalRows.length})
              </summary>
              <ul className="mt-2 space-y-2 text-sm text-[color:var(--aipify-text-secondary)]">
                {section.historicalRows.map((row) => (
                  <li key={row.id} className="font-mono text-xs">
                    {row.variantKey} · {row.billingInterval} · {commissionCell(row, labels, locale)}
                    {row.effectiveFrom ? ` · ${row.effectiveFrom}` : ""}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </article>
      ))}
    </div>
  );
}
