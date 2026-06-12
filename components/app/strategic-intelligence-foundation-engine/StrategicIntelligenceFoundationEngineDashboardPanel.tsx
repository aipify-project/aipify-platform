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

function ObjectiveCard({ objective }: { objective: { key?: string; label?: string; description?: string } }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-3">
      <p className="text-sm font-medium text-indigo-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function GuidanceList({
  items,
  signalKey = "signal",
}: {
  items?: Array<Record<string, unknown>>;
  signalKey?: string;
}) {
  if (!items?.length) return null;
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={String(item.key ?? item[signalKey])} className="rounded border border-gray-100 p-2 text-sm">
          <p className="font-medium">
            {item.emoji ? `${String(item.emoji)} ` : ""}
            {String(item[signalKey] ?? item.prompt ?? item.label ?? "")}
          </p>
          {item.description ? <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p> : null}
          {item.consideration ? (
            <p className="mt-1 text-xs text-gray-600">{String(item.consideration)}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

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

      {dashboard.implementation_blueprint_phase79?.phase ? (
        <>
          <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
            <h2 className="text-sm font-semibold">{labels.phase79Title}</h2>
            <p className="mt-1 text-xs text-violet-700">
              {dashboard.implementation_blueprint_phase79.phase}
              {dashboard.implementation_blueprint_phase79.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase79.engine_phase}`
                : ""}
            </p>
            {dashboard.blueprint_distinction_note ? (
              <p className="mt-2 text-xs text-violet-700">{dashboard.blueprint_distinction_note}</p>
            ) : null}
            {dashboard.blueprint_mission ? (
              <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.blueprint_mission}</p>
            ) : null}
            {dashboard.blueprint_philosophy ? (
              <p className="mt-2 text-sm text-violet-900">{dashboard.blueprint_philosophy}</p>
            ) : null}
            {dashboard.blueprint_abos_principle ? (
              <p className="mt-2 text-xs text-violet-800">{dashboard.blueprint_abos_principle}</p>
            ) : null}
            {dashboard.strategic_intelligence_engine_note ? (
              <p className="mt-2 text-xs text-violet-800">{dashboard.strategic_intelligence_engine_note}</p>
            ) : null}
          </section>

          {(dashboard.blueprint_integration_links ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dashboard.blueprint_integration_links?.map((link) =>
                link.route ? (
                  <Link key={link.route} href={link.route} className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm">
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}

          {dashboard.blueprint_objectives && dashboard.blueprint_objectives.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dashboard.blueprint_objectives.map((obj) => (
                  <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                ))}
              </div>
            </section>
          ) : null}

          {dashboard.intelligence_sources?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.intelligenceSources}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.intelligence_sources.principle}</p>
              {dashboard.intelligence_sources.sources && dashboard.intelligence_sources.sources.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {dashboard.intelligence_sources.sources.map((source) => (
                    <ObjectiveCard
                      key={String(source.key ?? source.label)}
                      objective={{
                        key: String(source.key ?? ""),
                        label: String(source.label ?? ""),
                        description: String(source.description ?? ""),
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {dashboard.strategic_observations?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.strategicObservations}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.strategic_observations.principle}</p>
              <GuidanceList items={dashboard.strategic_observations.observations} />
            </section>
          ) : null}

          {dashboard.pattern_recognition?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.patternRecognition}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.pattern_recognition.principle}</p>
              {dashboard.pattern_recognition.patterns && dashboard.pattern_recognition.patterns.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {dashboard.pattern_recognition.patterns.map((pattern) => (
                    <ObjectiveCard
                      key={String(pattern.key ?? pattern.label)}
                      objective={{
                        key: String(pattern.key ?? ""),
                        label: String(pattern.label ?? ""),
                        description: String(pattern.description ?? ""),
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {dashboard.opportunity_identification?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.opportunityIdentification}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.opportunity_identification.principle}</p>
              <GuidanceList items={dashboard.opportunity_identification.opportunities} />
            </section>
          ) : null}

          {dashboard.leadership_intelligence_briefings?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipBriefings}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.leadership_intelligence_briefings.principle}</p>
              <GuidanceList
                items={dashboard.leadership_intelligence_briefings.briefing_types}
                signalKey="label"
              />
            </section>
          ) : null}

          {dashboard.companion_guidance?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.companion_guidance.principle}</p>
              <GuidanceList items={dashboard.companion_guidance.examples} signalKey="prompt" />
            </section>
          ) : null}

          {dashboard.limitation_principles?.principle ? (
            <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.limitationPrinciples}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.limitation_principles.principle}</p>
              {dashboard.limitation_principles.forbidden && dashboard.limitation_principles.forbidden.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-amber-900">{labels.forbidden}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-amber-800">
                    {dashboard.limitation_principles.forbidden.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {dashboard.limitation_principles.required && dashboard.limitation_principles.required.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-amber-900">{labels.required}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-amber-800">
                    {dashboard.limitation_principles.required.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ) : null}

          {dashboard.engagement_summary ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-gray-500">{labels.totalInsights}</dt>
                  <dd>{String(dashboard.engagement_summary.total_insights ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">{labels.highImpactInsights}</dt>
                  <dd>{String(dashboard.engagement_summary.high_impact_insights ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">{labels.activeCategories}</dt>
                  <dd>{String(dashboard.engagement_summary.active_categories ?? 0)}</dd>
                </div>
              </dl>
            </section>
          ) : null}

          {dashboard.blueprint_success_criteria && dashboard.blueprint_success_criteria.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintSuccessCriteria}</h3>
              <ul className="mt-3 space-y-2">
                {dashboard.blueprint_success_criteria.map((criterion: AbosSuccessCriterion) => (
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

          {dashboard.blueprint_self_love_connection ? (
            <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintSelfLoveConnection}</h3>
              {dashboard.blueprint_self_love_connection.principle ? (
                <p className="mt-2 text-sm text-gray-700">{dashboard.blueprint_self_love_connection.principle}</p>
              ) : null}
              {(dashboard.blueprint_self_love_connection.practices ??
                dashboard.blueprint_self_love_connection.strategic_patterns ??
                []).length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
                  {(
                    dashboard.blueprint_self_love_connection.practices ??
                    dashboard.blueprint_self_love_connection.strategic_patterns ??
                    []
                  ).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {dashboard.blueprint_trust_connection ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintTrustConnection}</h3>
              {dashboard.blueprint_trust_connection.principle ? (
                <p className="mt-2 text-sm text-gray-700">{dashboard.blueprint_trust_connection.principle}</p>
              ) : null}
              {(dashboard.blueprint_trust_connection.leaders_should_know ?? []).length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
                  {dashboard.blueprint_trust_connection.leaders_should_know!.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {(dashboard.blueprint_vision_phrases ?? []).length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintVisionPhrases}</h3>
              <ul className="mt-3 space-y-2">
                {dashboard.blueprint_vision_phrases!.map((phrase) => (
                  <li key={phrase} className="text-sm italic text-gray-600">
                    {phrase}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {dashboard.blueprint_privacy_note ? (
            <p className="text-xs text-gray-500">{dashboard.blueprint_privacy_note}</p>
          ) : null}
        </>
      ) : null}

      {dashboard.adaptive_strategic_intelligence?.implementation_blueprint_phase85?.phase ? (
        <>
          {(() => {
            const adaptive = dashboard.adaptive_strategic_intelligence!;
            return (
              <>
                <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
                  <h2 className="text-sm font-semibold">{labels.phase85Title}</h2>
                  <p className="mt-1 text-xs text-teal-700">
                    {adaptive.implementation_blueprint_phase85?.phase}
                    {adaptive.implementation_blueprint_phase85?.engine_phase
                      ? ` · ${adaptive.implementation_blueprint_phase85.engine_phase}`
                      : ""}
                  </p>
                  {adaptive.distinction_note ? (
                    <p className="mt-2 text-xs text-teal-700">{adaptive.distinction_note}</p>
                  ) : null}
                  {adaptive.mission ? (
                    <p className="mt-2 text-sm font-medium text-teal-900">{adaptive.mission}</p>
                  ) : null}
                  {adaptive.philosophy ? (
                    <p className="mt-2 text-sm text-teal-900">{adaptive.philosophy}</p>
                  ) : null}
                  {adaptive.abos_principle ? (
                    <p className="mt-2 text-xs text-teal-800">{adaptive.abos_principle}</p>
                  ) : null}
                  {adaptive.vision ? (
                    <p className="mt-2 text-xs italic text-teal-800">{adaptive.vision}</p>
                  ) : null}
                  {adaptive.adaptive_strategic_intelligence_note ? (
                    <p className="mt-2 text-xs text-teal-800">{adaptive.adaptive_strategic_intelligence_note}</p>
                  ) : null}
                </section>

                {(adaptive.integration_links ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {adaptive.integration_links?.map((link) =>
                      link.route ? (
                        <Link
                          key={link.route}
                          href={link.route}
                          className="rounded-lg border border-teal-200 px-3 py-1.5 text-sm"
                        >
                          {link.label}
                        </Link>
                      ) : null
                    )}
                  </div>
                ) : null}

                {adaptive.objectives && adaptive.objectives.length > 0 ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveObjectives}</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {adaptive.objectives.map((obj) => (
                        <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                      ))}
                    </div>
                  </section>
                ) : null}

                {adaptive.adaptive_strategic_questions?.principle ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveStrategicQuestions}</h3>
                    <p className="mt-2 text-sm text-gray-700">{adaptive.adaptive_strategic_questions.principle}</p>
                    <GuidanceList items={adaptive.adaptive_strategic_questions.questions} signalKey="question" />
                  </section>
                ) : null}

                {adaptive.continuous_strategic_review?.principle ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.continuousStrategicReview}</h3>
                    <p className="mt-2 text-sm text-gray-700">{adaptive.continuous_strategic_review.principle}</p>
                    {adaptive.continuous_strategic_review.dimensions &&
                    adaptive.continuous_strategic_review.dimensions.length > 0 ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {adaptive.continuous_strategic_review.dimensions.map((dim) => (
                          <ObjectiveCard
                            key={String(dim.key ?? dim.label)}
                            objective={{
                              key: String(dim.key ?? ""),
                              label: String(dim.label ?? ""),
                              description: String(dim.description ?? ""),
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </section>
                ) : null}

                {adaptive.strategic_flexibility?.principle ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.strategicFlexibility}</h3>
                    <p className="mt-2 text-sm text-gray-700">{adaptive.strategic_flexibility.principle}</p>
                    {adaptive.strategic_flexibility.modes && adaptive.strategic_flexibility.modes.length > 0 ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {adaptive.strategic_flexibility.modes.map((mode) => (
                          <ObjectiveCard
                            key={String(mode.key ?? mode.label)}
                            objective={{
                              key: String(mode.key ?? ""),
                              label: String(mode.label ?? ""),
                              description: String(mode.description ?? ""),
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </section>
                ) : null}

                {adaptive.learning_organization_connection?.principle ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.learningOrganizationConnection}</h3>
                    <p className="mt-2 text-sm text-gray-700">{adaptive.learning_organization_connection.principle}</p>
                    {adaptive.learning_organization_connection.connections &&
                    adaptive.learning_organization_connection.connections.length > 0 ? (
                      <ul className="mt-4 space-y-2">
                        {adaptive.learning_organization_connection.connections.map((conn) => {
                          const route = typeof conn.route === "string" ? conn.route : undefined;
                          return (
                            <li
                              key={String(conn.key ?? conn.label)}
                              className="rounded border border-gray-100 p-2 text-sm"
                            >
                              {route ? (
                                <Link href={route} className="font-medium text-teal-800 underline">
                                  {String(conn.label ?? "")}
                                </Link>
                              ) : (
                                <p className="font-medium">{String(conn.label ?? "")}</p>
                              )}
                              {conn.description ? (
                                <p className="mt-1 text-xs text-gray-600">{String(conn.description)}</p>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </section>
                ) : null}

                {adaptive.leadership_insights?.principle ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipInsights}</h3>
                    <p className="mt-2 text-sm text-gray-700">{adaptive.leadership_insights.principle}</p>
                    <GuidanceList items={adaptive.leadership_insights.insights} signalKey="label" />
                  </section>
                ) : null}

                {adaptive.companion_guidance?.principle ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveCompanionGuidance}</h3>
                    <p className="mt-2 text-sm text-gray-700">{adaptive.companion_guidance.principle}</p>
                    <GuidanceList items={adaptive.companion_guidance.examples} signalKey="prompt" />
                  </section>
                ) : null}

                {adaptive.limitation_principles?.principle ? (
                  <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveLimitationPrinciples}</h3>
                    <p className="mt-2 text-sm text-gray-700">{adaptive.limitation_principles.principle}</p>
                    {adaptive.limitation_principles.forbidden &&
                    adaptive.limitation_principles.forbidden.length > 0 ? (
                      <>
                        <p className="mt-3 text-xs font-medium text-amber-900">{labels.forbidden}</p>
                        <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-amber-800">
                          {adaptive.limitation_principles.forbidden.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                    {adaptive.limitation_principles.required &&
                    adaptive.limitation_principles.required.length > 0 ? (
                      <>
                        <p className="mt-3 text-xs font-medium text-amber-900">{labels.required}</p>
                        <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-amber-800">
                          {adaptive.limitation_principles.required.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </section>
                ) : null}

                {adaptive.engagement_summary ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveEngagementSummary}</h3>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="text-gray-500">{labels.adaptiveQuestions}</dt>
                        <dd>{String(adaptive.engagement_summary.adaptive_questions ?? 0)}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">{labels.reviewDimensions}</dt>
                        <dd>{String(adaptive.engagement_summary.review_dimensions ?? 0)}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">{labels.flexibilityModes}</dt>
                        <dd>{String(adaptive.engagement_summary.flexibility_modes ?? 0)}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">{labels.learningConnections}</dt>
                        <dd>{String(adaptive.engagement_summary.learning_connections ?? 0)}</dd>
                      </div>
                    </dl>
                  </section>
                ) : null}

                {adaptive.success_criteria && adaptive.success_criteria.length > 0 ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveSuccessCriteria}</h3>
                    <ul className="mt-3 space-y-2">
                      {adaptive.success_criteria.map((criterion: AbosSuccessCriterion) => (
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
                            {criterion.note ? (
                              <p className="mt-1 text-xs text-gray-500">{criterion.note}</p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {adaptive.self_love_connection ? (
                  <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveSelfLoveConnection}</h3>
                    {adaptive.self_love_connection.principle ? (
                      <p className="mt-2 text-sm text-gray-700">{adaptive.self_love_connection.principle}</p>
                    ) : null}
                    {(adaptive.self_love_connection.practices ?? []).length > 0 ? (
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
                        {adaptive.self_love_connection.practices!.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ) : null}

                {adaptive.trust_connection ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveTrustConnection}</h3>
                    {adaptive.trust_connection.principle ? (
                      <p className="mt-2 text-sm text-gray-700">{adaptive.trust_connection.principle}</p>
                    ) : null}
                    {(adaptive.trust_connection.leaders_should_know ?? []).length > 0 ? (
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
                        {adaptive.trust_connection.leaders_should_know!.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ) : null}

                {(adaptive.vision_phrases ?? []).length > 0 ? (
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveVisionPhrases}</h3>
                    <ul className="mt-3 space-y-2">
                      {adaptive.vision_phrases!.map((phrase) => (
                        <li key={phrase} className="text-sm italic text-gray-600">
                          {phrase}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {adaptive.privacy_note ? (
                  <p className="text-xs text-gray-500">{adaptive.privacy_note}</p>
                ) : null}
              </>
            );
          })()}
        </>
      ) : null}
    </div>
  );
}
