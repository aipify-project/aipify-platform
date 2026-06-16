"use client";

import { useState } from "react";
import type { BlockerCategory, ExecutionCoordinationLabels, ExecutionDetail } from "@/lib/action-center-execution";

type Props = {
  detail: ExecutionDetail;
  labels: ExecutionCoordinationLabels;
  acting: boolean;
  onBack: () => void;
  onEvent: (eventType: string, description: string, metadata?: Record<string, unknown>) => Promise<void>;
  onOpenImpact?: () => void;
  onOpenApproval?: () => void;
  onOpenPortfolio?: () => void;
};

const STEP_DOT: Record<string, string> = {
  pending: "bg-gray-200 text-gray-500",
  current: "bg-indigo-600 text-white ring-4 ring-indigo-100",
  complete: "bg-emerald-500 text-white",
  blocked: "bg-rose-400 text-white",
};

export function ActionExecutionDetailView({
  detail,
  labels,
  acting,
  onBack,
  onEvent,
  onOpenImpact,
  onOpenApproval,
  onOpenPortfolio,
}: Props) {
  const [updateText, setUpdateText] = useState("");
  const [blockerCategory, setBlockerCategory] = useState<BlockerCategory>("missing_information");
  const [blockerDesc, setBlockerDesc] = useState("");
  const [blockerOwner, setBlockerOwner] = useState("");
  const [blockerPlan, setBlockerPlan] = useState("");
  const [learningSubmitted, setLearningSubmitted] = useState(false);
  const [learning, setLearning] = useState({
    expected: "",
    actual: "",
    timeline: "",
    blockers: "",
    lessons: "",
    improvements: "",
  });

  const action = detail.action;
  if (!action) return null;

  const isCompleted = detail.lifecycle?.current_stage === "completed";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="text-sm font-medium text-indigo-600 hover:underline">
          ← {labels.actions.back}
        </button>
        <div className="flex gap-3 text-sm">
          {onOpenImpact ? (
            <button type="button" onClick={onOpenImpact} className="text-gray-600 hover:underline">
              Impact analysis
            </button>
          ) : null}
          {onOpenApproval ? (
            <button type="button" onClick={onOpenApproval} className="text-gray-600 hover:underline">
              Approvals
            </button>
          ) : null}
          {onOpenPortfolio ? (
            <button type="button" onClick={onOpenPortfolio} className="text-gray-600 hover:underline">
              Portfolio
            </button>
          ) : null}
        </div>
      </div>

      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
        {labels.humanOversight}
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">{action.title}</h2>
        <p className="mt-2 text-sm text-gray-600">{action.description}</p>
        {detail.priority ? (
          <p className="mt-2 text-sm font-medium text-indigo-800">
            {labels.priority.level}: {labels.priority.levels[detail.priority.level]}
          </p>
        ) : null}
      </section>

      {detail.lifecycle ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
          <h3 className="font-semibold text-indigo-950">{labels.sections.lifecycle}</h3>
          <ol className="mt-4 flex flex-wrap gap-2">
            {detail.lifecycle.stages.map((stage, i) => (
              <li key={stage.key} className="flex flex-col items-center text-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${STEP_DOT[stage.status] ?? STEP_DOT.pending}`}
                >
                  {i + 1}
                </div>
                <p className="mt-1 max-w-[72px] text-[10px] font-medium text-gray-800">
                  {labels.lifecycle.stages[stage.key]}
                </p>
                <p className="text-[9px] uppercase text-gray-500">{labels.lifecycle.stepStatus[stage.status]}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {detail.ownership ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.ownership}</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="font-medium text-gray-500">{labels.ownership.primary}</dt>
              <dd className="mt-1 rounded-full bg-indigo-100 px-3 py-1 inline-block text-indigo-900">
                {detail.ownership.primary_owner}
              </dd>
            </div>
            {detail.ownership.secondary_owner ? (
              <div>
                <dt className="font-medium text-gray-500">{labels.ownership.secondary}</dt>
                <dd className="mt-1 text-gray-900">{detail.ownership.secondary_owner}</dd>
              </div>
            ) : null}
            {detail.ownership.executive_sponsor ? (
              <div>
                <dt className="font-medium text-gray-500">{labels.ownership.executiveSponsor}</dt>
                <dd className="mt-1 text-gray-900">{detail.ownership.executive_sponsor}</dd>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <dt className="font-medium text-gray-500">{labels.ownership.contributors}</dt>
              <dd className="mt-1 text-gray-900">{detail.ownership.contributors.join(", ")}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {(detail.dependencies?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h3 className="font-semibold text-violet-950">{labels.sections.dependencies}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.dependencies!.map((dep, i) => (
              <li key={dep.id ?? i} className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                <span className="text-violet-950">
                  {labels.dependencies.types[dep.type] ?? dep.type}: {dep.label}
                </span>
                <span className="text-xs font-medium text-violet-800">
                  {labels.dependencies.statuses[dep.status] ?? dep.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.blockers?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
          <h3 className="font-semibold text-rose-950">{labels.sections.blockers}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.blockers!.filter((b) => !b.resolved).map((b) => (
              <li key={b.id} className="rounded-lg bg-white/70 px-3 py-2">
                <p className="font-medium text-rose-950">{labels.blockers.categories[b.category] ?? b.category}</p>
                <p className="text-rose-900">{b.description}</p>
                <p className="mt-1 text-xs text-rose-800">
                  {b.severity} · {b.owner}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-900">{labels.blockers.register}</h3>
        <div className="mt-3 space-y-2">
          <select
            value={blockerCategory}
            onChange={(e) => setBlockerCategory(e.target.value as BlockerCategory)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          >
            {Object.entries(labels.blockers.categories).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <input
            value={blockerDesc}
            onChange={(e) => setBlockerDesc(e.target.value)}
            placeholder={labels.blockers.description}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            value={blockerOwner}
            onChange={(e) => setBlockerOwner(e.target.value)}
            placeholder={labels.blockers.owner}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <textarea
            value={blockerPlan}
            onChange={(e) => setBlockerPlan(e.target.value)}
            placeholder={labels.blockers.resolutionPlan}
            rows={2}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={acting || !blockerDesc.trim()}
            onClick={() =>
              void onEvent("execution_blocker", blockerDesc, {
                category: blockerCategory,
                owner: blockerOwner,
                resolution_plan: blockerPlan,
                severity: "medium",
              }).then(() => {
                setBlockerDesc("");
                setBlockerPlan("");
              })
            }
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {labels.blockers.submit}
          </button>
        </div>
      </section>

      {detail.timeline ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.timeline}</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-gray-500">{labels.timeline.plannedStart}</dt>
              <dd>{detail.timeline.planned_start ? new Date(detail.timeline.planned_start).toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{labels.timeline.estimatedCompletion}</dt>
              <dd>
                {detail.timeline.estimated_completion
                  ? new Date(detail.timeline.estimated_completion).toLocaleString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">{labels.timeline.deviation}</dt>
              <dd>{detail.timeline.schedule_deviation_hours}h</dd>
            </div>
          </dl>
          {detail.timeline.milestones.length > 0 ? (
            <ul className="mt-4 space-y-1 text-sm text-gray-700">
              {detail.timeline.milestones.map((m, i) => (
                <li key={i}>
                  · {m.label} — {new Date(m.achieved_at).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {detail.confidence ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h3 className="font-semibold text-indigo-950">{labels.sections.confidence}</h3>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-indigo-700">{detail.confidence.score}%</p>
          <p className="text-sm font-medium text-indigo-900">
            {labels.confidence.level}: {labels.confidence.levels[detail.confidence.level]}
          </p>
          <p className="mt-2 text-xs text-indigo-800">{labels.confidence.disclaimer}</p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-900">{labels.sections.collaboration}</h3>
        <textarea
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          placeholder={labels.collaboration.placeholder}
          rows={3}
          className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting || !updateText.trim()}
            onClick={() =>
              void onEvent("execution_update", updateText).then(() => setUpdateText(""))
            }
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
          >
            {labels.collaboration.addUpdate}
          </button>
          <button
            type="button"
            disabled={acting || !updateText.trim()}
            onClick={() => void onEvent("assistance_requested", updateText)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs disabled:opacity-50"
          >
            {labels.collaboration.requestAssistance}
          </button>
        </div>
        {(detail.collaboration_log?.length ?? 0) > 0 ? (
          <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
            {detail.collaboration_log!.map((log) => (
              <li key={log.id} className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-gray-900">{log.description}</p>
                <p className="text-xs text-gray-500">
                  {log.performed_by} · {new Date(log.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {isCompleted && !learningSubmitted ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <h3 className="font-semibold text-emerald-950">{labels.sections.learning}</h3>
          <p className="mt-1 text-sm text-emerald-900">{labels.learning.intro}</p>
          <div className="mt-3 space-y-2">
            {(
              [
                ["expected", labels.learning.expectedOutcome],
                ["actual", labels.learning.actualOutcome],
                ["timeline", labels.learning.timelineAccuracy],
                ["blockers", labels.learning.blockersEncountered],
                ["lessons", labels.learning.lessonsLearned],
                ["improvements", labels.learning.improvements],
              ] as const
            ).map(([key, label]) => (
              <input
                key={key}
                value={learning[key]}
                onChange={(e) => setLearning((s) => ({ ...s, [key]: e.target.value }))}
                placeholder={label}
                className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm"
              />
            ))}
            <button
              type="button"
              disabled={acting || !learning.actual.trim()}
              onClick={() =>
                void onEvent("execution_learning", learning.actual, learning).then(() =>
                  setLearningSubmitted(true)
                )
              }
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {labels.learning.submit}
            </button>
          </div>
        </section>
      ) : null}
      {learningSubmitted ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {labels.learning.submitted}
        </p>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-900">{labels.sections.knowledgeCenter}</h3>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="font-medium">{labels.faq.whatIsCoordination}</dt>
            <dd className="text-gray-600">{labels.faq.whatIsCoordinationAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium">{labels.faq.autoExecute}</dt>
            <dd className="text-gray-600">{labels.faq.autoExecuteAnswer}</dd>
          </div>
        </dl>
      </section>

      {detail.principle ? <p className="text-xs text-gray-500">{detail.principle}</p> : null}
    </div>
  );
}
