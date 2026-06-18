"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseCrossTenantIntelligenceEngineDashboard,
  type CrossTenantGlobalInsight,
  type CrossTenantIntelligenceEngineDashboard,
  type CrossTenantPendingRecommendation,
} from "@/lib/aipify/cross-tenant-intelligence-engine";

type Props = { labels: Record<string, string> };

export function CrossTenantIntelligenceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CrossTenantIntelligenceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [savingParticipation, setSavingParticipation] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [participationStatus, setParticipationStatus] = useState("internal_only");
  const [anonymizationLevel, setAnonymizationLevel] = useState("standard");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/cross-tenant-intelligence-engine/dashboard");
    if (res.ok) {
      const parsed = parseCrossTenantIntelligenceEngineDashboard(await res.json());
      setDashboard(parsed);
      if (parsed.settings?.participation_status) {
        setParticipationStatus(String(parsed.settings.participation_status));
      }
      if (parsed.settings?.anonymization_level) {
        setAnonymizationLevel(String(parsed.settings.anonymization_level));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const saveParticipation = async () => {
    setSavingParticipation(true);
    setActionError(null);
    const res = await fetch("/api/aipify/cross-tenant-intelligence-engine/participation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participation_status: participationStatus,
        anonymization_level: anonymizationLevel,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.participationFailed);
    } else {
      await load();
    }
    setSavingParticipation(false);
  };

  const generateInsights = async () => {
    setGenerating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/cross-tenant-intelligence-engine/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_existing: false }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.generateFailed);
    } else {
      await load();
    }
    setGenerating(false);
  };

  const approveRecommendation = async (item: CrossTenantPendingRecommendation) => {
    const insightId = item.insight?.id;
    if (!insightId) return;
    setBusyId(insightId);
    setActionError(null);
    const res = await fetch("/api/aipify/cross-tenant-intelligence-engine/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ global_insight_id: insightId }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.approveFailed);
    } else {
      await load();
    }
    setBusyId(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/cross-tenant-intelligence-engine/export", {
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

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? dashboard.executive_summary ?? {};
  const sections = dashboard.sections ?? {};
  const industryTrends = sections.industry_trends ?? [];
  const opportunities = sections.opportunities ?? [];
  const improvementAreas = sections.improvement_areas ?? [];
  const pendingRecommendations = sections.pending_recommendations ?? [];

  const renderInsightList = (items: CrossTenantGlobalInsight[], emptyLabel: string) => {
    if (items.length === 0) return <p className="mt-2 text-sm text-gray-500">{emptyLabel}</p>;
    return (
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((insight) => (
          <li key={insight.id} className="rounded border border-indigo-100 bg-indigo-50/30 p-3">
            <div className="font-medium">{insight.summary}</div>
            <div className="mt-1 text-xs text-gray-500">
              {insight.insight_category} · {insight.industry} · {labels.confidence}: {insight.confidence_level}
            </div>
            {insight.recommendation && (
              <p className="mt-2 text-xs text-gray-600">{insight.recommendation}</p>
            )}
          </li>
        ))}
      </ul>
    );
  };

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

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.participationSettings}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-gray-500">{labels.participationStatus}</span>
            <select
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
              value={participationStatus}
              onChange={(e) => setParticipationStatus(e.target.value)}
            >
              <option value="disabled">{labels.participationDisabled}</option>
              <option value="internal_only">{labels.participationInternalOnly}</option>
              <option value="anonymized_contributor">{labels.participationContributor}</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-gray-500">{labels.anonymizationLevel}</span>
            <select
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
              value={anonymizationLevel}
              onChange={(e) => setAnonymizationLevel(e.target.value)}
            >
              <option value="standard">{labels.anonymizationStandard}</option>
              <option value="enhanced">{labels.anonymizationEnhanced}</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          className="mt-3 rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={savingParticipation}
          onClick={() => void saveParticipation()}
        >
          {savingParticipation ? labels.savingParticipation : labels.saveParticipation}
        </button>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={generating || participationStatus === "disabled"}
          onClick={() => void generateInsights()}
        >
          {generating ? labels.generating : labels.generateInsights}
        </button>
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.visibleInsights}</dt><dd>{String(summary.visible_insights ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.pendingRecommendations}</dt><dd>{String(summary.pending_recommendations ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.approvedRecommendations}</dt><dd>{String(summary.approved_recommendations ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.globalActiveInsights}</dt><dd>{String(summary.global_active_insights ?? 0)}</dd></div>
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

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.industryTrends}</h3>
        {renderInsightList(industryTrends, labels.noIndustryTrends)}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.opportunities}</h3>
        {renderInsightList(opportunities, labels.noOpportunities)}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.improvementAreas}</h3>
        {renderInsightList(improvementAreas, labels.noImprovementAreas)}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.pendingRecommendationsSection}</h3>
        {pendingRecommendations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noPendingRecommendations}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {pendingRecommendations.map((item) => {
              const insight = item.insight;
              if (!insight?.id) return null;
              return (
                <li key={insight.id} className="rounded border border-indigo-100 bg-indigo-50/30 p-3">
                  <div className="font-medium">{insight.summary}</div>
                  {insight.recommendation && (
                    <p className="mt-2 text-xs text-gray-600">{insight.recommendation}</p>
                  )}
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === insight.id}
                    onClick={() => void approveRecommendation(item)}
                  >
                    {labels.approveRecommendation}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

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
