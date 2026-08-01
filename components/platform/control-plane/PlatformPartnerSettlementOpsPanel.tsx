"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatSettlementMoney,
  labelSettlementOpsStatus,
  parsePartnerSettlementOperations,
  type PartnerSettlementOperationsBundle,
  type PlatformControlPlaneLabels,
} from "@/lib/platform-control-plane";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { createTranslator, type Dictionary } from "@/lib/i18n/translate";

type Props = {
  labels: PlatformControlPlaneLabels;
  locale: string;
  dictionary: Dictionary;
};

function formatWhen(iso: string | null, locale: string): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(t),
  );
}

export function PlatformPartnerSettlementOpsPanel({ labels, locale, dictionary }: Props) {
  const t = useMemo(() => createTranslator(dictionary), [dictionary]);
  const [bundle, setBundle] = useState<PartnerSettlementOperationsBundle | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/platform-control-plane/settlement-operations", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("settlement_failed");
        const json = await res.json();
        if (!cancelled) {
          setBundle(parsePartnerSettlementOperations(json?.data ?? json));
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!bundle) return [];
    const q = query.trim().toLowerCase();
    if (!q) return bundle.settlements;
    return bundle.settlements.filter((row) =>
      [row.partnerName, row.settlementPeriod, row.invoiceNumber ?? "", row.settlementStatus]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [bundle, query]);

  return (
    <section className="mx-auto w-full max-w-[1680px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {labels.settlementOps.title}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          {labels.settlementOps.subtitle}
        </p>
        <aside
          className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
          role="note"
        >
          {labels.settlementOps.noMutations}
        </aside>
      </header>

      {loading ? (
        <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700">
          <AipifyLoader centered />
        </div>
      ) : null}

      {error || (!loading && !bundle) ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
          role="alert"
        >
          {labels.settlementOps.error}
        </div>
      ) : null}

      {bundle ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {labels.settlementOps.freshness}:{" "}
              <time dateTime={bundle.generatedAt}>{formatWhen(bundle.generatedAt, locale)}</time>
            </p>
            {bundle.freshness.partial ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
                {labels.settlementOps.partial}
              </span>
            ) : null}
          </div>

          <div className="sticky top-0 z-10 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/90">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              {labels.settlementOps.filters}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={labels.settlementOps.searchPlaceholder}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
              {labels.settlementOps.empty}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="min-w-[1400px] w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
                  <tr>
                    <th className="px-3 py-2">{labels.settlementOps.columns.partner}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.period}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.commissionBasis}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.earned}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.approved}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.invoice}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.matching}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.payout}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.updated}</th>
                    <th className="px-3 py-2">{labels.settlementOps.columns.nextAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-slate-100 text-slate-800 dark:border-slate-800 dark:text-slate-100"
                    >
                      <td className="px-3 py-2 font-medium">{row.partnerName}</td>
                      <td className="px-3 py-2">{row.settlementPeriod}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {formatSettlementMoney(
                          row.commissionBasis,
                          row.currency,
                          locale,
                          labels.metrics.noData,
                        )}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {formatSettlementMoney(
                          row.earnedAmount,
                          row.currency,
                          locale,
                          labels.metrics.noData,
                        )}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {formatSettlementMoney(
                          row.approvedAmount,
                          row.currency,
                          locale,
                          labels.metrics.noData,
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {row.invoiceNumber || labels.metrics.noData}
                        {row.invoiceStatus ? (
                          <div className="text-xs text-slate-500">
                            {labelSettlementOpsStatus(t, row.invoiceStatus)}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2">
                        {labelSettlementOpsStatus(t, row.matchingStatus)}
                      </td>
                      <td className="px-3 py-2">
                        {labelSettlementOpsStatus(t, row.settlementStatus)}
                      </td>
                      <td className="px-3 py-2">{formatWhen(row.lastUpdated, locale)}</td>
                      <td className="px-3 py-2">{labelSettlementOpsStatus(t, row.nextAction)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <section className="space-y-3">
            <header>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {labels.settlementOps.discrepanciesTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {labels.settlementOps.discrepanciesSubtitle}
              </p>
            </header>
            {bundle.discrepancies.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
                {labels.settlementOps.discrepanciesEmpty}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2">{labels.settlementOps.columns.severity}</th>
                      <th className="px-3 py-2">{labels.settlementOps.columns.partner}</th>
                      <th className="px-3 py-2">{labels.settlementOps.columns.invoice}</th>
                      <th className="px-3 py-2">{labels.settlementOps.columns.expected}</th>
                      <th className="px-3 py-2">{labels.settlementOps.columns.actual}</th>
                      <th className="px-3 py-2">{labels.settlementOps.columns.difference}</th>
                      <th className="px-3 py-2">{labels.settlementOps.columns.reason}</th>
                      <th className="px-3 py-2">{labels.settlementOps.columns.nextAction}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bundle.discrepancies.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-slate-100 text-slate-800 dark:border-slate-800 dark:text-slate-100"
                      >
                        <td className="px-3 py-2">{labelSettlementOpsStatus(t, row.severity)}</td>
                        <td className="px-3 py-2">{row.partnerName}</td>
                        <td className="px-3 py-2">{row.invoiceNumber || labels.metrics.noData}</td>
                        <td className="px-3 py-2 tabular-nums">
                          {formatSettlementMoney(row.expected, "NOK", locale, labels.metrics.noData)}
                        </td>
                        <td className="px-3 py-2 tabular-nums">
                          {formatSettlementMoney(row.actual, "NOK", locale, labels.metrics.noData)}
                        </td>
                        <td className="px-3 py-2 tabular-nums">
                          {formatSettlementMoney(
                            row.difference,
                            "NOK",
                            locale,
                            labels.metrics.noData,
                          )}
                        </td>
                        <td className="px-3 py-2">{labelSettlementOpsStatus(t, row.reason)}</td>
                        <td className="px-3 py-2">{labelSettlementOpsStatus(t, row.nextAction)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}
