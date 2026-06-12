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
  const [customizing, setCustomizing] = useState(false);
  const [togglingInsights, setTogglingInsights] = useState(false);

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

  const toggleInsights = async (disable: boolean) => {
    setTogglingInsights(true);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-intelligence-foundation-engine/customize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disable_insights: disable }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.toggleFailed);
    } else {
      await load();
    }
    setTogglingInsights(false);
  };

  const customizeSettings = async () => {
    const priority = window.prompt(labels.prioritiesPrompt, "");
    if (priority === null) return;

    setCustomizing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-intelligence-foundation-engine/customize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priorities: priority.trim() ? [{ title: priority.trim() }] : [],
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.customizeFailed);
    } else {
      await load();
    }
    setCustomizing(false);
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
  const insightsEnabled = summary.insights_enabled !== false;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
            <p className="mt-2 text-sm">{dashboard.philosophy}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 disabled:opacity-50"
              disabled={customizing}
              onClick={() => void customizeSettings()}
            >
              {customizing ? labels.customizing : labels.customize}
            </button>
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 disabled:opacity-50"
              disabled={togglingInsights}
              onClick={() => void toggleInsights(insightsEnabled)}
            >
              {togglingInsights
                ? labels.toggling
                : insightsEnabled
                  ? labels.disableInsights
                  : labels.enableInsights}
            </button>
            <button
              type="button"
              className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 disabled:opacity-50"
              disabled={exporting}
              onClick={() => void exportInsights()}
            >
              {exporting ? labels.exporting : labels.export}
            </button>
          </div>
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

      {dashboard.industry_objectives && dashboard.industry_objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.industryObjectives}</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.industry_objectives.map((item) => (
              <li key={String(item.key ?? item.label)}>
                <span className="font-medium text-gray-800">{String(item.label ?? "")}</span>
                {item.description ? <span className="text-gray-500"> — {String(item.description)}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.industry_pack_examples && dashboard.industry_pack_examples.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.industryPackExamples}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.industry_pack_examples.map((pack) => (
              <li key={String(pack.key ?? pack.title)} className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm">
                <p className="font-medium text-indigo-900">{pack.title}</p>
                {pack.examples && pack.examples.length > 0 ? (
                  <ul className="mt-1 list-inside list-disc text-xs text-indigo-800">
                    {pack.examples.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_specialization && dashboard.companion_specialization.length > 0 ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
          <h3 className="text-sm font-semibold text-emerald-900">{labels.companionSpecialization}</h3>
          <ul className="mt-2 space-y-2 text-sm text-emerald-900">
            {dashboard.companion_specialization.map((exp) => (
              <li key={exp.key ?? exp.example}>
                {exp.emoji ? `${exp.emoji} ` : ""}
                {exp.example}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(dashboard.blueprint_success_criteria) && dashboard.blueprint_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.trust_connection_blueprint?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnectionBlueprint}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection_blueprint.principle}</p>
        </section>
      ) : null}

      {dashboard.knowledge_center_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.knowledgeCenterConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.knowledge_center_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.engagement_summary ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray-500">{labels.activeInsights}</dt>
              <dd className="font-medium">{dashboard.engagement_summary.active_insights ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.activatedBusinessPacks}</dt>
              <dd className="font-medium">{dashboard.engagement_summary.activated_business_packs ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.highImpactInsights}</dt>
              <dd className="font-medium">{dashboard.engagement_summary.high_impact_insights ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.profileAssigned}</dt>
              <dd className="font-medium">
                {dashboard.engagement_summary.profile_assigned ? labels.yes : labels.no}
              </dd>
            </div>
          </dl>
          {dashboard.engagement_summary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.engagement_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {typeof dashboard.distinction_note === "string" ? (
        <p className="text-xs text-gray-500">{dashboard.distinction_note}</p>
      ) : null}
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
