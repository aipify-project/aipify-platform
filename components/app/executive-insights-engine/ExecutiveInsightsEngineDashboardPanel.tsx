"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseExecutiveInsightsEngineDashboard,
  type ExecutiveInsightsEngineDashboard,
} from "@/lib/aipify/executive-insights-engine";

type Props = { labels: Record<string, string> };

function healthClass(status?: string) {
  switch (status) {
    case "excellent":
      return "bg-emerald-100 text-emerald-800";
    case "healthy":
      return "bg-sky-100 text-sky-800";
    case "needs_attention":
      return "bg-amber-100 text-amber-800";
    case "action_recommended":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function urgencyClass(urgency?: string) {
  switch (urgency) {
    case "critical":
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function ExecutiveInsightsEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ExecutiveInsightsEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/executive-insights-engine/dashboard");
    if (res.ok) setDashboard(parseExecutiveInsightsEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generateReport(period: string) {
    setActionId(`report-${period}`);
    const res = await fetch("/api/executive/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reporting_period: period }),
    });
    if (res.ok) {
      const report = (await res.json()) as { id?: string };
      if (report.id) await fetch(`/api/executive/reports/${report.id}/export`);
    }
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const health = dashboard.organization_health ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/analytics-insights-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.analytics}
        </Link>
        <Link href="/app/operations-dashboard-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.operations}
        </Link>
        <Link href="/app/customer-success-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.customerSuccess}
        </Link>
        <Link href="/app/strategy" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.strategicIntelligence}
        </Link>
        <Link href="/app/executive" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.executiveDashboard}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${healthClass(summary.health_status as string)}`}
          >
            {String(summary.health_status ?? "healthy")}
          </span>
        </div>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.safety_note}</p>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.organizationHealth}</p>
          <p className="mt-1 text-2xl font-semibold">{String(health.score ?? summary.health_score ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.operationalRisks}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.risk_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.strategicOpportunities}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.opportunity_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.actionsRequiringAttention}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.action_count ?? 0)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={actionId !== null}
          onClick={() => void generateReport("weekly")}
          className="rounded-lg bg-violet-700 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {actionId === "report-weekly" ? labels.generating : labels.generateWeekly}
        </button>
        <button
          type="button"
          disabled={actionId !== null}
          onClick={() => void generateReport("monthly")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          {actionId === "report-monthly" ? labels.generating : labels.generateMonthly}
        </button>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.majorAchievements}</h3>
        {(dashboard.major_achievements ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.major_achievements.map((item, idx) => (
              <li key={String(item.title ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{String(item.title ?? "")}</span>
                {item.summary ? <span className="text-gray-600"> · {String(item.summary)}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.operationalRisks}</h3>
        {(dashboard.operational_risks ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.operational_risks.slice(0, 8).map((item, idx) => (
              <li key={String(item.title ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{String(item.title ?? "")}</span>
                  {item.severity ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${urgencyClass(item.severity)}`}>
                      {String(item.severity)}
                    </span>
                  ) : null}
                </div>
                {item.source_label ? (
                  <p className="mt-1 text-xs text-gray-500">{String(item.source_label)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.strategicOpportunities}</h3>
        {(dashboard.strategic_opportunities ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.strategic_opportunities.slice(0, 8).map((item, idx) => (
              <li key={String(item.title ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.title ?? "")}
                {item.summary ? <span className="text-gray-600"> · {String(item.summary)}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.customerTrends}</h3>
        {(dashboard.customer_trends ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.customer_trends.map((trend, idx) => (
              <div key={String(trend.metric ?? idx)} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="text-xs text-gray-500">{String(trend.metric ?? "")}</p>
                <p className="mt-1 font-semibold">{String(trend.value ?? "—")}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendedActions}</h3>
        {(dashboard.recommended_actions ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {dashboard.recommended_actions.map((action, idx) => (
              <li key={String(action.action_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{String(action.title ?? "")}</span>
                  {action.urgency ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${urgencyClass(action.urgency)}`}>
                      {String(action.urgency)}
                    </span>
                  ) : null}
                </div>
                {action.rationale ? <p className="mt-1 text-gray-600">{String(action.rationale)}</p> : null}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  {action.expected_outcome ? <span>{labels.expectedOutcome}: {String(action.expected_outcome)}</span> : null}
                  {action.estimated_effort ? <span>{labels.estimatedEffort}: {String(action.estimated_effort)}</span> : null}
                </div>
                {action.route ? (
                  <Link href={String(action.route)} className="mt-2 inline-block text-xs text-violet-700">
                    {labels.openModule}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recentReports}</h3>
        {(dashboard.recent_reports ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recent_reports.map((report, idx) => (
              <li key={String(report.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium capitalize">{String(report.reporting_period ?? "")}</span>
                <span className="text-gray-500"> · {String(report.created_at ?? "")}</span>
                {report.summary ? <p className="mt-1 text-gray-600">{String(report.summary)}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
