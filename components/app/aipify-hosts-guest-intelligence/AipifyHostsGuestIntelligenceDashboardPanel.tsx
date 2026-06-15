"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { isHostsModuleIncluded } from "@/lib/aipify/aipify-hosts";
import {
  parseAipifyHostsGuestIntelligenceDashboard,
  type AipifyHostsGuestIntelligenceDashboard,
  type HostsGuestInsight,
  type HostsGuestModule,
} from "@/lib/aipify/aipify-hosts-guest-intelligence";

type Props = {
  labels: Record<string, string>;
};

function insightStyle(type: HostsGuestInsight["type"]): string {
  if (type === "early_warning") return "border-amber-200 bg-amber-50/60";
  if (type === "loyalty") return "border-emerald-200 bg-emerald-50/60";
  if (type === "recognition" || type === "satisfaction") return "border-violet-200 bg-violet-50/60";
  return "border-gray-200 bg-white";
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ModuleCard({
  module,
  enabled,
  enabledLabel,
  scaffoldLabel,
}: {
  module: HostsGuestModule;
  enabled: boolean;
  enabledLabel: string;
  scaffoldLabel: string;
}) {
  return (
    <article
      className={`rounded-xl border p-4 ${enabled ? "border-violet-100 bg-violet-50/40" : "border-gray-100 bg-gray-50/60"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{module.label}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${enabled ? "bg-violet-100 text-violet-800" : "bg-gray-200 text-gray-600"}`}
        >
          {enabled ? enabledLabel : scaffoldLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
    </article>
  );
}

export function AipifyHostsGuestIntelligenceDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsGuestIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/guest-intelligence/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsGuestIntelligenceDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const snap = dashboard.loyalty_snapshot;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-6">
        <p className="text-sm font-medium text-violet-900">{dashboard.positioning}</p>
        <p className="mt-2 text-sm text-violet-800">{dashboard.vision}</p>
        <p className="mt-3 text-xs text-violet-800">{dashboard.governance.principle}</p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.loyaltySnapshot}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.overallSatisfaction} value={`${snap.overall_satisfaction}%`} />
          <MetricCard label={labels.repeatGuestPct} value={`${snap.repeat_guest_pct}%`} />
          <MetricCard label={labels.returningGuests} value={snap.returning_guests} />
          <MetricCard label={labels.earlyWarnings} value={snap.at_risk_guests} />
        </dl>
      </section>

      {dashboard.guest_insights.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.guestInsights}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {dashboard.guest_insights.map((insight) => (
              <li
                key={insight.key}
                className={`rounded-xl border px-4 py-3 text-sm text-gray-800 ${insightStyle(insight.type)}`}
              >
                {insight.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.executiveMetrics}</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {dashboard.executive_metrics.map((metric) => (
            <MetricCard key={metric.key} label={metric.label} value={metric.value} />
          ))}
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.modules}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.modules.map((module) => (
            <ModuleCard
              key={module.key}
              module={module}
              enabled={isHostsModuleIncluded(dashboard.package_key, module.key)}
              enabledLabel={labels.included}
              scaffoldLabel={labels.upgradeRequired}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.guestSegments}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.segments.map((segment) => (
            <span
              key={segment.key}
              className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200"
            >
              {segment.label}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.journeyStages}</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {dashboard.journey_stages.map((stage) => (
            <article key={stage.key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{stage.label}</h3>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {stage.focus.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.feedbackCategories}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.feedback_categories.map((category) => (
            <span
              key={category}
              className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm text-gray-700"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.successMetrics}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {dashboard.success_metrics.map((metric) => (
            <li key={metric.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
              {metric.label}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/aipify-hosts"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {labels.backToHosts}
        </Link>
        <Link
          href="/app/settings/employee-knowledge"
          className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100"
        >
          {labels.exploreKnowledge}
        </Link>
      </div>
    </div>
  );
}
