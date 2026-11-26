"use client";

import { useMemo, useState } from "react";
import { getLocalizedCspCatalogProducts } from "@/lib/certified-sales-partner/product-catalog-display";
import {
  CSP_LEAD_STAGES,
  deriveCspLeadStage,
  filterCspLeadRows,
  parseCspLeadRows,
  type CspLeadRow,
  type CspLeadStage,
} from "@/lib/certified-sales-partner/partner-leads-customers";
import {
  CARD,
  EmptyState,
  ErrorState,
  formatDate,
  lookup,
  Pill,
  TD,
  TH,
  useCspList,
  type CspStatusLabels,
} from "./CertifiedSalesPartnerPortalPanels";
import { useCspPortal } from "./CertifiedSalesPartnerWorkspacePanel";

export type CspLeadsLabels = {
  title: string;
  intro: string;
  searchLabel: string;
  searchPlaceholder: string;
  filterLabel: string;
  filterAll: string;
  stage: CspStatusLabels;
  channels: CspStatusLabels;
  /** Sale status labels (reused from the sales list). */
  saleStatus: CspStatusLabels;
  linkCol: string;
  channelCol: string;
  stageCol: string;
  productCol: string;
  registeredCol: string;
  expiresCol: string;
  noSaleYet: string;
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

/** Leads page — the partner's own attributed registrations. No customer identity is shown. */
export function CertifiedSalesPartnerLeadsPanel({ labels, locale }: { labels: CspLeadsLabels; locale: string }) {
  const portal = useCspPortal();
  const productNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of getLocalizedCspCatalogProducts(locale)) map[p.key] = p.title;
    return map;
  }, [locale]);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<CspLeadStage | "all">("all");
  const { state, reload } = useCspList<CspLeadRow>(
    "/api/certified-sales-partner/leads",
    parseCspLeadRows,
    portal !== null,
  );

  const now = useMemo(() => new Date(), [state]);
  const rows = state.phase === "ready" ? state.rows : [];
  const visible = useMemo(
    () =>
      filterCspLeadRows(rows, {
        query,
        stage,
        now,
        productNames,
        channelLabels: labels.channels,
        stageLabels: labels.stage as Partial<Record<CspLeadStage, string>>,
      }),
    [rows, query, stage, now, productNames, labels.channels, labels.stage],
  );
  if (!portal) return null;

  const filtering = query.trim() !== "" || stage !== "all";

  return (
    <section className={CARD} aria-labelledby="csp-leads-title">
      <h2 id="csp-leads-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
        {labels.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>

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
                  value={stage}
                  onChange={(event) => setStage(event.target.value as CspLeadStage | "all")}
                  className={`${INPUT} mt-1`}
                >
                  <option value="all">{labels.filterAll}</option>
                  {CSP_LEAD_STAGES.map((key) => (
                    <option key={key} value={key}>
                      {lookup(labels.stage, key)}
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
                      setStage("all");
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
                      <th className={TH}>{labels.registeredCol}</th>
                      <th className={TH}>{labels.stageCol}</th>
                      <th className={TH}>{labels.productCol}</th>
                      <th className={TH}>{labels.linkCol}</th>
                      <th className={TH}>{labels.channelCol}</th>
                      <th className={TH}>{labels.expiresCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--aipify-border)]">
                    {visible.map((row, index) => {
                      const rowStage = deriveCspLeadStage(row, now);
                      return (
                        <tr key={row.id ?? index}>
                          <td className={TD}>{formatDate(row.registeredAt, locale)}</td>
                          <td className={TD}>
                            <Pill kind={rowStage === "converted" ? "ok" : rowStage === "window_expired" ? "warn" : "info"}>
                              {lookup(labels.stage, rowStage)}
                            </Pill>
                          </td>
                          <td className={TD}>
                            {row.productKey ? (
                              <>
                                {productNames[row.productKey] ?? row.productKey}
                                {row.saleStatus ? (
                                  <span className="block text-xs text-[color:var(--aipify-text-muted)]">
                                    {lookup(labels.saleStatus, row.saleStatus)}
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              labels.noSaleYet
                            )}
                          </td>
                          <td className={`${TD} font-mono`}>{row.linkCode ?? "—"}</td>
                          <td className={TD}>{row.channel ? lookup(labels.channels, row.channel) : "—"}</td>
                          <td className={TD}>{formatDate(row.windowExpiresAt, locale)}</td>
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
