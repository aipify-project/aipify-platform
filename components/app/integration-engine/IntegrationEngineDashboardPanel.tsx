"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseIntegrationEngineDashboard,
  type IntegrationEngineDashboard,
} from "@/lib/aipify/integration-engine";

type IntegrationEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "failed":
      return "bg-rose-100 text-rose-800";
    case "disabled":
    case "archived":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function IntegrationEngineDashboardPanel({ labels }: IntegrationEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<IntegrationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/integration-engine/dashboard");
    if (res.ok) setDashboard(parseIntegrationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(id: string, action: "sync" | "disable") {
    setActionId(id);
    await fetch(`/api/integrations/${id}/${action}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  async function connectUnonight() {
    setActionId("unonight");
    await fetch("/api/integrations/unonight/connect", { method: "POST", body: "{}" });
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const health = dashboard.health_summary ?? {};
  const pilot = dashboard.unonight_pilot;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/support-ai-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.supportAi}
        </Link>
        <Link href="/app/audit-accountability" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.auditAccountability}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.integrationEngine}</h2>
        <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeIntegrations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.active ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.failedIntegrations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.failed ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingIntegrations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.pending ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.disabledIntegrations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.disabled ?? 0}</p>
        </div>
      </section>

      <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-violet-900">{labels.unonightPilot}</h2>
            <p className="mt-1 text-xs text-violet-700">
              {pilot?.connected ? labels.unonightConnected : labels.unonightNotConnected}
              {pilot?.last_sync_at ? ` · ${labels.lastSync}: ${new Date(pilot.last_sync_at).toLocaleString()}` : ""}
            </p>
          </div>
          {!pilot?.connected ? (
            <button
              type="button"
              disabled={actionId === "unonight"}
              onClick={() => void connectUnonight()}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {labels.connectUnonight}
            </button>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.connectedIntegrations}</h2>
        {dashboard.connected_integrations.length === 0 ? (
          <p className="mt-3 text-xs text-gray-500">{labels.noIntegrations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.connected_integrations.map((i) => (
              <li key={i.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">{i.integration_name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(i.status)}`}>
                    {i.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {i.integration_key}
                  {i.last_sync_at ? ` · ${labels.lastSync}: ${new Date(i.last_sync_at).toLocaleString()}` : ""}
                  {i.has_credentials ? ` · ${labels.credentialsStored}` : ""}
                </p>
                {i.last_error ? <p className="mt-1 text-xs text-rose-600">{i.last_error}</p> : null}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={actionId === i.id}
                    onClick={() => void runAction(i.id, "sync")}
                    className="rounded border border-violet-200 px-2 py-0.5 text-xs text-violet-800 disabled:opacity-50"
                  >
                    {labels.sync}
                  </button>
                  {i.enabled ? (
                    <button
                      type="button"
                      disabled={actionId === i.id}
                      onClick={() => void runAction(i.id, "disable")}
                      className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-700 disabled:opacity-50"
                    >
                      {labels.disable}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.pending_actions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-amber-800">{labels.pendingActions}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.pending_actions.map((a) => (
              <li key={a.id} className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
                <span className="font-medium">{a.integration_name}</span>
                <p className="text-xs text-amber-700">{a.warning}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentFailures}</h2>
          {dashboard.recent_failures.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">{labels.noFailures}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dashboard.recent_failures.map((f) => (
                <li key={f.id} className="rounded-lg border border-rose-100 bg-rose-50/30 px-3 py-2 text-sm">
                  <p className="text-rose-800">{f.error_message}</p>
                  <p className="text-xs text-gray-500">
                    {f.sync_type} · retries {f.retry_count ?? 0}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentWebhooks}</h2>
          {dashboard.recent_webhooks.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">{labels.noWebhooks}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dashboard.recent_webhooks.map((w) => (
                <li key={w.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <span className="font-medium">{w.event_type}</span>
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(w.status)}`}>
                    {w.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {dashboard.catalog.filter((c) => c.is_future).length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.futureIntegrations}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.catalog
              .filter((c) => c.is_future)
              .map((c) => (
                <span key={c.integration_key} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {c.integration_name}
                </span>
              ))}
          </div>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h2 className="text-sm font-semibold text-violet-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-violet-800">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
