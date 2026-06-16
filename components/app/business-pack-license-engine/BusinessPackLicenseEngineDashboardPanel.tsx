"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  packLicenseRoute,
  parseBusinessPackLicenseEngineDashboard,
  type BusinessPackLicenseEngineDashboard,
} from "@/lib/aipify/business-pack-license-engine";

type Props = { labels: Record<string, string> };

export function BusinessPackLicenseEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<BusinessPackLicenseEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/business-pack-license-engine/dashboard");
    if (res.ok) setDashboard(parseBusinessPackLicenseEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!dashboard?.has_access) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm text-indigo-900">{dashboard.principle}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-4">
        {[
          ["packDefinitions", summary.pack_definitions],
          ["activeLicenses", summary.active_tenant_licenses],
          ["trialLicenses", summary.trial_licenses],
          ["auditEvents", summary.audit_events],
        ].map(([key, value]) => (
          <div key={key as string} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
            <p className="mt-1 text-xs text-gray-500">{labels[key as string]}</p>
          </div>
        ))}
      </section>

      {dashboard.upgrade_flow && dashboard.upgrade_flow.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.upgradeFlow}</h3>
          <ol className="mt-3 flex flex-wrap gap-2">
            {dashboard.upgrade_flow.map((step, index) => (
              <li key={step} className="flex items-center gap-1 text-sm text-gray-700">
                {index > 0 && <span className="text-gray-300">→</span>}
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 capitalize">{step.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {dashboard.license_metrics && dashboard.license_metrics.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.licenseMetrics}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.license_metrics.map((m) => (
              <li key={m.pack} className="flex justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{m.pack}</span>
                <span className="text-gray-600 capitalize">{m.metric}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.governance && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.governance}</h3>
          <dl className="mt-3 space-y-2">
            {Object.entries(dashboard.governance).map(([role, note]) => (
              <div key={role}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{role.replace(/_/g, " ")}</dt>
                <dd className="text-sm text-gray-700">{note}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">{labels.catalogTitle}</h3>
        {(dashboard.definitions ?? []).map((def) => (
          <article key={String(def.pack_key)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <h4 className="font-semibold text-gray-900">{String(def.pack_name)}</h4>
              <p className="text-xs text-gray-500">
                {String(def.license_metric)} · {String(def.tier_count)} {labels.tiers}
                {def.trial_available ? ` · ${labels.trialAvailable}` : ""}
              </p>
            </div>
            <Link
              href={String(def.license_center_route ?? packLicenseRoute(String(def.pack_key)))}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
            >
              {labels.viewLicenseCenter}
            </Link>
          </article>
        ))}
      </section>

      {dashboard.success_criteria && dashboard.success_criteria.length > 0 && (
        <section className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h3 className="text-sm font-semibold text-emerald-900">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-1 text-sm text-emerald-950">
            {dashboard.success_criteria.map((item) => (
              <li key={item} className="flex gap-2"><span>✓</span>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
