"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSocialImpactPurposeDashboard,
  type AbosSuccessCriterion,
  type AlignmentSnapshot,
  type BlueprintObjective,
  type CompanionAdaptationExample,
  type ImpactIndicator,
  type InitiativeScaffold,
  type IntegrationLink,
  type CommunityInitiative,
  type ExecutiveImpactReview,
  type ImpactReport,
  type PurposeCommitment,
  type PurposeInitiative,
  type SocialImpactPurposeDashboard,
  type WellbeingProgram,
} from "@/lib/aipify/social-impact-purpose-engine";

type SocialImpactPurposeDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-emerald-900">{objective.description}</p> : null}
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
    case "active":
    case "fulfilled":
    case "strong":
    case "high":
      return "bg-emerald-100 text-emerald-800";
    case "planned":
    case "review":
    case "moderate":
    case "emerging":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "paused":
    case "low":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function InitiativeCard({ initiative }: { initiative: PurposeInitiative }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{initiative.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(initiative.status)}`}>
          {initiative.status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{initiative.summary}</p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
        <span>{initiative.initiative_type.replace(/_/g, " ")}</span>
        <span>{initiative.progress_pct}%</span>
        <span>{initiative.participation_count} participants</span>
      </div>
    </div>
  );
}

function CommitmentCard({ commitment }: { commitment: PurposeCommitment }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-emerald-900">{commitment.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(commitment.status)}`}>
          {commitment.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-emerald-800">{commitment.summary}</p>
      <p className="mt-1 text-xs text-emerald-700">
        {commitment.commitment_area.replace(/_/g, " ")} · {commitment.progress_pct}%
      </p>
    </div>
  );
}

function AlignmentRow({ snapshot }: { snapshot: AlignmentSnapshot }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{snapshot.alignment_dimension.replace(/_/g, " ")}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(snapshot.alignment_signal)}`}>
          {snapshot.alignment_signal.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{snapshot.reflection_summary}</p>
    </div>
  );
}

function IndicatorRow({ indicator }: { indicator: ImpactIndicator }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{indicator.indicator_type.replace(/_/g, " ")}</span>
        {indicator.trend_pct != null ? (
          <span className="text-xs text-teal-700">{indicator.trend_pct > 0 ? "+" : ""}{indicator.trend_pct}%</span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-teal-800">{indicator.summary}</p>
    </div>
  );
}

function CommunityInitiativeCard({ initiative }: { initiative: CommunityInitiative }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">{initiative.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(initiative.status)}`}>
          {initiative.status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{initiative.summary}</p>
      <p className="mt-1 text-xs text-sky-700">
        {initiative.initiative_type.replace(/_/g, " ")} · {initiative.participation_count} participants
      </p>
    </div>
  );
}

function WellbeingProgramCard({ program }: { program: WellbeingProgram }) {
  return (
    <div className="rounded-lg border border-rose-100 bg-rose-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-rose-900">{program.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(program.status)}`}>
          {program.status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-rose-800">{program.summary}</p>
      <p className="mt-1 text-xs text-rose-700">
        {program.program_type.replace(/_/g, " ")} · {program.adoption_count} adoption
      </p>
    </div>
  );
}

function ImpactReportCard({ report }: { report: ImpactReport }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{report.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(report.status)}`}>
          {report.status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{report.summary}</p>
      <p className="mt-1 text-xs text-indigo-700">{report.report_type.replace(/_/g, " ")}</p>
    </div>
  );
}

function ExecutiveReviewCard({ review }: { review: ExecutiveImpactReview }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-amber-900">{review.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(review.status)}`}>
          {review.status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-amber-800">{review.reflection_summary}</p>
      <p className="mt-1 text-xs text-amber-700">{review.review_dimension.replace(/_/g, " ")}</p>
    </div>
  );
}

