"use client";

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
  type PurposeCommitment,
  type PurposeInitiative,
  type SocialImpactPurposeDashboard,
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

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
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
    </div>
  );
}
