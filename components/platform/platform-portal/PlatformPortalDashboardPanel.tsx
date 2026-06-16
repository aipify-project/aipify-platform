"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildPlatformPortalLabels,
  parsePlatformPortalDashboard,
  type PlatformPortalDashboard,
} from "@/lib/platform-portal";
import type { PlatformNavGroupConfig } from "@/lib/platform/build-nav";

type PlatformPortalDashboardPanelProps = {
  labels: ReturnType<typeof buildPlatformPortalLabels>["dashboard"];
  navGroups: PlatformNavGroupConfig[];
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export function PlatformPortalDashboardPanel({
  labels,
  navGroups,
}: PlatformPortalDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PlatformPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-portal/dashboard");
    if (res.ok) setDashboard(parsePlatformPortalDashboard(await res.json()));
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
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-800">
          {dashboard.principle}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label={labels.organizationsRequiringAttention}
            value={dashboard.organizations_requiring_attention}
          />
          <MetricCard label={labels.activeSubscriptions} value={dashboard.active_subscriptions} />
          <MetricCard label={labels.openSupportWorkload} value={dashboard.open_support_workload} />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.paymentStatusSummary}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <MetricCard label={labels.paymentActive} value={dashboard.payment_status_summary.active} />
          <MetricCard
            label={labels.paymentPastDue}
            value={dashboard.payment_status_summary.past_due}
          />
          <MetricCard
            label={labels.paymentTrialing}
            value={dashboard.payment_status_summary.trialing}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.customerSuccessIndicators}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <MetricCard
            label={labels.organizationsRequiringAttention}
            value={dashboard.customer_success_indicators.organizations_requiring_attention}
          />
          <MetricCard
            label={labels.healthyRatio}
            value={`${dashboard.customer_success_indicators.healthy_ratio_pct}%`}
          />
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.marketplaceModeration}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label={labels.pendingReview}
              value={dashboard.marketplace_moderation.pending_review}
            />
            <MetricCard label={labels.published} value={dashboard.marketplace_moderation.published} />
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.partnerProgramSummary}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label={labels.activePrograms}
              value={dashboard.growth_partner_summary.active_programs}
            />
            <MetricCard
              label={labels.pendingApplications}
              value={dashboard.growth_partner_summary.pending_applications}
            />
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.productDeploymentUpdates}</h2>
        {dashboard.product_deployment_updates.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{labels.noUpdates}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dashboard.product_deployment_updates.map((update) => (
              <li
                key={update.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{update.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    v{update.version} · {update.classification}
                  </p>
                </div>
                {update.scheduled_at ? (
                  <span className="text-xs text-slate-500">
                    {new Date(update.scheduled_at).toLocaleDateString()}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.portalModules}</h2>
        {navGroups.map((group) => (
          <div key={group.id}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {group.label}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >
                  <h4 className="font-medium text-slate-900">{item.label}</h4>
                  <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
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
