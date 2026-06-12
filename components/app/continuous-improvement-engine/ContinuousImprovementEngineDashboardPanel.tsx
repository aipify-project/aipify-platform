"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseContinuousImprovementEngineDashboard,
  type AdaptiveOrganizationContinuousOptimizationBlueprint,
  type AdaptiveOrganizationExperimentRecord,
  type BlueprintCompanionExample,
  type BlueprintIntegrationLink,
  type BlueprintObjective,
  type BlueprintSuccessCriterion,
  type ContinuousImprovementEngineDashboard,
  type ContinuousImprovementOrganizationalEvolutionBlueprint,
  type FatigueSignalRecord,
  type ImprovementInitiativeRecord,
  type ImprovementPortfolioRecord,
  type ImprovementSuggestion,
} from "@/lib/aipify/continuous-improvement-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3 text-sm">
      <span className="font-medium text-gray-900">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function CompanionCard({ example }: { example: BlueprintCompanionExample }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3 text-sm text-gray-700">
      {example.scenario ? <p className="text-xs font-medium uppercase text-gray-500">{example.scenario}</p> : null}
      <p className="mt-1">{example.question ?? example.prompt ?? example.example}</p>
    </div>
  );
}

function IntegrationLinkRow({ link }: { link: BlueprintIntegrationLink }) {
  if (!link.route) {
    return (
      <div className="text-sm">
        <span className="font-medium text-gray-900">{link.label}</span>
        {link.note ? <p className="mt-0.5 text-xs text-gray-600">{link.note}</p> : null}
      </div>
    );
  }
  return (
    <div className="text-sm">
      <Link href={link.route} className="font-medium text-indigo-700 underline">
        {link.label}
      </Link>
      {link.note ? <p className="mt-0.5 text-xs text-gray-600">{link.note}</p> : null}
    </div>
  );
}

function SuccessCriterionRow({ criterion }: { criterion: BlueprintSuccessCriterion }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className={criterion.met ? "text-green-600" : "text-gray-400"}>{criterion.met ? "✓" : "○"}</span>
      <div>
        <span className="text-gray-900">{criterion.label}</span>
        {criterion.note ? <p className="mt-0.5 text-xs text-gray-600">{criterion.note}</p> : null}
      </div>
    </div>
  );
}

