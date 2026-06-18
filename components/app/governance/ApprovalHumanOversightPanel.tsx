"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  APPROVAL_OVERSIGHT_CORE_PRINCIPLE,
  APPROVAL_OVERSIGHT_VISION,
  parseApprovalHumanOversightCenter,
  type ApprovalHumanOversightCenter,
  type ApprovalRequest,
} from "@/lib/approval-human-oversight";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  governanceLink: string;
  trustApprovalsLink: string;
  approvalProfilesLink: string;
  dashboardTitle: string;
  pendingTitle: string;
  completedTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  emptyPending: string;
  emptyRecommendations: string;
  whyAipifyRecommends: string;
  riskLevel: string;
  businessImpact: string;
  financialImpact: string;
  ifApproved: string;
  ifRejected: string;
  risks: string;
  approve: string;
  reject: string;
  delegate: string;
  requestInfo: string;
  snooze: string;
  dismiss: string;
  delegatedTo: string;
  categories: Record<string, string>;
  riskLevels: Record<string, string>;
  priorities: Record<string, string>;
  metrics: {
    pending: string;
    highPriority: string;
    delegated: string;
    completed7d: string;
    avgResponse: string;
    compliance: string;
  };
  privacyNote: string;
};

type Props = { labels: PanelLabels; locale: string };

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800",
  moderate: "bg-sky-100 text-sky-800",
  elevated: "bg-amber-100 text-amber-900",
  high: "bg-rose-100 text-rose-900",
};

const PRIORITY_STYLES: Record<string, string> = {
  critical: "border-rose-300",
  high: "border-amber-300",
  medium: "border-gray-200",
  low: "border-gray-100",
};

