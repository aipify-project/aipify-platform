"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseStrategicIntelligenceFoundationEngineDashboard,
  type AbosSuccessCriterion,
  type StrategicIntelligenceFoundationEngineDashboard,
  type StrategicInsight,
} from "@/lib/aipify/strategic-intelligence-foundation-engine";

type Props = { labels: Record<string, string> };

function impactClass(level?: string) {
  switch (level) {
    case "critical":
      return "bg-rose-100 text-rose-800";
    case "high":
      return "bg-amber-100 text-amber-800";
    case "medium":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function StrategicIntelligenceFoundationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<StrategicIntelligenceFoundationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/strategic-intelligence-foundation-engine/dashboard");
    if (res.ok) setDashboard(parseStrategicIntelligenceFoundationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runScan() {
    setScanning(true);
    await fetch("/api/aipify/strategic-intelligence-foundation-engine/scan", { method: "POST" });
    await load();
    setScanning(false);
  }

  async function dismissInsight(id: string) {
    setActionId(id);
    await fetch("/api/aipify/strategic-intelligence-foundation-engine/dismiss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insight_id: id }),
    });
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      {(dashboard.integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.integration_links?.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        {dashboard.mission ? <p className="mt-2 text-sm font-medium">{dashboard.mission}</p> : null}
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p> : null}
        {dashboard.strategic_intelligence_foundation_note ? (
          <p className="mt-1 text-xs text-indigo-700">{dashboard.strategic_intelligence_foundation_note}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-1 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.safety_note}</p>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.newInsights}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.new_insights ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.highImpact}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.high_impact ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.completed}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.completed ?? 0)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={scanning}
          onClick={() => void runScan()}
          className="rounded-lg bg-indigo-700 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {scanning ? labels.scanning : labels.runScan}
        </button>
      </div>

      {dashboard.strategic_objectives && dashboard.strategic_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.strategicObjectives}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.strategic_objectives.map((obj) => (
              <div key={obj.key ?? obj.label} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="text-sm font-medium text-indigo-900">{obj.label}</p>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.insight_categories && dashboard.insight_categories.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.insightCategories}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {dashboard.insight_categories.map((category) => (
              <div key={category.key ?? category.label} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="text-sm font-medium text-indigo-900">{category.label}</p>
                {category.description ? (
                  <p className="mt-1 text-xs text-gray-600">{category.description}</p>
                ) : null}
                {(category.examples ?? []).length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-gray-600">
                    {category.examples!.slice(0, 2).map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.activeInsights}</h3>
        {(dashboard.insights ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {(dashboard.insights ?? []).slice(0, 10).map((insight: StrategicInsight) => (
              <li key={String(insight.id)} className="rounded-lg border border-gray-100 px-3 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{String(insight.title ?? "")}</span>
                  {insight.impact_level ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${impactClass(insight.impact_level)}`}>
                      {String(insight.impact_level)}
                    </span>
                  ) : null}
                  {insight.category ? (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {String(insight.category)}
                    </span>
                  ) : null}
                </div>
                {insight.summary ? <p className="mt-1 text-gray-600">{String(insight.summary)}</p> : null}
                {insight.recommended_action ? (
                  <p className="mt-1 text-xs text-indigo-700">{String(insight.recommended_action)}</p>
                ) : null}
                {insight.id ? (
                  <button
                    type="button"
                    disabled={actionId !== null}
                    onClick={() => void dismissInsight(String(insight.id))}
                    className="mt-2 text-xs text-gray-500 underline disabled:opacity-50"
                  >
                    {actionId === String(insight.id) ? labels.dismissing : labels.dismiss}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.priorities}</h3>
        {(dashboard.priorities ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(dashboard.priorities ?? []).map((insight, idx) => (
              <li key={String(insight.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{String(insight.title ?? "")}</span>
                {typeof insight.confidence_score === "number" ? (
                  <span className="text-gray-500"> · {insight.confidence_score}% confidence</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {(dashboard.companion_communication_examples ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionExamples}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.companion_communication_examples!.map((ex) => (
              <li key={ex.key ?? ex.example} className="rounded-lg border border-indigo-100 bg-indigo-50/20 px-3 py-2 text-sm">
                {ex.example}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.success_criteria && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.success_criteria.map((criterion: AbosSuccessCriterion) => (
              <li
                key={criterion.key ?? criterion.label}
                className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                >
                  {criterion.met ? labels.criterionMet : labels.criterionPending}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{criterion.label}</p>
                  {criterion.note ? <p className="mt-1 text-xs text-gray-500">{criterion.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.trust_connection ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          {dashboard.trust_connection.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.trust_connection.principle}</p>
          ) : null}
          {(dashboard.trust_connection.leaders_should_know ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {dashboard.trust_connection.leaders_should_know!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.data_sources ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dataSources}</h3>
          {dashboard.data_sources.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.data_sources.principle}</p>
          ) : null}
          {(dashboard.data_sources.modules ?? []).length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {dashboard.data_sources.modules!.map((mod) => {
                const route = typeof mod.route === "string" ? mod.route : undefined;
                const label = typeof mod.label === "string" ? mod.label : String(mod.key ?? "");
                return route ? (
                  <Link key={route} href={route} className="rounded border border-gray-200 px-2 py-1 text-xs">
                    {label}
                  </Link>
                ) : (
                  <span key={label} className="rounded border border-gray-200 px-2 py-1 text-xs">
                    {label}
                  </span>
                );
              })}
            </ul>
          ) : null}
          {dashboard.data_sources.privacy_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.data_sources.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.self_love_connection ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.selfLoveConnection}</h3>
          {dashboard.self_love_connection.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.self_love_connection.principle}</p>
          ) : null}
          {(dashboard.self_love_connection.strategic_patterns ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {dashboard.self_love_connection.strategic_patterns!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {(dashboard.vision_phrases ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.visionPhrases}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.vision_phrases!.map((phrase) => (
              <li key={phrase} className="text-sm italic text-gray-600">
                {phrase}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((pr) => (
              <li key={pr}>{pr}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
