"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDigitalTwinDashboard,
  type BlueprintObjective,
  type DigitalTwinDashboard,
} from "@/lib/aipify/digital-twin";

type DigitalTwinDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function confidenceClass(level: string) {
  switch (level) {
    case "high":
      return "bg-emerald-100 text-emerald-800";
    case "low":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export function DigitalTwinDashboardPanel({ labels }: DigitalTwinDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<DigitalTwinDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/digital-twin/dashboard");
    if (res.ok) setDashboard(parseDigitalTwinDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const engagement = dashboard.engagement_summary;
  const phase124 = dashboard.implementation_blueprint_phase124;
  const phase124Engagement = phase124?.engagement_summary;
  const phase159 = dashboard.implementation_blueprint_phase159;
  const phase159Engagement = phase159?.engagement_summary;

  return (
    <div className="space-y-6">
      {(dashboard.blueprint_integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.blueprint_integration_links?.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      {dashboard.blueprint_mission || dashboard.blueprint_distinction_note ? (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-6">
          <h2 className="text-sm font-semibold text-indigo-900">{labels.blueprintSection}</h2>
          {dashboard.implementation_blueprint_phase77?.phase ? (
            <p className="mt-1 text-xs text-indigo-700">
              {dashboard.implementation_blueprint_phase77.phase}
              {dashboard.implementation_blueprint_phase77.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase77.engine_phase}`
                : ""}
            </p>
          ) : null}
          {dashboard.blueprint_distinction_note ? (
            <p className="mt-2 text-xs text-indigo-800">{dashboard.blueprint_distinction_note}</p>
          ) : null}
          {dashboard.blueprint_mission ? (
            <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.blueprint_mission}</p>
          ) : null}
          {dashboard.blueprint_philosophy ? (
            <p className="mt-2 text-sm text-indigo-900">{dashboard.blueprint_philosophy}</p>
          ) : null}
          {dashboard.blueprint_abos_principle ? (
            <p className="mt-2 text-xs text-indigo-800">{dashboard.blueprint_abos_principle}</p>
          ) : null}
          {(dashboard.blueprint_objectives ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.objectives}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {dashboard.blueprint_objectives?.map((obj) => (
                  <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                ))}
              </div>
            </div>
          ) : null}
          {dashboard.digital_twin_definition?.components?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.twinDefinition}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {dashboard.digital_twin_definition.components.map((comp) => (
                  <ObjectiveCard key={comp.key ?? comp.label} objective={comp} />
                ))}
              </div>
            </div>
          ) : null}
          {dashboard.organizational_mapping?.example_chain?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.organizationalMapping}</h3>
              <p className="mt-2 text-sm text-indigo-900">
                {dashboard.organizational_mapping.example_chain.join(" → ")}
              </p>
            </div>
          ) : null}
          {dashboard.companion_observations?.observations?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.companionObservations}</h3>
              <ul className="mt-2 space-y-2 text-sm text-indigo-900">
                {dashboard.companion_observations.observations.map((obs) => (
                  <li key={obs.key ?? obs.signal}>
                    {obs.emoji ? `${obs.emoji} ` : ""}
                    {obs.signal}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {dashboard.simulation_connection?.example_scenarios?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.simulationConnection}</h3>
              <ul className="mt-2 space-y-1 text-sm text-indigo-900">
                {dashboard.simulation_connection.example_scenarios.map((scenario) => (
                  <li key={scenario.key ?? scenario.label}>{scenario.label}</li>
                ))}
              </ul>
              {dashboard.simulation_connection.simulation_route ? (
                <Link
                  href={dashboard.simulation_connection.simulation_route}
                  className="mt-2 inline-block text-sm text-indigo-700 underline"
                >
                  {labels.openSimulations}
                </Link>
              ) : null}
            </div>
          ) : null}
          {dashboard.learning_organization_connection?.evolution_sources?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.learningConnection}</h3>
              <ul className="mt-2 space-y-1 text-sm text-indigo-900">
                {dashboard.learning_organization_connection.evolution_sources.map((src) => (
                  <li key={src.key ?? src.label}>
                    {src.route ? (
                      <Link href={src.route} className="underline">
                        {src.label}
                      </Link>
                    ) : (
                      src.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {dashboard.blueprint_self_love_connection?.practices?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.selfLoveConnection}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-indigo-900">
                {dashboard.blueprint_self_love_connection.practices.map((practice) => (
                  <li key={practice}>{practice}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {dashboard.blueprint_leadership_insights?.insight_types?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.leadershipInsights}</h3>
              <ul className="mt-2 space-y-1 text-sm text-indigo-900">
                {dashboard.blueprint_leadership_insights.insight_types.map((insight) => (
                  <li key={insight.key ?? insight.label}>
                    {insight.emoji ? `${insight.emoji} ` : ""}
                    {insight.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {dashboard.privacy_principles?.forbidden?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.privacyPrinciples}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-indigo-800">
                {dashboard.privacy_principles.forbidden.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {engagement ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              <p className="text-xs text-indigo-800">
                {labels.activeRoles}: {engagement.active_roles ?? 0}
              </p>
              <p className="text-xs text-indigo-800">
                {labels.activeProcesses}: {engagement.active_processes ?? 0}
              </p>
              <p className="text-xs text-indigo-800">
                {labels.openInsights}: {engagement.open_insights ?? 0}
              </p>
            </div>
          ) : null}
          {(dashboard.blueprint_success_criteria ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.successCriteria}</h3>
              <ul className="mt-2 space-y-1">
                {dashboard.blueprint_success_criteria?.map((criterion) => (
                  <li
                    key={criterion.key ?? criterion.label}
                    className="flex flex-wrap items-center justify-between gap-2 rounded border border-indigo-100 px-3 py-2 text-sm"
                  >
                    <span className="text-indigo-900">{criterion.label}</span>
                    <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
                      {criterion.met ? labels.criterionMet : labels.criterionPending}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(dashboard.blueprint_vision_phrases ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.visionPhrases}</h3>
              <ul className="mt-2 space-y-1 text-sm italic text-indigo-900">
                {dashboard.blueprint_vision_phrases?.map((phrase) => (
                  <li key={phrase}>&ldquo;{phrase}&rdquo;</li>
                ))}
              </ul>
            </div>
          ) : null}
          {dashboard.blueprint_privacy_note ? (
            <p className="mt-4 text-xs text-indigo-700">{dashboard.blueprint_privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {phase124?.mission || phase124?.distinction_note ? (
        <section className="rounded-xl border border-teal-200 bg-teal-50/30 p-6">
          <h2 className="text-sm font-semibold text-teal-900">{labels.phase124Section}</h2>
          {phase124.phase ? (
            <p className="mt-1 text-xs text-teal-700">
              {labels.phase124Era}
              {phase124.engine_phase ? ` · ${phase124.engine_phase}` : ""}
            </p>
          ) : null}
          {phase124.distinction_note ? (
            <p className="mt-2 text-xs text-teal-800">{phase124.distinction_note}</p>
          ) : null}
          {phase124.mission ? (
            <p className="mt-2 text-sm font-medium text-teal-900">{phase124.mission}</p>
          ) : null}
          {phase124.philosophy ? (
            <p className="mt-2 text-sm text-teal-900">{phase124.philosophy}</p>
          ) : null}
          {phase124.abos_principle ? (
            <p className="mt-2 text-xs text-teal-800">{phase124.abos_principle}</p>
          ) : null}
          {(phase124.objectives ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124Objectives}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase124.objectives?.map((obj) => (
                  <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                ))}
              </div>
            </div>
          ) : null}
          {phase124.organizational_digital_twin?.reflects?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124TwinReflects}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase124.organizational_digital_twin.reflects.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase124.digital_twin_center ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124TwinCenter}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-teal-900">
                {phase124.digital_twin_center?.map((cap) => (
                  <li key={cap.key ?? cap.label} className="rounded border border-teal-100 px-2 py-1">
                    {cap.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(phase124.organizational_map_engine ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124MapEngine}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase124.organizational_map_engine?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase124.dependency_intelligence ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124DependencyIntelligence}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase124.dependency_intelligence?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {phase124.simulation_workspace?.scenarios?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124SimulationWorkspace}</h3>
              <ul className="mt-2 space-y-1 text-sm text-teal-900">
                {phase124.simulation_workspace.scenarios.map((scenario) => (
                  <li key={scenario.key ?? scenario.label}>{scenario.label}</li>
                ))}
              </ul>
              {phase124.simulation_workspace.simulation_route ? (
                <Link
                  href={phase124.simulation_workspace.simulation_route}
                  className="mt-2 inline-block text-sm text-teal-700 underline"
                >
                  {labels.openSimulations}
                </Link>
              ) : null}
            </div>
          ) : null}
          {(phase124.transformation_impact_model ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124TransformationImpact}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase124.transformation_impact_model?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase124.knowledge_network_engine ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124KnowledgeNetwork}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase124.knowledge_network_engine?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase124.resilience_visualization ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124ResilienceVisualization}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase124.resilience_visualization?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase124.executive_digital_twin_companion ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124ExecutiveCompanion}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase124.executive_digital_twin_companion?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase124.companion_limitations ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124CompanionLimitations}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-teal-800">
                {phase124.companion_limitations?.map((rule) => (
                  <li key={rule.key ?? rule.label}>{rule.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {phase124.self_love_connection?.considerations?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124SelfLoveConnection}</h3>
              <ul className="mt-2 space-y-1 text-sm text-teal-900">
                {phase124.self_love_connection.considerations.map((item) => (
                  <li key={item.key ?? item.label}>{item.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {phase124.memory_engine?.captures?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124MemoryEngine}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-teal-900">
                {phase124.memory_engine.captures.map((item) => (
                  <li key={item.key ?? item.label} className="rounded border border-teal-100 px-2 py-1">
                    {item.label}
                  </li>
                ))}
              </ul>
              {phase124.memory_engine.org_memory_route ? (
                <Link
                  href={phase124.memory_engine.org_memory_route}
                  className="mt-2 inline-block text-sm text-teal-700 underline"
                >
                  {labels.phase124OpenOrgMemory}
                </Link>
              ) : null}
            </div>
          ) : null}
          {(phase124.cross_links ?? []).length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {phase124.cross_links?.map((link) =>
                link.route ? (
                  <Link key={link.route + (link.label ?? "")} href={link.route} className="rounded-lg border border-teal-200 px-3 py-1.5 text-sm">
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}
          {phase124Engagement ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              <p className="text-xs text-teal-800">
                {labels.phase124TwinCenterCount}: {phase124Engagement.twin_center_capabilities ?? 0}
              </p>
              <p className="text-xs text-teal-800">
                {labels.phase124DependencySignals}: {phase124Engagement.dependency_signals ?? 0}
              </p>
              <p className="text-xs text-teal-800">
                {labels.phase124SimulationScenarios}: {phase124Engagement.simulation_scenarios ?? 0}
              </p>
            </div>
          ) : null}
          {(phase124.success_criteria ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124SuccessCriteria}</h3>
              <ul className="mt-2 space-y-1">
                {phase124.success_criteria?.map((criterion) => (
                  <li
                    key={criterion.key ?? criterion.label}
                    className="flex flex-wrap items-center justify-between gap-2 rounded border border-teal-100 px-3 py-2 text-sm"
                  >
                    <span className="text-teal-900">{criterion.label}</span>
                    <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
                      {criterion.met ? labels.criterionMet : labels.criterionPending}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(phase124.success_metrics ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124SuccessMetrics}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-teal-900">
                {phase124.success_metrics?.map((metric) => (
                  <li key={metric.key ?? metric.label} className="rounded border border-teal-100 px-2 py-1">
                    {metric.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {phase124.companion_adaptation?.examples?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">{labels.phase124CompanionAdaptation}</h3>
              <ul className="mt-2 space-y-2 text-sm text-teal-900">
                {phase124.companion_adaptation.examples.map((example) => (
                  <li key={example.key ?? example.prompt}>
                    {example.emoji ? `${example.emoji} ` : ""}
                    {example.prompt}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {phase124.privacy_note ? (
            <p className="mt-4 text-xs text-teal-700">{phase124.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {phase159?.mission || phase159?.distinction_note ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/30 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.phase159Section}</h2>
          {phase159.phase ? (
            <p className="mt-1 text-xs text-violet-700">
              {labels.phase159Era}
              {phase159.engine_phase ? ` · ${phase159.engine_phase}` : ""}
            </p>
          ) : null}
          {phase159.distinction_note ? (
            <p className="mt-2 text-xs text-violet-800">{phase159.distinction_note}</p>
          ) : null}
          {phase159.mission ? (
            <p className="mt-2 text-sm font-medium text-violet-900">{phase159.mission}</p>
          ) : null}
          {phase159.philosophy ? (
            <p className="mt-2 text-sm text-violet-900">{phase159.philosophy}</p>
          ) : null}
          {phase159.abos_principle ? (
            <p className="mt-2 text-xs text-violet-800">{phase159.abos_principle}</p>
          ) : null}
          {(phase159.objectives ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159Objectives}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase159.objectives?.map((obj) => (
                  <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase159.systemic_awareness_center ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159AwarenessCenter}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-violet-900">
                {phase159.systemic_awareness_center?.map((cap) => (
                  <li key={cap.key ?? cap.label} className="rounded border border-violet-100 px-2 py-1">
                    {cap.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(phase159.interdependency_engine ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159InterdependencyEngine}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase159.interdependency_engine?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase159.systemic_consequence_framework ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159ConsequenceFramework}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase159.systemic_consequence_framework?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {phase159.executive_systemic_reviews?.review_themes?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159ExecutiveReviews}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase159.executive_systemic_reviews.review_themes.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {(phase159.systemic_companion ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159SystemicCompanion}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase159.systemic_companion?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {phase159.organizational_health_engine?.themes?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159OrgHealthThemes}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase159.organizational_health_engine.themes.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
              {phase159.organizational_health_engine.org_health_route ? (
                <Link
                  href={phase159.organizational_health_engine.org_health_route}
                  className="mt-2 inline-block text-sm text-violet-700 underline"
                >
                  {labels.phase159OpenOrgHealth}
                </Link>
              ) : null}
            </div>
          ) : null}
          {(phase159.systemic_learning_engine ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159SystemicLearning}</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {phase159.systemic_learning_engine?.map((item) => (
                  <ObjectiveCard key={item.key ?? item.label} objective={item} />
                ))}
              </div>
            </div>
          ) : null}
          {phase159.awareness_memory_engine?.captures?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159AwarenessMemory}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-violet-900">
                {phase159.awareness_memory_engine.captures.map((item) => (
                  <li key={item.key ?? item.label} className="rounded border border-violet-100 px-2 py-1">
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(phase159.companion_limitations ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159CompanionLimitations}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-violet-800">
                {phase159.companion_limitations?.map((rule) => (
                  <li key={rule.key ?? rule.label}>{rule.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {phase159.self_love_connection?.considerations?.length ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159SelfLoveConnection}</h3>
              <ul className="mt-2 space-y-1 text-sm text-violet-900">
                {phase159.self_love_connection.considerations.map((item) => (
                  <li key={item.key ?? item.label}>{item.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(phase159.integration_links ?? []).length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {phase159.integration_links?.map((link) =>
                link.route ? (
                  <Link key={link.route + (link.label ?? "")} href={link.route} className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm">
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}
          {phase159Engagement ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              <p className="text-xs text-violet-800">
                {labels.phase159DependencyMaps}: {phase159Engagement.dependency_maps ?? 0}
              </p>
              <p className="text-xs text-violet-800">
                {labels.phase159SystemicReviews}: {phase159Engagement.systemic_reviews ?? 0}
              </p>
              <p className="text-xs text-violet-800">
                {labels.phase159AwarenessCenterCount}: {phase159Engagement.awareness_center_capabilities ?? 0}
              </p>
            </div>
          ) : null}
          {(phase159.success_criteria ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159SuccessCriteria}</h3>
              <ul className="mt-2 space-y-1">
                {phase159.success_criteria?.map((criterion) => (
                  <li
                    key={criterion.key ?? criterion.label}
                    className="flex flex-wrap items-center justify-between gap-2 rounded border border-violet-100 px-3 py-2 text-sm"
                  >
                    <span className="text-violet-900">{criterion.label}</span>
                    <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
                      {criterion.met ? labels.criterionMet : labels.criterionPending}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(phase159.success_metrics ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159SuccessMetrics}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-violet-900">
                {phase159.success_metrics?.map((metric) => (
                  <li key={metric.key ?? metric.label} className="rounded border border-violet-100 px-2 py-1">
                    {metric.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(phase159.vision_phrases ?? []).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700">{labels.phase159VisionPhrases}</h3>
              <ul className="mt-2 space-y-1 text-sm italic text-violet-900">
                {phase159.vision_phrases?.map((phrase) => (
                  <li key={phrase}>&ldquo;{phrase}&rdquo;</li>
                ))}
              </ul>
            </div>
          ) : null}
          {phase159.privacy_note ? (
            <p className="mt-4 text-xs text-violet-700">{phase159.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.twinHealth}</h2>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          {dashboard.twin_health_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <p className="text-sm text-gray-700">{labels.processCoverage}: {dashboard.process_coverage ?? 0}</p>
          <p className="text-sm text-gray-700">{labels.knowledgeOwners}: {dashboard.knowledge_owners ?? 0}</p>
          <p className="text-sm text-gray-700">{labels.lowConfidence}: {dashboard.low_confidence_count ?? 0}</p>
          <p className="text-sm text-gray-700">{labels.roles}: {dashboard.roles.length}</p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.rolesSection}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {dashboard.roles.map((role) => (
            <li key={role.role_key} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{role.role_name}</p>
              <p className="mt-1 text-xs text-gray-500">{role.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.processesSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.processes.map((proc) => (
            <li key={proc.process_key} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <Link
                href={`/app/digital-twin/processes/${proc.process_key}`}
                className="font-medium text-slate-800 hover:underline"
              >
                {proc.process_name}
              </Link>
              <p className="mt-1 text-xs capitalize text-gray-500">
                {proc.category}
                {proc.deadline_hours ? ` · ${proc.deadline_hours}h deadline` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.knowledgeRouting}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.knowledge_routing.map((owner) => (
            <li key={owner.topic_key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <span>{owner.topic}</span>
              <span className={`rounded px-2 py-0.5 text-xs capitalize ${confidenceClass(owner.confidence_level)}`}>
                {owner.confidence}% · {owner.confidence_level}
                {owner.requires_review ? ` · ${labels.reviewRecommended}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.insightsSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.insights.map((insight) => (
            <li key={insight.id} className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{insight.summary}</p>
              <p className="mt-1 text-xs capitalize text-gray-500">
                {insight.insight_type.replace(/_/g, " ")} · {insight.confidence}% confidence
              </p>
            </li>
          ))}
        </ul>
      </section>

      {dashboard.integrations ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrations}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {Object.entries(dashboard.integrations).map(([key, value]) => (
              <li key={key}>
                <span className="capitalize">{key.replace(/_/g, " ")}</span>: {value}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
