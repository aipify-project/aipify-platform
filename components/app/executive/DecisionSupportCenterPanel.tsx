"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  EXECUTIVE_DECISION_CORE_PRINCIPLE,
  EXECUTIVE_DECISION_PHILOSOPHY,
  EXECUTIVE_DECISION_VISION,
  parseExecutiveDecisionSupportCenter,
  type DecisionWorkspace,
  type ExecutiveDecisionSupportCenter,
} from "@/lib/executive-decision-support";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  assistantDecisionsLink: string;
  approvalCenterLink: string;
  dashboardTitle: string;
  workspaceTitle: string;
  insightsTitle: string;
  stakeholderTitle: string;
  auditTitle: string;
  decidedTitle: string;
  emptyDecisions: string;
  emptyInsights: string;
  emptyStakeholder: string;
  owner: string;
  stakeholders: string;
  status: string;
  category: string;
  timeSensitivity: string;
  deadline: string;
  framework: string;
  objectives: string;
  assumptions: string;
  alternatives: string;
  risks: string;
  outcome: string;
  advanceStatus: string;
  markDecided: string;
  archive: string;
  dismiss: string;
  youDecide: string;
  categories: Record<string, string>;
  states: Record<string, string>;
  frameworks: Record<string, string>;
  sensitivities: Record<string, string>;
  inputTypes: Record<string, string>;
  metrics: {
    active: string;
    pendingEval: string;
    awaitingApproval: string;
    stakeholderInputs: string;
    highSensitivity: string;
    decided: string;
    frameworkAdoption: string;
    confidence: string;
  };
  privacyNote: string;
};

type Props = { labels: PanelLabels; locale: string };

const SENSITIVITY_STYLES: Record<string, string> = {
  low: "border-gray-200",
  medium: "border-sky-200",
  high: "border-amber-300",
  critical: "border-rose-300 bg-rose-50/30",
};

