"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  PilotChecklistItem,
  PilotDashboard,
  PilotEvent,
  PilotInstallStatus,
  PilotIntegration,
  PilotModule,
} from "@/lib/aipify/pilot";

type UnonightPilotInstallPanelProps = {
  labels: Record<string, string>;
};

type ActionState = "idle" | "loading" | "error";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

function StatusBadge({ value, tone }: { value: string; tone?: "green" | "amber" | "gray" }) {
  const colors =
    tone === "green"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${colors}`}>
      {value}
    </span>
  );
}

export function UnonightPilotInstallPanel({ labels }: UnonightPilotInstallPanelProps) {
  const [status, setStatus] = useState<PilotInstallStatus | null>(null);
  const [modules, setModules] = useState<PilotModule[]>([]);
  const [integrations, setIntegrations] = useState<PilotIntegration[]>([]);
  const [checklist, setChecklist] = useState<PilotChecklistItem[]>([]);
  const [events, setEvents] = useState<PilotEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<ActionState>("idle");
  const [actionError, setActionError] = useState<string | null>(null);

  const tenantId = status?.profile?.tenant_id;
  const dashboard = status?.dashboard as PilotDashboard | undefined;

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const installStatus = await fetchJson<PilotInstallStatus>(
        "/api/aipify/install/unonight/status"
      );
      setStatus(installStatus);

      if (installStatus.profile?.tenant_id) {
        const id = installStatus.profile.tenant_id;
        const [mods, ints, list, evts] = await Promise.all([
          fetchJson<PilotModule[]>(`/api/aipify/tenants/${id}/modules`),
          fetchJson<PilotIntegration[]>(`/api/aipify/tenants/${id}/integrations`),
          fetchJson<PilotChecklistItem[]>(`/api/aipify/tenants/${id}/pilot-checklist`),
          fetchJson<PilotEvent[]>(`/api/aipify/tenants/${id}/pilot-events?limit=10`),
        ]);
        setModules(mods);
        setIntegrations(ints);
        setChecklist(list);
        setEvents(evts);
      } else {
        setModules([]);
        setIntegrations([]);
        setChecklist([]);
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function runAction(url: string, method = "POST") {
    setAction("loading");
    setActionError(null);
    try {
      await fetchJson(url, { method });
      await reload();
      setAction("idle");
    } catch (error) {
      setAction("error");
      setActionError(error instanceof Error ? error.message : "Action failed");
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {actionError}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900">{labels.status}</h2>
          {status?.exists && dashboard ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">{labels.safeMode}</p>
                <p className="mt-1 font-medium">
                  {dashboard.safe_mode ? labels.safeModeOn : labels.safeModeOff}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{labels.supportMode}</p>
                <p className="mt-1 font-medium">{dashboard.support_ai_mode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{labels.knowledge}</p>
                <p className="mt-1 font-medium">{dashboard.knowledge_articles_count} articles</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{labels.discovery}</p>
                <p className="mt-1 font-medium">
                  {dashboard.last_discovery_run?.status
                    ? String(dashboard.last_discovery_run.status)
                    : labels.notRun}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{labels.pendingApprovals}</p>
                <p className="mt-1 font-medium">{dashboard.pending_approvals}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{labels.blockedActions}</p>
                <p className="mt-1 font-medium">{dashboard.blocked_actions}</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-600">{labels.notProvisioned}</p>
          )}
        </div>

        <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-4">
          <h2 className="text-sm font-semibold text-violet-900">{labels.nextStep}</h2>
          <p className="mt-2 text-sm text-violet-800">
            {dashboard?.next_recommended_step ?? labels.createTenantFirst}
          </p>
          <p className="mt-3 text-xs text-violet-700">
            {labels.completeness}: {dashboard?.setup_completeness_score ?? 0}%
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={action === "loading"}
          onClick={() => void runAction("/api/aipify/install/unonight/create-tenant")}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {labels.createTenant}
        </button>
        <button
          type="button"
          disabled={action === "loading" || !tenantId}
          onClick={() => void runAction("/api/aipify/install/unonight/enable-safe-modules")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.enableSafeModules}
        </button>
        <button
          type="button"
          disabled={action === "loading" || !tenantId}
          onClick={() => void runAction("/api/aipify/install/unonight/seed-knowledge")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.seedKnowledge}
        </button>
        <button
          type="button"
          disabled={action === "loading" || !tenantId}
          onClick={() => void runAction("/api/aipify/install/unonight/run-discovery")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.runDiscovery}
        </button>
        {tenantId ? (
          <Link
            href={`/platform/customers/${tenantId}/pilot-status`}
            className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900"
          >
            {labels.openDashboard}
          </Link>
        ) : null}
      </div>

      {tenantId ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{labels.modules}</h2>
              <Link href={`/platform/customers/${tenantId}/modules`} className="text-xs text-violet-700">
                {labels.viewAll}
              </Link>
            </div>
            <ul className="mt-3 space-y-2">
              {modules.slice(0, 8).map((m) => (
                <li key={m.module_key} className="flex items-center justify-between text-sm">
                  <span>{m.module_key}</span>
                  <StatusBadge value={m.mode} tone={m.enabled ? "green" : "gray"} />
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{labels.integrationsTitle}</h2>
              <Link
                href={`/platform/customers/${tenantId}/integrations`}
                className="text-xs text-violet-700"
              >
                {labels.viewAll}
              </Link>
            </div>
            <ul className="mt-3 space-y-2">
              {integrations.map((i) => (
                <li key={i.integration_key} className="flex items-center justify-between text-sm">
                  <span>{i.display_name}</span>
                  <StatusBadge
                    value={i.status}
                    tone={i.status === "connected" ? "green" : "amber"}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-4 lg:col-span-2">
            <h2 className="text-sm font-semibold">{labels.checklist}</h2>
            <ul className="mt-3 divide-y divide-gray-100">
              {checklist.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{item.title}</span>
                  <StatusBadge
                    value={item.status}
                    tone={item.status === "completed" ? "green" : "amber"}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-4 lg:col-span-2">
            <h2 className="text-sm font-semibold">{labels.recentEvents}</h2>
            <ul className="mt-3 space-y-2">
              {events.map((e) => (
                <li key={e.id} className="rounded border border-gray-100 px-3 py-2 text-sm">
                  <div className="font-medium">{e.title}</div>
                  {e.summary ? <p className="text-gray-600">{e.summary}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  );
}
