"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseUnonightPilotHealthDashboard,
  type UnonightPilotHealthDashboard,
} from "@/lib/unonight-pilot";

type UnonightPilotHealthPanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  healthState: string;
  killSwitch: string;
  killSwitchOn: string;
  killSwitchOff: string;
  readOnly: string;
  shadowMode: string;
  dataSources: string;
  syncRuns: string;
  discoveryReports: string;
  auditLogs: string;
  shadowPrepared: string;
  privacyNote: string;
  enableDiscovery: string;
  enableReadOnly: string;
  enableShadowMode: string;
  pause: string;
  disable: string;
  activateKillSwitch: string;
  deactivateKillSwitch: string;
  runDiscovery: string;
  runSync: string;
  approveSource: string;
  externalConnectionNote: string;
  healthStates: Record<string, string>;
};

type UnonightPilotHealthPanelProps = {
  labels: UnonightPilotHealthPanelLabels;
};

export function UnonightPilotHealthPanel({ labels }: UnonightPilotHealthPanelProps) {
  const [dashboard, setDashboard] = useState<UnonightPilotHealthDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform/unonight-pilot/center");
    if (res.ok) setDashboard(parseUnonightPilotHealthDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(action: string, payload?: Record<string, unknown>) {
    setBusy(true);
    await fetch("/api/platform/unonight-pilot/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runDiscovery() {
    setBusy(true);
    await fetch("/api/platform/unonight-pilot/discovery", { method: "POST" });
    setBusy(false);
    await load();
  }

  async function runSync() {
    setBusy(true);
    await fetch("/api/platform/unonight-pilot/sync", { method: "POST", body: "{}" });
    setBusy(false);
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  if (!dashboard?.found) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-4 text-gray-600">{dashboard?.reason ?? "Unonight organization not found."}</p>
      </div>
    );
  }

  const settings = dashboard.settings;
  const healthLabel =
    labels.healthStates[settings?.health_state ?? "disabled"] ?? settings?.health_state;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {dashboard.privacy_note && (
          <p className="mt-3 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-900">
            {labels.privacyNote}
          </p>
        )}
        <p className="mt-2 text-sm text-amber-800">{labels.externalConnectionNote}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-gray-500">{labels.healthState}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{healthLabel}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-gray-500">{labels.killSwitch}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {settings?.kill_switch ? labels.killSwitchOn : labels.killSwitchOff}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-gray-500">{labels.readOnly}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{settings?.read_only ? "On" : "Off"}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-gray-500">{labels.shadowMode}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{settings?.shadow_mode ? "On" : "Off"}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { action: "enable_discovery", label: labels.enableDiscovery },
          { action: "enable_read_only", label: labels.enableReadOnly },
          { action: "enable_shadow_mode", label: labels.enableShadowMode },
          { action: "pause", label: labels.pause },
          { action: "disable", label: labels.disable },
          {
            action: settings?.kill_switch ? "kill_switch_off" : "kill_switch_on",
            label: settings?.kill_switch ? labels.deactivateKillSwitch : labels.activateKillSwitch,
          },
        ].map((btn) => (
          <button
            key={btn.action}
            type="button"
            disabled={busy}
            onClick={() => void runAction(btn.action)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            {btn.label}
          </button>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => void runDiscovery()}
          className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {labels.runDiscovery}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runSync()}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {labels.runSync}
        </button>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">{labels.dataSources}</h2>
        <ul className="mt-3 space-y-2">
          {(dashboard.data_sources ?? []).map((source) => (
            <li
              key={source.source_key}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-gray-900">{source.display_name}</p>
                <p className="text-gray-500">
                  {source.source_key} · {source.sync_status}
                  {source.last_sync_at ? ` · ${source.last_sync_at}` : ""}
                </p>
              </div>
              {!source.allowed && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void runAction("approve_source", { source_key: source.source_key })
                  }
                  className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                >
                  {labels.approveSource}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">{labels.syncRuns}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {(dashboard.recent_sync_runs ?? []).slice(0, 5).map((run) => (
              <li key={run.id}>
                {run.source_key} — {run.status} ({run.records_ingested} ingested)
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">{labels.discoveryReports}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {(dashboard.discovery_reports ?? []).map((report) => (
              <li key={report.report_key}>
                {report.report_key} — {report.status}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            {labels.shadowPrepared}: {dashboard.shadow_recommendations_prepared ?? 0}
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">{labels.auditLogs}</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          {(dashboard.audit_logs ?? []).slice(0, 10).map((log, index) => (
            <li key={`${log.action}-${log.created_at}-${index}`}>
              {log.created_at} · {log.action} ({log.actor_type})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