function BlueprintSection({ blueprint, labels }: { blueprint: ContinuousImprovementOrganizationalEvolutionBlueprint; labels: Record<string, string> }) {
  const engagement = blueprint.engagement_summary;

  return (
    <>
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.blueprintTitle}</h2>
        <p className="mt-1 text-xs uppercase tracking-wide text-teal-700">
          {blueprint.title ?? labels.blueprintPhase90}
          {blueprint.engine_phase ? ` · ${blueprint.engine_phase}` : ""}
        </p>
        {blueprint.mission ? <p className="mt-2 text-sm font-medium text-teal-900">{blueprint.mission}</p> : null}
        {blueprint.philosophy ? <p className="mt-2 text-sm text-teal-900">{blueprint.philosophy}</p> : null}
        {blueprint.abos_principle ? <p className="mt-2 text-xs text-teal-800">{blueprint.abos_principle}</p> : null}
        {blueprint.vision ? <p className="mt-2 text-xs font-medium italic text-teal-800">{blueprint.vision}</p> : null}
        {blueprint.distinction_note ? <p className="mt-2 text-xs text-teal-700">{blueprint.distinction_note}</p> : null}
      </section>

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.initiativesActive}: {String(engagement.initiatives_active ?? 0)}</span>
            <span>{labels.initiativesCompleted}: {String(engagement.initiatives_completed ?? 0)}</span>
            <span>{labels.feedbackCount}: {String(engagement.feedback_count ?? 0)}</span>
            <span>{labels.reviewCyclesCompleted}: {String(engagement.review_cycles_completed ?? 0)}</span>
            <span>{labels.avgImprovementPct}: {String(engagement.avg_improvement_pct ?? 0)}%</span>
          </div>
        </section>
      ) : null}

      {blueprint.objectives && blueprint.objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.objectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {blueprint.objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.improvement_questions && blueprint.improvement_questions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.improvementQuestions}</h3>
          <div className="mt-3 space-y-3">
            {blueprint.improvement_questions.map((question) => (
              <CompanionCard key={question.key ?? question.scenario} example={question} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.learning_cycles?.cycle_phrase ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-indigo-900">
          <h3 className="text-sm font-semibold">{labels.learningCycles}</h3>
          <p className="mt-2 font-medium">{String(blueprint.learning_cycles.cycle_phrase)}</p>
          {typeof blueprint.learning_cycles.principle === "string" ? (
            <p className="mt-2 text-xs">{blueprint.learning_cycles.principle}</p>
          ) : null}
        </section>
      ) : null}

      {blueprint.experimentation_principles?.principle ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.experimentationPrinciples}</h3>
          <p className="mt-2">{String(blueprint.experimentation_principles.principle)}</p>
        </section>
      ) : null}

      {blueprint.organizational_evolution?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.organizationalEvolution}</h3>
          <p className="mt-2">{String(blueprint.organizational_evolution.principle)}</p>
        </section>
      ) : null}

      {blueprint.companion_guidance && blueprint.companion_guidance.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.companionGuidanceHint}</p>
          <div className="mt-3 space-y-3">
            {blueprint.companion_guidance.map((example) => (
              <CompanionCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.improvement_sources && blueprint.improvement_sources.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.improvementSources}</h3>
          <div className="mt-3 space-y-3">
            {blueprint.improvement_sources.map((source) => (
              <IntegrationLinkRow key={source.key ?? source.label} link={source} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{String(blueprint.self_love_connection.principle)}</p>
        </section>
      ) : null}

      {blueprint.leadership_insights?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipInsights}</h3>
          <p className="mt-2">{String(blueprint.leadership_insights.principle)}</p>
        </section>
      ) : null}

      {blueprint.limitation_principles?.principle ? (
        <section className="rounded-lg border border-orange-100 bg-orange-50/40 p-4 text-sm text-orange-900">
          <h3 className="text-sm font-semibold">{labels.limitationPrinciples}</h3>
          <p className="mt-2">{String(blueprint.limitation_principles.principle)}</p>
        </section>
      ) : null}

      {blueprint.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          <p className="mt-2">{String(blueprint.trust_connection.principle)}</p>
        </section>
      ) : null}

      {blueprint.dogfooding?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dogfooding}</h3>
          <p className="mt-2 text-sm text-gray-600">{String(blueprint.dogfooding.principle)}</p>
        </section>
      ) : null}

      {blueprint.integration_links && blueprint.integration_links.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationLinks}</h3>
          <div className="mt-3 space-y-3">
            {blueprint.integration_links.map((link) => (
              <IntegrationLinkRow key={link.key ?? link.label} link={link} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.success_criteria && blueprint.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {blueprint.success_criteria.map((criterion) => (
              <SuccessCriterionRow key={criterion.key ?? criterion.label} criterion={criterion} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function Phase134Section({
  blueprint,
  labels,
}: {
  blueprint: AdaptiveOrganizationContinuousOptimizationBlueprint;
  labels: Record<string, string>;
}) {
  const engagement = blueprint.engagement_summary;

  return (
    <>
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.phase134BlueprintTitle}</h2>
        <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">
          {blueprint.title ?? labels.phase134BlueprintLabel}
          {blueprint.era ? ` · ${blueprint.era}` : ""}
        </p>
        {blueprint.mission ? <p className="mt-2 text-sm font-medium text-violet-900">{blueprint.mission}</p> : null}
        {blueprint.philosophy ? <p className="mt-2 text-sm text-violet-900">{blueprint.philosophy}</p> : null}
        {blueprint.abos_principle ? <p className="mt-2 text-xs text-violet-800">{blueprint.abos_principle}</p> : null}
        {blueprint.vision ? <p className="mt-2 text-xs font-medium italic text-violet-800">{blueprint.vision}</p> : null}
        {blueprint.distinction_note ? <p className="mt-2 text-xs text-violet-700">{blueprint.distinction_note}</p> : null}
        {blueprint.privacy_note ? <p className="mt-2 text-xs text-violet-600">{blueprint.privacy_note}</p> : null}
      </section>

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134EngagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.phase134ActiveExperiments}: {String(engagement.active_experiments ?? 0)}</span>
            <span>{labels.phase134PortfolioCurrent}: {String(engagement.portfolio_current ?? 0)}</span>
            <span>{labels.phase134ElevatedFatigue}: {String(engagement.elevated_fatigue_signals ?? 0)}</span>
            <span>{labels.initiativesActive}: {String(engagement.initiatives_active ?? 0)}</span>
            <span>{labels.initiativesCompleted}: {String(engagement.initiatives_completed ?? 0)}</span>
            <span>{labels.reviewCyclesCompleted}: {String(engagement.review_cycles_completed ?? 0)}</span>
          </div>
        </section>
      ) : null}

      {blueprint.objectives && blueprint.objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134Objectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {blueprint.objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.learning_loops?.cycle_phrase ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-indigo-900">
          <h3 className="text-sm font-semibold">{labels.phase134LearningLoops}</h3>
          <p className="mt-2 font-medium">{String(blueprint.learning_loops.cycle_phrase)}</p>
          {typeof blueprint.learning_loops.principle === "string" ? (
            <p className="mt-2 text-xs">{blueprint.learning_loops.principle}</p>
          ) : null}
        </section>
      ) : null}

      {blueprint.adaptive_organization_center?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134AdaptiveCenter}</h3>
          <p className="mt-2">{String(blueprint.adaptive_organization_center.principle)}</p>
        </section>
      ) : null}

      {blueprint.experimentation_framework?.principle ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.phase134Experimentation}</h3>
          <p className="mt-2">{String(blueprint.experimentation_framework.principle)}</p>
        </section>
      ) : null}

      {blueprint.adaptation_insight_engine?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134AdaptationInsights}</h3>
          <p className="mt-2">{String(blueprint.adaptation_insight_engine.principle)}</p>
        </section>
      ) : null}

      {blueprint.optimization_companion && blueprint.optimization_companion.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134OptimizationCompanion}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.phase134OptimizationCompanionHint}</p>
          <div className="mt-3 space-y-3">
            {blueprint.optimization_companion.map((example) => (
              <CompanionCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.change_fatigue_protection?.principle ? (
        <section className="rounded-lg border border-orange-100 bg-orange-50/40 p-4 text-sm text-orange-900">
          <h3 className="text-sm font-semibold">{labels.phase134ChangeFatigue}</h3>
          <p className="mt-2">{String(blueprint.change_fatigue_protection.principle)}</p>
        </section>
      ) : null}

      {blueprint.improvement_portfolio_engine?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134ImprovementPortfolio}</h3>
          <p className="mt-2">{String(blueprint.improvement_portfolio_engine.principle)}</p>
        </section>
      ) : null}

      {blueprint.companion_limitations?.principle ? (
        <section className="rounded-lg border border-red-100 bg-red-50/40 p-4 text-sm text-red-900">
          <h3 className="text-sm font-semibold">{labels.phase134CompanionLimitations}</h3>
          <p className="mt-2">{String(blueprint.companion_limitations.principle)}</p>
        </section>
      ) : null}

      {blueprint.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{String(blueprint.self_love_connection.principle)}</p>
        </section>
      ) : null}

      {blueprint.security_requirements?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134SecurityRequirements}</h3>
          <p className="mt-2">{String(blueprint.security_requirements.principle)}</p>
        </section>
      ) : null}

      {blueprint.era_cross_links && blueprint.era_cross_links.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134EraCrossLinks}</h3>
          <div className="mt-3 space-y-3">
            {blueprint.era_cross_links.map((link) => (
              <IntegrationLinkRow key={link.key ?? link.label} link={link} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.integration_links && blueprint.integration_links.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationLinks}</h3>
          <div className="mt-3 space-y-3">
            {blueprint.integration_links.map((link) => (
              <IntegrationLinkRow key={link.key ?? link.label} link={link} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint.dogfooding?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dogfooding}</h3>
          <p className="mt-2 text-sm text-gray-600">{String(blueprint.dogfooding.principle)}</p>
        </section>
      ) : null}

      {blueprint.success_criteria && blueprint.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134SuccessCriteria}</h3>
          <div className="mt-3 space-y-2">
            {blueprint.success_criteria.map((criterion) => (
              <SuccessCriterionRow key={criterion.key ?? criterion.label} criterion={criterion} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function ExperimentRow({ experiment }: { experiment: AdaptiveOrganizationExperimentRecord }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="font-medium text-gray-900">{experiment.experiment_title}</span>
          {experiment.pilot_scope ? <p className="mt-1 text-xs text-gray-600">{experiment.pilot_scope}</p> : null}
          {experiment.success_criteria ? <p className="mt-1 text-xs text-gray-500">{experiment.success_criteria}</p> : null}
        </div>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{experiment.status}</span>
      </div>
    </div>
  );
}

function PortfolioRow({ item }: { item: ImprovementPortfolioRecord }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="font-medium text-gray-900">{item.improvement_title}</span>
          {item.lessons_learned ? <p className="mt-1 text-xs text-gray-600">{item.lessons_learned}</p> : null}
          {item.expected_outcome && item.actual_outcome ? (
            <p className="mt-1 text-xs text-gray-500">
              {item.expected_outcome} → {item.actual_outcome}
            </p>
          ) : null}
        </div>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{item.portfolio_status}</span>
      </div>
    </div>
  );
}

function FatigueSignalRow({ signal }: { signal: FatigueSignalRecord }) {
  const intensityClass =
    signal.intensity === "high" || signal.intensity === "elevated"
      ? "text-orange-700 bg-orange-50"
      : "text-gray-600 bg-gray-100";
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className={`rounded px-2 py-0.5 text-xs ${intensityClass}`}>{signal.intensity}</span>
      <div>
        <span className="font-medium text-gray-900">{signal.signal_label}</span>
        {signal.aggregate_note ? <p className="mt-0.5 text-xs text-gray-600">{signal.aggregate_note}</p> : null}
      </div>
    </div>
  );
}

export function ContinuousImprovementEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ContinuousImprovementEngineDashboard | null>(null);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const [dashboardRes, suggestionsRes] = await Promise.all([
      fetch("/api/aipify/continuous-improvement-engine/dashboard"),
      fetch("/api/aipify/continuous-improvement-engine/initiatives"),
    ]);
    if (dashboardRes.ok) {
      setDashboard(parseContinuousImprovementEngineDashboard(await dashboardRes.json()));
    }
    if (suggestionsRes.ok) {
      const body = (await suggestionsRes.json()) as { suggestions?: ImprovementSuggestion[] };
      setSuggestions(body.suggestions ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const reviewInitiative = async (initiative: ImprovementInitiativeRecord, status: string) => {
    if (!initiative.id) return;
    setReviewing(initiative.id);
    setActionError(null);
    const res = await fetch("/api/aipify/continuous-improvement-engine/initiatives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review", initiative_id: initiative.id, status }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setReviewing(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const blueprint = dashboard.continuous_improvement_organizational_evolution_blueprint;
  const phase134 = dashboard.implementation_blueprint_phase134;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {phase134 ? <Phase134Section blueprint={phase134} labels={labels} /> : null}

      {blueprint ? <BlueprintSection blueprint={blueprint} labels={labels} /> : null}

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

      {dashboard.initiatives && dashboard.initiatives.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.initiatives}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.initiatives.map((initiative) => (
              <div key={initiative.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{initiative.initiative_title}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{initiative.source}</span>
                    <p className="mt-1 text-xs text-gray-600">{initiative.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{initiative.status}</span>
                    {initiative.status === "proposed" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={reviewing === initiative.id}
                        onClick={() => void reviewInitiative(initiative, "approved")}
                      >
                        {reviewing === initiative.id ? labels.reviewing : labels.approveInitiative}
                      </button>
                    )}
                    {initiative.status === "approved" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={reviewing === initiative.id}
                        onClick={() => void reviewInitiative(initiative, "in_progress")}
                      >
                        {reviewing === initiative.id ? labels.reviewing : labels.startInitiative}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.experiments && dashboard.experiments.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134Experiments}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.experiments.map((experiment) => (
              <ExperimentRow key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </section>
      )}

      {dashboard.improvement_portfolio && dashboard.improvement_portfolio.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134PortfolioItems}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.improvement_portfolio.map((item) => (
              <PortfolioRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {dashboard.fatigue_signals && dashboard.fatigue_signals.length > 0 && (
        <section className="rounded-xl border border-orange-100 bg-orange-50/30 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase134FatigueSignals}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.phase134FatigueSignalsHint}</p>
          <div className="mt-3 space-y-2">
            {dashboard.fatigue_signals.map((signal) => (
              <FatigueSignalRow key={signal.id ?? signal.signal_key} signal={signal} />
            ))}
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {suggestions.map((suggestion, index) => (
              <div key={`${suggestion.initiative_title}-${index}`} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{suggestion.initiative_title}</span>
                <span className="ml-2 text-xs uppercase text-gray-500">{suggestion.priority}</span>
                {suggestion.rationale && <p className="mt-1 text-xs">{suggestion.rationale}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.trends && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trends}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(dashboard.trends, null, 2)}</pre>
        </section>
      )}

      {dashboard.memory_integration && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.memoryIntegration}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.memory_integration, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.success_measurements && dashboard.success_measurements.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successMeasurements}</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.success_measurements.map((measurement) => (
              <div key={measurement.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{measurement.metric_key}</span>
                <span className="ml-2 text-xs">
                  {measurement.baseline_value} → {measurement.current_value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