function MetaListSection({
  title,
  meta,
  itemsKey,
}: {
  title: string;
  meta?: Record<string, unknown>;
  itemsKey: string;
}) {
  const items = Array.isArray(meta?.[itemsKey]) ? (meta[itemsKey] as Array<Record<string, unknown>>) : [];
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? (
        <p className="text-sm text-gray-600">{meta.principle}</p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
            <span className="font-medium text-gray-900">{String(item.label ?? item.key)}</span>
            {typeof item.description === "string" ? (
              <p className="mt-1 text-xs text-gray-600">{item.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SocialImpactPurposeDashboardPanel({ labels }: SocialImpactPurposeDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SocialImpactPurposeDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/social-impact-purpose-engine/dashboard");
    if (res.ok) setDashboard(parseSocialImpactPurposeDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.sipbp118_integration_links ?? dashboard.integration_links ?? [];
  const limitationItems = dashboard.social_impact_purpose_limitation_principles?.must_avoid ?? [];
  const companionExamples = dashboard.social_impact_purpose_companion_adaptation?.examples ?? [];
  const purposeComponents = Array.isArray(dashboard.purpose_center_meta?.components)
    ? (dashboard.purpose_center_meta.components as Array<Record<string, unknown>>)
    : [];
  const executiveMonitors = Array.isArray(dashboard.executive_purpose_dashboard_meta?.monitors)
    ? (dashboard.executive_purpose_dashboard_meta.monitors as Array<Record<string, unknown>>)
    : [];
  const phase149Links: IntegrationLink[] = dashboard.gisrb149_integration_links ?? [];
  const phase149Limitations = dashboard.gisrb149_companion_limitations ?? [];
  const impactCompanionExamples = Array.isArray(dashboard.impact_companion?.examples)
    ? (dashboard.impact_companion.examples as CompanionAdaptationExample[])
    : [];
  const executiveReviewDimensions = Array.isArray(dashboard.executive_impact_reviews_meta?.dimensions)
    ? (dashboard.executive_impact_reviews_meta.dimensions as Array<Record<string, unknown>>)
    : [];
  const globalImpactCapabilities = Array.isArray(dashboard.global_impact_center?.capabilities)
    ? (dashboard.global_impact_center.capabilities as Array<Record<string, unknown>>)
    : [];
  const phase149Sections = dashboard.phase149_sections;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/purpose-values-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.purposeValuesEngine}
        </Link>
        <Link href="/app/impact-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.impactEngine}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLoveEngine}
        </Link>
        <Link href="/app/gratitude-recognition-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.gratitudeRecognitionEngine}
        </Link>
        <Link href="/app/community" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.community}
        </Link>
        <Link href="/app/growth-partner-operations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.growthPartnerOperations}
        </Link>
        <Link href="/app/inclusion-humanity-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.inclusionHumanityEngine}
        </Link>
        <Link href="/app/ai-ethics-responsible-use-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aiEthicsEngine}
        </Link>
        <Link href="/app/global-knowledge-exchange-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.globalKnowledgeExchangeEngine}
        </Link>
        <Link href="/app/innovation-impact-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.innovationImpactEngine}
        </Link>
        <Link href="/app/ecosystem-governance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.ecosystemGovernance}
        </Link>
        <Link href="/app/organizational-health-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.organizationalHealthEngine}
        </Link>
        {phase149Links.map((link) =>
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
        {dashboard.implementation_blueprint_phase118?.phase ? (
          <p className="mt-1 text-xs text-emerald-700">
            {dashboard.implementation_blueprint_phase118.phase}
            {dashboard.implementation_blueprint_phase118.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase118.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.social_impact_purpose_mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.social_impact_purpose_mission}</p>
        ) : null}
        {dashboard.social_impact_purpose_philosophy ? (
          <p className="mt-2 text-sm text-emerald-900">{dashboard.social_impact_purpose_philosophy}</p>
        ) : null}
        {dashboard.social_impact_purpose_distinction_note ? (
          <p className="mt-2 text-xs text-emerald-700">{dashboard.social_impact_purpose_distinction_note}</p>
        ) : null}
        {dashboard.social_impact_purpose_vision ? (
          <p className="mt-2 text-xs italic text-emerald-800">{dashboard.social_impact_purpose_vision}</p>
        ) : null}
      </section>

      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-800">{labels.purposeCenter}</p>
            <p className="text-3xl font-bold text-emerald-900">{dashboard.avg_initiative_progress ?? 0}%</p>
            <p className="mt-1 text-sm text-emerald-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-emerald-600">{labels.humanOversightRequired}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.activeInitiatives}</span>
            <p className="font-semibold">{dashboard.active_initiatives ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.activeCommitments}</span>
            <p className="font-semibold">{dashboard.active_commitments ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.totalParticipation}</span>
            <p className="font-semibold">{dashboard.total_participation ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.impactIndicators}</span>
            <p className="font-semibold">{dashboard.impact_indicators_count ?? 0}</p>
          </div>
        </div>
      </div>

      {purposeComponents.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.purposeCenterComponents}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {purposeComponents.map((component) => (
              <div
                key={String(component.key)}
                className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm"
              >
                <span className="font-medium text-emerald-900">{String(component.label)}</span>
                {typeof component.description === "string" ? (
                  <p className="mt-1 text-xs text-emerald-800">{component.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.initiatives.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.socialImpactInitiatives}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dashboard.initiatives.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.initiative_type_scaffolds.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.initiativeTypes}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.initiative_type_scaffolds.map((scaffold: InitiativeScaffold) => (
              <div key={scaffold.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{scaffold.label}</span>
                {scaffold.description ? <p className="mt-1 text-xs text-gray-600">{scaffold.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.commitments.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.strategicCommitments}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dashboard.commitments.map((commitment) => (
              <CommitmentCard key={commitment.id} commitment={commitment} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection title={labels.employeeWellbeing} meta={dashboard.employee_wellbeing_meta} itemsKey="areas" />

      {dashboard.alignment_snapshots_list.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.purposeAlignment}</h2>
          {typeof dashboard.purpose_alignment_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.purpose_alignment_meta.principle}</p>
          ) : null}
          <div className="space-y-2">
            {dashboard.alignment_snapshots_list.map((snapshot) => (
              <AlignmentRow key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.impact_indicators.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.impactTracking}</h2>
          {typeof dashboard.impact_tracking_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.impact_tracking_meta.principle}</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.impact_indicators.map((indicator) => (
              <IndicatorRow key={indicator.id} indicator={indicator} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.growthPartnerParticipation}
        meta={dashboard.growth_partner_participation_meta}
        itemsKey="participation_types"
      />

      <MetaListSection
        title={labels.communityImpactPrograms}
        meta={dashboard.community_impact_programs_meta}
        itemsKey="program_types"
      />

      {executiveMonitors.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executivePurposeDashboard}</h2>
          {typeof dashboard.executive_purpose_dashboard_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.executive_purpose_dashboard_meta.principle}</p>
          ) : null}
          <ul className="grid gap-2 sm:grid-cols-2">
            {executiveMonitors.map((monitor) => (
              <li key={String(monitor.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(monitor.label)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.social_impact_purpose_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.social_impact_purpose_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {typeof dashboard.self_love_in_organizations_meta?.vision === "string" ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveInOrganizations}</h2>
          <p className="mt-2 text-sm text-rose-800">{dashboard.self_love_in_organizations_meta.vision}</p>
        </section>
      ) : null}

      {companionExamples.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionAdaptation}</h2>
          {dashboard.social_impact_purpose_companion_adaptation?.principle ? (
            <p className="text-sm text-gray-600">{dashboard.social_impact_purpose_companion_adaptation.principle}</p>
          ) : null}
          <div className="space-y-2">
            {companionExamples.map((example: CompanionAdaptationExample) => (
              <div key={example.key} className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                <span className="font-medium">
                  {example.emoji ? `${example.emoji} ` : ""}
                  {example.prompt}
                </span>
                {example.consideration ? (
                  <p className="mt-1 text-xs text-violet-800">{example.consideration}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.limitationPrinciples}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.social_impact_purpose_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.social_impact_purpose_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.social_impact_purpose_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.social_impact_purpose_privacy_note}</p>
      ) : null}

      <section className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
        <h2 className="text-sm font-semibold text-sky-900">{labels.phase149BlueprintTitle}</h2>
        {dashboard.implementation_blueprint_phase149?.phase ? (
          <p className="mt-1 text-xs text-sky-700">
            {dashboard.implementation_blueprint_phase149.phase}
            {dashboard.implementation_blueprint_phase149.era
              ? ` · ${dashboard.implementation_blueprint_phase149.era}`
              : ""}
          </p>
        ) : null}
        {dashboard.gisrb149_mission ? (
          <p className="mt-2 text-sm font-medium text-sky-900">{dashboard.gisrb149_mission}</p>
        ) : null}
        {dashboard.gisrb149_philosophy ? (
          <p className="mt-2 text-sm text-sky-900">{dashboard.gisrb149_philosophy}</p>
        ) : null}
        {dashboard.gisrb149_distinction_note ? (
          <p className="mt-2 text-xs text-sky-700">{dashboard.gisrb149_distinction_note}</p>
        ) : null}
        {dashboard.gisrb149_vision ? (
          <p className="mt-2 text-xs italic text-sky-800">{dashboard.gisrb149_vision}</p>
        ) : null}
        {dashboard.global_impact_social_responsibility_note ? (
          <p className="mt-2 text-xs text-sky-700">{dashboard.global_impact_social_responsibility_note}</p>
        ) : null}
      </section>

      {dashboard.gisrb149_engagement_summary ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-sky-600">{labels.communityInitiatives}</span>
            <p className="font-semibold">{dashboard.gisrb149_engagement_summary.community_initiatives ?? 0}</p>
          </div>
          <div className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-sky-600">{labels.wellbeingPrograms}</span>
            <p className="font-semibold">{dashboard.gisrb149_engagement_summary.wellbeing_programs ?? 0}</p>
          </div>
          <div className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-sky-600">{labels.impactReports}</span>
            <p className="font-semibold">{dashboard.gisrb149_engagement_summary.impact_reports ?? 0}</p>
          </div>
          <div className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-sky-600">{labels.executiveReviews}</span>
            <p className="font-semibold">{dashboard.gisrb149_engagement_summary.executive_reviews ?? 0}</p>
          </div>
        </div>
      ) : null}

      {globalImpactCapabilities.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.globalImpactCenter}</h2>
          {typeof dashboard.global_impact_center?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.global_impact_center.principle}</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {globalImpactCapabilities.map((capability) => (
              <div key={String(capability.key)} className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
                <span className="font-medium text-sky-900">{String(capability.label)}</span>
                {typeof capability.description === "string" ? (
                  <p className="mt-1 text-xs text-sky-800">{capability.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {phase149Sections?.community_initiatives && phase149Sections.community_initiatives.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.communityInitiatives}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {phase149Sections.community_initiatives.map((initiative) => (
              <CommunityInitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        </section>
      ) : null}

      {phase149Sections?.wellbeing_programs && phase149Sections.wellbeing_programs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.wellbeingPrograms}</h2>
          {typeof dashboard.employee_wellbeing_framework?.boundary_note === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.employee_wellbeing_framework.boundary_note}</p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            {phase149Sections.wellbeing_programs.map((program) => (
              <WellbeingProgramCard key={program.id} program={program} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.socialResponsibilityEngine}
        meta={{ items: dashboard.social_responsibility_engine }}
        itemsKey="items"
      />

      <MetaListSection
        title={labels.communityImpactEngine}
        meta={{ items: dashboard.community_impact_engine }}
        itemsKey="items"
      />

      <MetaListSection
        title={labels.impactReportingEngine}
        meta={{ items: dashboard.impact_reporting_engine }}
        itemsKey="items"
      />

      {phase149Sections?.impact_reports && phase149Sections.impact_reports.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.impactReports}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {phase149Sections.impact_reports.map((report) => (
              <ImpactReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.growthPartnerImpactProgram}
        meta={dashboard.growth_partner_impact_program}
        itemsKey="program_types"
      />

      {executiveReviewDimensions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveImpactReviews}</h2>
          {typeof dashboard.executive_impact_reviews_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.executive_impact_reviews_meta.principle}</p>
          ) : null}
          <ul className="grid gap-2 sm:grid-cols-2">
            {executiveReviewDimensions.map((dimension) => (
              <li key={String(dimension.key)} className="rounded-lg border border-amber-100 px-3 py-2 text-sm">
                {String(dimension.label)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase149Sections?.executive_reviews && phase149Sections.executive_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveReviewRecords}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {phase149Sections.executive_reviews.map((review) => (
              <ExecutiveReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.gisrb149_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.phase149Objectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.gisrb149_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {impactCompanionExamples.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.impactCompanion}</h2>
          {typeof dashboard.impact_companion?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.impact_companion.principle}</p>
          ) : null}
          <div className="space-y-2">
            {impactCompanionExamples.map((example: CompanionAdaptationExample) => (
              <div key={example.key} className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                <span className="font-medium">
                  {example.emoji ? `${example.emoji} ` : ""}
                  {example.prompt}
                </span>
                {example.consideration ? (
                  <p className="mt-1 text-xs text-violet-800">{example.consideration}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {typeof dashboard.gisrb149_self_love_connection?.vision === "string" ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveConnection}</h2>
          <p className="mt-2 text-sm text-rose-800">{dashboard.gisrb149_self_love_connection.vision}</p>
        </section>
      ) : null}

      {dashboard.gisrb149_security_requirements && dashboard.gisrb149_security_requirements.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.securityRequirements}</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            {dashboard.gisrb149_security_requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase149Limitations.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.companionLimitations}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
            {phase149Limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.gisrb149_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.phase149SuccessCriteria}</h2>
          {dashboard.gisrb149_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.gisrb149_vision_phrases && dashboard.gisrb149_vision_phrases.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.visionPhrases}</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            {dashboard.gisrb149_vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.gisrb149_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.gisrb149_privacy_note}</p>
      ) : null}
    </div>
  );
}
