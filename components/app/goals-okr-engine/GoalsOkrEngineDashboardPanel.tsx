"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseGoalsOkrEngineDashboard,
  type GoalsOkrEngineDashboard,
  type OkrIntervention,
  type OrganizationKeyResult,
  type OrganizationObjective,
} from "@/lib/aipify/goals-okr-engine";

type Props = { labels: Record<string, string> };

export function GoalsOkrEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GoalsOkrEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/goals-okr-engine/dashboard");
    if (res.ok) setDashboard(parseGoalsOkrEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const objectiveAction = async (payload: Record<string, unknown>) => {
    setActionError(null);
    const res = await fetch("/api/aipify/goals-okr-engine/objectives", {
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

  const activateObjective = async (objective: OrganizationObjective) => {
    if (!objective.id) return;
    setBusyId(objective.id);
    await objectiveAction({ action: "activate", objective_id: objective.id });
    setBusyId(null);
  };

  const approveCompletion = async (objective: OrganizationObjective) => {
    if (!objective.id) return;
    setBusyId(objective.id);
    await objectiveAction({ action: "approve_completion", objective_id: objective.id });
    setBusyId(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/goals-okr-engine/export", {
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

  const summary = dashboard.summary ?? dashboard.executive_summary ?? {};
  const sections = dashboard.sections ?? {};
  const interventions = dashboard.interventions ?? [];
  const activeObjectives = sections.active_objectives ?? [];
  const atRiskKeyResults = sections.at_risk_key_results ?? [];
  const keyResults = dashboard.key_results ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-emerald-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-emerald-300 px-3 py-1 text-xs text-emerald-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.activeObjectives}</dt><dd>{String(summary.active_objectives ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.atRiskObjectives}</dt><dd>{String(summary.at_risk_objectives ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.atRiskKeyResults}</dt><dd>{String(summary.at_risk_key_results ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.completedObjectives}</dt><dd>{String(summary.completed_objectives ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.avgProgress}</dt><dd>{String(summary.avg_progress_pct ?? 0)}%</dd></div>
          <div><dt className="text-gray-500">{labels.strategicObjectives}</dt><dd>{String(summary.strategic_objectives ?? 0)}</dd></div>
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

      {interventions.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.interventions}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {(interventions as OkrIntervention[]).map((rec, i) => (
              <li key={`${rec.type ?? "int"}-${i}`} className="rounded border border-gray-100 p-2">
                <span className="text-xs uppercase text-gray-500">{rec.type} · {rec.confidence}</span>
                <p className="mt-1">{rec.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeObjectives.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.activeObjectivesSection}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {activeObjectives.map((o) => (
              <li key={o.id} className="rounded border border-emerald-100 bg-emerald-50/30 p-3">
                <div className="font-medium">{o.objective_name}</div>
                <div className="mt-1 text-xs text-gray-500">{o.hierarchy_level} · {o.priority} · {o.status}</div>
                {o.id && o.status === "draft" && (
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === o.id}
                    onClick={() => void activateObjective(o)}
                  >
                    {labels.activateObjective}
                  </button>
                )}
                {o.id && ["active", "on_track", "at_risk"].includes(String(o.status)) && (
                  <button
                    type="button"
                    className="mt-2 ml-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === o.id}
                    onClick={() => void approveCompletion(o)}
                  >
                    {labels.approveCompletion}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {atRiskKeyResults.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.atRiskKeyResultsSection}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(atRiskKeyResults as OrganizationKeyResult[]).map((kr) => (
              <li key={kr.id} className="rounded border border-amber-100 bg-amber-50/30 p-3">
                <div className="font-medium">{kr.key_result_name}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {labels.progress}: {String(kr.progress_percentage ?? 0)}%
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {keyResults.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.keyResults}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {keyResults.slice(0, 20).map((kr) => (
              <li key={kr.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{kr.key_result_name}</span>
                <span className="ml-2 text-xs text-gray-500">{String(kr.progress_percentage ?? 0)}% · {kr.status}</span>
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
