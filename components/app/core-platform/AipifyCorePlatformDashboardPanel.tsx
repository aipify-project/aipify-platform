"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAipifyCorePlatformDashboard,
  type AipifyCorePlatformDashboard,
} from "@/lib/aipify/core-platform";

type AipifyCorePlatformDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "connected":
    case "low":
    case "informational":
      return "bg-emerald-100 text-emerald-800";
    case "medium":
    case "moderate":
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "high":
    case "important":
    case "degraded":
      return "bg-orange-100 text-orange-800";
    case "critical":
    case "inactive":
    case "disconnected":
    case "error":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function AipifyCorePlatformDashboardPanel({ labels }: AipifyCorePlatformDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AipifyCorePlatformDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/core-platform/dashboard");
    if (res.ok) setDashboard(parseAipifyCorePlatformDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.homeOverview}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/platform-install" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.platformInstall}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
        </Link>
      </div>

      {dashboard.unonight_pilot_mode ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm text-blue-900">
          <span className="font-medium">{labels.pilotMode}</span>
          <p className="mt-1 text-xs text-blue-800">{labels.pilotNote}</p>
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-300 bg-slate-50/80 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.coreHealth}</h2>
        <p className="mt-2 text-4xl font-bold text-slate-800">
          {dashboard.core_health_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm text-slate-700">
          {dashboard.components_active ?? 0} {labels.componentsActive} · {dashboard.modules_enabled ?? 0}{" "}
          {labels.modulesEnabled}
        </p>
        <p className="mt-2 text-sm text-slate-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-slate-600">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {dashboard.dashboard_widgets.map((w) => (
          <div key={w.widget_key} className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-xs font-medium text-gray-700">{w.title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{w.count_value}</p>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{w.summary}</p>
          </div>
        ))}
      </section>

      {dashboard.core_components.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.coreComponents}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.core_components.map((c) => (
              <article key={c.component_key} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium capitalize text-slate-900">{c.component_key.replace(/_/g, " ")}</p>
                  <span className="text-sm font-bold text-slate-700">{c.health_score}/100</span>
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(c.status)}`}>
                  {c.status}
                </span>
                <p className="mt-2 text-xs text-slate-600">{c.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.supported_roles.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.authenticationRoles}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.supported_roles.map((r) => (
              <span key={r.key} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
                {r.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.ai_action_framework.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.aiActionFramework}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.ai_action_framework.map((a) => (
              <li key={a.action_key} className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
                <span className="font-medium text-violet-900">{a.action_label}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(a.risk_level)}`}>
                  {a.risk_level}
                </span>
                {a.auto_execute_allowed ? (
                  <span className="ml-2 text-xs text-emerald-700">{labels.autoAllowed}</span>
                ) : (
                  <span className="ml-2 text-xs text-amber-700">{labels.approvalRequired}</span>
                )}
                <p className="mt-1 text-xs text-violet-800">{a.example}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.tenant_modules.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.moduleFramework}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.tenant_modules.map((m) => (
              <div
                key={m.module_key}
                className={`rounded-lg border px-3 py-2 text-sm ${m.enabled ? "border-emerald-200 bg-emerald-50/40" : "border-gray-200 bg-gray-50"}`}
              >
                <p className="font-medium text-gray-900">{m.module_label}</p>
                <p className="text-xs capitalize text-gray-500">
                  {m.module_category} · {m.enabled ? labels.enabled : labels.disabled}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.integrations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrations}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.integrations.map((i) => (
              <li key={i.integration_key} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{i.integration_label}</span>
                  <span className="ml-2 text-xs capitalize text-gray-500">{i.integration_type}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(i.status)}`}>{i.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.pilot_principles && dashboard.pilot_principles.length > 0 ? (
        <section className="rounded-lg border border-blue-100 bg-blue-50/30 p-4">
          <h2 className="text-sm font-semibold text-blue-900">{labels.pilotPrinciples}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-blue-800">
            {dashboard.pilot_principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recent_audit_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.auditLogging}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_audit_events.map((e) => (
              <li key={e.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium capitalize">{e.event_type?.replace(/_/g, " ")}</span>
                <span className="ml-2 text-xs text-gray-500">({e.actor_type})</span>
                {e.summary ? <p className="mt-1 text-xs text-gray-600">{e.summary}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
