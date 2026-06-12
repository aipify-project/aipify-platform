"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parsePredictiveInsightsEngineDashboard,
  type OrganizationPredictiveInsight,
  type PredictiveInsightsEngineDashboard,
} from "@/lib/aipify/predictive-insights-engine";

type Props = { labels: Record<string, string> };

export function PredictiveInsightsEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<PredictiveInsightsEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/predictive-insights-engine/dashboard");
    if (res.ok) setDashboard(parsePredictiveInsightsEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const insightAction = async (payload: Record<string, unknown>) => {
    setActionError(null);
    const res = await fetch("/api/aipify/predictive-insights-engine/insights", {
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

  const dismissInsight = async (insight: OrganizationPredictiveInsight) => {
    if (!insight.id) return;
    setBusyId(insight.id);
    await insightAction({ action: "dismiss", insight_id: insight.id });
    setBusyId(null);
  };

  const generateInsights = async () => {
    setGenerating(true);
    setActionError(null);
    const ok = await insightAction({ action: "generate" });
    if (!ok) setActionError(labels.generateFailed);
    setGenerating(false);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/predictive-insights-engine/export", {
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
  const activeInsights = sections.active_insights ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-violet-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-violet-300 px-3 py-1 text-xs text-violet-800 disabled:opacity-50"
          disabled={generating}
          onClick={() => void generateInsights()}
        >
          {generating ? labels.generating : labels.generateInsights}
        </button>
        <button
          type="button"
          className="rounded border border-violet-300 px-3 py-1 text-xs text-violet-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.activeInsights}</dt><dd>{String(summary.active_insights ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.highRiskInsights}</dt><dd>{String(summary.high_risk_insights ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.criticalInsights}</dt><dd>{String(summary.critical_insights ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.dismissedInsights}</dt><dd>{String(summary.dismissed_insights ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.predictionTypes}</dt><dd>{String(summary.prediction_type_count ?? 0)}</dd></div>
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

      {activeInsights.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.insightsSection}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(activeInsights as OrganizationPredictiveInsight[]).map((insight) => (
              <li key={insight.id} className="rounded border border-violet-100 bg-violet-50/30 p-3">
                <div className="font-medium">{insight.summary}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {insight.prediction_type} · {labels.confidence}: {insight.confidence} · {labels.risk}: {insight.risk_level}
                </div>
                {insight.recommended_action && (
                  <p className="mt-2 text-xs text-gray-600">{insight.recommended_action}</p>
                )}
                {insight.id && (
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === insight.id}
                    onClick={() => void dismissInsight(insight)}
                  >
                    {labels.dismissInsight}
                  </button>
                )}
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
