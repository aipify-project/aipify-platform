"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseStatusTransparencyEngineDashboard,
  type StatusTransparencyEngineDashboard,
} from "@/lib/aipify/status-transparency-engine";

type StatusTransparencyEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "operational":
      return "bg-emerald-100 text-emerald-800";
    case "degraded_performance":
      return "bg-amber-100 text-amber-800";
    case "partial_outage":
      return "bg-orange-100 text-orange-800";
    case "major_outage":
      return "bg-rose-100 text-rose-800";
    case "maintenance":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function formatComponent(name: string) {
  return name.replace(/_/g, " ");
}

export function StatusTransparencyEngineDashboardPanel({
  labels,
}: StatusTransparencyEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<StatusTransparencyEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [publicPageEnabled, setPublicPageEnabled] = useState(true);
  const [tenantNotices, setTenantNotices] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/status-transparency-engine/dashboard");
    if (res.ok) {
      const parsed = parseStatusTransparencyEngineDashboard(await res.json());
      setDashboard(parsed);
      setPublicPageEnabled(parsed.settings?.public_status_page_enabled ?? true);
      setTenantNotices(parsed.settings?.tenant_notices_enabled ?? true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    setActionId("settings");
    await fetch("/api/status/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_status_page_enabled: publicPageEnabled,
        tenant_notices_enabled: tenantNotices,
      }),
    });
    await load();
    setActionId(null);
  }

  async function resolveIncident(id: string) {
    setActionId(id);
    await fetch(`/api/status/incidents/${id}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution_message: "Incident resolved from status dashboard." }),
    });
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) {
    return <div className="text-sm text-gray-600">{labels.noOrganization}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass(dashboard.overall_status)}`}
        >
          {labels.platformStatus}: {dashboard.overall_status ?? "operational"}
        </span>
        <Link href="/app/observability-platform-health-engine" className="text-sm text-blue-600 hover:underline">
          {labels.observabilityEngine}
        </Link>
        <Link href="/api/status/public" className="text-sm text-blue-600 hover:underline" target="_blank">
          {labels.publicStatus}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs uppercase text-gray-500">{labels.openIncidents}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.summary?.open_incidents ?? 0}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs uppercase text-gray-500">{labels.maintenanceActive}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.summary?.maintenance_active ?? 0}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs uppercase text-gray-500">{labels.monthlyUptime}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.summary?.monthly_uptime_avg ?? 99.9}%</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs uppercase text-gray-500">{labels.recentResolutions}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.recent_resolutions.length}</p>
        </div>
      </div>

      {dashboard.principles?.length ? (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-semibold text-gray-900">{labels.principles}</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
            {dashboard.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold text-gray-900">{labels.activeIncidents}</h2>
        {dashboard.active_incidents.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noActiveIncidents}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {dashboard.active_incidents.map((incident) => (
              <li key={incident.id} className="rounded border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{incident.title}</p>
                    <p className="text-sm text-gray-600">
                      {formatComponent(String(incident.component ?? "platform"))} · {incident.severity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${statusClass(incident.status)}`}>
                      {incident.status}
                    </span>
                    <button
                      type="button"
                      disabled={actionId === incident.id}
                      onClick={() => void resolveIncident(incident.id)}
                      className="rounded bg-gray-900 px-3 py-1 text-xs text-white disabled:opacity-50"
                    >
                      {labels.resolveIncident}
                    </button>
                  </div>
                </div>
                {incident.description ? (
                  <p className="mt-2 text-sm text-gray-600">{incident.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold text-gray-900">{labels.scheduledMaintenance}</h2>
        {dashboard.scheduled_maintenance.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noMaintenance}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.scheduled_maintenance.map((item) => (
              <li key={item.id} className="text-sm text-gray-700">
                <span className="font-medium">{item.title}</span>
                {item.description ? ` — ${item.description}` : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold text-gray-900">{labels.uptimeTrends}</h2>
        {dashboard.uptime_trends.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noUptimeData}</p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {dashboard.uptime_trends.slice(0, 8).map((metric) => (
              <div key={metric.id} className="rounded border p-2 text-sm">
                <p className="font-medium capitalize">{formatComponent(metric.component ?? "")}</p>
                <p className="text-gray-600">{metric.uptime_percentage}% · {metric.measurement_period}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold text-gray-900">{labels.statusSettings}</h2>
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={publicPageEnabled}
              onChange={(e) => setPublicPageEnabled(e.target.checked)}
            />
            {labels.publicStatusPage}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tenantNotices}
              onChange={(e) => setTenantNotices(e.target.checked)}
            />
            {labels.tenantNotices}
          </label>
        </div>
        <button
          type="button"
          disabled={actionId === "settings"}
          onClick={() => void saveSettings()}
          className="mt-3 rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {labels.saveSettings}
        </button>
      </div>
    </div>
  );
}
