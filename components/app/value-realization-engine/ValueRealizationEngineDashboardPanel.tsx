"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseValueRealizationEngineDashboard,
  type ValueMetricRecord,
  type ValueMilestoneRecord,
  type ValueRealizationEngineDashboard,
  type ValueImprovementSuggestion,
} from "@/lib/aipify/value-realization-engine";

type Props = { labels: Record<string, string> };

export function ValueRealizationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ValueRealizationEngineDashboard | null>(null);
  const [suggestions, setSuggestions] = useState<ValueImprovementSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const [dashRes, suggestRes] = await Promise.all([
      fetch("/api/aipify/value-realization-engine/dashboard"),
      fetch("/api/aipify/value-realization-engine/review"),
    ]);
    if (dashRes.ok) setDashboard(parseValueRealizationEngineDashboard(await dashRes.json()));
    if (suggestRes.ok) {
      const body = (await suggestRes.json()) as { suggestions?: ValueImprovementSuggestion[] };
      setSuggestions(body.suggestions ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const genRes = await fetch("/api/aipify/value-realization-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: "value_realization" }),
    });
    if (!genRes.ok) {
      const body = (await genRes.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
      setExporting(false);
      return;
    }
    const generated = (await genRes.json()) as { id?: string };
    if (generated.id) {
      const exportRes = await fetch("/api/aipify/value-realization-engine/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: generated.id }),
      });
      if (!exportRes.ok) {
        const body = (await exportRes.json()) as { error?: string };
        setActionError(body.error ?? labels.exportFailed);
      } else {
        await load();
      }
    }
    setExporting(false);
  };

  const achieveMilestone = async (milestone: ValueMilestoneRecord) => {
    if (!milestone.id) return;
    setCompleting(milestone.id);
    setActionError(null);
    const res = await fetch("/api/aipify/value-realization-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "milestone",
        milestone_id: milestone.id,
        current_value: milestone.target_value,
        status: "achieved",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.milestoneFailed);
    } else {
      await load();
    }
    setCompleting(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-emerald-300 px-3 py-1 text-xs text-emerald-800 disabled:opacity-50"
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

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.metrics && dashboard.metrics.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.metrics}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.metrics.map((metric: ValueMetricRecord) => (
              <div key={metric.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{metric.metric_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{metric.category}</span>
                  </div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                    {metric.improvement_percentage}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {labels.baseline}: {metric.baseline_value} → {labels.current}: {metric.current_value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.milestones && dashboard.milestones.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.milestones}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.milestones.map((milestone) => (
              <div key={milestone.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{milestone.milestone_name}</span>
                  <p className="mt-1 text-xs text-gray-600">
                    {milestone.current_value} / {milestone.target_value}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{milestone.status}</span>
                  {milestone.status === "pending" && (
                    <button
                      type="button"
                      className="rounded border border-emerald-300 px-2 py-0.5 text-xs text-emerald-700 disabled:opacity-50"
                      disabled={completing === milestone.id}
                      onClick={() => void achieveMilestone(milestone)}
                    >
                      {completing === milestone.id ? labels.completing : labels.achieveMilestone}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.suggestions}</h3>
          <div className="mt-3 space-y-3">
            {suggestions.map((s, i) => (
              <div key={`${s.metric_name}-${i}`} className="rounded-lg border border-gray-200 p-3 text-sm">
                <span className="font-medium text-gray-900">{s.metric_name}</span>
                <span className="ml-2 text-xs text-gray-500">({s.confidence})</span>
                <p className="mt-1 text-xs text-gray-600">{s.recommendation}</p>
              </div>
            ))}
          </div>
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
