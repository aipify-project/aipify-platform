"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseCapacityWorkloadManagementEngineDashboard,
  type CapacityRebalancingRecommendation,
  type CapacityWorkloadManagementEngineDashboard,
  type OrganizationWorkloadItem,
  type OrganizationWorkloadWarning,
} from "@/lib/aipify/capacity-workload-management-engine";

type Props = { labels: Record<string, string> };

export function CapacityWorkloadManagementEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CapacityWorkloadManagementEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/capacity-workload-management-engine/dashboard");
    if (res.ok) setDashboard(parseCapacityWorkloadManagementEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const workloadAction = async (payload: Record<string, unknown>) => {
    setActionError(null);
    const res = await fetch("/api/aipify/capacity-workload-management-engine/workload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
      return false;
    }
    await load();
    return true;
  };

  const acknowledgeWarning = async (warning: OrganizationWorkloadWarning) => {
    if (!warning.id) return;
    setBusyId(warning.id);
    await workloadAction({ action: "acknowledge_warning", warning_id: warning.id });
    setBusyId(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/capacity-workload-management-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const sections = dashboard.sections ?? {};
  const recommendations = dashboard.recommendations ?? [];
  const unassigned = sections.unassigned_work ?? [];
  const warnings = dashboard.warnings ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-amber-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-amber-300 px-3 py-1 text-xs text-amber-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.overloadedUsers}</dt><dd>{String(summary.overloaded_users ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.openWarnings}</dt><dd>{String(summary.open_warnings ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.unassignedWork}</dt><dd>{String(summary.unassigned_work ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.upcomingRisks}</dt><dd>{String(summary.upcoming_risks_7d ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.openWorkloadItems}</dt><dd>{String(summary.open_workload_items ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.criticalWarnings}</dt><dd>{String(summary.critical_warnings ?? 0)}</dd></div>
        </dl>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recommendations}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {(recommendations as CapacityRebalancingRecommendation[]).map((rec, i) => (
              <li key={`${rec.type ?? "rec"}-${i}`} className="rounded border border-gray-100 p-2">
                <span className="text-xs uppercase text-gray-500">{rec.type} · {rec.confidence}</span>
                <p className="mt-1">{rec.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {warnings.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.warnings}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {warnings.map((w) => (
              <li key={w.id} className="rounded border border-amber-100 bg-amber-50/30 p-3">
                <div className="font-medium">{w.summary}</div>
                <div className="mt-1 text-xs text-gray-500">{w.warning_type} · {w.severity}</div>
                {w.id && w.status === "open" && (
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === w.id}
                    onClick={() => void acknowledgeWarning(w)}
                  >
                    {labels.acknowledgeWarning}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {unassigned.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.unassignedWorkSection}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {unassigned.map((item: OrganizationWorkloadItem) => (
              <li key={item.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{item.source_type}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {item.priority} · {item.estimated_effort}h
                  {item.due_date ? ` · ${item.due_date}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.my_workload_items && dashboard.my_workload_items.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.myWorkload}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.my_workload_items.map((item) => (
              <li key={item.id} className="rounded border border-gray-100 p-2">
                {item.source_type} · {item.estimated_effort}h · {item.priority}
                {item.due_date ? ` · ${item.due_date}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-x-auto text-xs text-gray-600">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
