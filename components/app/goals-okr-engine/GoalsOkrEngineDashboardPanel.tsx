"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGoalsOkrEngineDashboard,
  type BlueprintObjective,
  type GoalsOkrEngineDashboard,
  type OkrIntervention,
  type OrganizationKeyResult,
  type OrganizationObjective,
} from "@/lib/aipify/goals-okr-engine";

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

export function GoalsOkrEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GoalsOkrEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/goals-okr-engine/dashboard");
    if (res.ok) setDashboard(parseGoalsOkrEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const objectiveAction = async (payload: Record<string, unknown>) => {
    setActionError(null);
    const res = await fetch("/api/aipify/goals-okr-engine/objectives", {
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

  const activateObjective = async (objective: OrganizationObjective) => {
    if (!objective.id) return;
    setBusyId(objective.id);
    await objectiveAction({ action: "activate", objective_id: objective.id });
    setBusyId(null);
  };

  const approveCompletion = async (objective: OrganizationObjective) => {
    if (!objective.id) return;
    setBusyId(objective.id);
    await objectiveAction({ action: "approve_completion", objective_id: objective.id });
    setBusyId(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/goals-okr-engine/export", {
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
  const interventions = dashboard.interventions ?? [];
  const activeObjectives = sections.active_objectives ?? [];
  const atRiskKeyResults = sections.at_risk_key_results ?? [];
  const keyResults = dashboard.key_results ?? [];
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

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-emerald-700">
          {dashboard.blueprint_distinction_note ?? labels.distinctionNote}
        </p>
        {dashboard.implementation_blueprint_phase69?.phase ? (
          <p className="mt-1 text-xs text-emerald-600">
            {dashboard.implementation_blueprint_phase69.phase}
            {dashboard.implementation_blueprint_phase69.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase69.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.blueprint_mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.blueprint_mission}</p>
        ) : null}
        {dashboard.blueprint_philosophy ? (
          <p className="mt-2 text-sm text-emerald-900">{dashboard.blueprint_philosophy}</p>
        ) : null}
        {dashboard.blueprint_abos_principle ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.blueprint_abos_principle}</p>
        ) : null}
        {dashboard.strategic_execution_note ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.strategic_execution_note}</p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-emerald-300 px-3 py-1 text-xs text-emerald-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.activeObjectives}</dt><dd>{String(summary.active_objectives ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.atRiskObjectives}</dt><dd>{String(summary.at_risk_objectives ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.atRiskKeyResults}</dt><dd>{String(summary.at_risk_key_results ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.completedObjectives}</dt><dd>{String(summary.completed_objectives ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.avgProgress}</dt><dd>{String(summary.avg_progress_pct ?? 0)}%</dd></div>
          <div><dt className="text-gray-500">{labels.strategicObjectives}</dt><dd>{String(summary.strategic_objectives ?? 0)}</dd></div>
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

      {dashboard.strategic_initiatives?.initiative_types &&
      dashboard.strategic_initiatives.initiative_types.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.strategicInitiatives}</h3>
          {dashboard.strategic_initiatives.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.strategic_initiatives.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.strategic_initiatives.initiative_types.map((initiative) => (
              <ObjectiveCard key={initiative.key ?? initiative.label} objective={initiative} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.execution_cascade?.levels && dashboard.execution_cascade.levels.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.executionCascade}</h3>
          {dashboard.execution_cascade.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.execution_cascade.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.execution_cascade.levels.map((level) => (
              <ObjectiveCard key={level.key ?? level.label} objective={level} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_guidance?.examples && dashboard.companion_guidance.examples.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.companionGuidance}</h3>
          {dashboard.companion_guidance.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.companion_guidance.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.companion_guidance.examples.map((example, i) => (
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

      {dashboard.progress_visibility?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.progressVisibility}</h3>
          <p className="mt-2 text-gray-700">{dashboard.progress_visibility.principle}</p>
          {dashboard.progress_visibility.dimensions &&
          dashboard.progress_visibility.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.progress_visibility.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.adaptive_execution?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.adaptiveExecution}</h3>
          <p className="mt-2 text-gray-700">{dashboard.adaptive_execution.principle}</p>
          {dashboard.adaptive_execution.signals && dashboard.adaptive_execution.signals.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.adaptive_execution.signals.map((signal) => (
                <li key={signal.key ?? signal.signal} className="rounded border border-gray-100 p-2">
                  <p className="font-medium">
                    {signal.emoji ? `${signal.emoji} ` : ""}
                    {signal.signal}
                  </p>
                  {signal.description ? <p className="mt-1 text-xs text-gray-600">{signal.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.cross_functional_coordination?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.crossFunctionalCoordination}</h3>
          <p className="mt-2 text-gray-700">{dashboard.cross_functional_coordination.principle}</p>
          {dashboard.cross_functional_coordination.dimensions &&
          dashboard.cross_functional_coordination.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.cross_functional_coordination.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
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
          {dashboard.self_love_connection.practices &&
          dashboard.self_love_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.leadership_insights?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.leadershipInsights}</h3>
          <p className="mt-2 text-gray-700">{dashboard.leadership_insights.principle}</p>
          {dashboard.leadership_insights.insight_types &&
          dashboard.leadership_insights.insight_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {dashboard.leadership_insights.insight_types.map((insight) => (
                <ObjectiveCard key={insight.key ?? insight.label} objective={insight} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.users_should_see &&
          dashboard.trust_connection.users_should_see.length > 0 ? (
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
            <span>
              {labels.activeObjectives}: {engagement.active_objectives ?? 0}
            </span>
            <span>
              {labels.totalKeyResults}: {engagement.total_key_results ?? 0}
            </span>
            <span>
              {labels.atRiskKeyResults}: {engagement.at_risk_key_results ?? 0}
            </span>
            <span>
              {labels.completedObjectives}: {engagement.completed_objectives ?? 0}
            </span>
            <span>
              {labels.avgProgress}: {engagement.avg_progress_pct ?? 0}%
            </span>
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
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-emerald-900">
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

      {interventions.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.interventions}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {(interventions as OkrIntervention[]).map((rec, i) => (
              <li key={`${rec.type ?? "int"}-${i}`} className="rounded border border-gray-100 p-2">
                <span className="text-xs uppercase text-gray-500">{rec.type} · {rec.confidence}</span>
                <p className="mt-1">{rec.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeObjectives.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.activeObjectivesSection}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {activeObjectives.map((o) => (
              <li key={o.id} className="rounded border border-emerald-100 bg-emerald-50/30 p-3">
                <div className="font-medium">{o.objective_name}</div>
                <div className="mt-1 text-xs text-gray-500">{o.hierarchy_level} · {o.priority} · {o.status}</div>
                {o.id && o.status === "draft" && (
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === o.id}
                    onClick={() => void activateObjective(o)}
                  >
                    {labels.activateObjective}
                  </button>
                )}
                {o.id && ["active", "on_track", "at_risk"].includes(String(o.status)) && (
                  <button
                    type="button"
                    className="mt-2 ml-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === o.id}
                    onClick={() => void approveCompletion(o)}
                  >
                    {labels.approveCompletion}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {atRiskKeyResults.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.atRiskKeyResultsSection}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(atRiskKeyResults as OrganizationKeyResult[]).map((kr) => (
              <li key={kr.id} className="rounded border border-amber-100 bg-amber-50/30 p-3">
                <div className="font-medium">{kr.key_result_name}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {labels.progress}: {String(kr.progress_percentage ?? 0)}%
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {keyResults.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.keyResults}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {keyResults.slice(0, 20).map((kr) => (
              <li key={kr.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{kr.key_result_name}</span>
                <span className="ml-2 text-xs text-gray-500">{String(kr.progress_percentage ?? 0)}% · {kr.status}</span>
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
