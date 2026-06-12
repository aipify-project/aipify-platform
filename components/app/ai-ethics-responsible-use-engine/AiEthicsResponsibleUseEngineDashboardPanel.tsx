"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAiEthicsResponsibleUseEngineDashboard,
  type AiEthicsResponsibleUseEngineDashboard,
  type AiUseCaseRecord,
  type AutonomyLevel,
  type BlueprintIntegrationLink,
  type BlueprintObjective,
  type BlueprintSuccessCriterion,
  type CompanionExample,
} from "@/lib/aipify/ai-ethics-responsible-use-engine";

type Props = { labels: Record<string, string> };

function badgeClass(value?: string) {
  switch (value) {
    case "approved":
    case "low":
    case "healthy":
      return "bg-emerald-100 text-emerald-800";
    case "proposed":
    case "medium":
    case "attention_needed":
      return "bg-amber-100 text-amber-800";
    case "high":
    case "reviews_due":
      return "bg-orange-100 text-orange-800";
    case "critical":
    case "restricted":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function AiEthicsResponsibleUseEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AiEthicsResponsibleUseEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/ai-ethics-responsible-use-engine/dashboard");
    if (res.ok) setDashboard(parseAiEthicsResponsibleUseEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const useCaseAction = async (useCaseId: string, action: "approve" | "restrict") => {
    setBusyId(useCaseId);
    setActionError(null);
    const res = await fetch(`/api/aipify/ai-ethics-responsible-use-engine/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ use_case_id: useCaseId }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const governanceSummary = dashboard.governance_summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.trustActions}
        </Link>
        <Link href="/app/human-oversight-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.humanOversight}
        </Link>
        <Link href="/app/companion-identity-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.companionIdentity}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
        {(dashboard.escgbp_integration_links ?? []).slice(0, 4).map((link: BlueprintIntegrationLink) =>
          link.route ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
        {(dashboard.cecbp_integration_links ?? []).slice(0, 3).map((link: BlueprintIntegrationLink) =>
          link.route ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
        {(dashboard.tehgbp98_integration_links ?? []).slice(0, 3).map((link: BlueprintIntegrationLink) =>
          link.route ? (
            <Link key={`tehgbp98-${link.route}`} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      {dashboard.implementation_blueprint_phase98 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="text-sm font-semibold text-amber-900">{labels.trustGovernanceBlueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-amber-700">
            {dashboard.implementation_blueprint_phase98.title ?? labels.blueprintPhase98}
            {dashboard.implementation_blueprint_phase98.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase98.engine_phase}`
              : ""}
          </p>
          {dashboard.tehgbp98_mission ? (
            <p className="mt-2 text-sm font-medium text-amber-900">{dashboard.tehgbp98_mission}</p>
          ) : null}
          {dashboard.tehgbp98_philosophy ? (
            <p className="mt-2 text-sm text-amber-900">{dashboard.tehgbp98_philosophy}</p>
          ) : null}
          {dashboard.tehgbp98_vision ? (
            <p className="mt-2 text-sm italic text-amber-800">{dashboard.tehgbp98_vision}</p>
          ) : null}
          {dashboard.tehgbp98_abos_principle ? (
            <p className="mt-2 text-xs text-amber-800">{dashboard.tehgbp98_abos_principle}</p>
          ) : null}
          {dashboard.tehgbp98_distinction_note ? (
            <p className="mt-2 text-xs text-amber-700">{dashboard.tehgbp98_distinction_note}</p>
          ) : null}
          {dashboard.tehgbp98_vision_phrases && dashboard.tehgbp98_vision_phrases.length > 0 ? (
            <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-amber-800">
              {dashboard.tehgbp98_vision_phrases.slice(0, 4).map((phrase) => (
                <li key={phrase}>{phrase}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.implementation_blueprint_phase65 ? (
        <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
          <h2 className="text-sm font-semibold text-teal-900">{labels.councilBlueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-teal-700">
            {dashboard.implementation_blueprint_phase65.title ?? labels.blueprintPhase65}
            {dashboard.implementation_blueprint_phase65.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase65.engine_phase}`
              : ""}
          </p>
          {dashboard.cecbp_mission ? (
            <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.cecbp_mission}</p>
          ) : null}
          {dashboard.cecbp_philosophy ? (
            <p className="mt-2 text-sm text-teal-900">{dashboard.cecbp_philosophy}</p>
          ) : null}
          {dashboard.cecbp_abos_principle ? (
            <p className="mt-2 text-xs text-teal-800">{dashboard.cecbp_abos_principle}</p>
          ) : null}
          {dashboard.cecbp_distinction_note ? (
            <p className="mt-2 text-xs text-teal-700">{dashboard.cecbp_distinction_note}</p>
          ) : null}
          {dashboard.cecbp_vision_phrases && dashboard.cecbp_vision_phrases.length > 0 ? (
            <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-teal-800">
              {dashboard.cecbp_vision_phrases.slice(0, 4).map((phrase) => (
                <li key={phrase}>{phrase}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.implementation_blueprint_phase54 ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.blueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">
            {dashboard.implementation_blueprint_phase54.title ?? labels.blueprintPhase54}
            {dashboard.implementation_blueprint_phase54.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase54.engine_phase}`
              : ""}
          </p>
          {dashboard.escgbp_mission ? (
            <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.escgbp_mission}</p>
          ) : null}
          {dashboard.escgbp_philosophy ? (
            <p className="mt-2 text-sm text-violet-900">{dashboard.escgbp_philosophy}</p>
          ) : null}
          {dashboard.escgbp_abos_principle ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.escgbp_abos_principle}</p>
          ) : null}
          {dashboard.escgbp_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.escgbp_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.critical_prohibition_note ? (
          <p className="mt-2 text-xs font-medium text-rose-800">{dashboard.critical_prohibition_note}</p>
        ) : null}
        {dashboard.human_agency_note ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.human_agency_note}</p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      {governanceSummary ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.governanceSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: labels.approvedUseCases, value: governanceSummary.approved_use_cases },
              { label: labels.proposedUseCases, value: governanceSummary.proposed_use_cases },
              { label: labels.highRiskActive, value: governanceSummary.high_risk_active },
              { label: labels.governanceHealth, value: governanceSummary.governance_health },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className={`mt-1 text-lg font-semibold capitalize ${badgeClass(String(item.value ?? ""))} inline-block rounded px-2`}>
                  {String(item.value ?? "—")}
                </p>
              </div>
            ))}
          </div>
          {governanceSummary.summary_text ? (
            <p className="mt-2 text-xs text-gray-500">{governanceSummary.summary_text}</p>
          ) : null}
        </section>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.summary}</p>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}

      {dashboard.trust_ethics_governance_engagement_summary ? (
        <section className="rounded-xl border border-amber-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustGovernanceEngagementSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: labels.approvedUseCases, value: dashboard.trust_ethics_governance_engagement_summary.approved_use_cases },
              { label: labels.proposedUseCases, value: dashboard.trust_ethics_governance_engagement_summary.proposed_use_cases },
              { label: labels.overdueReviews, value: dashboard.trust_ethics_governance_engagement_summary.overdue_ethics_reviews },
              { label: labels.highRiskActive, value: dashboard.trust_ethics_governance_engagement_summary.high_risk_active },
              { label: labels.recentAuditEvents, value: dashboard.trust_ethics_governance_engagement_summary.recent_ethics_audit_events },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-gray-800">{String(item.value ?? "—")}</p>
              </div>
            ))}
          </div>
          {dashboard.trust_ethics_governance_engagement_summary.summary_text ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.trust_ethics_governance_engagement_summary.summary_text}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.tehgbp98_objectives && dashboard.tehgbp98_objectives.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustGovernanceObjectives}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dashboard.tehgbp98_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.ethical_questions ? (
        <GuidingQuestionsSection title={labels.ethicalQuestions} data={dashboard.ethical_questions} />
      ) : null}

      {dashboard.governance_principles ? (
        <JsonSection title={labels.governancePrinciples} data={dashboard.governance_principles} />
      ) : null}

      {dashboard.human_in_the_loop ? (
        <JsonSection title={labels.humanInTheLoop} data={dashboard.human_in_the_loop} />
      ) : null}

      {dashboard.companion_transparency ? (
        <JsonSection title={labels.companionTransparency} data={dashboard.companion_transparency} />
      ) : null}

      {dashboard.ethical_review_practices ? (
        <JsonSection title={labels.ethicalReviewPractices} data={dashboard.ethical_review_practices} />
      ) : null}

      {dashboard.tehgbp98_companion_guidance ? (
        <JsonSection title={labels.trustGovernanceCompanionGuidance} data={dashboard.tehgbp98_companion_guidance} />
      ) : null}

      {dashboard.tehgbp98_self_love_connection ? (
        <JsonSection title={labels.trustGovernanceSelfLoveConnection} data={dashboard.tehgbp98_self_love_connection} />
      ) : null}

      {dashboard.tehgbp98_leadership_connection ? (
        <JsonSection title={labels.leadershipConnection} data={dashboard.tehgbp98_leadership_connection} />
      ) : null}

      {dashboard.tehgbp98_trust_connection ? (
        <JsonSection title={labels.trustGovernanceTrustConnection} data={dashboard.tehgbp98_trust_connection} />
      ) : null}

      {dashboard.privacy_principles ? (
        <PrivacyPrinciplesSection title={labels.privacyPrinciples} data={dashboard.privacy_principles} />
      ) : null}

      {dashboard.tehgbp98_dogfooding ? (
        <JsonSection title={labels.trustGovernanceDogfooding} data={dashboard.tehgbp98_dogfooding} />
      ) : null}

      {dashboard.council_engagement_summary ? (
        <section className="rounded-xl border border-teal-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.councilEngagementSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: labels.approvedUseCases, value: dashboard.council_engagement_summary.approved_use_cases },
              { label: labels.proposedUseCases, value: dashboard.council_engagement_summary.proposed_use_cases },
              { label: labels.overdueReviews, value: dashboard.council_engagement_summary.overdue_ethics_reviews },
              { label: labels.recentAuditEvents, value: dashboard.council_engagement_summary.recent_ethics_audit_events },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-gray-800">{String(item.value ?? "—")}</p>
              </div>
            ))}
          </div>
          {dashboard.council_engagement_summary.summary_text ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.council_engagement_summary.summary_text}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.cecbp_objectives && dashboard.cecbp_objectives.length > 0 ? (
        <section className="rounded-xl border border-teal-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.councilObjectives}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dashboard.cecbp_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.council_responsibilities ? (
        <JsonSection title={labels.councilResponsibilities} data={dashboard.council_responsibilities} />
      ) : null}

      {dashboard.guiding_questions ? (
        <GuidingQuestionsSection title={labels.guidingQuestions} data={dashboard.guiding_questions} />
      ) : null}

      {dashboard.representation_principles ? (
        <JsonSection title={labels.representationPrinciples} data={dashboard.representation_principles} />
      ) : null}

      {dashboard.companion_philosophy_reviews ? (
        <JsonSection title={labels.companionPhilosophyReviews} data={dashboard.companion_philosophy_reviews} />
      ) : null}

      {dashboard.cecbp_community_feedback ? (
        <JsonSection title={labels.communityFeedback} data={dashboard.cecbp_community_feedback} />
      ) : null}

      {dashboard.cecbp_self_love_connection ? (
        <JsonSection title={labels.councilSelfLoveConnection} data={dashboard.cecbp_self_love_connection} />
      ) : null}

      {dashboard.cecbp_trust_connection ? (
        <JsonSection title={labels.councilTrustConnection} data={dashboard.cecbp_trust_connection} />
      ) : null}

      {dashboard.cecbp_dogfooding ? (
        <JsonSection title={labels.councilDogfooding} data={dashboard.cecbp_dogfooding} />
      ) : null}

      {dashboard.escgbp_objectives && dashboard.escgbp_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dashboard.escgbp_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_principles ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionPrinciples}</h3>
          {dashboard.companion_principles.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.companion_principles.principle}</p>
          ) : null}
          {dashboard.companion_principles.qualities && dashboard.companion_principles.qualities.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
              {dashboard.companion_principles.qualities.map((q) => <li key={q}>{q}</li>)}
            </ul>
          ) : null}
          {dashboard.companion_principles.companion_examples &&
          dashboard.companion_principles.companion_examples.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.companion_principles.companion_examples.map((ex) => (
                <CompanionExampleCard key={ex.key ?? ex.example} example={ex} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.autonomy_principles ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.autonomyPrinciples}</h3>
          {dashboard.autonomy_principles.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.autonomy_principles.principle}</p>
          ) : null}
          {dashboard.autonomy_principles.levels && dashboard.autonomy_principles.levels.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.autonomy_principles.levels.map((level) => (
                <AutonomyLevelCard key={level.key ?? level.label} level={level} labels={labels} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.emotional_safety ? (
        <PrincipleSection title={labels.emotionalSafety} data={dashboard.emotional_safety} />
      ) : null}

      {dashboard.data_ethics ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dataEthics}</h3>
          {dashboard.data_ethics.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.data_ethics.principle}</p>
          ) : null}
          {dashboard.data_ethics.required_disclosure && dashboard.data_ethics.required_disclosure.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.data_ethics.required_disclosure.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
          {dashboard.data_ethics.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.data_ethics.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.explainability_requirements && (
        <JsonSection title={labels.explainabilityRequirements} data={dashboard.explainability_requirements} />
      )}

      {dashboard.prohibited_examples && dashboard.prohibited_examples.length > 0 && (
        <JsonSection title={labels.prohibitedExamples} data={dashboard.prohibited_examples} />
      )}

      {dashboard.approved_use_cases && dashboard.approved_use_cases.length > 0 && (
        <UseCaseSection title={labels.approvedUseCases} useCases={dashboard.approved_use_cases} labels={labels}
          onRestrict={(id) => void useCaseAction(id, "restrict")} busyId={busyId} showRestrict />
      )}

      {dashboard.proposed_use_cases && dashboard.proposed_use_cases.length > 0 && (
        <UseCaseSection title={labels.proposedUseCases} useCases={dashboard.proposed_use_cases} labels={labels}
          onApprove={(id) => void useCaseAction(id, "approve")} busyId={busyId} showApprove />
      )}

      {dashboard.restricted_use_cases && dashboard.restricted_use_cases.length > 0 && (
        <UseCaseSection title={labels.restrictedUseCases} useCases={dashboard.restricted_use_cases} labels={labels}
          onApprove={(id) => void useCaseAction(id, "approve")} busyId={busyId} showApprove />
      )}

      {dashboard.organizational_governance ? (
        <JsonSection title={labels.organizationalGovernance} data={dashboard.organizational_governance} />
      ) : null}

      {dashboard.companion_evolution_reviews ? (
        <JsonSection title={labels.companionEvolutionReviews} data={dashboard.companion_evolution_reviews} />
      ) : null}

      {dashboard.escgbp_trust_connection ? (
        <JsonSection title={labels.trustConnection} data={dashboard.escgbp_trust_connection} />
      ) : null}

      {dashboard.review_schedules && dashboard.review_schedules.length > 0 && (
        <JsonSection title={labels.reviewSchedules} data={dashboard.review_schedules} />
      )}

      {dashboard.oversight_trends && (
        <JsonSection title={labels.oversightTrends} data={dashboard.oversight_trends} />
      )}

      {dashboard.tehgbp98_success_criteria && dashboard.tehgbp98_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustGovernanceSuccessCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.tehgbp98_success_criteria.map((criterion) => (
              <SuccessCriterionRow key={criterion.key ?? criterion.label} criterion={criterion} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.cecbp_success_criteria && dashboard.cecbp_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-teal-100 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.councilSuccessCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.cecbp_success_criteria.map((criterion) => (
              <SuccessCriterionRow key={criterion.key ?? criterion.label} criterion={criterion} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.escgbp_success_criteria && dashboard.escgbp_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.escgbp_success_criteria.map((criterion) => (
              <SuccessCriterionRow key={criterion.key ?? criterion.label} criterion={criterion} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.integration_notes && (
        <JsonSection title={labels.integrationNotes} data={dashboard.integration_notes} />
      )}
    </div>
  );
}

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
      <p className="font-medium text-gray-800">
        {objective.emoji ? `${objective.emoji} ` : ""}{objective.label}
      </p>
      {objective.description ? <p className="mt-1 text-xs text-gray-500">{objective.description}</p> : null}
    </div>
  );
}

function CompanionExampleCard({ example }: { example: CompanionExample }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
      {example.scenario ? <p className="text-xs font-medium uppercase text-gray-500">{example.scenario}</p> : null}
      <p className="mt-1 text-gray-700">{example.example ?? example.text}</p>
    </div>
  );
}

function AutonomyLevelCard({ level, labels }: { level: AutonomyLevel; labels: Record<string, string> }) {
  const isCritical = level.trust_action_level === 4;
  return (
    <div className={`rounded-lg border p-3 text-sm ${isCritical ? "border-rose-200 bg-rose-50" : "border-gray-100 bg-gray-50"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-gray-800">{level.label}</span>
        {level.autonomy_tier ? (
          <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(level.autonomy_tier)}`}>
            {level.autonomy_tier}
          </span>
        ) : null}
      </div>
      {level.description ? <p className="mt-1 text-xs text-gray-600">{level.description}</p> : null}
      {isCritical ? <p className="mt-1 text-xs font-medium text-rose-700">{labels.criticalNote}</p> : null}
    </div>
  );
}

