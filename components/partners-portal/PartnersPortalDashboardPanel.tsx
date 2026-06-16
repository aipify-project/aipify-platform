"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PARTNERS_PORTAL_NAV_GROUPS,
  parsePartnersPortalDashboard,
  type PartnersPortalDashboard,
  type PartnersPortalLabels,
} from "@/lib/partners-portal";

type PartnersPortalDashboardPanelProps = {
  labels: PartnersPortalLabels["dashboard"];
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

export function PartnersPortalDashboardPanel({
  labels,
  navLabels,
}: PartnersPortalDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PartnersPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/partners-portal/dashboard");
    if (res.ok) setDashboard(parsePartnersPortalDashboard(await res.json()));
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4 text-sm text-slate-800">
          {dashboard.principle}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard label={labels.leadsAssigned} value={dashboard.leads_assigned} />
          <MetricCard
            label={labels.conversionRate}
            value={`${dashboard.conversion_metrics.conversion_rate_pct}%`}
          />
          <MetricCard
            label={labels.certificationProgress}
            value={`${dashboard.certification_progress}%`}
          />
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.pipelineOverview}</h2>
          <ul className="mt-4 space-y-2">
            {dashboard.pipeline_overview.map((stage) => (
              <li
                key={stage.stage}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                <span className="font-medium capitalize text-slate-800">{stage.stage.replace(/_/g, " ")}</span>
                <span className="text-slate-600">{stage.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.upcomingFollowUps}</h2>
          {dashboard.upcoming_follow_ups.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{labels.noFollowUps}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {dashboard.upcoming_follow_ups.map((item) => (
                <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                  <p className="font-medium text-slate-900">{item.company_name}</p>
                  <p className="text-slate-600">{item.contact_name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.partnerRankings}</h2>
        <ul className="mt-4 space-y-2">
          {dashboard.partner_rankings.map((rank) => (
            <li
              key={rank.rank}
              className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
            >
              <span className="text-slate-800">
                #{rank.rank} {rank.label}
              </span>
              <span className="font-semibold text-emerald-700">{rank.score}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.monthlyPerformance}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <MetricCard
              label={labels.leadsThisMonth}
              value={dashboard.monthly_performance_summary.leads_this_month}
            />
            <MetricCard
              label={labels.convertedCustomers}
              value={dashboard.monthly_performance_summary.converted_customers}
            />
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.referralStatistics}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <MetricCard label={labels.activeReferrals} value={dashboard.referral_statistics.active} />
            <MetricCard label={labels.convertedReferrals} value={dashboard.referral_statistics.converted} />
            <MetricCard label={labels.invitedReferrals} value={dashboard.referral_statistics.invited} />
          </dl>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.portalModules}</h2>
        {PARTNERS_PORTAL_NAV_GROUPS.map((group) => (
          <div key={group.id}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {navLabels[group.id]}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <h4 className="font-medium text-slate-900">{navLabels[item.id]}</h4>
                  <span className="mt-4 inline-block text-sm font-medium text-emerald-700">
                    {labels.openModule} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="text-xs text-slate-500">{dashboard.privacy_note || labels.privacyNote}</p>
    </div>
  );
}
