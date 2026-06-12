"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEcosystemGovernanceDashboard,
  type AbosSuccessCriterion,
  type AuditReview,
  type BlueprintObjective,
  type CertificationProgram,
  type CertificationRecord,
  type EcosystemGovernanceDashboard,
  type GpCertificationLevel,
  type IntegrationLink,
  type PolicyEntry,
  type TrustBadge,
} from "@/lib/aipify/ecosystem-governance";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-emerald-900">{objective.description}</p>
      ) : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: AbosSuccessCriterion;
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

function badgeClass(value?: string) {
  switch (value) {
    case "certified":
    case "maintenance":
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "in_review":
    case "scheduled":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "important":
    case "critical":
    case "review_triggered":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ProgramRow({ program }: { program: CertificationProgram }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{program.title ?? program.program_key}</span>
        {program.status ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(program.status)}`}>{program.status}</span>
        ) : null}
      </div>
      {program.cross_link_route ? (
        <Link href={program.cross_link_route} className="mt-1 inline-block text-xs text-emerald-700">
          {program.cross_link_route}
        </Link>
      ) : null}
    </li>
  );
}

function CertificationRow({ record }: { record: CertificationRecord }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{record.participant_key}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(record.status)}`}>
          {record.status?.replace(/_/g, " ")}
        </span>
      </div>
      {record.certification_level_label ? (
        <p className="mt-1 text-xs text-gray-600">{record.certification_level_label}</p>
      ) : null}
      {record.progress_pct != null ? (
        <p className="mt-1 text-xs text-gray-500">{record.progress_pct}%</p>
      ) : null}
    </li>
  );
}