export function ApprovalHumanOversightPanel({ labels, locale }: Props) {
  const [center, setCenter] = useState<ApprovalHumanOversightCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/approval-human-oversight/center");
    if (res.ok) setCenter(parseApprovalHumanOversightCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/approval-human-oversight/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.governance && (
          <Link href={center.links.governance} className="text-slate-600 hover:underline">
            {labels.governanceLink}
          </Link>
        )}
        {center?.links?.trust_approvals && (
          <Link href={center.links.trust_approvals} className="text-slate-600 hover:underline">
            {labels.trustApprovalsLink}
          </Link>
        )}
        {center?.links?.approval_profiles && (
          <Link href={center.links.approval_profiles} className="text-slate-600 hover:underline">
            {labels.approvalProfilesLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {APPROVAL_OVERSIGHT_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.visionTitle}: {APPROVAL_OVERSIGHT_VISION}
        </p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label={labels.metrics.pending} value={dash.pending_count} />
            <Metric label={labels.metrics.highPriority} value={dash.high_priority_count} />
            <Metric label={labels.metrics.delegated} value={dash.delegated_count} />
            <Metric label={labels.metrics.completed7d} value={dash.completed_7d} />
            <Metric label={labels.metrics.avgResponse} value={`${dash.avg_response_hours}h`} />
            <Metric label={labels.metrics.compliance} value={`${dash.compliance_rate}%`} />
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.pendingTitle}</h2>
        {(center?.pending.length ?? 0) === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyPending}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {center?.pending.map((req) => (
              <ApprovalCard
                key={req.request_key}
                req={req}
                labels={labels}
                locale={locale}
                expanded={expandedKey === req.request_key}
                onToggle={() =>
                  setExpandedKey(expandedKey === req.request_key ? null : req.request_key)
                }
                canRecord={center?.can_record ?? false}
                onAction={postAction}
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.completedTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center?.recent_completed.map((item) => (
              <li key={item.history_key} className="rounded-xl border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{item.action_title}</p>
                <p className="text-gray-600">
                  {item.decision} · {item.approver_label}
                </p>
                {item.created_at && (
                  <p className="text-xs text-gray-500">{formatDateTime(item.created_at, locale)}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.recommendationsTitle}</h2>
          {(center?.recommendations.length ?? 0) === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.emptyRecommendations}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {center?.recommendations.map((rec) => (
                <li key={rec.recommendation_key} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-sm">
                  <p className="text-gray-900">{rec.message}</p>
                  {center?.can_manage && (
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "dismiss_recommendation",
                          recommendation_key: rec.recommendation_key,
                        })
                      }
                      className="mt-2 text-xs text-indigo-600 hover:underline"
                    >
                      {labels.dismiss}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}
    </div>
  );
}

function ApprovalCard({
  req,
  labels,
  locale,
  expanded,
  onToggle,
  canRecord,
  onAction,
}: {
  req: ApprovalRequest;
  labels: PanelLabels;
  locale: string;
  expanded: boolean;
  onToggle: () => void;
  canRecord: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const fin = req.financial_impact;
  return (
    <article className={`rounded-2xl border-2 bg-white p-4 shadow-sm ${PRIORITY_STYLES[req.priority] ?? PRIORITY_STYLES.medium}`}>
      <button type="button" onClick={onToggle} className="w-full text-left">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-gray-900">{req.action_title}</p>
            <p className="mt-1 text-xs text-gray-500">
              {labels.categories[req.category] ?? req.category} · Level {req.approval_level}
            </p>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_STYLES[req.risk_level] ?? RISK_STYLES.moderate}`}>
            {labels.riskLevels[req.risk_level] ?? req.risk_level}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm">
          <p>
            <span className="font-medium text-gray-800">{labels.whyAipifyRecommends}:</span>{" "}
            {req.aipify_recommendation_reason}
          </p>
          {req.business_impact && (
            <p>
              <span className="font-medium text-gray-800">{labels.businessImpact}:</span>{" "}
              {req.business_impact}
            </p>
          )}
          {Object.keys(fin).length > 0 && (
            <p>
              <span className="font-medium text-gray-800">{labels.financialImpact}:</span>{" "}
              {fin.estimated_cost != null ? `$${fin.estimated_cost}` : ""}{" "}
              {fin.budget_category ? `· ${String(fin.budget_category)}` : ""}
            </p>
          )}
          {req.if_approved && (
            <p>
              <span className="font-medium text-gray-800">{labels.ifApproved}:</span> {req.if_approved}
            </p>
          )}
          {req.if_rejected && (
            <p>
              <span className="font-medium text-gray-800">{labels.ifRejected}:</span> {req.if_rejected}
            </p>
          )}
          {req.risks_summary && (
            <p>
              <span className="font-medium text-gray-800">{labels.risks}:</span> {req.risks_summary}
            </p>
          )}
          {req.deadline_at && (
            <p className="text-xs text-gray-500">
              Deadline: {formatDateTime(req.deadline_at, locale)}
            </p>
          )}
          {canRecord && req.status === "pending" && (
            <div className="flex flex-wrap gap-2 pt-2">
              <ActionBtn label={labels.approve} onClick={() => onAction({ action: "approve", request_key: req.request_key })} />
              <ActionBtn label={labels.reject} onClick={() => onAction({ action: "reject", request_key: req.request_key })} variant="muted" />
              <ActionBtn label={labels.delegate} onClick={() => onAction({ action: "delegate", request_key: req.request_key, delegated_to: "Team lead" })} variant="muted" />
              <ActionBtn label={labels.requestInfo} onClick={() => onAction({ action: "request_info", request_key: req.request_key })} variant="muted" />
              <ActionBtn label={labels.snooze} onClick={() => onAction({ action: "snooze", request_key: req.request_key })} variant="muted" />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ActionBtn({
  label,
  onClick,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "muted";
}) {
  const cls =
    variant === "primary"
      ? "bg-slate-800 text-white hover:bg-slate-900"
      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
  return (
    <button type="button" onClick={() => void onClick()} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${cls}`}>
      {label}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}
