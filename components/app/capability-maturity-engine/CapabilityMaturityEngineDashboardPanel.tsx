"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseCapabilityMaturityEngineDashboard,
  type CapabilityMaturityEngineDashboard,
  type MaturityAssessment,
} from "@/lib/aipify/capability-maturity-engine";

type Props = { labels: Record<string, string> };

export function CapabilityMaturityEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CapabilityMaturityEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/capability-maturity-engine/dashboard");
    if (res.ok) setDashboard(parseCapabilityMaturityEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const advanceAssessment = async (assessment: MaturityAssessment) => {
    if (!assessment.id || !assessment.maturity_level) return;
    const nextLevel = Math.min(assessment.maturity_level + 1, 5);
    if (nextLevel === assessment.maturity_level) return;

    setUpdating(assessment.id);
    setActionError(null);
    const res = await fetch("/api/aipify/capability-maturity-engine/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        assessment_id: assessment.id,
        maturity_level: nextLevel,
        assessment_summary: `Maturity advanced to level ${nextLevel} from capability maturity dashboard`,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.advanceFailed);
    } else {
      await load();
    }
    setUpdating(null);
  };

  const generateRoadmaps = async () => {
    setGenerating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/capability-maturity-engine/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.roadmapFailed);
    } else {
      await load();
    }
    setGenerating(false);
  };

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/capability-maturity-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: "executive_overview" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    } else {
      await load();
    }
    setExporting(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const maturityLabels = dashboard.maturity_labels ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={generating}
          onClick={() => void generateRoadmaps()}
        >
          {generating ? labels.generating : labels.generateRoadmaps}
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

      {dashboard.assessments && dashboard.assessments.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.assessments}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.assessments.map((assessment) => (
              <div key={assessment.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{assessment.domain}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">
                      {labels.level} {assessment.maturity_level}
                      {assessment.maturity_level != null && maturityLabels[String(assessment.maturity_level)]
                        ? ` — ${maturityLabels[String(assessment.maturity_level)]}`
                        : ""}
                    </span>
                    {assessment.assessment_summary && (
                      <p className="mt-1 text-xs text-gray-600">{assessment.assessment_summary}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {assessment.maturity_level != null && assessment.maturity_level < 5 && (
                      <button
                        type="button"
                        className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                        disabled={updating === assessment.id}
                        onClick={() => void advanceAssessment(assessment)}
                      >
                        {updating === assessment.id ? labels.advancing : labels.advanceMaturity}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.roadmaps && dashboard.roadmaps.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.roadmaps}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.roadmaps, null, 2)}
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
