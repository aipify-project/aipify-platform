"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAnalyticsInsightsEngineDashboard,
  type AnalyticsInsightsEngineDashboard,
} from "@/lib/aipify/analytics-insights-engine";

type AnalyticsInsightsEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function healthClass(status?: string) {
  switch (status) {
    case "excellent":
      return "bg-emerald-100 text-emerald-800";
    case "healthy":
      return "bg-teal-100 text-teal-800";
    case "needs_attention":
      return "bg-amber-100 text-amber-800";
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function severityClass(severity?: string) {
  switch (severity) {
    case "critical":
      return "bg-rose-100 text-rose-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "moderate":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatCategory(category?: string) {
  return (category ?? "").replace(/_/g, " ");
}

function formatMetricKey(key: string) {
  return key.split(".").pop()?.replace(/_/g, " ") ?? key;
}

export function AnalyticsInsightsEngineDashboardPanel({
  labels,
}: AnalyticsInsightsEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AnalyticsInsightsEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/analytics-insights-engine/dashboard");
    if (res.ok) setDashboard(parseAnalyticsInsightsEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function refreshMetrics() {
    setActionId("refresh");
    await fetch("/api/analytics/metrics", { method: "POST" });
    await load();
    setActionId(null);
  }

  async function generateInsights() {
    setActionId("insights");
    await fetch("/api/analytics/insights", { method: "POST" });
    await load();
    setActionId(null);
  }

  async function createReport(type: string) {
    setActionId(`report-${type}`);
    const res = await fetch("/api/analytics/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: type }),
    });
    if (res.ok) {
      const report = (await res.json()) as { id?: string };
      if (report.id) {
        await fetch(`/api/analytics/reports/${report.id}/export`);
      }
    }
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const health = dashboard.organization_health ?? {};
  const kpis = dashboard.kpi_overview ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/operations-dashboard-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.operationsDashboard}
        </Link>
        <Link href="/app/support-ai-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.supportAi}
        </Link>
        <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/quality-guardian-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.qualityGuardian}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.analyticsEngine}</h2>
        <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void refreshMetrics()}
          disabled={actionId !== null}
          className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {labels.refreshMetrics}
        </button>
        <button
          type="button"
          onClick={() => void generateInsights()}
          disabled={actionId !== null}
          className="rounded-lg border border-violet-300 px-3 py-1.5 text-sm text-violet-900 disabled:opacity-50"
        >
          {labels.generateInsights}
        </button>
        <button
          type="button"
          onClick={() => void createReport("weekly")}
          disabled={actionId !== null}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {labels.exportWeekly}
        </button>
        <button
          type="button"
          onClick={() => void createReport("monthly")}
          disabled={actionId !== null}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {labels.exportMonthly}
        </button>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.organizationHealth}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.score ?? 0}</p>
          <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${healthClass(health.status)}`}>
            {health.status ?? labels.unknown}
          </span>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeInsights}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.insights?.length ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.metricsTracked}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{Object.keys(kpis).length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.userRole}</p>
          <p className="mt-1 text-lg font-semibold capitalize text-gray-900">{dashboard.user_role ?? labels.unknown}</p>
        </div>
      </section>

      {Object.keys(kpis).length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.kpiOverview}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(kpis).map(([key, val]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                <p className="text-xs font-medium capitalize text-gray-600">{formatMetricKey(key)}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{val.value ?? 0}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(dashboard.improvement_opportunities?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold text-amber-900">{labels.improvementOpportunities}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.improvement_opportunities?.map((item) => (
              <li key={item.insight_key} className="rounded-lg border border-amber-100 bg-white p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{item.title}</span>
                  <span className={`rounded px-2 py-0.5 text-xs ${severityClass(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
                {item.suggested_action && (
                  <p className="mt-1 text-xs text-gray-600">{item.suggested_action}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.insights?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.insights}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.insights?.map((insight) => (
              <li key={insight.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{insight.title}</span>
                  <span className={`rounded px-2 py-0.5 text-xs ${severityClass(insight.severity)}`}>
                    {insight.severity}
                  </span>
                  <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">
                    {labels.confidence}: {insight.confidence}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-700">
                    {formatCategory(insight.category)}
                  </span>
                </div>
                {insight.description && <p className="mt-1 text-sm text-gray-600">{insight.description}</p>}
                {insight.suggested_action && (
                  <p className="mt-1 text-xs text-violet-800">{insight.suggested_action}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.reports?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reports}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.reports?.map((report) => (
              <li key={report.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 p-3 text-sm">
                <span className="capitalize text-gray-900">{report.report_type}</span>
                <span className="text-xs text-gray-500">{report.status}</span>
                <span className="text-xs text-gray-500">
                  {report.generated_at ? new Date(report.generated_at).toLocaleDateString() : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(dashboard.principles) && dashboard.principles.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
