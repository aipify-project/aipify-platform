"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseStrategicAlignmentEngineDashboard,
  type BlueprintObjective,
  type StrategicAlignmentEngineDashboard,
  type StrategicObjective,
} from "@/lib/aipify/strategic-alignment-engine";

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

export function StrategicAlignmentEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<StrategicAlignmentEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/dashboard");
    if (res.ok) setDashboard(parseStrategicAlignmentEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activateObjective = async (objective: StrategicObjective) => {
    if (!objective.id) return;
    setActivating(objective.id);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/objectives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", objective_id: objective.id, status: "active" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.activateFailed);
    } else {
      await load();
    }
    setActivating(null);
  };

  const recordReview = async (objective: StrategicObjective) => {
    if (!objective.id) return;
    setReviewing(objective.id);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objective_id: objective.id,
        findings: "Alignment review recorded from strategic alignment dashboard",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.reviewFailed);
    } else {
      await load();
    }
    setReviewing(null);
  };

  const detectMisalignment = async () => {
    setDetecting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "detect_misalignment" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.detectFailed);
    } else {
      await load();
    }
    setDetecting(false);
  };

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/strategic-alignment-engine/export", {
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

  const summary = dashboard.summary ?? {};
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

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-indigo-700">
          {dashboard.blueprint_distinction_note ?? labels.distinctionNote}
        </p>
        {dashboard.implementation_blueprint_phase68?.phase ? (
          <p className="mt-1 text-xs text-indigo-600">
            {dashboard.implementation_blueprint_phase68.phase}
            {dashboard.implementation_blueprint_phase68.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase68.engine_phase}`
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
        {dashboard.organizational_alignment_note ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.organizational_alignment_note}</p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={detecting}
          onClick={() => void detectMisalignment()}
        >
          {detecting ? labels.detecting : labels.detectMisalignment}
        </button>
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportReport()}
        >
          {exporting ? labels.exporting : labels.exportReport}
        </button>
      </div>

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

      {dashboard.alignment_questions?.questions && dashboard.alignment_questions.questions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.alignmentQuestions}</h3>
          {dashboard.alignment_questions.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.alignment_questions.principle}</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.alignment_questions.questions.map((q) => (
              <div key={q.key ?? q.question} className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
                <span className="font-medium">
                  {q.emoji ? `${q.emoji} ` : ""}
                  {q.question}
                </span>
                {q.description ? <p className="mt-1 text-xs text-gray-600">{q.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.strategic_cascading?.levels && dashboard.strategic_cascading.levels.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.strategicCascading}</h3>
          {dashboard.strategic_cascading.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.strategic_cascading.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.strategic_cascading.levels.map((level) => (
              <ObjectiveCard key={level.key ?? level.label} objective={level} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.cross_functional_visibility?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.crossFunctionalVisibility}</h3>
          <p className="mt-2 text-gray-700">{dashboard.cross_functional_visibility.principle}</p>
          {dashboard.cross_functional_visibility.dimensions &&
          dashboard.cross_functional_visibility.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.cross_functional_visibility.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
          ) : null}
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

      {dashboard.goal_communication?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.goalCommunication}</h3>
          <p className="mt-2 text-gray-700">{dashboard.goal_communication.principle}</p>
          {dashboard.goal_communication.elements && dashboard.goal_communication.elements.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.goal_communication.elements.map((el) => (
                <ObjectiveCard key={el.key ?? el.label} objective={el} />
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
              {labels.linkedEntities}: {engagement.linked_entities ?? 0}
            </span>
            <span>
              {labels.reviewsRecorded}: {engagement.reviews_recorded ?? 0}
            </span>
            <span>
              {labels.latestMisaligned}: {engagement.latest_misaligned_count ?? 0}
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
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-indigo-900">
            {dashboard.vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

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

      {dashboard.objectives && dashboard.objectives.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.objectives}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.objectives.map((objective) => (
              <div key={objective.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{objective.objective_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{objective.priority}</span>
                    {objective.description && (
                      <p className="mt-1 text-xs text-gray-600">{objective.description}</p>
                    )}
                    {objective.target_date && (
                      <p className="mt-1 text-xs text-gray-500">
                        {labels.targetDate}: {objective.target_date}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{objective.status}</span>
                    {objective.status === "planned" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={activating === objective.id}
                        onClick={() => void activateObjective(objective)}
                      >
                        {activating === objective.id ? labels.activating : labels.activate}
                      </button>
                    )}
                    {(objective.status === "planned" || objective.status === "active") && (
                      <button
                        type="button"
                        className="rounded border border-green-300 px-2 py-0.5 text-xs text-green-700 disabled:opacity-50"
                        disabled={reviewing === objective.id}
                        onClick={() => void recordReview(objective)}
                      >
                        {reviewing === objective.id ? labels.reviewing : labels.recordReview}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.snapshots && dashboard.snapshots.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.snapshots}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.snapshots, null, 2)}
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
