"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { isHostsModuleIncluded } from "@/lib/aipify/aipify-hosts";
import {
  parseAipifyHostsCompanionDashboard,
  type AipifyHostsCompanionDashboard,
  type HostsCompanionModule,
  type HostsCompanionRecommendation,
  type HostsPendingApproval,
} from "@/lib/aipify/aipify-hosts-companion";

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
  module: HostsCompanionModule;
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

function impactStyle(impact: string): string {
  if (impact === "high") return "bg-red-50 text-red-800 ring-red-200";
  if (impact === "low") return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

export function AipifyHostsCompanionDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsCompanionDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/companion/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsCompanionDashboard(await res.json()));
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

  const snap = dashboard.command_snapshot;
  const briefing = dashboard.morning_briefing;
  const perf = dashboard.performance_insights;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-6">
        <p className="text-sm font-medium text-violet-900">{dashboard.positioning}</p>
        <p className="mt-2 text-sm text-violet-800">{dashboard.vision}</p>
        <p className="mt-3 text-xs text-violet-800">{dashboard.governance.principle}</p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.commandCenter}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.arrivalsToday} value={snap.arrivals_today} />
          <MetricCard label={labels.departuresToday} value={snap.departures_today} />
          <MetricCard label={labels.pendingApprovals} value={snap.pending_approvals} />
          <MetricCard label={labels.occupancyForecast} value={`${snap.occupancy_forecast_pct}%`} />
          <MetricCard label={labels.revenueSnapshot} value={snap.revenue_snapshot.toLocaleString()} />
          <MetricCard label={labels.propertyHealth} value={snap.property_health_score} />
          <MetricCard label={labels.guestAlerts} value={snap.guest_alerts} />
          <MetricCard label={labels.maintenanceTasks} value={snap.maintenance_tasks} />
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.morningBriefing}</h2>
          <p className="mt-3 font-medium text-gray-900">{briefing.greeting}</p>
          <p className="mt-2 text-sm font-medium text-gray-700">{labels.todaysOverview}</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {briefing.overview_lines.map((line) => (
              <li key={line}>· {line}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-medium text-gray-700">{labels.recommendedActions}</p>
          <ul className="mt-2 space-y-1 text-sm text-violet-900">
            {briefing.recommended_actions.map((action) => (
              <li key={action}>· {action}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.eveningBriefing}</h2>
          <p className="mt-2 text-sm font-medium text-gray-700">{labels.todaysPerformance}</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {dashboard.evening_briefing.summary_lines.map((line) => (
              <li key={line}>· {line}</li>
            ))}
          </ul>
        </article>
      </section>

      {dashboard.since_last_login.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.sinceLastLogin}</h2>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dashboard.since_last_login.map((item) => (
              <div key={item.key} className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs text-gray-500">{item.label}</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{item.count}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {dashboard.pending_approvals.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.approvalHub}</h2>
          <ul className="space-y-3">
            {dashboard.pending_approvals.map((item: HostsPendingApproval) => (
              <li key={item.key} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${impactStyle(item.impact)}`}>
                    {item.impact}
                  </span>
                  <Link
                    href="/app/approvals"
                    className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                  >
                    {labels.reviewApproval}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.recommendations.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.recommendations}</h2>
          <ul className="space-y-3">
            {dashboard.recommendations.map((rec: HostsCompanionRecommendation) => (
              <li key={rec.key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">{rec.label}</p>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {labels.impact}: {rec.impact}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {labels.effort}: {rec.effort}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-violet-900">{rec.next_step}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.companionChat}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.companion_prompts.map((prompt) => (
            <Link
              key={prompt}
              href="/app/assistant"
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm text-violet-900 hover:bg-violet-100"
            >
              {prompt}
            </Link>
          ))}
        </div>
      </section>

      {dashboard.memory_insights.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.companionMemory}</h2>
          <ul className="space-y-2">
            {dashboard.memory_insights.map((insight) => (
              <li key={insight} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {insight}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-500">{labels.memoryNote}</p>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.performanceInsights}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.responseSpeed} value={perf.response_speed_score} />
          <MetricCard label={labels.approvalEfficiency} value={perf.approval_efficiency_score} />
          <MetricCard label={labels.operationalConsistency} value={perf.operational_consistency_score} />
          <MetricCard label={labels.guestSatisfaction} value={perf.guest_satisfaction_score} />
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.executiveQuestions}</h2>
        <ul className="space-y-2">
          {dashboard.executive_questions.map((question) => (
            <li key={question} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              {question}
            </li>
          ))}
        </ul>
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
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.notificationCategories}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.notification_categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200"
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
          href="/app/assistant"
          className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100"
        >
          {labels.openCompanion}
        </Link>
        <Link
          href="/app/settings/employee-knowledge"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {labels.exploreKnowledge}
        </Link>
      </div>
    </div>
  );
}
