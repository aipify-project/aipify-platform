"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseContinuousImprovementEngineDashboard,
  type ContinuousImprovementEngineDashboard,
  type ImprovementInitiativeRecord,
  type ImprovementSuggestion,
} from "@/lib/aipify/continuous-improvement-engine";

type Props = { labels: Record<string, string> };

export function ContinuousImprovementEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ContinuousImprovementEngineDashboard | null>(null);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const [dashboardRes, suggestionsRes] = await Promise.all([
      fetch("/api/aipify/continuous-improvement-engine/dashboard"),
      fetch("/api/aipify/continuous-improvement-engine/initiatives"),
    ]);
    if (dashboardRes.ok) {
      setDashboard(parseContinuousImprovementEngineDashboard(await dashboardRes.json()));
    }
    if (suggestionsRes.ok) {
      const body = (await suggestionsRes.json()) as { suggestions?: ImprovementSuggestion[] };
      setSuggestions(body.suggestions ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const reviewInitiative = async (initiative: ImprovementInitiativeRecord, status: string) => {
    if (!initiative.id) return;
    setReviewing(initiative.id);
    setActionError(null);
    const res = await fetch("/api/aipify/continuous-improvement-engine/initiatives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review", initiative_id: initiative.id, status }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setReviewing(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.initiatives && dashboard.initiatives.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.initiatives}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.initiatives.map((initiative) => (
              <div key={initiative.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{initiative.initiative_title}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{initiative.source}</span>
                    <p className="mt-1 text-xs text-gray-600">{initiative.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{initiative.status}</span>
                    {initiative.status === "proposed" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={reviewing === initiative.id}
                        onClick={() => void reviewInitiative(initiative, "approved")}
                      >
                        {reviewing === initiative.id ? labels.reviewing : labels.approveInitiative}
                      </button>
                    )}
                    {initiative.status === "approved" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={reviewing === initiative.id}
                        onClick={() => void reviewInitiative(initiative, "in_progress")}
                      >
                        {reviewing === initiative.id ? labels.reviewing : labels.startInitiative}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {suggestions.map((suggestion, index) => (
              <div key={`${suggestion.initiative_title}-${index}`} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{suggestion.initiative_title}</span>
                <span className="ml-2 text-xs uppercase text-gray-500">{suggestion.priority}</span>
                {suggestion.rationale && <p className="mt-1 text-xs">{suggestion.rationale}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.trends && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trends}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(dashboard.trends, null, 2)}</pre>
        </section>
      )}

      {dashboard.memory_integration && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.memoryIntegration}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.memory_integration, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.success_measurements && dashboard.success_measurements.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successMeasurements}</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.success_measurements.map((measurement) => (
              <div key={measurement.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{measurement.metric_key}</span>
                <span className="ml-2 text-xs">
                  {measurement.baseline_value} → {measurement.current_value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
