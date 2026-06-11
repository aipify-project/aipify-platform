"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseObservabilityPlatformHealthEngineDashboard,
  type ObservabilityPlatformHealthEngineDashboard,
} from "@/lib/aipify/observability-platform-health-engine";

type ObservabilityPlatformHealthEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "healthy":
      return "bg-emerald-100 text-emerald-800";
    case "degraded":
    case "needs_attention":
      return "bg-amber-100 text-amber-800";
    case "unavailable":
    case "critical":
      return "bg-rose-100 text-rose-800";
    case "maintenance":
      return "bg-sky-100 text-sky-800";
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
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatComponent(name: string) {
  return name.replace(/_/g, " ");
}

export function ObservabilityPlatformHealthEngineDashboardPanel({
  labels,
}: ObservabilityPlatformHealthEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<ObservabilityPlatformHealthEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [proactiveMonitoring, setProactiveMonitoring] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/observability-platform-health-engine/dashboard");
    if (res.ok) {
      const parsed = parseObservabilityPlatformHealthEngineDashboard(await res.json());
      setDashboard(parsed);
      setProactiveMonitoring(parsed.settings?.proactive_monitoring_enabled ?? true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runHealthCheck() {
    setActionId("check");
    await fetch("/api/observability/status", { method: "POST" });
    await load();
    setActionId(null);
  }

  async function saveSettings() {
    setActionId("settings");
    await fetch("/api/observability/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proactive_monitoring_enabled: proactiveMonitoring }),
    });
    await load();
    setActionId(null);
  }

  async function resolveIncident(id: string) {
    setActionId(id);
    await fetch(`/api/incidents/${id}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution_notes: "Resolved from observability dashboard" }),
    });
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const components = dashboard.components ?? {};
  const recovery = dashboard.recovery_progress ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/operations-dashboard-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.operationsDashboard}
        </Link>
        <Link href="/app/integration-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.integrationEngine}
        </Link>
        <Link href="/app/notification-communication-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.notifications}
        </Link>
        <Link href="/app/analytics-insights-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.analytics}
        </Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-teal-900">{labels.observabilityEngine}</h2>
            <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
            <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(dashboard.overall_status)}`}>
              {labels.platformStatus}: {dashboard.overall_status ?? "unknown"}
            </span>
            <button
              type="button"
              disabled={actionId === "check"}
              onClick={() => void runHealthCheck()}
              className="rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-sm text-teal-900"
            >
              {labels.runHealthCheck}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.openIncidents}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{recovery.open_incidents ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.degradedComponents}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{recovery.degraded_components ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.resolvedIncidents}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{recovery.resolved_incidents_30d ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.maintenanceWindows}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.maintenance_windows.length}</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">{labels.componentStatus}</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(components).map(([key, comp]) => (
            <div key={key} className="rounded-lg border border-gray-100 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium capitalize text-gray-900">{formatComponent(key)}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(comp.status)}`}>
                  {comp.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">{comp.message}</p>
            </div>
          ))}
          {Object.keys(components).length === 0 && (
            <p className="text-sm text-gray-500">{labels.noComponents}</p>
          )}
        </div>
      </section>

      {(dashboard.active_incidents?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.activeIncidents}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.active_incidents.map((incident) => (
              <li key={incident.id} className="rounded-lg border border-rose-100 bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{incident.incident_summary}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${severityClass(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                        {incident.status}
                      </span>
                    </div>
                  </div>
                  {incident.status !== "resolved" && (
                    <button
                      type="button"
                      disabled={actionId === incident.id}
                      onClick={() => void resolveIncident(incident.id)}
                      className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-800"
                    >
                      {labels.resolveIncident}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.recent_outages?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recentOutages}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_outages.slice(0, 8).map((event) => (
              <li key={event.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="capitalize text-gray-900">{formatComponent(String(event.component))}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(event.status)}`}>
                  {event.status}
                </span>
                <span className="text-xs text-gray-500">{event.message}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.response_time_trends?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.responseTimeTrends}</h3>
          <ul className="mt-3 space-y-1">
            {dashboard.response_time_trends.slice(0, 10).map((trend, idx) => (
              <li key={`${trend.period_date}-${trend.metric_key}-${idx}`} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {trend.period_date} · {(trend.metric_key ?? "").split(".").pop()?.replace(/_/g, " ")}
                </span>
                <span className="font-medium text-gray-900">{trend.metric_value}h</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.maintenance_windows?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-sky-200 bg-sky-50/30 p-4">
          <h3 className="text-sm font-semibold text-sky-900">{labels.upcomingMaintenance}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.maintenance_windows.map((window) => (
              <li key={window.id} className="rounded-lg border border-sky-100 bg-white p-3 text-sm">
                <p className="font-medium text-gray-900">{window.title}</p>
                <p className="mt-1 text-xs text-gray-600">
                  {window.scheduled_start} → {window.scheduled_end}
                </p>
                <span className="mt-1 inline-block rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
                  {window.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">{labels.monitoringSettings}</h3>
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={proactiveMonitoring}
            onChange={(e) => setProactiveMonitoring(e.target.checked)}
          />
          {labels.proactiveMonitoring}
        </label>
        <button
          type="button"
          disabled={actionId === "settings"}
          onClick={() => void saveSettings()}
          className="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          {labels.saveSettings}
        </button>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
            {dashboard.principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