function AuditRow({ review }: { review: AuditReview }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{review.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(review.priority)}`}>
          {review.review_type?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{review.summary}</p>
      {review.support_not_punishment_note ? (
        <p className="mt-1 text-xs italic text-gray-500">{review.support_not_punishment_note}</p>
      ) : null}
    </li>
  );
}

function PolicyRow({ policy }: { policy: PolicyEntry }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <span className="font-medium">{policy.title}</span>
      <p className="mt-1 text-xs text-gray-600">{policy.summary}</p>
    </li>
  );
}

function BadgeRow({ badge }: { badge: TrustBadge }) {
  return (
    <li className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
      <span className="font-medium">{badge.title}</span>
      <p className="mt-1 text-xs text-gray-600">{badge.summary}</p>
    </li>
  );
}

function GpLevelRow({ level }: { level: GpCertificationLevel }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span>{level.label}</span>
      {level.maps_to_tier_label ? (
        <span className="text-xs text-gray-500">{level.maps_to_tier_label}</span>
      ) : null}
    </li>
  );
}

export function EcosystemGovernanceDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<EcosystemGovernanceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/ecosystem-governance/dashboard");
    if (res.ok) setDashboard(parseEcosystemGovernanceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.egcbp119_cross_links ?? dashboard.integration_links ?? [];
  const limitationItems = dashboard.ecosystem_governance_limitation_principles?.must_avoid ?? [];
  const selfLovePractices = dashboard.self_love_in_governance?.practices ?? [];
  const companionExamples = (dashboard.ecosystem_governance_companion_adaptation?.examples ?? []) as Array<{
    emoji?: string;
    prompt?: string;
    consideration?: string;
  }>;
  const ciActivities = (dashboard.continuous_improvement_meta?.activities ?? []) as string[];
  const securityRequirements = (dashboard.security_requirements_meta?.requirements ?? []) as string[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/marketplace-governance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.marketplaceGovernance}
        </Link>
        <Link href="/app/partners" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.partnerCertification}
        </Link>
        <Link href="/app/companion-marketplace" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.companionMarketplace}
        </Link>
        <Link href="/app/trust-reputation-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.trustReputation}
        </Link>
        <Link href="/app/continuous-improvement-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.continuousImprovement}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
        </Link>
        <Link href="/app/settings/two-factor" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.twoFactorSettings}
        </Link>
        {integrationLinks.map((link) =>
          link.route ? (
            <Link
              key={link.route + (link.key ?? "")}
              href={link.route}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            >
              {link.label ?? link.route}
            </Link>
          ) : null,
        )}
      </div>

      <section className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint_phase119?.phase ? (
          <p className="mt-1 text-xs text-emerald-700">
            {dashboard.implementation_blueprint_phase119.phase}
            {dashboard.implementation_blueprint_phase119.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase119.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.ecosystem_governance_mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.ecosystem_governance_mission}</p>
        ) : null}
        {dashboard.ecosystem_governance_philosophy ?? dashboard.philosophy ? (
          <p className="mt-2 text-sm text-emerald-900">
            {dashboard.ecosystem_governance_philosophy ?? dashboard.philosophy}
          </p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-emerald-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.ecosystem_governance_vision ? (
          <p className="mt-2 text-xs italic text-emerald-800">{dashboard.ecosystem_governance_vision}</p>
        ) : null}
      </section>

      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-800">{labels.governanceMaturityScore}</p>
            <p className="text-3xl font-bold text-emerald-900">{dashboard.governance_maturity_score ?? 0}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-emerald-600">{labels.humanOversightRequired}</p>
            ) : null}
            {dashboard.voluntary_alignment_enabled ? (
              <p className="mt-1 text-xs text-emerald-600">{labels.voluntaryAlignment}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.certifiedParticipants}</span>
            <p className="text-xl font-semibold">{dashboard.certified_participants ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.certificationsInReview}</span>
            <p className="text-xl font-semibold">{dashboard.certifications_in_review ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.activeTrustBadges}</span>
            <p className="text-xl font-semibold">{dashboard.active_trust_badges ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.openAuditReviews}</span>
            <p className="text-xl font-semibold">{dashboard.open_audit_reviews ?? 0}</p>
          </div>
        </div>
      </div>

      {dashboard.ecosystem_governance_objectives?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.ecosystem_governance_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.governance_center_functions.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.governanceCenterFunctions}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.governance_center_functions.map((fn) => (
              <li key={String(fn.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(fn.label ?? fn.key)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.certification_programs.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.certificationPrograms}</h3>
          <ul className="space-y-2">
            {dashboard.certification_programs.map((program) => (
              <ProgramRow key={program.id ?? program.program_key} program={program} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.gp_certification_levels.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.gpCertificationLevels}</h3>
          <ul className="space-y-2">
            {dashboard.gp_certification_levels.map((level) => (
              <GpLevelRow key={level.key ?? level.label} level={level} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_assessment_areas.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.companionAssessmentAreas}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {dashboard.companion_assessment_areas.map((area) => (
              <li key={String(area.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(area.label ?? area.key)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.certification_records.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.certificationRecords}</h3>
          <ul className="space-y-2">
            {dashboard.certification_records.map((record) => (
              <CertificationRow key={record.id ?? record.participant_key} record={record} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.audit_reviews.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.auditReviews}</h3>
          <ul className="space-y-2">
            {dashboard.audit_reviews.map((review) => (
              <AuditRow key={review.id ?? review.title} review={review} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.policy_entries.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.policyLibrary}</h3>
          <ul className="space-y-2">
            {dashboard.policy_entries.map((policy) => (
              <PolicyRow key={policy.id ?? policy.policy_key} policy={policy} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.trust_badges.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.trustBadges}</h3>
          <ul className="space-y-2">
            {dashboard.trust_badges.map((badge) => (
              <BadgeRow key={badge.id ?? badge.badge_key} badge={badge} />
            ))}
          </ul>
        </section>
      ) : null}

      {ciActivities.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.continuousImprovement}</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {ciActivities.map((activity) => (
              <li key={activity} className="rounded-lg border border-gray-100 px-3 py-2 text-sm capitalize">
                {activity.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {securityRequirements.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.securityRequirements}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {securityRequirements.map((req) => (
              <li key={req} className="rounded-lg border border-gray-100 px-3 py-2 text-sm capitalize">
                {req.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {selfLovePractices.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.selfLoveInGovernance}</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {selfLovePractices.map((practice) => (
              <li key={practice} className="rounded border border-gray-100 px-3 py-2 capitalize">
                {practice.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {companionExamples.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.companionAdaptation}</h3>
          <ul className="space-y-2">
            {companionExamples.map((example) => (
              <li key={example.prompt} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span>{example.emoji ? `${example.emoji} ` : ""}{example.prompt}</span>
                {example.consideration ? (
                  <p className="mt-1 text-xs text-gray-500">{example.consideration}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {limitationItems.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.limitationPrinciples}</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {limitationItems.map((item) => (
              <li key={item} className="rounded border border-amber-100 bg-amber-50/40 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.ecosystem_governance_success_criteria?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="space-y-2">
            {dashboard.ecosystem_governance_success_criteria.map((criterion) => (
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

      {dashboard.privacy_note ? <p className="text-xs text-gray-500">{dashboard.privacy_note}</p> : null}
    </div>
  );
}