function SuccessCriterionRow({ criterion }: { criterion: BlueprintSuccessCriterion }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className={criterion.met ? "text-emerald-600" : "text-gray-400"} aria-hidden>
        {criterion.met ? "✓" : "○"}
      </span>
      <div>
        <span className="text-gray-800">{criterion.label}</span>
        {criterion.note ? <p className="text-xs text-gray-500">{criterion.note}</p> : null}
      </div>
    </li>
  );
}

function PrincipleSection({ title, data }: { title: string; data: { principle?: string; must_avoid?: string[]; must_encourage?: string[] } }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {data.principle ? <p className="mt-1 text-xs text-gray-500">{data.principle}</p> : null}
      {data.must_avoid && data.must_avoid.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium text-rose-700">Avoid</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
            {data.must_avoid.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
      {data.must_encourage && data.must_encourage.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium text-emerald-700">Encourage</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
            {data.must_encourage.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function UseCaseSection({
  title, useCases, labels, onApprove, onRestrict, busyId, showApprove, showRestrict,
}: {
  title: string;
  useCases: AiUseCaseRecord[];
  labels: Record<string, string>;
  onApprove?: (id: string) => void;
  onRestrict?: (id: string) => void;
  busyId: string | null;
  showApprove?: boolean;
  showRestrict?: boolean;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-3">
        {useCases.map((uc) => (
          <div key={uc.id} className="rounded-lg border border-gray-200 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-gray-800">{uc.use_case_name}</span>
              <div className="flex gap-1">
                <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(uc.risk_level)}`}>
                  {uc.risk_level}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(uc.status)}`}>
                  {uc.status}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 capitalize">{uc.category?.replace(/_/g, " ")}</p>
            {uc.risk_level === "critical" ? (
              <p className="mt-1 text-xs text-rose-700">{labels.criticalNote}</p>
            ) : (
              <div className="mt-2 flex gap-2">
                {showApprove && uc.id && onApprove && (
                  <button type="button" disabled={busyId === uc.id}
                    onClick={() => onApprove(uc.id!)}
                    className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50">
                    {labels.approve}
                  </button>
                )}
                {showRestrict && uc.id && onRestrict && (
                  <button type="button" disabled={busyId === uc.id}
                    onClick={() => onRestrict(uc.id!)}
                    className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-800 disabled:opacity-50">
                    {labels.restrict}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function GuidingQuestionsSection({
  title,
  data,
}: {
  title: string;
  data: { principle?: string; questions?: CompanionExample[] };
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {data.principle ? <p className="mt-1 text-xs text-gray-500">{data.principle}</p> : null}
      {data.questions && data.questions.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.questions.map((q) => (
            <div key={q.key ?? q.question} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
              <p className="font-medium text-gray-800">
                {q.emoji ? `${q.emoji} ` : ""}{q.key?.replace(/_/g, " ")}
              </p>
              {q.question ? <p className="mt-1 text-xs text-gray-600">{q.question}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function PrivacyPrinciplesSection({
  title,
  data,
}: {
  title: string;
  data: { principle?: string; never?: string[]; always?: string[] };
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {data.principle ? <p className="mt-1 text-xs text-gray-500">{data.principle}</p> : null}
      {data.never && data.never.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium text-rose-700">Never</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
            {data.never.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
      {data.always && data.always.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium text-emerald-700">Always</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
            {data.always.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function JsonSection({ title, data }: { title: string; data: unknown }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
