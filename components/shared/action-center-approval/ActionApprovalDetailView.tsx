"use client";

import { useState } from "react";
import type { ApprovalDecisionType, ApprovalDelegationLabels, ApprovalDetail } from "@/lib/action-center-approval";

type ActionApprovalDetailViewProps = {
  detail: ApprovalDetail;
  labels: ApprovalDelegationLabels;
  riskLabels: Record<string, string>;
  acting: boolean;
  onBack: () => void;
  onDecision: (decision: ApprovalDecisionType, payload: { comment?: string; delegate_to?: string; conditions?: string }) => Promise<void>;
  onOpenImpact?: () => void;
};

const SLA_STYLES: Record<string, string> = {
  on_track: "border-emerald-200 bg-emerald-50 text-emerald-900",
  approaching_deadline: "border-amber-200 bg-amber-50 text-amber-900",
  overdue: "border-rose-200 bg-rose-50 text-rose-900",
  escalated: "border-violet-200 bg-violet-50 text-violet-900",
};

export function ActionApprovalDetailView({
  detail,
  labels,
  riskLabels,
  acting,
  onBack,
  onDecision,
  onOpenImpact,
}: ActionApprovalDetailViewProps) {
  const [decision, setDecision] = useState<ApprovalDecisionType>("approve");
  const [comment, setComment] = useState("");
  const [delegateTo, setDelegateTo] = useState("");
  const [conditions, setConditions] = useState("");

  const action = detail.action;
  const workflow = detail.workflow;
  const delegation = detail.delegation;
  const sla = detail.sla;

  if (!action) return null;

  async function submit() {
    await onDecision(decision, {
      comment: comment.trim() || undefined,
      delegate_to: delegateTo.trim() || undefined,
      conditions: conditions.trim() || undefined,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="text-sm font-medium text-indigo-600 hover:underline">
          ← {labels.actions.back}
        </button>
        {onOpenImpact ? (
          <button type="button" onClick={onOpenImpact} className="text-sm text-gray-600 hover:underline">
            View impact analysis
          </button>
        ) : null}
      </div>

      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
        {labels.humanOversight}
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">{action.title}</h2>
        <p className="mt-2 text-sm text-gray-600">{action.description}</p>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          {riskLabels[action.risk_level] ?? action.risk_level}
        </p>
      </section>

      {workflow ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
          <h3 className="font-semibold text-indigo-950">{labels.sections.workflow}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="font-medium text-indigo-900">{labels.workflow.type}</dt>
              <dd className="text-indigo-950">{labels.workflow.types[workflow.type]}</dd>
            </div>
            <div>
              <dt className="font-medium text-indigo-900">{labels.workflow.steps}</dt>
              <dd className="text-indigo-950">
                {workflow.steps_completed} / {workflow.steps_required}
              </dd>
            </div>
            {workflow.rules.length > 0 ? (
              <div>
                <dt className="font-medium text-indigo-900">{labels.workflow.rules}</dt>
                <dd className="mt-1 space-y-1 text-indigo-950">
                  {workflow.rules.map((rule) => (
                    <p key={rule.key}>
                      {rule.key}: {rule.label}
                    </p>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {delegation ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.delegation}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="font-medium text-gray-500">{labels.delegation.currentOwner}</dt>
              <dd className="text-gray-900">{delegation.current_owner}</dd>
            </div>
            {delegation.previous_owners.length > 0 ? (
              <div>
                <dt className="font-medium text-gray-500">{labels.delegation.previousOwners}</dt>
                <dd className="mt-1 space-y-1 text-gray-700">
                  {delegation.previous_owners.map((o, i) => (
                    <p key={i}>
                      {o.owner ?? "—"} {o.from_owner ? `(from ${o.from_owner})` : ""}
                    </p>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {sla ? (
        <section className={`rounded-2xl border p-5 ${SLA_STYLES[sla.status] ?? ""}`}>
          <h3 className="font-semibold">{labels.sections.sla}</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
            <div>
              <dt className="font-medium opacity-80">{labels.sla.status}</dt>
              <dd className="font-semibold">{labels.sla.statuses[sla.status]}</dd>
            </div>
            <div>
              <dt className="font-medium opacity-80">{labels.sla.hoursWaiting}</dt>
              <dd>{sla.hours_waiting}h</dd>
            </div>
            <div>
              <dt className="font-medium opacity-80">{labels.sla.deadline}</dt>
              <dd>{sla.deadline_hours}h</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {(detail.delegate_recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h3 className="font-semibold text-violet-950">{labels.sections.recommendations}</h3>
          <p className="mt-1 text-sm text-violet-900">{labels.recommendations.intro}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.delegate_recommendations!.map((rec) => (
              <li key={rec.role_name} className="flex items-center justify-between gap-2">
                <span className="font-medium text-violet-950">{rec.role_name}</span>
                <span className="text-violet-800">
                  {labels.recommendations.reasons[rec.reason_key] ?? rec.reason_key} · {labels.recommendations.optional}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-900">{labels.sections.decisions}</h3>
        <div className="mt-4 space-y-3">
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value as ApprovalDecisionType)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="approve">{labels.decisions.approve}</option>
            <option value="approve_with_conditions">{labels.decisions.approveWithConditions}</option>
            <option value="reject">{labels.decisions.reject}</option>
            <option value="request_information">{labels.decisions.requestInformation}</option>
            <option value="delegate_review">{labels.decisions.delegateReview}</option>
            <option value="require_executive_oversight">{labels.decisions.requireExecutiveOversight}</option>
            <option value="escalate">{labels.decisions.escalate}</option>
            <option value="return_for_clarification">{labels.decisions.returnForClarification}</option>
          </select>
          {decision === "delegate_review" ? (
            <input
              value={delegateTo}
              onChange={(e) => setDelegateTo(e.target.value)}
              placeholder={labels.delegation.delegateTo}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          ) : null}
          {decision === "approve_with_conditions" ? (
            <input
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder={labels.decisions.conditions}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          ) : null}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={labels.decisions.comment}
            rows={2}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={acting || (decision === "delegate_review" && !delegateTo.trim())}
            onClick={() => void submit()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {labels.decisions.submit}
          </button>
        </div>
      </section>

      {(detail.audit_trail?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.audit}</h3>
          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm text-gray-700">
            {detail.audit_trail!.map((log) => (
              <li key={log.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <p className="font-medium text-gray-900">{log.event_type}</p>
                <p className="text-gray-600">{log.event_description}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {log.performed_by} · {new Date(log.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-900">{labels.sections.knowledgeCenter}</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-gray-900">{labels.faq.whatIsDelegation}</dt>
            <dd className="text-gray-600">{labels.faq.whatIsDelegationAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">{labels.faq.autoApprove}</dt>
            <dd className="text-gray-600">{labels.faq.autoApproveAnswer}</dd>
          </div>
        </dl>
      </section>

      {detail.principle ? <p className="text-xs text-gray-500">{detail.principle}</p> : null}
    </div>
  );
}