export function DecisionSupportCenterPanel({ labels, locale }: Props) {
  const [center, setCenter] = useState<ExecutiveDecisionSupportCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/executive-decision-support/center");
    if (res.ok) setCenter(parseExecutiveDecisionSupportCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/executive-decision-support/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && (
          <Link href={center.links.executive} className="text-slate-600 hover:underline">
            {labels.executiveLink}
          </Link>
        )}
        {center?.links?.assistant_decisions && (
          <Link href={center.links.assistant_decisions} className="text-slate-600 hover:underline">
            {labels.assistantDecisionsLink}
          </Link>
        )}
        {center?.links?.approval_center && (
          <Link href={center.links.approval_center} className="text-slate-600 hover:underline">
            {labels.approvalCenterLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {EXECUTIVE_DECISION_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.philosophyTitle}: {EXECUTIVE_DECISION_PHILOSOPHY}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.visionTitle}: {EXECUTIVE_DECISION_VISION}
        </p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.youDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.active} value={dash.active_count} />
            <Metric label={labels.metrics.pendingEval} value={dash.pending_evaluations} />
            <Metric label={labels.metrics.awaitingApproval} value={dash.awaiting_approval} />
            <Metric label={labels.metrics.stakeholderInputs} value={dash.stakeholder_inputs} />
            <Metric label={labels.metrics.highSensitivity} value={dash.high_sensitivity} />
            <Metric label={labels.metrics.decided} value={dash.decided_count} />
            <Metric label={labels.metrics.frameworkAdoption} value={`${dash.framework_adoption_rate}%`} />
            <Metric label={labels.metrics.confidence} value={`${dash.decision_confidence_avg}/5`} />
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.workspaceTitle}</h2>
        {center?.active_decisions.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyDecisions}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {center?.active_decisions.map((dec) => (
              <DecisionCard
                key={dec.decision_key}
                decision={dec}
                labels={labels}
                locale={locale}
                expanded={expandedKey === dec.decision_key}
                onToggle={() =>
                  setExpandedKey(expandedKey === dec.decision_key ? null : dec.decision_key)
                }
                canRecord={center?.can_record ?? false}
                onAction={postAction}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.insightsTitle}</h2>
        {(center?.insights.length ?? 0) === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyInsights}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {center?.insights.map((ins) => (
              <li key={ins.insight_key} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-sm">
                <p className="text-gray-800">{ins.message}</p>
                {center?.can_manage && (
                  <button
                    type="button"
                    className="mt-2 text-xs text-slate-600 hover:underline"
                    onClick={() =>
                      void postAction({ action: "dismiss_insight", insight_key: ins.insight_key })
                    }
                  >
                    {labels.dismiss}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.stakeholderTitle}</h2>
          {(center?.stakeholder_input.length ?? 0) === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.emptyStakeholder}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {center?.stakeholder_input.map((input) => (
                <li key={input.input_key} className="rounded-xl border border-gray-100 p-3 text-sm">
                  <p className="font-medium text-gray-900">
                    {input.contributor_label} · {labels.inputTypes[input.input_type] ?? input.input_type}
                  </p>
                  <p className="mt-1 text-gray-700">{input.content}</p>
                  {input.rating != null && (
                    <p className="mt-1 text-xs text-gray-500">Rating: {input.rating}/5</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.decidedTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center?.decided_decisions.map((dec) => (
              <li key={dec.decision_key} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 text-sm">
                <p className="font-medium text-gray-900">{dec.title}</p>
                {dec.outcome_summary && <p className="mt-1 text-gray-700">{dec.outcome_summary}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.auditTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.recent_audit.map((entry, idx) => (
            <li key={`${entry.event_type}-${idx}`} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="text-gray-800">{entry.summary}</p>
              {entry.created_at && (
                <p className="text-xs text-gray-500">{formatDateTime(entry.created_at, locale)}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}
    </div>
  );
}

function DecisionCard({
  decision,
  labels,
  locale,
  expanded,
  onToggle,
  canRecord,
  onAction,
}: {
  decision: DecisionWorkspace;
  labels: PanelLabels;
  locale: string;
  expanded: boolean;
  onToggle: () => void;
  canRecord: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const nextStatus =
    decision.status === "gathering_info"
      ? "under_evaluation"
      : decision.status === "under_evaluation"
        ? "awaiting_approval"
        : decision.status === "awaiting_approval"
          ? "decided"
          : null;

  return (
    <article
      className={`rounded-2xl border-2 bg-white p-4 shadow-sm ${SENSITIVITY_STYLES[decision.time_sensitivity] ?? SENSITIVITY_STYLES.medium}`}
    >
      <button type="button" onClick={onToggle} className="w-full text-left">
        <p className="text-lg font-semibold text-gray-900">{decision.title}</p>
        <p className="mt-1 text-xs text-gray-500">
          {labels.categories[decision.category] ?? decision.category} ·{" "}
          {labels.states[decision.status] ?? decision.status} ·{" "}
          {labels.sensitivities[decision.time_sensitivity] ?? decision.time_sensitivity}
        </p>
      </button>

      {expanded && (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
          <p>
            <span className="font-medium">{labels.owner}:</span> {decision.owner_label}
          </p>
          {decision.stakeholders && (
            <p>
              <span className="font-medium">{labels.stakeholders}:</span> {decision.stakeholders}
            </p>
          )}
          <p>
            <span className="font-medium">{labels.framework}:</span>{" "}
            {labels.frameworks[decision.framework_type] ?? decision.framework_type}
          </p>
          {decision.objectives && (
            <p>
              <span className="font-medium">{labels.objectives}:</span> {decision.objectives}
            </p>
          )}
          {decision.assumptions && (
            <p>
              <span className="font-medium">{labels.assumptions}:</span> {decision.assumptions}
            </p>
          )}
          {decision.alternatives && (
            <p>
              <span className="font-medium">{labels.alternatives}:</span> {decision.alternatives}
            </p>
          )}
          {decision.risk_indicators.length > 0 && (
            <p>
              <span className="font-medium">{labels.risks}:</span>{" "}
              {decision.risk_indicators.map(String).join(" · ")}
            </p>
          )}
          {decision.deadline_at && (
            <p className="text-xs text-gray-500">
              {labels.deadline}: {formatDateTime(decision.deadline_at, locale)}
            </p>
          )}
          <FrameworkPreview decision={decision} />
          {canRecord && decision.status !== "archived" && (
            <div className="flex flex-wrap gap-2 pt-2">
              {nextStatus && (
                <ActionBtn
                  label={labels.advanceStatus}
                  onClick={() =>
                    onAction({
                      action: "update_status",
                      decision_key: decision.decision_key,
                      status: nextStatus,
                    })
                  }
                />
              )}
              {decision.status === "awaiting_approval" && (
                <ActionBtn
                  label={labels.markDecided}
                  onClick={() =>
                    onAction({
                      action: "mark_decided",
                      decision_key: decision.decision_key,
                      outcome_summary: "Decision recorded by owner.",
                    })
                  }
                />
              )}
              <ActionBtn
                label={labels.archive}
                variant="muted"
                onClick={() =>
                  onAction({ action: "archive", decision_key: decision.decision_key })
                }
              />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function FrameworkPreview({ decision }: { decision: DecisionWorkspace }) {
  const data = decision.framework_data;
  if (decision.framework_type === "pros_cons") {
    const pros = Array.isArray(data.pros) ? data.pros : [];
    const cons = Array.isArray(data.cons) ? data.cons : [];
    return (
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {pros.length > 0 && (
          <p className="rounded-lg bg-emerald-50 p-2 text-xs">
            <span className="font-medium">Pros:</span> {pros.map(String).join("; ")}
          </p>
        )}
        {cons.length > 0 && (
          <p className="rounded-lg bg-amber-50 p-2 text-xs">
            <span className="font-medium">Cons:</span> {cons.map(String).join("; ")}
          </p>
        )}
      </div>
    );
  }
  if (decision.framework_type === "weighted_criteria" && Array.isArray(data.criteria)) {
    return (
      <ul className="mt-2 space-y-1 text-xs text-gray-600">
        {(data.criteria as Array<Record<string, unknown>>).map((c) => (
          <li key={String(c.key)}>
            {String(c.label ?? c.key)} ({String(c.weight)}%)
          </li>
        ))}
      </ul>
    );
  }
  if (decision.framework_type === "scenario_analysis" && Array.isArray(data.scenarios)) {
    return (
      <ul className="mt-2 space-y-1 text-xs text-gray-600">
        {(data.scenarios as Array<Record<string, unknown>>).map((s) => (
          <li key={String(s.key)}>
            <span className="font-medium">{String(s.label)}:</span> {String(s.summary)}
          </li>
        ))}
      </ul>
    );
  }
  if (decision.framework_type === "risk_review" && Array.isArray(data.risks)) {
    return (
      <ul className="mt-2 space-y-1 text-xs text-gray-600">
        {(data.risks as Array<Record<string, unknown>>).map((r) => (
          <li key={String(r.key)}>
            {String(r.label)} — {String(r.level)}
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  variant = "primary",
}: {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: "primary" | "muted";
}) {
  const styles =
    variant === "muted"
      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      : "border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700";
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${styles}`}
    >
      {label}
    </button>
  );
}
