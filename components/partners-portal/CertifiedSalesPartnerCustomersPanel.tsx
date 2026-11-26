"use client";

import { useMemo, useState } from "react";
import { getLocalizedCspCatalogProducts } from "@/lib/certified-sales-partner/product-catalog-display";
import {
  CSP_COMMISSION_QUALIFICATIONS,
  cspPaidPeriodProgress,
  deriveCspCommissionQualification,
  filterCspCustomerRows,
  parseCspCustomerRows,
  type CspCommissionQualification,
  type CspCustomerRow,
} from "@/lib/certified-sales-partner/partner-leads-customers";
import {
  CARD,
  EmptyState,
  ErrorState,
  formatDate,
  formatMoney,
  lookup,
  Pill,
  TD,
  TH,
  useCspList,
  type CspStatusLabels,
} from "./CertifiedSalesPartnerPortalPanels";
import { useCspPortal } from "./CertifiedSalesPartnerWorkspacePanel";

export type CspCustomersLabels = {
  title: string;
  intro: string;
  qualificationNote: string;
  searchLabel: string;
  searchPlaceholder: string;
  filterLabel: string;
  filterAll: string;
  qualification: CspStatusLabels;
  /** Sale status labels (reused from the sales list). */
  saleStatus: CspStatusLabels;
  productCol: string;
  statusCol: string;
  qualificationCol: string;
  periodsCol: string;
  /** Template with {paid} and {required}. */
  periodsValue: string;
  commissionCol: string;
  commissionPending: string;
  registeredCol: string;
  confirmedCol: string;
  /** Template with {shown} and {total}. */
  resultCount: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  noMatchTitle: string;
  noMatchBody: string;
  clearFilters: string;
  loadError: string;
  retry: string;
  privacyNote: string;
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

const INPUT =
  "w-full rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] px-3 py-2 text-sm text-[color:var(--aipify-text-primary)]";

/** Mine kunder — the partner's own attributed customers (qualified sales) and commission status. */
export function CertifiedSalesPartnerCustomersPanel({ labels, locale }: { labels: CspCustomersLabels; locale: string }) {
  const portal = useCspPortal();
  const productNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of getLocalizedCspCatalogProducts(locale)) map[p.key] = p.title;
    return map;
  }, [locale]);
  const [query, setQuery] = useState("");
  const [qualification, setQualification] = useState<CspCommissionQualification | "all">("all");
  const { state, reload } = useCspList<CspCustomerRow>(
    "/api/certified-sales-partner/customers",
    parseCspCustomerRows,
    portal !== null,
  );

  const rows = state.phase === "ready" ? state.rows : [];
  const visible = useMemo(
    () =>
      filterCspCustomerRows(rows, {
        query,
        qualification,
        productNames,
        qualificationLabels: labels.qualification as Partial<Record<CspCommissionQualification, string>>,
        statusLabels: labels.saleStatus,
      }),
    [rows, query, qualification, productNames, labels.qualification, labels.saleStatus],
  );
  if (!portal) return null;

  const filtering = query.trim() !== "" || qualification !== "all";

  return (
    <section className={CARD} aria-labelledby="csp-customers-title">
      <h2 id="csp-customers-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
        {labels.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
      <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.qualificationNote}</p>

      <div className="mt-4">
        {state.phase === "error" ? <ErrorState message={labels.loadError} retry={labels.retry} onRetry={reload} /> : null}

        {state.phase === "ready" && rows.length === 0 ? (
          <EmptyState
            title={labels.emptyTitle}
            body={labels.emptyBody}
            cta={labels.emptyCta}
            href="/partners/referrals/links"
          />
        ) : null}

        {state.phase === "ready" && rows.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <label className="block text-sm font-medium text-[color:var(--aipify-text-primary)]">
                {labels.searchLabel}
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={labels.searchPlaceholder}
                  className={`${INPUT} mt-1`}
                />
              </label>
              <label className="block text-sm font-medium text-[color:var(--aipify-text-primary)]">
                {labels.filterLabel}
                <select
                  value={qualification}
                  onChange={(event) => setQualification(event.target.value as CspCommissionQualification | "all")}
                  className={`${INPUT} mt-1`}
                >
                  <option value="all">{labels.filterAll}</option>
                  {CSP_COMMISSION_QUALIFICATIONS.map((key) => (
                    <option key={key} value={key}>
                      {lookup(labels.qualification, key)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="text-xs text-[color:var(--aipify-text-muted)]" role="status">
              {fill(labels.resultCount, { shown: visible.length, total: rows.length })}
            </p>

            {visible.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[color:var(--aipify-border-strong)] p-6 text-center">
                <h3 className="text-base font-semibold text-[color:var(--aipify-text-primary)]">{labels.noMatchTitle}</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.noMatchBody}</p>
                {filtering ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setQualification("all");
                    }}
                    className="mt-4 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
                  >
                    {labels.clearFilters}
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[color:var(--aipify-border)]">
                  <thead>
                    <tr>
                      <th className={TH}>{labels.productCol}</th>
                      <th className={TH}>{labels.statusCol}</th>
                      <th className={TH}>{labels.qualificationCol}</th>
                      <th className={TH}>{labels.periodsCol}</th>
                      <th className={TH}>{labels.commissionCol}</th>
                      <th className={TH}>{labels.registeredCol}</th>
                      <th className={TH}>{labels.confirmedCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--aipify-border)]">
                    {visible.map((row, index) => {
                      const qual = deriveCspCommissionQualification(row.status);
                      const progress = cspPaidPeriodProgress(row.paidPeriodsCount);
                      const showAmount =
                        qual === "qualified" && row.snapshotAmount !== null && row.snapshotCurrency !== null;
                      return (
                        <tr key={row.id ?? index}>
                          <td className={TD}>{(row.productKey && productNames[row.productKey]) || row.productKey || "—"}</td>
                          <td className={TD}>{lookup(labels.saleStatus, row.status)}</td>
                          <td className={TD}>
                            <Pill kind={qual === "qualified" ? "ok" : qual === "not_qualified" ? "warn" : "info"}>
                              {lookup(labels.qualification, qual)}
                            </Pill>
                          </td>
                          <td className={TD}>
                            {progress ? fill(labels.periodsValue, { paid: progress.paid, required: progress.required }) : "—"}
                          </td>
                          <td className={TD}>
                            {showAmount
                              ? formatMoney(row.snapshotAmount as number, row.snapshotCurrency as string, locale)
                              : labels.commissionPending}
                          </td>
                          <td className={TD}>{formatDate(row.attributedAt, locale)}</td>
                          <td className={TD}>{formatDate(row.firstConfirmedAt, locale)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-xs text-[color:var(--aipify-text-muted)]">{labels.privacyNote}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
