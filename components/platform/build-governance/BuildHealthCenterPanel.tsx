"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseBuildHealthCenter, type BuildGovernanceLabels } from "@/lib/build-governance";

type BuildHealthCenterPanelProps = {
  labels: BuildGovernanceLabels;
  registryHref: string;
};

function StatusBadge({
  value,
  labels,
}: {
  value: string;
  labels: BuildGovernanceLabels["health"];
}) {
  const tone =
    value === "pass"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : value === "fail"
        ? "bg-red-50 text-red-700 ring-red-200"
        : value === "warn"
          ? "bg-amber-50 text-amber-800 ring-amber-200"
          : "bg-zinc-100 text-zinc-600 ring-zinc-200";
  const label =
    value === "pass"
      ? labels.pass
      : value === "fail"
        ? labels.fail
        : value === "warn"
          ? labels.warn
          : labels.unknown;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tone}`}>
      {label}
    </span>
  );
}

export function BuildHealthCenterPanel({ labels, registryHref }: BuildHealthCenterPanelProps) {
  const [center, setCenter] = useState<ReturnType<typeof parseBuildHealthCenter> | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform/build-governance/health");
    if (res.ok) setCenter(parseBuildHealthCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runScan = useCallback(async () => {
    setBusy(true);
    try {
      await fetch("/api/platform/build-governance/health", { method: "POST" });
      await load();
    } finally {
      setBusy(false);
    }
  }, [load]);

  if (loading && !center) {
    return <p className="p-6 text-sm text-zinc-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
          <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void runScan()}
            disabled={busy}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {busy ? labels.loading : labels.runScan}
          </button>
          <Link
            href={registryHref}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {labels.openRegistry}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [labels.health.buildStatus, center.buildStatus],
          [labels.health.typecheckStatus, center.typecheckStatus],
          [labels.health.routeValidation, center.routeValidationStatus],
          [labels.health.duplicateRouteCheck, center.duplicateRouteCheck],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
            <dd className="mt-3">
              <StatusBadge value={String(value)} labels={labels.health} />
            </dd>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [labels.health.routeCount, center.routeCount],
          [labels.health.apiRouteCount, center.apiRouteCount],
          [labels.health.dynamicRouteCount, center.dynamicRouteCount],
          [
            labels.health.buildDuration,
            center.buildDurationMs ? `${Math.round(center.buildDurationMs / 1000)}s` : "—",
          ],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
            <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">{labels.health.warnings}</h2>
          {center.warnings.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-700">{labels.health.pass}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-amber-800">
              {center.warnings.slice(0, 12).map((warning) => (
                <li key={warning} className="rounded-lg bg-amber-50 px-3 py-2">
                  {warning}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">{labels.health.criticalIssues}</h2>
          {center.criticalIssues.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-700">{labels.health.pass}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-red-700">
              {center.criticalIssues.map((issue) => (
                <li key={`${issue.code}-${issue.message}`} className="rounded-lg bg-red-50 px-3 py-2">
                  {issue.message}
                  {issue.filePath ? <span className="mt-1 block text-xs text-red-600">{issue.filePath}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">{labels.stats.trend}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            [labels.stats.total, center.statistics.totalRoutes],
            [labels.stats.api, center.statistics.apiRoutes],
            [labels.stats.customer, center.statistics.customerRoutes],
            [labels.stats.platform, center.statistics.platformRoutes],
            [labels.stats.marketing, center.statistics.marketingRoutes],
            [labels.stats.businessPacks, center.statistics.businessPackRoutes],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl bg-zinc-50 px-3 py-3">
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
