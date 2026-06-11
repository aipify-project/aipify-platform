"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseIndustryInsightsExportPayload,
  parseIndustryIntelligenceFoundationEngineDashboard,
  type IndustryInsightRecord,
  type IndustryIntelligenceFoundationEngineDashboard,
} from "@/lib/aipify/industry-intelligence-foundation-engine";

type Props = { labels: Record<string, string> };

export function IndustryIntelligenceFoundationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<IndustryIntelligenceFoundationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [overriding, setOverriding] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-intelligence-foundation-engine/dashboard");
    if (res.ok) setDashboard(parseIndustryIntelligenceFoundationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const assignProfile = async (industryKey: string) => {
    setAssigning(industryKey);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-intelligence-foundation-engine/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry_key: industryKey }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.assignFailed);
    } else {
      await load();
    }
    setAssigning(null);
  };

  const overrideInsight = async (insight: IndustryInsightRecord) => {
    const overrideText = window.prompt(labels.overridePrompt, insight.recommendation ?? "");
    if (!overrideText || !insight.id) return;

    setOverriding(insight.id);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-intelligence-foundation-engine/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insight_id: insight.id, override_recommendation: overrideText }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.overrideFailed);
    } else {
      await load();
    }
    setOverriding(null);
  };

  const exportInsights = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-intelligence-foundation-engine/export");
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    } else {
      const payload = parseIndustryInsightsExportPayload(await res.json());
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `industry-insights-${payload.industry_key ?? "export"}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
            <p className="mt-2 text-sm">{dashboard.philosophy}</p>
          </div>
          <button
            type="button"
            className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 disabled:opacity-50"
            disabled={exporting}
            onClick={() => void exportInsights()}
          >
            {exporting ? labels.exporting : labels.export}
          </button>
        </div>
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

      {dashboard.assigned_profile ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.assignedProfile}</h3>
          <p className="mt-2 text-sm font-medium text-gray-800">{dashboard.assigned_profile.industry_name}</p>
          <p className="mt-1 text-sm text-gray-600">{dashboard.assigned_profile.description}</p>
        </section>
      ) : (
        dashboard.available_profiles && dashboard.available_profiles.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">{labels.availableProfiles}</h3>
            <div className="mt-3 space-y-3">
              {dashboard.available_profiles.map((profile) => (
                <div key={String(profile.industry_key)} className="rounded-lg border border-gray-200 p-3">
                  <p className="font-medium text-gray-800">{String(profile.industry_name)}</p>
                  <p className="mt-1 text-sm text-gray-600">{String(profile.description ?? "")}</p>
                  <button
                    type="button"
                    className="mt-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                    disabled={assigning === profile.industry_key}
                    onClick={() => void assignProfile(String(profile.industry_key))}
                  >
                    {assigning === profile.industry_key ? labels.assigning : labels.assignProfile}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )
      )}

      {dashboard.benchmarks && dashboard.benchmarks.length > 0 && (
        <JsonSection title={labels.benchmarks} data={dashboard.benchmarks} />
      )}

      {dashboard.recommended_improvements && dashboard.recommended_improvements.length > 0 && (
        <InsightSection
          title={labels.recommendedImprovements}
          insights={dashboard.recommended_improvements}
          labels={labels}
          onOverride={overrideInsight}
          overriding={overriding}
        />
      )}

      {dashboard.common_risks && dashboard.common_risks.length > 0 && (
        <JsonSection title={labels.commonRisks} data={dashboard.common_risks} />
      )}

      {dashboard.strategic_opportunities && dashboard.strategic_opportunities.length > 0 && (
        <InsightSection
          title={labels.strategicOpportunities}
          insights={dashboard.strategic_opportunities}
          labels={labels}
          onOverride={overrideInsight}
          overriding={overriding}
        />
      )}

      {dashboard.business_pack_alignment && dashboard.business_pack_alignment.length > 0 && (
        <JsonSection title={labels.businessPackAlignment} data={dashboard.business_pack_alignment} />
      )}

      {dashboard.integration_summaries && (
        <JsonSection title={labels.integrationSummaries} data={dashboard.integration_summaries} />
      )}
    </div>
  );
}

function JsonSection({ title, data }: { title: string; data: unknown }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}

function InsightSection({
  title,
  insights,
  labels,
  onOverride,
  overriding,
}: {
  title: string;
  insights: IndustryInsightRecord[];
  labels: Record<string, string>;
  onOverride: (insight: IndustryInsightRecord) => void;
  overriding: string | null;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-3">
        {insights.map((insight) => (
          <div key={insight.id ?? insight.title} className="rounded-lg border border-gray-200 p-3 text-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-gray-800">{insight.title}</p>
              <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs uppercase text-gray-600">
                {insight.impact_level}
              </span>
            </div>
            <p className="mt-1 text-gray-600">
              {insight.status === "overridden" ? insight.override_recommendation : insight.recommendation}
            </p>
            {insight.status !== "overridden" && insight.id && (
              <button
                type="button"
                className="mt-2 text-xs font-medium text-indigo-600 disabled:opacity-50"
                disabled={overriding === insight.id}
                onClick={() => onOverride(insight)}
              >
                {overriding === insight.id ? labels.overriding : labels.override}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
