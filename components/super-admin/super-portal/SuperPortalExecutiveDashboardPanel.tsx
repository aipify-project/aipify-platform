"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  STATUS_BADGES,
  parseSuperPortalDashboard,
  type SuperPortalDashboard,
  type SuperPortalLabels,
} from "@/lib/super-portal";
import type { SuperAdminSection } from "@/lib/super-admin/types";

type SuperPortalExecutiveDashboardPanelProps = {
  labels: SuperPortalLabels["dashboard"];
  sections: SuperAdminSection[];
  sectionLabels: Record<string, { title: string; purpose: string }>;
  moduleLabels: Record<string, { label: string; description: string }>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

export function SuperPortalExecutiveDashboardPanel({
  labels,
  sections,
  sectionLabels,
  moduleLabels,
}: SuperPortalExecutiveDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SuperPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/super-portal/dashboard");
    if (res.ok) setDashboard(parseSuperPortalDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !dashboard) {
    return <p className="p-6 text-sm text-zinc-500">{labels.loading}</p>;
  }

  if (!dashboard) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {dashboard.principle}
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.totalOrganizations} value={dashboard.total_organizations} />
          <MetricCard label={labels.totalActiveUsers} value={dashboard.total_active_users} />
          <MetricCard
            label={labels.totalActiveSubscriptions}
            value={dashboard.total_active_subscriptions}
          />
          <MetricCard
            label={labels.platformAdministrators}
            value={dashboard.platform_administrator_count}
          />
          <MetricCard
            label={labels.globalPlatformStatus}
            value={labels.statuses[dashboard.global_platform_status] ?? dashboard.global_platform_status}
          />
          <MetricCard
            label={labels.openCriticalIncidents}
            value={dashboard.open_critical_incidents}
          />
          <MetricCard label={labels.platformUptime} value={`${dashboard.platform_uptime_pct}%`} />
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.growthTrends}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {dashboard.growth_trends.map((trend) => (
            <div key={trend.key} className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3">
              <p className="text-sm font-medium text-zinc-900">{trend.label}</p>
              <p className="mt-1 text-lg font-semibold text-zinc-800">{trend.value_pct}%</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.executiveAlerts}</h2>
        {dashboard.executive_alerts.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">{labels.noAlerts}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dashboard.executive_alerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-zinc-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-zinc-900">{alert.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_BADGES[alert.severity] ?? STATUS_BADGES.stable}`}
                >
                  {alert.severity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.portalModules}</h2>
        {sections.map((section) => (
          <div key={section.id}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {sectionLabels[section.id]?.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-600">{sectionLabels[section.id]?.purpose}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.modules.map((module) => (
                <Link
                  key={module.id}
                  href={module.href}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >
                  <h4 className="font-medium text-zinc-900">
                    {moduleLabels[module.id]?.label}
                  </h4>
                  <p className="mt-2 text-sm text-zinc-600">
                    {moduleLabels[module.id]?.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
                    {labels.openModule} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="text-xs text-zinc-500">{dashboard.privacy_note || labels.privacyNote}</p>
    </div>
  );
}
