"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalHealthEngineDashboard,
  type OrganizationalHealthEngineDashboard,
  type OrganizationalHealthIntervention,
  type OrganizationalHealthScore,
} from "@/lib/aipify/organizational-health-engine";

type Props = { labels: Record<string, string> };

export function OrganizationalHealthEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalHealthEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalHealthEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const measureHealth = async () => {
    setMeasuring(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/measure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.measureFailed);
    } else {
      await load();
    }
    setMeasuring(false);
  };

  const generateRecommendations = async () => {
    setGenerating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_recommendations" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.generateFailed);
    } else {
      await load();
    }
    setGenerating(false);
  };

  const approveIntervention = async (intervention: OrganizationalHealthIntervention) => {
    if (!intervention.id) return;
    setApproving(intervention.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intervention_id: intervention.id, capture_memory: true }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.approveFailed);
    } else {
      await load();
    }
    setApproving(null);
  };

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-health-engine/export", {
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
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-teal-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={measuring}
          onClick={() => void measureHealth()}
        >
          {measuring ? labels.measuring : labels.measureHealth}
        </button>
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={generating}
          onClick={() => void generateRecommendations()}
        >
          {generating ? labels.generating : labels.generateRecommendations}
        </button>
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
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

      {dashboard.scores && dashboard.scores.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.scores}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.scores.map((score: OrganizationalHealthScore) => (
              <div key={score.id ?? score.health_category} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">{score.health_category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-teal-700">{score.health_score}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{score.health_status}</span>
                  </div>
                </div>
                {score.indicators && (
                  <pre className="mt-2 overflow-auto text-xs text-gray-600">
                    {JSON.stringify(score.indicators, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.interventions && dashboard.interventions.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.interventions}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.interventions.map((intervention) => (
              <div key={intervention.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase text-gray-500">{intervention.category}</span>
                    <p className="mt-1 text-gray-800">{intervention.recommendation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{intervention.status}</span>
                    {intervention.status === "pending" && (
                      <button
                        type="button"
                        className="rounded border border-green-300 px-2 py-0.5 text-xs text-green-700 disabled:opacity-50"
                        disabled={approving === intervention.id}
                        onClick={() => void approveIntervention(intervention)}
                      >
                        {approving === intervention.id ? labels.approving : labels.approveIntervention}
                      </button>
                    )}
                  </div>
                </div>
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
