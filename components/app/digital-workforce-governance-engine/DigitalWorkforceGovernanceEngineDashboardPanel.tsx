"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseDigitalWorkforceGovernanceCenter,
  type DigitalWorkforceGovernanceCenter,
} from "@/lib/aipify/digital-workforce-governance-engine";

type Props = { labels: Record<string, string> };

export function DigitalWorkforceGovernanceEngineDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<DigitalWorkforceGovernanceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [policyName, setPolicyName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/digital-workforce-governance-engine/dashboard");
    if (res.ok) {
      setCenter(parseDigitalWorkforceGovernanceCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/digital-workforce-governance-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      setPolicyName("");
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricEmployees, formatOverviewMetric(overview.digital_employees)],
            [labels.metricAuthorityLevels, formatOverviewMetric(overview.authority_levels)],
            [labels.metricActivePolicies, formatOverviewMetric(overview.active_policies)],
            [labels.metricApprovalChains, formatOverviewMetric(overview.approval_chains)],
            [labels.metricExceptions, formatOverviewMetric(overview.governance_exceptions)],
            [labels.metricRiskEvents, formatOverviewMetric(overview.risk_events)],
            [labels.metricOpenDecisions, formatOverviewMetric(overview.open_decisions)],
            [labels.metricHealth, formatOverviewMetric(overview.governance_health_score)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openDecisionAuthority, ops.decision_authority_route],
            [labels.openApprovalPolicies, ops.approval_policies_route],
            [labels.openRiskPolicies, ops.risk_policies_route],
            [labels.openEthicalGuidelines, ops.ethical_guidelines_route],
            [labels.openEscalationRules, ops.escalation_rules_route],
            [labels.openAnalytics, ops.analytics_route],
            [labels.openIntelligence, ops.intelligence_route],
            [labels.openLifecycle, ops.lifecycle_route],
            [labels.openValue, ops.value_route],
            [labels.openApprovals, ops.approvals_route],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("assign_authority")}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.syncAuthority}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("complete_governance_review", { review_key: "policy-review" })}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
          >
            {labels.completeReview}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("log_risk_event", { event_title: labels.defaultRiskTitle, risk_class: "medium" })}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
          >
            {labels.logRiskEvent}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.authorityLevelsTitle}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {(center.authority_levels ?? []).map((level) => (
            <li key={level.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">
                {labels.levelLabel} {level.level_number}: {level.level_name}
              </p>
              <p className="text-gray-600">{level.level_description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.matrixTitle}</h2>
        {(center.action_authority_matrix ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noMatrix}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.action_authority_matrix ?? []).slice(0, 10).map((entry) => (
              <li key={entry.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{entry.action_name}</span>
                <span className="text-gray-600">
                  {labels.levelLabel} {entry.min_authority_level} · {entry.risk_class}
                  {entry.requires_human_approval ? ` · ${labels.humanApproval}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.assignmentsTitle}</h2>
        {(center.authority_assignments ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noAssignments}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.authority_assignments ?? []).slice(0, 8).map((a) => (
              <li key={a.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{a.employee_name}</span>
                <span className="text-gray-600">
                  {a.department} · {labels.levelLabel} {a.authority_level}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.policiesTitle}</h2>
        <ul className="mt-4 space-y-2">
          {(center.policies ?? []).map((policy) => (
            <li key={policy.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{policy.policy_name}</p>
              <p className="text-gray-600">
                {policy.policy_type} · {policy.risk_class}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.policyNamePlaceholder}
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
          />
          <button
            type="button"
            disabled={acting || !policyName.trim()}
            onClick={() =>
              void runAction("create_policy", {
                policy_name: policyName.trim(),
                policy_type: "organization",
                risk_class: "medium",
              })
            }
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.createPolicy}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.decisionsTitle}</h2>
        {(center.decision_logs ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noDecisions}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.decision_logs ?? []).slice(0, 6).map((log) => (
              <li key={log.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{log.action_name}</p>
                <p className="text-gray-600">
                  {log.decision_status} · {log.risk_class}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">{center.abos_principle}</p>
    </div>
  );
}
