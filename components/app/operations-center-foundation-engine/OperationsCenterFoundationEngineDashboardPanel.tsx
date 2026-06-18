"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOperationsCenterFoundationEngineDashboard,
  type BlueprintObjective,
  type BriefingElement,
  type CollaborationExample,
  type CompanionGuidanceExample,
  type CrossFunctionalObservation,
  type HealthIndicator,
  type HealthMonitoringTheme,
  type CompanionNetworkEntry,
  type CompanionLimitation,
  type ReviewCycle,
  type EraCrossLink,
  type ModuleOverviewBlock,
  type OperationsCenterFoundationEngineDashboard,
  type OperationsEvent,
} from "@/lib/aipify/operations-center-foundation-engine";

type Props = { labels: Record<string, string> };

function priorityClass(priority?: string) {
  switch (priority) {
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

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-sm">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function ModuleOverviewCard({
  block,
  labels,
}: {
  block?: ModuleOverviewBlock;
  labels: Record<string, string>;
}) {
  if (!block) return null;
  const entries = Object.entries(block).filter(
    ([key]) => !["key", "label", "route", "source_modules", "summary"].includes(key)
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900">{block.label}</h4>
        {block.route ? (
          <Link href={block.route} className="text-xs text-indigo-700 hover:underline">
            {labels.viewModule}
          </Link>
        ) : null}
      </div>
      {block.summary ? <p className="mt-1 text-xs text-gray-600">{block.summary}</p> : null}
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs text-gray-500">{key.replace(/_/g, " ")}</dt>
            <dd className="text-sm font-medium">{String(value ?? 0)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function EventList({
  events,
  labels,
  onAcknowledge,
  onResolve,
  actionId,
}: {
  events: OperationsEvent[];
  labels: Record<string, string>;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  actionId: string | null;
}) {
  if (events.length === 0) {
    return <p className="mt-2 text-sm text-gray-500">{labels.noEvents}</p>;
  }

  return (
    <ul className="mt-3 space-y-2 text-sm">
      {events.map((event) => (
        <li key={event.id} className="rounded border border-gray-100 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{event.title}</span>
            {event.priority ? (
              <span className={`rounded-full px-2 py-0.5 text-xs ${priorityClass(event.priority)}`}>
                {event.priority}
              </span>
            ) : null}
            {event.category ? <span className="text-xs text-gray-500">{event.category}</span> : null}
          </div>
          {event.description ? <p className="mt-1 text-xs text-gray-600">{event.description}</p> : null}
          {event.id && onAcknowledge && onResolve && event.status !== "completed" ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={actionId !== null}
                className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                onClick={() => onAcknowledge(event.id!)}
              >
                {actionId === `ack-${event.id}` ? labels.working : labels.acknowledge}
              </button>
              <button
                type="button"
                disabled={actionId !== null}
                className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                onClick={() => onResolve(event.id!)}
              >
                {actionId === `resolve-${event.id}` ? labels.working : labels.resolve}
              </button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function OperationsCenterFoundationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OperationsCenterFoundationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/operations-center-foundation-engine/dashboard");
    if (res.ok) setDashboard(parseOperationsCenterFoundationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const eventAction = async (action: "acknowledge" | "resolve", eventId: string) => {
    setActionId(`${action === "acknowledge" ? "ack" : "resolve"}-${eventId}`);
    const path =
      action === "acknowledge"
        ? `/api/aipify/operations-center-foundation-engine/events/${eventId}/acknowledge`
        : `/api/aipify/operations-center-foundation-engine/events/${eventId}/resolve`;
    await fetch(path, { method: "POST" });
    await load();
    setActionId(null);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const since = dashboard.since_last_time;
  const modules = dashboard.module_overviews ?? {};

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
        {dashboard.operations_center_foundation_engine_note ? (
          <p className="mt-1 text-xs text-indigo-700">{dashboard.operations_center_foundation_engine_note}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-1 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.implementation_blueprint_phase70?.phase ? (
          <p className="mt-1 text-xs text-indigo-600">
            {dashboard.implementation_blueprint_phase70.phase}
            {dashboard.implementation_blueprint_phase70.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase70.engine_phase}`
              : ""}
          </p>
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
        {dashboard.cross_functional_intelligence_note ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.cross_functional_intelligence_note}</p>
        ) : null}
        {dashboard.blueprint_distinction_note ? (
          <p className="mt-1 text-xs text-indigo-700">{dashboard.blueprint_distinction_note}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.safety_note}</p>
        ) : null}
        {dashboard.blueprint_privacy_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.blueprint_privacy_note}</p>
        ) : null}
      </section>

      {since ? (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-6">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.sinceLastTime}</h3>
          {since.trend_summary ? (
            <p className="mt-2 text-sm text-indigo-900">{since.trend_summary}</p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.supportResolved}</p>
              <p className="mt-1 text-xl font-semibold">{since.support_cases_resolved ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.kcUpdated}</p>
              <p className="mt-1 text-xl font-semibold">{since.kc_articles_updated ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.tasksCompleted}</p>
              <p className="mt-1 text-xl font-semibold">{since.high_priority_tasks_completed ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.bottlenecks}</p>
              <p className="mt-1 text-xl font-semibold">{since.bottlenecks_open ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.bellMoments}</p>
              <p className="mt-1 text-xl font-semibold">{since.bell_moments ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.recognitionMoments}</p>
              <p className="mt-1 text-xl font-semibold">{since.recognition_moments ?? 0}</p>
            </div>
          </div>
          {since.assumption_note ? (
            <p className="mt-3 text-xs text-gray-500">{since.assumption_note}</p>
          ) : null}
        </section>
      ) : null}

      <section>
        <h3 className="text-sm font-semibold text-gray-900">{labels.moduleOverviews}</h3>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <ModuleOverviewCard block={modules.support_overview} labels={labels} />
          <ModuleOverviewCard block={modules.task_overview} labels={labels} />
          <ModuleOverviewCard block={modules.knowledge_overview} labels={labels} />
          <ModuleOverviewCard block={modules.executive_overview} labels={labels} />
          <ModuleOverviewCard block={modules.recognition_overview} labels={labels} />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.urgentEvents}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.urgent ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.openEvents}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.open_events ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_approvals ?? 0)}</p>
        </div>
      </div>

      {(dashboard.urgent_actions ?? []).length > 0 ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/30 p-6">
          <h3 className="text-sm font-semibold text-rose-900">{labels.urgentActions}</h3>
          <EventList
            events={dashboard.urgent_actions ?? []}
            labels={labels}
            onAcknowledge={(id) => void eventAction("acknowledge", id)}
            onResolve={(id) => void eventAction("resolve", id)}
            actionId={actionId}
          />
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.openOperationalEvents}</h3>
        <EventList
          events={dashboard.events ?? []}
          labels={labels}
          onAcknowledge={(id) => void eventAction("acknowledge", id)}
          onResolve={(id) => void eventAction("resolve", id)}
          actionId={actionId}
        />
      </section>

      {(dashboard.companion_communication_examples ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionExamples}</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {dashboard.companion_communication_examples?.map((ex) => (
              <li key={ex.key ?? ex.example}>
                {ex.example}
                {ex.scenario ? <span className="mt-1 block text-xs text-gray-500">{ex.scenario}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => (
              <li key={pr}>{pr}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.success_criteria ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.success_criteria?.map((c) => (
              <li key={c.key ?? c.label} className="flex flex-wrap items-start gap-2">
                <span className={c.met ? "text-emerald-700" : "text-amber-700"}>
                  {c.met ? "✓" : "○"}
                </span>
                <span className="flex-1">
                  {c.label}
                  {c.note ? <span className="mt-0.5 block text-xs text-gray-500">{c.note}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-xl border border-violet-100 bg-violet-50/30 p-6">
          <h3 className="text-sm font-semibold text-violet-900">{labels.selfLoveConnection}</h3>
          <p className="mt-2 text-sm text-violet-900">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.self_love_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.trust_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.blueprint_objectives && dashboard.blueprint_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.blueprint_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.organizational_connections?.example_chain &&
      dashboard.organizational_connections.example_chain.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.organizationalConnections}</h3>
          {dashboard.organizational_connections.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.organizational_connections.principle}</p>
          ) : null}
          {dashboard.organizational_connections.chain_summary ? (
            <p className="mt-2 text-sm font-medium text-indigo-900">
              {dashboard.organizational_connections.chain_summary}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.organizational_connections.example_chain.map((conn) => (
              <div key={conn.key ?? conn.label} className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
                {conn.route ? (
                  <Link href={conn.route} className="font-medium text-indigo-800 hover:underline">
                    {conn.label}
                  </Link>
                ) : (
                  <span className="font-medium">{conn.label}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.cross_functional_observations?.observations &&
      dashboard.cross_functional_observations.observations.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.crossFunctionalObservations}</h3>
          {dashboard.cross_functional_observations.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.cross_functional_observations.principle}</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.cross_functional_observations.observations.map((obs: CrossFunctionalObservation) => (
              <div key={obs.key ?? obs.observation} className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
                <span className="font-medium">
                  {obs.emoji ? `${obs.emoji} ` : ""}
                  {obs.observation}
                </span>
                {obs.description ? <p className="mt-1 text-xs text-gray-600">{obs.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.information_flow_visibility?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.informationFlowVisibility}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.information_flow_visibility.principle}</p>
          {dashboard.information_flow_visibility.dimensions &&
          dashboard.information_flow_visibility.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.information_flow_visibility.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.bottleneck_identification?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.bottleneckIdentification}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.bottleneck_identification.principle}</p>
          {dashboard.bottleneck_identification.patterns &&
          dashboard.bottleneck_identification.patterns.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.bottleneck_identification.patterns.map((pattern) => (
                <ObjectiveCard key={pattern.key ?? pattern.label} objective={pattern} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.collaboration_opportunities?.examples &&
      dashboard.collaboration_opportunities.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.collaborationOpportunities}</h3>
          {dashboard.collaboration_opportunities.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.collaboration_opportunities.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.collaboration_opportunities.examples.map((example: CollaborationExample, i) => (
              <li key={example.key ?? i} className="rounded border border-gray-100 p-2">
                <p className="font-medium">
                  {example.emoji ? `${example.emoji} ` : ""}
                  {example.prompt}
                </p>
                {example.consideration ? (
                  <p className="mt-1 text-xs text-gray-600">{example.consideration}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.blueprint_leadership_insights?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipInsights}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.blueprint_leadership_insights.principle}</p>
          {dashboard.blueprint_leadership_insights.insight_types &&
          dashboard.blueprint_leadership_insights.insight_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.blueprint_leadership_insights.insight_types.map((insight) => (
                <ObjectiveCard key={insight.key ?? insight.label} objective={insight} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.privacy_principles?.principle ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/30 p-6">
          <h3 className="text-sm font-semibold text-amber-900">{labels.privacyPrinciples}</h3>
          <p className="mt-2 text-sm text-amber-900">{dashboard.privacy_principles.principle}</p>
          {dashboard.privacy_principles.rules && dashboard.privacy_principles.rules.length > 0 ? (
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-900">
              {dashboard.privacy_principles.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.engagement_summary ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.moduleOverviewBlocks}</p>
              <p className="mt-1 text-xl font-semibold">{dashboard.engagement_summary.module_overview_blocks ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.openOperationsEvents}</p>
              <p className="mt-1 text-xl font-semibold">{dashboard.engagement_summary.open_operations_events ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.urgentOperationsEvents}</p>
              <p className="mt-1 text-xl font-semibold">{dashboard.engagement_summary.urgent_operations_events ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.tasksOverdue}</p>
              <p className="mt-1 text-xl font-semibold">{dashboard.engagement_summary.tasks_overdue ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.knowledgeOpenGaps}</p>
              <p className="mt-1 text-xl font-semibold">{dashboard.engagement_summary.knowledge_open_gaps ?? 0}</p>
            </div>
          </div>
          {dashboard.engagement_summary.privacy_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.engagement_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {(dashboard.blueprint_success_criteria ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.blueprint_success_criteria?.map((c) => (
              <li key={c.key ?? c.label} className="flex flex-wrap items-start gap-2">
                <span className={c.met ? "text-emerald-700" : "text-amber-700"}>
                  {c.met ? "✓" : "○"}
                </span>
                <span className="flex-1">
                  {c.label}
                  {c.note ? <span className="mt-0.5 block text-xs text-gray-500">{c.note}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.blueprint_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.blueprint_vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.blueprint_self_love_connection?.principle ? (
        <section className="rounded-xl border border-violet-100 bg-violet-50/30 p-6">
          <h3 className="text-sm font-semibold text-violet-900">{labels.blueprintSelfLoveConnection}</h3>
          <p className="mt-2 text-sm text-violet-900">{dashboard.blueprint_self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.blueprint_trust_connection?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintTrustConnection}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.blueprint_trust_connection.principle}</p>
        </section>
      ) : null}

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

      <section className="rounded-xl border border-violet-200 bg-violet-50/40 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.phase75Title}</h2>
        {dashboard.implementation_blueprint_phase75?.phase ? (
          <p className="mt-1 text-xs text-violet-700">
            {dashboard.implementation_blueprint_phase75.phase}
            {dashboard.implementation_blueprint_phase75.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase75.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.executive_operations_center_note ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.executive_operations_center_note}</p>
        ) : null}
        {dashboard.eocbp_mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.eocbp_mission}</p>
        ) : null}
        {dashboard.eocbp_philosophy ? (
          <p className="mt-2 text-sm text-violet-900">{dashboard.eocbp_philosophy}</p>
        ) : null}
        {dashboard.eocbp_abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.eocbp_abos_principle}</p>
        ) : null}
        {dashboard.eocbp_distinction_note ? (
          <p className="mt-1 text-xs text-violet-700">{dashboard.eocbp_distinction_note}</p>
        ) : null}
        {dashboard.eocbp_privacy_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.eocbp_privacy_note}</p>
        ) : null}
      </section>

      {dashboard.eocbp_objectives && dashboard.eocbp_objectives.length > 0 ? (
        <section className="rounded-xl border border-violet-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eocbpObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.eocbp_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.eocbp_executive_dashboard?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveDashboard}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eocbp_executive_dashboard.principle}</p>
          {dashboard.eocbp_executive_dashboard.clarity_objective ? (
            <p className="mt-2 text-sm font-medium text-violet-900">
              {dashboard.eocbp_executive_dashboard.clarity_objective}
            </p>
          ) : null}
          {dashboard.eocbp_executive_dashboard.dimensions &&
          dashboard.eocbp_executive_dashboard.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.eocbp_executive_dashboard.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eocbp_daily_executive_briefings?.briefing_elements &&
      dashboard.eocbp_daily_executive_briefings.briefing_elements.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dailyExecutiveBriefings}</h3>
          {dashboard.eocbp_daily_executive_briefings.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.eocbp_daily_executive_briefings.principle}</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.eocbp_daily_executive_briefings.briefing_elements.map((item: BriefingElement) => (
              <div key={item.key ?? item.element} className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                <span className="font-medium">
                  {item.emoji ? `${item.emoji} ` : ""}
                  {item.element}
                </span>
                {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.eocbp_executive_priority_center?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executivePriorityCenter}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eocbp_executive_priority_center.principle}</p>
          {dashboard.eocbp_executive_priority_center.focus_areas &&
          dashboard.eocbp_executive_priority_center.focus_areas.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.eocbp_executive_priority_center.focus_areas.map((area) => (
                <ObjectiveCard key={area.key ?? area.label} objective={area} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eocbp_organizational_health_overview?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.organizationalHealthOverview}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eocbp_organizational_health_overview.principle}</p>
          {dashboard.eocbp_organizational_health_overview.indicators &&
          dashboard.eocbp_organizational_health_overview.indicators.length > 0 ? (
            <div className="mt-3 space-y-2">
              {dashboard.eocbp_organizational_health_overview.indicators.map((item: HealthIndicator) => (
                <div key={item.key ?? item.indicator} className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
                  <span className="font-medium">
                    {item.emoji ? `${item.emoji} ` : ""}
                    {item.indicator}
                  </span>
                  {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eocbp_meeting_decision_continuity?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.meetingDecisionContinuity}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eocbp_meeting_decision_continuity.principle}</p>
          {dashboard.eocbp_meeting_decision_continuity.continuity_elements &&
          dashboard.eocbp_meeting_decision_continuity.continuity_elements.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.eocbp_meeting_decision_continuity.continuity_elements.map((el) => (
                <ObjectiveCard key={el.key ?? el.label} objective={el} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eocbp_strategic_momentum_tracking?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.strategicMomentumTracking}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eocbp_strategic_momentum_tracking.principle}</p>
          {dashboard.eocbp_strategic_momentum_tracking.tracking_elements &&
          dashboard.eocbp_strategic_momentum_tracking.tracking_elements.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.eocbp_strategic_momentum_tracking.tracking_elements.map((el) => (
                <ObjectiveCard key={el.key ?? el.label} objective={el} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eocbp_companion_guidance?.examples && dashboard.eocbp_companion_guidance.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eocbpCompanionGuidance}</h3>
          {dashboard.eocbp_companion_guidance.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.eocbp_companion_guidance.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.eocbp_companion_guidance.examples.map((example: CompanionGuidanceExample, i) => (
              <li key={example.key ?? i} className="rounded border border-gray-100 p-2">
                <p className="font-medium">
                  {example.emoji ? `${example.emoji} ` : ""}
                  {example.prompt}
                </p>
                {example.consideration ? (
                  <p className="mt-1 text-xs text-gray-600">{example.consideration}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.eocbp_engagement_summary ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eocbpEngagementSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.pendingLeadershipApprovals}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.eocbp_engagement_summary.pending_leadership_approvals ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.executiveOverviewSignals}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.eocbp_engagement_summary.executive_overview_signals ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.recognitionSignals}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.eocbp_engagement_summary.recognition_signals ?? 0}
              </p>
            </div>
          </div>
          {dashboard.eocbp_engagement_summary.privacy_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.eocbp_engagement_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {(dashboard.eocbp_success_criteria ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eocbpSuccessCriteria}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.eocbp_success_criteria?.map((c) => (
              <li key={c.key ?? c.label} className="flex flex-wrap items-start gap-2">
                <span className={c.met ? "text-emerald-700" : "text-amber-700"}>
                  {c.met ? "✓" : "○"}
                </span>
                <span className="flex-1">
                  {c.label}
                  {c.note ? <span className="mt-0.5 block text-xs text-gray-500">{c.note}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.eocbp_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eocbpVisionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.eocbp_vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.eocbp_self_love_connection?.principle ? (
        <section className="rounded-xl border border-violet-100 bg-violet-50/30 p-6">
          <h3 className="text-sm font-semibold text-violet-900">{labels.eocbpSelfLoveConnection}</h3>
          <p className="mt-2 text-sm text-violet-900">{dashboard.eocbp_self_love_connection.principle}</p>
          {dashboard.eocbp_self_love_connection.journey_phrase ? (
            <p className="mt-2 text-xs italic text-violet-800">{dashboard.eocbp_self_love_connection.journey_phrase}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.eocbp_trust_connection?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eocbpTrustConnection}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eocbp_trust_connection.principle}</p>
        </section>
      ) : null}

      {(dashboard.eocbp_integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.eocbp_integration_links?.map((link) =>
            link.route ? (
              <Link key={`eocbp-${link.route}`} href={link.route} className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-amber-300 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold text-amber-950">{labels.phase130Title}</h2>
        {dashboard.enterprise_intelligence_era_capstone_note ? (
          <p className="mt-2 text-xs text-amber-900">{dashboard.enterprise_intelligence_era_capstone_note}</p>
        ) : null}
        {dashboard.implementation_blueprint_phase130?.phase ? (
          <p className="mt-1 text-xs text-amber-800">
            {dashboard.implementation_blueprint_phase130.phase}
            {dashboard.implementation_blueprint_phase130.era
              ? ` · ${dashboard.implementation_blueprint_phase130.era}`
              : ""}
          </p>
        ) : null}
        {dashboard.enterprise_command_engine_note ? (
          <p className="mt-2 text-xs text-amber-900">{dashboard.enterprise_command_engine_note}</p>
        ) : null}
        {dashboard.eoccep130_mission ? (
          <p className="mt-2 text-sm font-medium text-amber-950">{dashboard.eoccep130_mission}</p>
        ) : null}
        {dashboard.eoccep130_philosophy ? (
          <p className="mt-2 text-sm text-amber-950">{dashboard.eoccep130_philosophy}</p>
        ) : null}
        {dashboard.eoccep130_abos_principle ? (
          <p className="mt-2 text-xs text-amber-900">{dashboard.eoccep130_abos_principle}</p>
        ) : null}
        {dashboard.eoccep130_vision ? (
          <p className="mt-2 text-sm text-amber-950">{dashboard.eoccep130_vision}</p>
        ) : null}
        {dashboard.eoccep130_distinction_note ? (
          <p className="mt-1 text-xs text-amber-800">{dashboard.eoccep130_distinction_note}</p>
        ) : null}
        {dashboard.eoccep130_privacy_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.eoccep130_privacy_note}</p>
        ) : null}
      </section>

      {dashboard.eoccep130_objectives && dashboard.eoccep130_objectives.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eoccep130Objectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.eoccep130_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.eoccep130_enterprise_command_dashboard?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.enterpriseCommandDashboard}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eoccep130_enterprise_command_dashboard.principle}</p>
          {dashboard.eoccep130_enterprise_command_dashboard.dimensions &&
          dashboard.eoccep130_enterprise_command_dashboard.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.eoccep130_enterprise_command_dashboard.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eoccep130_initiative_orchestration?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.initiativeOrchestration}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eoccep130_initiative_orchestration.principle}</p>
          {dashboard.eoccep130_initiative_orchestration.elements &&
          dashboard.eoccep130_initiative_orchestration.elements.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.eoccep130_initiative_orchestration.elements.map((el) => (
                <ObjectiveCard key={el.key ?? el.label} objective={el} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eoccep130_executive_alignment?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveAlignment}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eoccep130_executive_alignment.principle}</p>
          {dashboard.eoccep130_executive_alignment.alignment_elements &&
          dashboard.eoccep130_executive_alignment.alignment_elements.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.eoccep130_executive_alignment.alignment_elements.map((el) => (
                <ObjectiveCard key={el.key ?? el.label} objective={el} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eoccep130_decision_execution?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.decisionExecution}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eoccep130_decision_execution.principle}</p>
          {dashboard.eoccep130_decision_execution.execution_elements &&
          dashboard.eoccep130_decision_execution.execution_elements.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.eoccep130_decision_execution.execution_elements.map((el) => (
                <ObjectiveCard key={el.key ?? el.label} objective={el} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.eoccep130_executive_companion_network?.companions &&
      dashboard.eoccep130_executive_companion_network.companions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveCompanionNetwork}</h3>
          {dashboard.eoccep130_executive_companion_network.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.eoccep130_executive_companion_network.principle}</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.eoccep130_executive_companion_network.companions.map((companion: CompanionNetworkEntry) =>
              companion.route ? (
                <Link
                  key={companion.key ?? companion.route}
                  href={companion.route}
                  className="block rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2 text-sm hover:border-amber-200"
                >
                  <span className="font-medium">
                    {companion.label}
                    {companion.phase ? ` (Phase ${companion.phase})` : ""}
                  </span>
                  {companion.description ? (
                    <p className="mt-1 text-xs text-gray-600">{companion.description}</p>
                  ) : null}
                </Link>
              ) : null
            )}
          </div>
          {dashboard.eoccep130_executive_companion_network.can_companions_decide ? (
            <p className="mt-3 text-xs text-gray-600">
              {dashboard.eoccep130_executive_companion_network.can_companions_decide}
            </p>
          ) : null}
        </section>
      ) : null}

      {dashboard.eoccep130_organizational_health_monitoring?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.organizationalHealthMonitoring}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eoccep130_organizational_health_monitoring.principle}</p>
          {dashboard.eoccep130_organizational_health_monitoring.themes &&
          dashboard.eoccep130_organizational_health_monitoring.themes.length > 0 ? (
            <div className="mt-3 space-y-2">
              {dashboard.eoccep130_organizational_health_monitoring.themes.map((item: HealthMonitoringTheme) => (
                <div key={item.key ?? item.theme} className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
                  <span className="font-medium">
                    {item.emoji ? `${item.emoji} ` : ""}
                    {item.theme}
                  </span>
                  {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {(dashboard.eoccep130_executive_review_cycles ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveReviewCycles}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.eoccep130_executive_review_cycles?.map((cycle: ReviewCycle) => (
              <div key={cycle.key ?? cycle.label} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">
                  {cycle.emoji ? `${cycle.emoji} ` : ""}
                  {cycle.label}
                </span>
                {cycle.description ? <p className="mt-1 text-xs text-gray-600">{cycle.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.eoccep130_enterprise_memory_integration?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.enterpriseMemoryIntegration}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.eoccep130_enterprise_memory_integration.principle}</p>
          {(dashboard.eoccep130_enterprise_memory_integration.cross_links ?? []).length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {dashboard.eoccep130_enterprise_memory_integration.cross_links?.map((link) =>
                link.route ? (
                  <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {(dashboard.eoccep130_companion_limitations ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionLimitations}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.eoccep130_companion_limitations?.map((item: CompanionLimitation) => (
              <li key={item.key ?? item.limitation} className="rounded border border-gray-100 p-2">
                <p className="font-medium">{item.limitation}</p>
                {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.eoccep130_enterprise_knowledge_library ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.enterpriseKnowledgeLibrary}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.eoccep130_enterprise_knowledge_library?.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.eoccep130_engagement_summary ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eoccep130EngagementSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.enterpriseDashboardDimensions}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.eoccep130_engagement_summary.executive_dashboard_dimensions ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.companionNetworkCount}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.eoccep130_engagement_summary.companion_network_count ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.eraCrossLinkCount}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.eoccep130_engagement_summary.era_cross_link_count ?? 0}
              </p>
            </div>
          </div>
          {dashboard.eoccep130_engagement_summary.privacy_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.eoccep130_engagement_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {(dashboard.eoccep130_success_criteria ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eoccep130SuccessCriteria}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.eoccep130_success_criteria?.map((c) => (
              <li key={c.key ?? c.label} className="flex flex-wrap items-start gap-2">
                <span className={c.met ? "text-emerald-700" : "text-amber-700"}>
                  {c.met ? "✓" : "○"}
                </span>
                <span className="flex-1">
                  {c.label}
                  {c.note ? <span className="mt-0.5 block text-xs text-gray-500">{c.note}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.eoccep130_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.eoccep130VisionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.eoccep130_vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.eoccep130_self_love_connection?.principle ? (
        <section className="rounded-xl border border-violet-100 bg-violet-50/30 p-6">
          <h3 className="text-sm font-semibold text-violet-900">{labels.eoccep130SelfLoveConnection}</h3>
          <p className="mt-2 text-sm text-violet-900">{dashboard.eoccep130_self_love_connection.principle}</p>
          {dashboard.eoccep130_self_love_connection.why_self_love ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.eoccep130_self_love_connection.why_self_love}</p>
          ) : null}
        </section>
      ) : null}

      {(dashboard.eoccep130_era_cross_links ?? []).length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-6">
          <h3 className="text-sm font-semibold text-amber-950">{labels.eraCapstoneBanner}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.eoccep130_era_cross_links?.map((link: EraCrossLink) =>
              link.route ? (
                <Link
                  key={`era-${link.phase}-${link.route}`}
                  href={link.route}
                  className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm"
                >
                  {link.phase ? `${link.phase}: ` : ""}
                  {link.label}
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      {(dashboard.eoccep130_integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.eoccep130_integration_links?.map((link) =>
            link.route ? (
              <Link key={`eoccep130-${link.route}-${link.label}`} href={link.route} className="rounded-lg border border-amber-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}
    </div>
  );
}
