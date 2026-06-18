"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOperationsDashboardEngineDashboard,
  type OperationsDashboardEngineDashboard,
} from "@/lib/aipify/operations-dashboard-engine";

type OperationsDashboardEngineDashboardPanelProps = {
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

function widgetTitle(key: string, labels: Record<string, string>) {
  const map: Record<string, string> = {
    since_last_login: labels.sinceLastLogin,
    pending_tasks: labels.pendingTasks,
    pending_approvals: labels.pendingApprovals,
    support_overview: labels.supportOverview,
    recent_notifications: labels.recentNotifications,
    ai_recommendations: labels.aiRecommendations,
    integration_health: labels.integrationHealth,
    knowledge_center_status: labels.knowledgeCenterStatus,
    audit_activity: labels.auditActivity,
    organization_health_score: labels.organizationHealth,
  };
  return map[key] ?? key;
}

export function OperationsDashboardEngineDashboardPanel({
  labels,
}: OperationsDashboardEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<OperationsDashboardEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/operations-dashboard-engine/dashboard");
    if (res.ok) setDashboard(parseOperationsDashboardEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAlert(id: string, action: "dismiss" | "acknowledge") {
    setActionId(id);
    await fetch(`/api/aipify/operations-dashboard-engine/alerts/${id}/${action}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const health = dashboard.organization_health ?? {};
  const widgets = dashboard.widgets ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/admin-assistant-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.adminAssistant}
        </Link>
        <Link href="/app/support-ai-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.supportAi}
        </Link>
        <Link href="/app/customer-onboarding-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.customerOnboarding}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.operationsDashboard}</h2>
        <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.organizationHealth}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.score ?? 0}</p>
          <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${healthClass(health.status)}`}>
            {health.status ?? labels.unknown}
          </span>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeAlerts}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.active_alerts.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.userRole}</p>
          <p className="mt-1 text-lg font-semibold capitalize text-gray-900">{dashboard.user_role}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.visibleWidgets}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.preferences.filter((p) => p.enabled).length}</p>
        </div>
      </section>

      {(dashboard.active_alerts?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.activeAlerts}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.active_alerts.map((alert) => (
              <li key={alert.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 p-3">
                <div>
                  <span className={`rounded px-2 py-0.5 text-xs ${severityClass(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <p className="mt-1 text-sm font-medium text-gray-900">{alert.title}</p>
                  {alert.message ? <p className="text-xs text-gray-600">{alert.message}</p> : null}
                </div>
                <div className="flex gap-2">
                  {alert.severity === "critical" && !alert.acknowledged_at ? (
                    <button
                      type="button"
                      disabled={actionId === alert.id}
                      onClick={() => void handleAlert(alert.id, "acknowledge")}
                      className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-800"
                    >
                      {labels.acknowledge}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={actionId === alert.id}
                    onClick={() => void handleAlert(alert.id, "dismiss")}
                    className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  >
                    {labels.dismiss}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {dashboard.preferences
          .filter((p) => p.enabled)
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((pref) => {
            const data = widgets[pref.widget_key] as Record<string, unknown> | undefined;
            if (!data) return null;
            return (
              <div key={pref.widget_key} className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {widgetTitle(pref.widget_key, labels)}
                </h3>
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-gray-50 p-2 text-xs text-gray-700">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            );
          })}
      </section>

      {dashboard.principles?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
