"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGovernancePolicyEngineDashboard,
  type BlueprintObjective,
  type CompanionExample,
  type GovernancePolicyEngineDashboard,
} from "@/lib/aipify/governance-policy-engine";

type GovernancePolicyEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function CompanionCard({ example }: { example: CompanionExample }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">
        {example.emoji ? `${example.emoji} ` : ""}
        {example.scenario}
      </span>
      {example.example ? <p className="mt-1 text-xs text-gray-600">{example.example}</p> : null}
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

function severityClass(severity?: string) {
  switch (severity) {
    case "critical":
      return "bg-rose-100 text-rose-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "moderate":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function categoryLabel(category: string, labels: Record<string, string>) {
  const map: Record<string, string> = {
    ai_autonomy: labels.categoryAiAutonomy,
    approval: labels.categoryApproval,
    support: labels.categorySupport,
    access: labels.categoryAccess,
    knowledge_publishing: labels.categoryKnowledge,
    integration: labels.categoryIntegration,
    retention: labels.categoryRetention,
  };
  return map[category] ?? category.replace(/_/g, " ");
}

export function GovernancePolicyEngineDashboardPanel({
  labels,
}: GovernancePolicyEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<GovernancePolicyEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/governance-policy-engine/dashboard");
    if (res.ok) setDashboard(parseGovernancePolicyEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runViolationScan() {
    setActionKey("scan");
    await fetch("/api/governance/violations/run/scan", { method: "POST" });
    await load();
    setActionKey(null);
  }

  async function acknowledgeViolation(id: string) {
    setActionKey(id);
    await fetch(`/api/governance/violations/${id}/acknowledge`, { method: "POST" });
    await load();
    setActionKey(null);
  }

  async function scheduleReview(policyId: string) {
    setActionKey(`review-${policyId}`);
    await fetch(`/api/governance/policies/${policyId}/schedule-review`, { method: "POST" });
    await load();
    setActionKey(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const settings = dashboard.settings ?? {};
  const engagement = dashboard.engagement_summary;
  const blueprintLinks = dashboard.blueprint_integration_links ?? [];
  const phase123 = dashboard.implementation_blueprint_phase123;
  const phase123Links = phase123?.cross_links ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/secure-ai-actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.secureAiActions}
        </Link>
        <Link href="/app/audit-accountability" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.auditAccountability}
        </Link>
        <Link href="/app/quality-guardian-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.qualityGuardian}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
        </Link>
        {blueprintLinks.slice(0, 4).map((link) =>
          link.route ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.governancePolicyEngine}</h2>
        <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        {dashboard.implementation_blueprint_phase67?.phase ? (
          <p className="mt-2 text-xs text-indigo-600">
            {dashboard.implementation_blueprint_phase67.phase}
            {dashboard.implementation_blueprint_phase67.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase67.engine_phase}`
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
        {dashboard.board_governance_companion_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.board_governance_companion_note}</p>
        ) : null}
        {dashboard.metadata_note ? (
          <p className="mt-2 text-xs text-indigo-600">{dashboard.metadata_note}</p>
        ) : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activePolicies}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.active_policies.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.openViolations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.policy_violations.length}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_approval_count ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.autonomyLevel}</p>
          <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
            {(settings.ai_autonomy_level ?? "approval_required").replace(/_/g, " ")}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{labels.activePoliciesList}</h3>
          <button
            type="button"
            disabled={actionKey === "scan"}
            onClick={() => void runViolationScan()}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-800"
          >
            {labels.runViolationScan}
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {dashboard.active_policies.length === 0 ? (
            <li className="text-sm text-gray-500">{labels.noPolicies}</li>
          ) : (
            dashboard.active_policies.map((policy) => (
              <li key={policy.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{policy.policy_name}</p>
                  <p className="text-xs text-gray-500">
                    {categoryLabel(policy.category, labels)} · {policy.policy_key}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={actionKey === `review-${policy.id}`}
                  onClick={() => void scheduleReview(policy.id)}
                  className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                >
                  {labels.scheduleReview}
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">{labels.policyViolations}</h3>
        <ul className="mt-3 space-y-2">
          {dashboard.policy_violations.length === 0 ? (
            <li className="text-sm text-gray-500">{labels.noViolations}</li>
          ) : (
            dashboard.policy_violations.map((violation) => (
              <li key={violation.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{violation.policy_name ?? violation.violation_type}</p>
                    <p className="mt-1 text-xs text-gray-600">{violation.description}</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs ${severityClass(violation.severity)}`}>
                    {violation.severity}
                  </span>
                </div>
                {violation.status === "open" ? (
                  <button
                    type="button"
                    disabled={actionKey === violation.id}
                    onClick={() => void acknowledgeViolation(violation.id)}
                    className="mt-2 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  >
                    {labels.acknowledge}
                  </button>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.upcomingReviews}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.upcoming_reviews.length === 0 ? (
              <li className="text-sm text-gray-500">{labels.noReviews}</li>
            ) : (
              dashboard.upcoming_reviews.map((review) => (
                <li key={review.id} className="text-sm text-gray-700">
                  {review.policy_name} — {new Date(review.scheduled_at).toLocaleDateString()}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.pendingApprovalsList}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.pending_approvals.length === 0 ? (
              <li className="text-sm text-gray-500">{labels.noPendingApprovals}</li>
            ) : (
              dashboard.pending_approvals.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-gray-700">
                  <span>{item.action_key}</span>
                  <span className="capitalize text-gray-500">{item.risk_level}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {dashboard.governance_recommendations && dashboard.governance_recommendations.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.governance_recommendations.map((rec) => (
              <li key={rec.key} className="rounded-lg border border-gray-100 p-3">
                <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                {rec.reason ? <p className="mt-1 text-xs text-gray-600">{rec.reason}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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

      {dashboard.board_preparation && dashboard.board_preparation.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.boardPreparation}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.board_preparation.map((item) => (
              <CompanionCard key={item.key ?? item.scenario} example={item} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.board_meeting_support?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.boardMeetingSupport}</h3>
          <p className="mt-2 text-gray-700">{dashboard.board_meeting_support.principle}</p>
          {dashboard.board_meeting_support.support_types && dashboard.board_meeting_support.support_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.board_meeting_support.support_types.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.strategic_oversight?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.strategicOversight}</h3>
          <p className="mt-2 text-gray-700">{dashboard.strategic_oversight.principle}</p>
          {dashboard.strategic_oversight.oversight_areas && dashboard.strategic_oversight.oversight_areas.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.strategic_oversight.oversight_areas.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
          {dashboard.strategic_oversight.balanced_oversight_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.strategic_oversight.balanced_oversight_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.risk_awareness && dashboard.risk_awareness.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.riskAwareness}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.risk_awareness.map((item) => (
              <CompanionCard key={item.key ?? item.scenario} example={item} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.blueprint_governance_principles && dashboard.blueprint_governance_principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.blueprintGovernancePrinciples}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.blueprint_governance_principles.map((principle) => (
              <li key={principle.key ?? principle.label} className="text-sm text-gray-700">
                {principle.emoji ? `${principle.emoji} ` : ""}
                {principle.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.decision_continuity?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.decisionContinuity}</h3>
          <p className="mt-2 text-gray-700">{dashboard.decision_continuity.principle}</p>
          {dashboard.decision_continuity.continuity_elements &&
          dashboard.decision_continuity.continuity_elements.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.decision_continuity.continuity_elements.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.companion_patterns &&
          dashboard.self_love_connection.companion_patterns.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.companion_patterns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.what_informs_observations &&
          dashboard.trust_connection.what_informs_observations.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_connection.what_informs_observations.map((item) => (
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
            <span>{labels.activePolicies}: {engagement.active_policies ?? 0}</span>
            <span>{labels.openViolations}: {engagement.open_violations ?? 0}</span>
            <span>{labels.scheduledReviews}: {engagement.scheduled_reviews ?? 0}</span>
            <span>{labels.overdueReviews}: {engagement.overdue_reviews ?? 0}</span>
            <span>{labels.pendingApprovals}: {engagement.pending_approvals ?? 0}</span>
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

      {phase123 ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/40 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.phase123Title}</h2>
          {phase123.phase ? <p className="mt-1 text-xs text-violet-700">{phase123.phase}</p> : null}
          {dashboard.board_governance_companion_phase123_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.board_governance_companion_phase123_note}</p>
          ) : null}
          {phase123.mission ? <p className="mt-2 text-sm font-medium text-violet-900">{phase123.mission}</p> : null}
          {phase123.philosophy ? <p className="mt-2 text-sm text-violet-900">{phase123.philosophy}</p> : null}
          {phase123.abos_principle ? <p className="mt-2 text-xs text-violet-800">{phase123.abos_principle}</p> : null}
          {phase123.privacy_note ? <p className="mt-2 text-xs text-violet-600">{phase123.privacy_note}</p> : null}
        </section>
      ) : null}

      {phase123?.objectives && phase123.objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123Objectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase123.objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.board_intelligence_center && phase123.board_intelligence_center.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123IntelligenceCenter}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase123.board_intelligence_center.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.board_dashboard_displays && phase123.board_dashboard_displays.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123DashboardDisplays}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase123.board_dashboard_displays.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.board_briefing_engine && phase123.board_briefing_engine.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123BriefingEngine}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase123.board_briefing_engine.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.governance_memory_engine && phase123.governance_memory_engine.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123GovernanceMemory}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase123.governance_memory_engine.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.board_companion_supports && phase123.board_companion_supports.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123CompanionSupports}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase123.board_companion_supports.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.committee_support && phase123.committee_support.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123CommitteeSupport}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {phase123.committee_support.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.risk_oversight_framework && phase123.risk_oversight_framework.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123RiskOversight}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase123.risk_oversight_framework.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.decision_traceability && phase123.decision_traceability.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123DecisionTraceability}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase123.decision_traceability.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.board_effectiveness_insights && phase123.board_effectiveness_insights.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123EffectivenessInsights}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase123.board_effectiveness_insights.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.companion_limitations && phase123.companion_limitations.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-6">
          <h3 className="text-sm font-semibold text-amber-900">{labels.phase123Limitations}</h3>
          <ul className="mt-3 space-y-2">
            {phase123.companion_limitations.map((item) => (
              <li key={item.key ?? item.label} className="text-sm text-amber-900">{item.label}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase123?.self_love_governance?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.phase123SelfLove}</h3>
          <p className="mt-2">{phase123.self_love_governance.principle}</p>
          {phase123.self_love_governance.governance_phrase ? (
            <p className="mt-2 text-xs">{phase123.self_love_governance.governance_phrase}</p>
          ) : null}
        </section>
      ) : null}

      {phase123?.board_knowledge_library && phase123.board_knowledge_library.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123KnowledgeLibrary}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase123.board_knowledge_library.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.companion_adaptation?.examples && phase123.companion_adaptation.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123CompanionAdaptation}</h3>
          {phase123.companion_adaptation.principle ? (
            <p className="mt-2 text-sm text-gray-700">{phase123.companion_adaptation.principle}</p>
          ) : null}
          <div className="mt-3 space-y-3">
            {phase123.companion_adaptation.examples.map((example) => (
              <CompanionCard
                key={example.key ?? example.prompt}
                example={{
                  emoji: example.emoji,
                  scenario: example.prompt,
                  example: example.consideration,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.success_metrics && phase123.success_metrics.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123SuccessMetrics}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase123.success_metrics.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase123?.success_criteria && phase123.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase123SuccessCriteria}</h3>
          <div className="mt-3 space-y-2">
            {phase123.success_criteria.map((criterion) => (
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

      {phase123Links.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.phase123CrossLinks}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {phase123Links.map((link) =>
              link.route ? (
                <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                  {link.label ?? link.route}
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
            {dashboard.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
