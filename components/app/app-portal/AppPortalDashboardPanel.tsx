"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  APP_PORTAL_NAV_GROUPS,
  parseAppPortalDashboard,
  type AppPortalDashboard,
  type AppPortalLabels,
} from "@/lib/app-portal";

type AppPortalDashboardPanelProps = {
  labels: AppPortalLabels["dashboard"];
  navLabels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export function AppPortalDashboardPanel({ labels, navLabels }: AppPortalDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AppPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app-portal/dashboard");
    if (res.ok) setDashboard(parseAppPortalDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !dashboard) {
    return <p className="p-6 text-sm text-slate-500">{labels.loading}</p>;
  }

  if (!dashboard) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const org = dashboard.organization_overview;
  const team = dashboard.team_activity_summary;
  const sub = dashboard.subscription_status;
  const sll = dashboard.since_last_login_summary;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">
          {dashboard.principle || labels.principle}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.organizationOverview}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard label={labels.organizationOverview} value={org.name} />
          <MetricCard label={labels.activeMembers} value={org.team_active} />
          <MetricCard label={labels.status} value={org.organization_role.replace(/_/g, " ")} />
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.teamActivity}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <MetricCard label={labels.activeMembers} value={team.active_members} />
            <MetricCard label={labels.tasksAttention} value={dashboard.tasks_requiring_attention} />
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.subscriptionStatus}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <MetricCard label={labels.plan} value={sub.plan_key} />
            <MetricCard label={labels.status} value={sub.status} />
          </dl>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.businessPackStatus}</h2>
          {dashboard.business_pack_status.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{labels.noBusinessPacks}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {dashboard.business_pack_status.map((pack) => (
                <li
                  key={pack.module_key}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-800">{pack.module_key}</span>
                  <span className="text-slate-600">{pack.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.recommendedActions}</h2>
          <ul className="mt-4 space-y-2">
            {dashboard.recommended_actions.map((action) => (
              <li key={action.id}>
                <Link
                  href={action.href}
                  className="block rounded-lg border border-slate-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  {action.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold text-slate-900">{labels.sinceLastLogin}</h2>
          <Link href="/app/since-last-login" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
            {labels.openModule}
          </Link>
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.importantUpdates} value={sll.important_updates} />
          <MetricCard label={labels.completedActions} value={sll.completed_actions} />
          <MetricCard label={labels.newNotifications} value={sll.new_notifications} />
          <MetricCard label={labels.notifications} value={dashboard.notifications_count} />
        </dl>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.portalModules}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APP_PORTAL_NAV_GROUPS.map((group) => (
            <div key={group.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">{navLabels[group.id] ?? group.id}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="text-sm text-indigo-700 hover:text-indigo-800">
                      {navLabels[item.id] ?? item.id}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-500">{dashboard.privacy_note || labels.privacyNote}</p>
    </div>
  );
}
