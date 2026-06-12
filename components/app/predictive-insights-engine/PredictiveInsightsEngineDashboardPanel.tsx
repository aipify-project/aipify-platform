"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePredictiveInsightsEngineDashboard,
  type BlueprintObjective,
  type OrganizationPredictiveInsight,
  type PredictiveInsightsEngineDashboard,
} from "@/lib/aipify/predictive-insights-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: { key?: string; label?: string; met?: boolean; note?: string | null };
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
    </div>
  );
}

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
  const engagement = dashboard.engagement_summary;
  const blueprintLinks = dashboard.blueprint_integration_links ?? [];

  return (
    <div className="space-y-6">
      {blueprintLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {blueprintLinks.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-violet-700">
          {dashboard.blueprint_distinction_note ?? labels.distinctionNote}
        </p>
        {dashboard.implementation_blueprint_phase74?.phase ? (
          <p className="mt-1 text-xs text-violet-600">
            {dashboard.implementation_blueprint_phase74.phase}
            {dashboard.implementation_blueprint_phase74.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase74.engine_phase}`
              : ""}
          </p>
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
        {dashboard.predictive_operations_note ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.predictive_operations_note}</p>
        ) : null}
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

      {dashboard.blueprint_objectives && dashboard.blueprint_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.blueprint_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.operational_pattern_recognition?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.operationalPatternRecognition}</h3>
          <p className="mt-2 text-gray-700">{dashboard.operational_pattern_recognition.principle}</p>
          {dashboard.operational_pattern_recognition.patterns &&
          dashboard.operational_pattern_recognition.patterns.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {dashboard.operational_pattern_recognition.patterns.map((pattern) => (
                <li key={pattern.key ?? pattern.signal} className="rounded border border-gray-100 p-2">
                  <p className="font-medium">
                    {pattern.emoji ? `${pattern.emoji} ` : ""}
                    {pattern.signal ?? pattern.prompt}
                  </p>
                  {pattern.description ? <p className="mt-1 text-xs text-gray-600">{pattern.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.resource_awareness?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.resourceAwareness}</h3>
          <p className="mt-2 text-gray-700">{dashboard.resource_awareness.principle}</p>
          {dashboard.resource_awareness.dimensions && dashboard.resource_awareness.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.resource_awareness.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.bottleneck_forecasting?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.bottleneckForecasting}</h3>
          <p className="mt-2 text-gray-700">{dashboard.bottleneck_forecasting.principle}</p>
          {dashboard.bottleneck_forecasting.forecasts && dashboard.bottleneck_forecasting.forecasts.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {dashboard.bottleneck_forecasting.forecasts.map((forecast) => (
                <li key={forecast.key ?? forecast.signal} className="rounded border border-gray-100 p-2">
                  <p className="font-medium">
                    {forecast.emoji ? `${forecast.emoji} ` : ""}
                    {forecast.signal}
                  </p>
                  {forecast.description ? <p className="mt-1 text-xs text-gray-600">{forecast.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.scenario_observations?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.scenarioObservations}</h3>
          <p className="mt-2 text-gray-700">{dashboard.scenario_observations.principle}</p>
          {dashboard.scenario_observations.scenarios && dashboard.scenario_observations.scenarios.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {dashboard.scenario_observations.scenarios.map((scenario) => (
                <ObjectiveCard key={scenario.key ?? scenario.label} objective={scenario} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.executive_insights_blueprint?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.executiveInsights}</h3>
          <p className="mt-2 text-gray-700">{dashboard.executive_insights_blueprint.principle}</p>
          {dashboard.executive_insights_blueprint.insight_types &&
          dashboard.executive_insights_blueprint.insight_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {dashboard.executive_insights_blueprint.insight_types.map((insight) => (
                <ObjectiveCard key={insight.key ?? insight.label} objective={insight} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_guidance?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.companionGuidance}</h3>
          <p className="mt-2 text-gray-700">{dashboard.companion_guidance.principle}</p>
          {dashboard.companion_guidance.examples && dashboard.companion_guidance.examples.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {dashboard.companion_guidance.examples.map((example) => (
                <li key={example.key ?? example.prompt} className="rounded border border-violet-100 bg-violet-50/30 p-2">
                  <p className="font-medium">
                    {example.emoji ? `${example.emoji} ` : ""}
                    {example.prompt}
                  </p>
                  {example.consideration ? <p className="mt-1 text-xs text-gray-600">{example.consideration}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.limitation_principles?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.limitationPrinciples}</h3>
          <p className="mt-2 text-gray-700">{dashboard.limitation_principles.principle}</p>
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

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.journey_phrase ? (
            <p className="mt-2 text-xs italic">{dashboard.self_love_connection.journey_phrase}</p>
          ) : null}
          {dashboard.self_love_connection.practices && dashboard.self_love_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.users_should_see && dashboard.trust_connection.users_should_see.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_connection.users_should_see.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          <p className="mt-2 text-gray-700">{dashboard.dogfooding.principle}</p>
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.activeInsights}: {engagement.active_insights ?? 0}</span>
            <span>{labels.highRiskInsights}: {engagement.high_risk_insights ?? 0}</span>
            <span>{labels.predictionTypes}: {engagement.prediction_type_count ?? 0}</span>
            <span>{labels.patternSignals}: {engagement.pattern_signals ?? 0}</span>
            <span>{labels.bottleneckForecasts}: {engagement.bottleneck_forecasts ?? 0}</span>
          </div>
        </section>
      ) : null}

      {dashboard.success_criteria && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.success_criteria.map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-violet-900">
            {dashboard.vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

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
