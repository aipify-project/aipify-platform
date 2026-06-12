"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseTrustReputationEngineDashboard,
  type CompanionExample,
  type OrganizationTrustProfile,
  type RelationshipObjective,
  type RelationshipPrinciple,
  type TrustReputationEngineDashboard,
} from "@/lib/aipify/trust-reputation-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: RelationshipObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function PrincipleCard({ principle }: { principle: RelationshipPrinciple }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{principle.label}</span>
      {principle.description ? <p className="mt-1 text-xs text-gray-600">{principle.description}</p> : null}
    </div>
  );
}

function CompanionExampleCard({ example }: { example: CompanionExample }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
      {example.scenario ? <p className="text-xs font-medium text-emerald-900">{example.scenario}</p> : null}
      {example.example ? <p className="mt-1 text-xs text-emerald-800">{example.example}</p> : null}
    </div>
  );
}

export function TrustReputationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<TrustReputationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/trust-reputation-engine/dashboard");
    if (res.ok) setDashboard(parseTrustReputationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const profileAction = async (payload: Record<string, unknown>) => {
    setActionError(null);
    const res = await fetch("/api/aipify/trust-reputation-engine/profiles", {
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

  const revokeTrust = async (profile: OrganizationTrustProfile) => {
    if (!profile.id) return;
    setBusyId(profile.id);
    await profileAction({ action: "revoke", profile_id: profile.id, reason: labels.revokeDefaultReason });
    setBusyId(null);
  };

  const approveExpansion = async (profile: OrganizationTrustProfile) => {
    if (!profile.id) return;
    setBusyId(profile.id);
    await profileAction({ action: "review_expansion", profile_id: profile.id, approved: true });
    setBusyId(null);
  };

  const rejectExpansion = async (profile: OrganizationTrustProfile) => {
    if (!profile.id) return;
    setBusyId(profile.id);
    await profileAction({ action: "review_expansion", profile_id: profile.id, approved: false });
    setBusyId(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/trust-reputation-engine/export", {
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

  const summary = dashboard.summary ?? dashboard.executive_summary ?? {};
  const sections = dashboard.sections ?? {};
  const trustProfiles = sections.trust_profiles ?? [];
  const trustTrends = sections.trust_trends ?? [];
  const trustedWorkflows = sections.trusted_workflows ?? [];
  const approvalQuality = sections.approval_quality ?? [];
  const reputationIndicators = sections.reputation_indicators ?? [];
  const engagement = dashboard.engagement_summary;
  const blueprintLinks =
    dashboard.phase116_integration_links ??
    dashboard.companion_integration_links ??
    dashboard.blueprint_integration_links ??
    [];

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
        <p className="mt-2 text-xs text-emerald-700">{labels.distinctionNote}</p>
        {dashboard.implementation_blueprint?.phase ? (
          <p className="mt-1 text-xs text-emerald-600">
            {dashboard.implementation_blueprint.phase}
            {dashboard.implementation_blueprint.engine_phase ? ` · ${dashboard.implementation_blueprint.engine_phase}` : ""}
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
        {dashboard.blueprint_distinction_note ? (
          <p className="mt-2 text-xs text-emerald-700">{dashboard.blueprint_distinction_note}</p>
        ) : null}
        {dashboard.companion_relationship_trust_note ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.companion_relationship_trust_note}</p>
        ) : null}
        {dashboard.trust_reputation_relationship_note ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.trust_reputation_relationship_note}</p>
        ) : null}
      </section>

      {dashboard.phase116_objectives && dashboard.phase116_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase116Objectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.phase116_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trust_framework_dimensions && dashboard.trust_framework_dimensions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.trustFrameworkDimensions}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.trust_framework_dimensions.map((dimension) => (
              <ObjectiveCard key={dimension.key ?? dimension.label} objective={dimension} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.relationship_health_categories && dashboard.relationship_health_categories.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.relationshipHealthCategories}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.relationship_health_categories.map((category) => (
              <ObjectiveCard key={category.key ?? category.label} objective={category} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.reputation_profile_types && dashboard.reputation_profile_types.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.reputationProfileTypes}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.reputation_profile_types.map((profile) => (
              <ObjectiveCard key={profile.key ?? profile.label} objective={profile} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trust_insights_questions && dashboard.trust_insights_questions.length > 0 ? (
        <section className="rounded-xl border border-blue-100 bg-blue-50/40 p-6">
          <h3 className="text-sm font-semibold">{labels.trustInsightsQuestions}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.trust_insights_questions.map((item) => (
              <li key={item.key ?? item.question} className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium text-blue-900">{item.question}</span>
                {item.intent ? <p className="mt-1 text-blue-700">{item.intent}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.early_warning_signals && dashboard.early_warning_signals.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.earlyWarningSignals}</h3>
          <p className="mt-1 text-xs">{labels.earlyWarningNote}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.early_warning_signals.map((signal) => (
              <div key={signal.key ?? signal.label} className="rounded border border-amber-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium">{signal.label}</span>
                {signal.description ? <p className="mt-1 text-amber-800">{signal.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.recognition_types?.types && dashboard.recognition_types.types.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.recognitionTypes}</h3>
          {dashboard.recognition_types.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.recognition_types.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.recognition_types.types.map((type) => (
              <ObjectiveCard key={type.key ?? type.label} objective={type} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trust_recovery_framework && dashboard.trust_recovery_framework.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.trustRecoveryFramework}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.trust_recovery_framework.map((support) => (
              <ObjectiveCard key={support.key ?? support.label} objective={support} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_responsibilities?.may && dashboard.companion_responsibilities.may.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.companionResponsibilities}</h3>
          <p className="mt-1 text-xs font-medium">{labels.companionMay}</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {dashboard.companion_responsibilities.may.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {dashboard.companion_responsibilities.must_avoid &&
          dashboard.companion_responsibilities.must_avoid.length > 0 ? (
            <>
              <p className="mt-3 text-xs font-medium">{labels.companionMustAvoid}</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-violet-700">
                {dashboard.companion_responsibilities.must_avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      {dashboard.growth_partner_trust_model?.areas && dashboard.growth_partner_trust_model.areas.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.growthPartnerTrustModel}</h3>
          {dashboard.growth_partner_trust_model.principle ? (
            <p className="mt-2 text-gray-700">{dashboard.growth_partner_trust_model.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.growth_partner_trust_model.areas.map((area) => (
              <ObjectiveCard key={area.key ?? area.label} objective={area} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.enterprise_trust_governance && dashboard.enterprise_trust_governance.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.enterpriseTrustGovernance}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.enterprise_trust_governance.map((config) => (
              <ObjectiveCard key={config.key ?? config.label} objective={config} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.privacy_ethics_principles && dashboard.privacy_ethics_principles.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.privacyEthicsPrinciples}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.privacy_ethics_principles.map((principle) => (
              <PrincipleCard key={principle.key ?? principle.label} principle={principle} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.self_love_in_relationships?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveInRelationships}</h3>
          <p className="mt-2">{dashboard.self_love_in_relationships.principle}</p>
          {dashboard.self_love_in_relationships.practices &&
          dashboard.self_love_in_relationships.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_in_relationships.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_adaptation && dashboard.companion_adaptation.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.companionAdaptation}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.companion_adaptation.map((example) => (
              <CompanionExampleCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.limitation_principles && dashboard.limitation_principles.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.limitationPrinciples}</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-gray-600">
            {dashboard.limitation_principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(dashboard.phase116_success_criteria) && dashboard.phase116_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.phase116SuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.phase116_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              return (
                <li key={item.key ?? label} className="flex items-start gap-2">
                  <span className={met ? "text-emerald-600" : "text-gray-400"}>{met ? "✓" : "○"}</span>
                  <span>
                    {label}
                    {item.note ? <span className="block text-xs text-gray-500">{item.note}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.phase116_success_metrics && dashboard.phase116_success_metrics.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.phase116SuccessMetrics}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.phase116_success_metrics.map((metric) => (
              <ObjectiveCard key={metric.key ?? metric.label} objective={metric} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_objectives && dashboard.companion_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.companionObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.companion_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trust_principles && dashboard.trust_principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.trustPrinciples}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.trust_principles.map((principle) => (
              <PrincipleCard key={principle.key ?? principle.label} principle={principle} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.avoid_practices && dashboard.avoid_practices.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.avoidPractices}</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-xs">
            {dashboard.avoid_practices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.relationship_continuity && dashboard.relationship_continuity.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.relationshipContinuity}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.relationship_continuity.map((example) => (
              <CompanionExampleCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_reliability?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.companionReliability}</h3>
          <p className="mt-2 text-gray-700">{dashboard.companion_reliability.principle}</p>
          {dashboard.companion_reliability.indicators && dashboard.companion_reliability.indicators.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.companion_reliability.indicators.map((indicator) => (
                <ObjectiveCard key={indicator.key ?? indicator.label} objective={indicator} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.boundary_principles?.should_support && dashboard.boundary_principles.should_support.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.boundaryPrinciples}</h3>
          {dashboard.boundary_principles.principle ? (
            <p className="mt-2">{dashboard.boundary_principles.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-xs">
            {dashboard.boundary_principles.should_support.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {dashboard.boundary_principles.should_avoid && dashboard.boundary_principles.should_avoid.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-violet-700">
              {dashboard.boundary_principles.should_avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_signal_indicators?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustSignalIndicators}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_signal_indicators.principle}</p>
          {dashboard.trust_signal_indicators.users_should_see &&
          dashboard.trust_signal_indicators.users_should_see.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_signal_indicators.users_should_see.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.organizational_trust?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.organizationalTrust}</h3>
          <p className="mt-2 text-gray-700">{dashboard.organizational_trust.principle}</p>
          {dashboard.organizational_trust.pillars && dashboard.organizational_trust.pillars.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {dashboard.organizational_trust.pillars.map((pillar) => (
                <ObjectiveCard key={pillar.key ?? pillar.label} objective={pillar} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_self_love?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.companionSelfLove}</h3>
          <p className="mt-2">{dashboard.companion_self_love.principle}</p>
          {dashboard.companion_self_love.practices && dashboard.companion_self_love.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.companion_self_love.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.activeProfiles}: {engagement.active_profiles ?? 0}</span>
            <span>{labels.trustedProfiles}: {engagement.trusted_profiles ?? 0}</span>
            <span>{labels.underReviewProfiles}: {engagement.under_review_profiles ?? 0}</span>
            <span>{labels.recentSignals}: {engagement.recent_signals_30d ?? 0}</span>
            <span>{labels.outcomesTotal}: {engagement.outcomes_total ?? 0}</span>
            <span>{labels.signalsLast90d}: {engagement.signals_last_90d ?? 0}</span>
            <span>{labels.reliabilitySignals}: {engagement.reliability_signals_90d ?? 0}</span>
            <span>{labels.continuitySignals}: {engagement.continuity_signals_30d ?? 0}</span>
            <span>{labels.relationshipSignals}: {engagement.relationship_signals_90d ?? 0}</span>
            <span>{labels.warningSignals}: {engagement.warning_signals_30d ?? 0}</span>
          </div>
        </section>
      ) : null}

      {dashboard.relationship_objectives && dashboard.relationship_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.relationshipObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.relationship_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.relationship_principles && dashboard.relationship_principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.relationshipPrinciples}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.relationship_principles.map((principle) => (
              <PrincipleCard key={principle.key ?? principle.label} principle={principle} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.example_phrases && dashboard.example_phrases.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.examplePhrases}</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {dashboard.example_phrases.map((item) => (
              <li key={item.key ?? item.phrase} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs italic">
                {item.phrase}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_examples && dashboard.companion_examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.companionExamples}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.companion_examples.map((example) => (
              <CompanionExampleCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trust_signals?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustSignals}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_signals.principle}</p>
          {dashboard.trust_signals.users_should_see && dashboard.trust_signals.users_should_see.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_signals.users_should_see.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.blueprint_boundaries?.should_avoid && dashboard.blueprint_boundaries.should_avoid.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.blueprintBoundaries}</h3>
          {dashboard.blueprint_boundaries.principle ? (
            <p className="mt-2">{dashboard.blueprint_boundaries.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-xs">
            {dashboard.blueprint_boundaries.should_avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.practices && dashboard.self_love_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.companion_success_criteria) && dashboard.companion_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.companionSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.companion_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              return (
                <li key={item.key ?? label} className="flex items-start gap-2">
                  <span className={met ? "text-emerald-600" : "text-gray-400"}>{met ? "✓" : "○"}</span>
                  <span>
                    {label}
                    {item.note ? <span className="block text-xs text-gray-500">{item.note}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              return (
                <li key={item.key ?? label} className="flex items-start gap-2">
                  <span className={met ? "text-emerald-600" : "text-gray-400"}>{met ? "✓" : "○"}</span>
                  <span>
                    {label}
                    {item.note ? <span className="block text-xs text-gray-500">{item.note}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

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
          <div><dt className="text-gray-500">{labels.activeProfiles}</dt><dd>{String(summary.active_profiles ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.trustedProfiles}</dt><dd>{String(summary.trusted_profiles ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.underReviewProfiles}</dt><dd>{String(summary.under_review_profiles ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.avgTrustScore}</dt><dd>{String(summary.avg_trust_score ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.recentSignals}</dt><dd>{String(summary.recent_signals ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.entityTypes}</dt><dd>{String(summary.entity_type_count ?? 0)}</dd></div>
        </dl>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      )}

      {trustTrends.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.trustTrends}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {trustTrends.map((t) => (
              <li key={String(t.entity_type)} className="rounded border border-emerald-100 bg-emerald-50/30 p-3">
                <div className="font-medium">{String(t.entity_type)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {labels.avgScore}: {String(t.avg_score ?? 0)} · {labels.profileCount}: {String(t.profile_count ?? 0)} · {labels.trustedCount}: {String(t.trusted_count ?? 0)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {trustedWorkflows.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.trustedWorkflows}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(trustedWorkflows as OrganizationTrustProfile[]).map((profile) => (
              <li key={profile.id} className="rounded border border-emerald-100 p-3">
                <div className="font-medium">{String(profile.metadata?.label ?? profile.entity_type)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {profile.entity_type} · {labels.trustLevel}: {profile.trust_level} · {labels.trustScore}: {profile.trust_score}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {approvalQuality.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.approvalQuality}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {approvalQuality.map((item) => (
              <li key={String(item.signal_type)} className="rounded border border-gray-100 p-3">
                <div className="font-medium">{String(item.signal_type)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {labels.avgValue}: {String(item.avg_value ?? 0)} · {labels.signalCount}: {String(item.signal_count ?? 0)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {reputationIndicators.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.reputationIndicators}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {reputationIndicators.slice(0, 10).map((signal) => (
              <li key={signal.id} className="rounded border border-gray-100 p-2 text-xs text-gray-600">
                {signal.signal_type}: {signal.signal_value}
              </li>
            ))}
          </ul>
        </section>
      )}

      {trustProfiles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.trustProfiles}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(trustProfiles as OrganizationTrustProfile[]).map((profile) => (
              <li key={profile.id} className="rounded border border-emerald-100 bg-emerald-50/30 p-3">
                <div className="font-medium">{String(profile.metadata?.label ?? profile.entity_type)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {profile.entity_type} · {labels.trustLevel}: {profile.trust_level} · {labels.trustScore}: {profile.trust_score} · {labels.status}: {profile.status}
                </div>
                {profile.id && profile.status === "under_review" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                      disabled={busyId === profile.id}
                      onClick={() => void approveExpansion(profile)}
                    >
                      {labels.approveExpansion}
                    </button>
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                      disabled={busyId === profile.id}
                      onClick={() => void rejectExpansion(profile)}
                    >
                      {labels.rejectExpansion}
                    </button>
                  </div>
                )}
                {profile.id && profile.status === "active" && (
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === profile.id}
                    onClick={() => void revokeTrust(profile)}
                  >
                    {labels.revokeTrust}
                  </button>
                )}
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
