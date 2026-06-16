"use client";

import { useState } from "react";
import type { InitiativeDetail, StrategicInitiativePortfolioLabels } from "@/lib/action-center-portfolio";

type Props = {
  detail: InitiativeDetail;
  labels: StrategicInitiativePortfolioLabels;
  acting: boolean;
  onBack: () => void;
  onOpenImpact?: () => void;
  onOpenApproval?: () => void;
  onOpenExecution?: () => void;
  onSubmitLearning: (payload: {
    expected_result: string;
    actual_result: string;
    timeline_accuracy: string;
    business_impact: string;
    lessons_learned: string;
    improvements: string;
  }) => Promise<void>;
};

const HEALTH_STYLE: Record<string, string> = {
  on_track: "border-emerald-200 bg-emerald-50 text-emerald-900",
  at_risk: "border-amber-200 bg-amber-50 text-amber-900",
  blocked: "border-rose-200 bg-rose-50 text-rose-900",
  overdue: "border-orange-200 bg-orange-50 text-orange-900",
  completed: "border-sky-200 bg-sky-50 text-sky-900",
};

export function ActionPortfolioDetailView({
  detail,
  labels,
  acting,
  onBack,
  onOpenImpact,
  onOpenApproval,
  onOpenExecution,
  onSubmitLearning,
}: Props) {
  const [learningSubmitted, setLearningSubmitted] = useState(false);
  const [learning, setLearning] = useState({
    expected: "",
    actual: "",
    timeline: "",
    impact: "",
    lessons: "",
    improvements: "",
  });

  const initiative = detail.initiative;
  if (!initiative) return null;

  const isCompleted = initiative.status === "executed" || detail.portfolio_health === "completed";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="text-sm font-medium text-indigo-600 hover:underline">
          ← {labels.actions.back}
        </button>
        <div className="flex gap-3 text-sm">
          {onOpenImpact ? (
            <button type="button" onClick={onOpenImpact} className="text-gray-600 hover:underline">
              Impact
            </button>
          ) : null}
          {onOpenApproval ? (
            <button type="button" onClick={onOpenApproval} className="text-gray-600 hover:underline">
              Approvals
            </button>
          ) : null}
          {onOpenExecution ? (
            <button type="button" onClick={onOpenExecution} className="text-gray-600 hover:underline">
              Execution
            </button>
          ) : null}
        </div>
      </div>

      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
        {labels.humanOversight}
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{initiative.title}</h2>
            {initiative.description ? (
              <p className="mt-2 text-sm text-gray-600">{initiative.description}</p>
            ) : null}
          </div>
          {detail.portfolio_health ? (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${HEALTH_STYLE[detail.portfolio_health] ?? ""}`}
            >
              {labels.health[detail.portfolio_health]}
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {initiative.category ? (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-900">
              {labels.categories[initiative.category]}
            </span>
          ) : null}
          {initiative.priority ? (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
              {labels.priority.level}: {labels.priority.levels[initiative.priority]}
            </span>
          ) : null}
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="font-medium text-gray-500">{labels.details.owner}</dt>
            <dd className="mt-1 text-gray-900">{initiative.owner ?? "—"}</dd>
          </div>
          {initiative.executive_sponsor ? (
            <div>
              <dt className="font-medium text-gray-500">{labels.alignment.executiveSponsor}</dt>
              <dd className="mt-1 text-gray-900">{initiative.executive_sponsor}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      {detail.strategic_alignment ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h3 className="font-semibold text-violet-950">{labels.sections.alignment}</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="font-medium text-violet-800">{labels.alignment.businessGoal}</dt>
              <dd className="mt-1 text-violet-950">{detail.strategic_alignment.business_goal}</dd>
            </div>
            <div>
              <dt className="font-medium text-violet-800">{labels.alignment.department}</dt>
              <dd className="mt-1 text-violet-950">{detail.strategic_alignment.department}</dd>
            </div>
            <div>
              <dt className="font-medium text-violet-800">{labels.alignment.alignmentScore}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{detail.strategic_alignment.alignment_score}</dd>
            </div>
            <div>
              <dt className="font-medium text-violet-800">{labels.confidence.level}</dt>
              <dd className="mt-1 font-medium">
                {labels.confidence.levels[detail.strategic_alignment.confidence_level]} ({detail.strategic_alignment.confidence_score})
              </dd>
              <p className="mt-1 text-xs text-violet-700">{labels.confidence.disclaimer}</p>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium text-violet-800">{labels.alignment.expectedValue}</dt>
              <dd className="mt-1 text-violet-950">{detail.strategic_alignment.expected_strategic_value}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {detail.timeline ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.details.timeline}</h3>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
            {detail.timeline.planned_start ? (
              <div><dt className="text-gray-500">{labels.details.plannedStart}</dt><dd>{new Date(detail.timeline.planned_start).toLocaleDateString()}</dd></div>
            ) : null}
            {detail.timeline.estimated_completion ? (
              <div><dt className="text-gray-500">{labels.details.estimatedCompletion}</dt><dd>{new Date(detail.timeline.estimated_completion).toLocaleDateString()}</dd></div>
            ) : null}
          </dl>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-900">{labels.sections.details}</h3>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-gray-500">{labels.details.expectedOutcome}</dt>
            <dd className="mt-1 text-gray-900">{detail.expected_outcome}</dd>
          </div>
          {detail.actual_outcome ? (
            <div>
              <dt className="font-medium text-gray-500">{labels.details.actualOutcome}</dt>
              <dd className="mt-1 text-gray-900">{detail.actual_outcome}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      {(detail.linked_dependencies?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
          <h3 className="font-semibold text-indigo-950">{labels.details.linkedDependencies}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.linked_dependencies!.map((dep, i) => (
              <li key={dep.id ?? i} className="rounded-lg bg-white/60 px-3 py-2">
                {dep.label} — <span className="text-indigo-800">{dep.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.linked_risks?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-rose-100 bg-rose-50/30 p-5">
          <h3 className="font-semibold text-rose-950">{labels.details.linkedRisks}</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {detail.linked_risks!.map((r) => (
              <li key={r.key}>{r.label} — {r.level}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.resource_awareness ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.resources}</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="font-medium text-gray-500">{labels.resources.requiredTeams}</dt>
              <dd className="mt-1">{detail.resource_awareness.required_teams.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">{labels.resources.requiredRoles}</dt>
              <dd className="mt-1">{detail.resource_awareness.required_roles.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">{labels.resources.estimatedWorkload}</dt>
              <dd className="mt-1 capitalize">{detail.resource_awareness.estimated_workload}</dd>
            </div>
            {(detail.resource_awareness.capacity_concerns.length > 0) ? (
              <div>
                <dt className="font-medium text-gray-500">{labels.resources.capacityConcerns}</dt>
                <dd className="mt-1">{detail.resource_awareness.capacity_concerns.join(", ")}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {detail.decision_support ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
          <h3 className="font-semibold text-emerald-950">{labels.decisionSupport.title}</h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-emerald-800">{labels.decisionSupport.whyItMatters}</dt>
              <dd className="mt-1 text-emerald-950">{detail.decision_support.why_it_matters}</dd>
            </div>
            <div>
              <dt className="font-medium text-emerald-800">{labels.decisionSupport.ifSucceeds}</dt>
              <dd className="mt-1">{detail.decision_support.if_succeeds}</dd>
            </div>
            <div>
              <dt className="font-medium text-emerald-800">{labels.decisionSupport.ifFails}</dt>
              <dd className="mt-1">{detail.decision_support.if_fails}</dd>
            </div>
            <div>
              <dt className="font-medium text-emerald-800">{labels.decisionSupport.ifDelayed}</dt>
              <dd className="mt-1">{detail.decision_support.if_delayed}</dd>
            </div>
            <div>
              <dt className="font-medium text-emerald-800">{labels.decisionSupport.whoInvolved}</dt>
              <dd className="mt-1">{detail.decision_support.who_involved.filter(Boolean).join(", ")}</dd>
            </div>
            <div className="rounded-lg border border-emerald-300 bg-white px-3 py-2">
              <dt className="font-semibold text-emerald-900">{labels.decisionSupport.decisionNeeded}</dt>
              <dd className="mt-1 font-medium">{detail.decision_support.decision_needed_now}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {isCompleted && !learningSubmitted ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.learning}</h3>
          <p className="mt-2 text-sm text-gray-600">{labels.learning.intro}</p>
          <div className="mt-4 space-y-3">
            {(["expected", "actual", "timeline", "impact", "lessons", "improvements"] as const).map((key) => {
              const labelKey =
                key === "expected" ? "expectedResult" :
                key === "actual" ? "actualResult" :
                key === "timeline" ? "timelineAccuracy" :
                key === "impact" ? "businessImpact" :
                key === "lessons" ? "lessonsLearned" : "improvements";
              return (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600">{labels.learning[labelKey]}</label>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    rows={2}
                    value={learning[key === "impact" ? "impact" : key]}
                    onChange={(e) =>
                      setLearning((prev) => ({
                        ...prev,
                        [key === "impact" ? "impact" : key]: e.target.value,
                      }))
                    }
                  />
                </div>
              );
            })}
            <button
              type="button"
              disabled={acting}
              onClick={() =>
                void onSubmitLearning({
                  expected_result: learning.expected,
                  actual_result: learning.actual,
                  timeline_accuracy: learning.timeline,
                  business_impact: learning.impact,
                  lessons_learned: learning.lessons,
                  improvements: learning.improvements,
                }).then(() => setLearningSubmitted(true))
              }
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
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
        <h3 className="font-semibold text-gray-900">{labels.faq.title}</h3>
        <dl className="mt-3 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-gray-900">{labels.faq.whatIsInitiative}</dt>
            <dd className="mt-1 text-gray-600">{labels.faq.whatIsInitiativeAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">{labels.faq.canAipifyDecide}</dt>
            <dd className="mt-1 text-gray-600">{labels.faq.canAipifyDecideAnswer}</dd>
          </div>
        </dl>
      </section>

      {(detail.audit_trail?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.audit}</h3>
          <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-sm text-gray-600">
            {detail.audit_trail!.map((log) => (
              <li key={log.id}>
                {log.event_type} — {log.event_description}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
