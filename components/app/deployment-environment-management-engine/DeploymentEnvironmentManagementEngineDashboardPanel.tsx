"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDeploymentEnvironmentManagementEngineDashboard,
  type DeploymentEnvironmentManagementEngineDashboard,
} from "@/lib/aipify/deployment-environment-management-engine";

type DeploymentEnvironmentManagementEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "active":
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "maintenance":
    case "scheduled":
    case "in_progress":
      return "bg-amber-100 text-amber-800";
    case "failed":
      return "bg-rose-100 text-rose-800";
    case "rolled_back":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatKey(key?: string) {
  return (key ?? "").replace(/_/g, " ");
}

export function DeploymentEnvironmentManagementEngineDashboardPanel({
  labels,
}: DeploymentEnvironmentManagementEngineDashboardPanelProps) {
  const [dashboard, setDashboard] =
    useState<DeploymentEnvironmentManagementEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/deployment-environment-management-engine/dashboard");
    if (res.ok) {
      setDashboard(parseDeploymentEnvironmentManagementEngineDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function rollbackRelease(id: string) {
    setActionKey(id);
    await fetch(`/api/deployments/${id}/rollback`, { method: "POST" });
    await load();
    setActionKey(null);
  }

  async function toggleFlag(featureKey: string, enabled: boolean, environment?: string) {
    setActionKey(`flag-${featureKey}`);
    await fetch("/api/feature-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature_key: featureKey, enabled, environment }),
    });
    await load();
    setActionKey(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/settings/updates" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.updateEngine}
        </Link>
        <Link href="/app/unonight-pilot-operations-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.unonightPilot}
        </Link>
        <Link href="/app/notification-communication-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.notifications}
        </Link>
        <Link href="/app/governance-policy-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.governance}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.deploymentEngine}</h2>
        <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        {dashboard.pilot_flow?.[0] && (
          <p className="mt-2 text-xs text-indigo-600">
            {labels.pilotFlow}: {dashboard.pilot_flow[0]}
          </p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeEnvironments}</p>
          <p className="mt-1 text-2xl font-semibold">{summary.active_environments ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.rollbackReady}</p>
          <p className="mt-1 text-2xl font-semibold">{summary.rollback_ready_releases ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.enabledFlags}</p>
          <p className="mt-1 text-2xl font-semibold">{summary.enabled_flags ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeRollouts}</p>
          <p className="mt-1 text-2xl font-semibold">{summary.active_rollouts ?? 0}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.environments}</h3>
        <div className="mt-4 space-y-2">
          {dashboard.environments.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noEnvironments}</p>
          ) : (
            dashboard.environments.map((env) => (
              <div
                key={env.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{env.environment_name}</p>
                  <p className="text-xs text-gray-500">{formatKey(env.environment_key)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">v{env.deployment_version}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(env.status)}`}>
                    {env.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.deploymentHistory}</h3>
        <div className="mt-4 space-y-2">
          {dashboard.deployment_history.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noReleases}</p>
          ) : (
            dashboard.deployment_history.map((release) => (
              <div
                key={release.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {release.environment_name} — {release.release_version}
                  </p>
                  {release.release_notes && (
                    <p className="text-xs text-gray-500">{release.release_notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(release.outcome)}`}>
                    {release.outcome}
                  </span>
                  {release.rollback_available && release.outcome === "completed" && (
                    <button
                      type="button"
                      disabled={actionKey === release.id}
                      onClick={() => void rollbackRelease(release.id)}
                      className="rounded border border-orange-200 px-2 py-0.5 text-xs text-orange-800"
                    >
                      {labels.rollback}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.featureFlags}</h3>
        <div className="mt-4 space-y-2">
          {dashboard.feature_flags.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noFlags}</p>
          ) : (
            dashboard.feature_flags.map((flag) => (
              <div
                key={flag.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{formatKey(flag.feature_key)}</p>
                  <p className="text-xs text-gray-500">
                    {flag.environment} · {flag.rollout_percentage}%
                  </p>
                </div>
                <button
                  type="button"
                  disabled={actionKey === `flag-${flag.feature_key}`}
                  onClick={() => void toggleFlag(flag.feature_key, !flag.enabled, flag.environment)}
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    flag.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {flag.enabled ? labels.enabled : labels.disabled}
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.rolloutProgress}</h3>
        <div className="mt-4 space-y-2">
          {dashboard.rollouts.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noRollouts}</p>
          ) : (
            dashboard.rollouts.map((rollout) => (
              <div
                key={rollout.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{formatKey(rollout.feature_key)}</p>
                  <p className="text-xs text-gray-500">{formatKey(rollout.strategy)}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(rollout.status)}`}>
                  {rollout.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.enterprise_hooks && (
        <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.enterpriseHooks}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{labels.enterpriseHooksNote}</p>
        </section>
      )}
    </div>
  );
}
