"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseStrategicAlignmentEngineDashboard,
  type StrategicAlignmentEngineDashboard,
  type StrategicObjective,
} from "@/lib/aipify/strategic-alignment-engine";

type Props = { labels: Record<string, string> };

export function StrategicAlignmentEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<StrategicAlignmentEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/dashboard");
    if (res.ok) setDashboard(parseStrategicAlignmentEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activateObjective = async (objective: StrategicObjective) => {
    if (!objective.id) return;
    setActivating(objective.id);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/objectives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", objective_id: objective.id, status: "active" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.activateFailed);
    } else {
      await load();
    }
    setActivating(null);
  };

  const recordReview = async (objective: StrategicObjective) => {
    if (!objective.id) return;
    setReviewing(objective.id);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objective_id: objective.id,
        findings: "Alignment review recorded from strategic alignment dashboard",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.reviewFailed);
    } else {
      await load();
    }
    setReviewing(null);
  };

  const detectMisalignment = async () => {
    setDetecting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "detect_misalignment" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.detectFailed);
    } else {
      await load();
    }
    setDetecting(false);
  };

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/export", {
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

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-indigo-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={detecting}
          onClick={() => void detectMisalignment()}
        >
          {detecting ? labels.detecting : labels.detectMisalignment}
        </button>
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportReport()}
        >
          {exporting ? labels.exporting : labels.exportReport}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.executive_summary && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveSummary}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.executive_summary, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.objectives && dashboard.objectives.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.objectives}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.objectives.map((objective) => (
              <div key={objective.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{objective.objective_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{objective.priority}</span>
                    {objective.description && (
                      <p className="mt-1 text-xs text-gray-600">{objective.description}</p>
                    )}
                    {objective.target_date && (
                      <p className="mt-1 text-xs text-gray-500">
                        {labels.targetDate}: {objective.target_date}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{objective.status}</span>
                    {objective.status === "planned" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={activating === objective.id}
                        onClick={() => void activateObjective(objective)}
                      >
                        {activating === objective.id ? labels.activating : labels.activate}
                      </button>
                    )}
                    {(objective.status === "planned" || objective.status === "active") && (
                      <button
                        type="button"
                        className="rounded border border-green-300 px-2 py-0.5 text-xs text-green-700 disabled:opacity-50"
                        disabled={reviewing === objective.id}
                        onClick={() => void recordReview(objective)}
                      >
                        {reviewing === objective.id ? labels.reviewing : labels.recordReview}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.snapshots && dashboard.snapshots.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.snapshots}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.snapshots, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
