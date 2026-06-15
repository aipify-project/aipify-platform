"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { isHostsModuleIncluded } from "@/lib/aipify/aipify-hosts";
import {
  parseAipifyHostsAutomationDashboard,
  type AipifyHostsAutomationDashboard,
  type HostsAutomationModule,
} from "@/lib/aipify/aipify-hosts-automation";

type Props = {
  labels: Record<string, string>;
};

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
  module: HostsAutomationModule;
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

function ReadinessBadge({ status, labels }: { status: string; labels: Record<string, string> }) {
  const styles =
    status === "verified"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : status === "blocked"
        ? "bg-red-50 text-red-800 ring-red-200"
        : "bg-amber-50 text-amber-800 ring-amber-200";
  const label =
    status === "verified" ? labels.verified : status === "blocked" ? labels.blocked : labels.pending;
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${styles}`}>{label}</span>;
}

export function AipifyHostsAutomationDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsAutomationDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/automation/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsAutomationDashboard(await res.json()));
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

  const snap = dashboard.operational_snapshot;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-6">
        <p className="text-sm font-medium text-violet-900">{dashboard.positioning}</p>
        <p className="mt-3 text-xs text-violet-800">{dashboard.governance.principle}</p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.dailyBriefing}</h2>
        <p className="mt-2 text-sm text-gray-600">{dashboard.daily_briefing.greeting}</p>
        <ul className="mt-4 space-y-2">
          {dashboard.daily_briefing.priorities.map((item) => (
            <li key={item} className="text-sm text-gray-700">
              · {item}
            </li>
          ))}
        </ul>
        {dashboard.daily_briefing.recommendations.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{labels.recommendations}</p>
            <ul className="mt-2 space-y-1">
              {dashboard.daily_briefing.recommendations.map((item) => (
                <li key={item} className="text-sm text-violet-800">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.operationalSnapshot}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.arrivalsToday} value={snap.arrivals_today} />
          <MetricCard label={labels.departuresToday} value={snap.departures_today} />
          <MetricCard label={labels.pendingApprovals} value={snap.pending_approvals} />
          <MetricCard label={labels.occupancyForecast} value={`${snap.occupancy_forecast_pct}%`} />
        </dl>
      </section>

      {dashboard.arrival_readiness.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.arrivalReadiness}</h2>
          <p className="mt-1 text-sm text-gray-500">{labels.arrivalReadinessHint}</p>
          <ul className="mt-4 divide-y divide-gray-100">
            {dashboard.arrival_readiness.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="text-gray-800">{item.label}</span>
                <ReadinessBadge status={item.status} labels={labels} />
              </li>
            ))}
          </ul>
        </section>
      )}

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
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.playbooks}</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {dashboard.playbooks.map((playbook) => (
            <article key={playbook.key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{playbook.label}</h3>
              <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-gray-600">
                {playbook.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.approvalLevels}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {dashboard.approval_levels.map((level) => (
            <article key={level.level} className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {labels.level} {level.level}
              </p>
              <h3 className="mt-1 font-semibold text-gray-900">{level.label}</h3>
              <p className="mt-1 text-sm text-gray-600">{level.description}</p>
            </article>
          ))}
        </div>
      </section>

      {dashboard.recommendations.length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/30 p-6">
          <h2 className="font-semibold text-gray-900">{labels.pendingRecommendations}</h2>
          <ul className="mt-4 space-y-3">
            {dashboard.recommendations.map((rec) => (
              <li key={rec.key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-4 py-3 text-sm shadow-sm">
                <span className="text-gray-800">{rec.label}</span>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                  {labels.approvalLevel} {rec.approval_level}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

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
