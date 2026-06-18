"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEnterpriseDeploymentDashboard,
  type EnterpriseDeploymentDashboard,
} from "@/lib/aipify/enterprise";
import { formatDate } from "@/lib/i18n/format-date";

type EnterpriseDeploymentDashboardPanelProps = {
  locale: string;
  labels: Record<string, string>;
};

export function EnterpriseDeploymentDashboardPanel({
  locale,
  labels,
}: EnterpriseDeploymentDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<EnterpriseDeploymentDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise/dashboard");
    if (res.ok) setDashboard(parseEnterpriseDeploymentDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;

  const s = dashboard.settings ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
          <p className="mt-2 text-sm text-indigo-800">{labels.principle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/enterprise/framework" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800">{labels.framework}</Link>
          <Link href="/app/enterprise/deployment" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.deployment}</Link>
          <Link href="/app/enterprise/agents" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.agents}</Link>
          <Link href="/app/enterprise/data-residency" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.dataResidency}</Link>
          <Link href="/app/enterprise/connectors" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.connectors}</Link>
          <Link href="/app/enterprise/audit" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.audit}</Link>
        </div>
      </div>

      {dashboard.upgrade_required ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {labels.upgradeRequired}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.mode, value: s.deployment_mode?.replace(/_/g, " ") },
          { label: labels.residency, value: s.data_residency_mode?.replace(/_/g, " ") },
          { label: labels.connectivity, value: s.connectivity_mode?.replace(/_/g, " ") },
          { label: labels.agentsCount, value: dashboard.agents.length },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="mt-1 text-lg font-semibold capitalize text-gray-900">{c.value ?? "—"}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="text-sm font-semibold">{labels.registeredAgents}</h2>
          {dashboard.agents.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noAgents}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.agents.map((a) => (
                <li key={a.id} className="rounded border border-white bg-white px-3 py-2">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{a.agent_name}</span>
                    <span className="capitalize text-indigo-700">{a.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {a.deployment_mode} · {a.last_seen_at ? formatDate(a.last_seen_at, locale) : labels.neverSeen}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="text-sm font-semibold">{labels.recentJobs}</h2>
          {dashboard.recent_jobs.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noJobs}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.recent_jobs.map((j) => (
                <li key={j.id} className="rounded border border-white bg-white px-3 py-2">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{j.job_type}</span>
                    <span className="capitalize">{j.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
