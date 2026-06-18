"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAugmentedOrganizationDashboard,
  type AbosSuccessCriterion,
  type AgencyRecord,
  type AugmentedOrganizationDashboard,
  type BlueprintObjective,
  type IntegrationLink,
  type MaturityLevel,
  type SymbiosisAssessment,
  type TrustSignal,
} from "@/lib/aipify/augmented-organization-engine";

type AugmentedOrganizationEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-teal-900">{objective.description}</p> : null}
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
    case "strong":
    case "stable":
    case "high":
    case "active":
    case "reviewed":
      return "bg-teal-100 text-teal-800";
    case "moderate":
    case "emerging":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "low":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function AssessmentRow({ assessment }: { assessment: SymbiosisAssessment }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">
          {assessment.assessment_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(assessment.health_signal)}`}>
          {assessment.health_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-teal-800">{assessment.summary}</p>
      {assessment.maturity_level != null ? (
        <p className="mt-1 text-xs text-teal-700">
          Level {assessment.maturity_level}
        </p>
      ) : null}
    </div>
  );
}

function TrustRow({ signal }: { signal: TrustSignal }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{signal.signal_type?.replace(/_/g, " ")}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(signal.confidence)}`}>
          {signal.confidence}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{signal.summary}</p>
    </div>
  );
}

function AgencyRow({ record }: { record: AgencyRecord }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{record.checkpoint_type?.replace(/_/g, " ")}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(record.status)}`}>
          {record.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{record.summary}</p>
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
      {typeof meta?.principle === "string" ? <p className="text-sm text-gray-600">{meta.principle}</p> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={String(item.key ?? item.label ?? item.level)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
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

function SymbiosisModelSection({
  title,
  meta,
  labels,
}: {
  title: string;
  meta?: Record<string, unknown>;
  labels: { humanContributions: string; companionContributions: string };
}) {
  if (!meta) return null;
  const humanItems = Array.isArray(meta.human_contributions)
    ? (meta.human_contributions as Array<Record<string, unknown>>)
    : [];
  const companionItems = Array.isArray(meta.companion_contributions)
    ? (meta.companion_contributions as Array<Record<string, unknown>>)
    : [];
  if (humanItems.length === 0 && companionItems.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {typeof meta.principle === "string" ? <p className="text-sm text-gray-600">{meta.principle}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-teal-900">{labels.humanContributions}</h3>
          <div className="mt-2 grid gap-2">
            {humanItems.map((item) => (
              <div key={String(item.key)} className="rounded border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
                {String(item.label ?? item.key)}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-indigo-900">{labels.companionContributions}</h3>
          <div className="mt-2 grid gap-2">
            {companionItems.map((item) => (
              <div key={String(item.key)} className="rounded border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                {String(item.label ?? item.key)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MaturityModelSection({
  title,
  meta,
  currentLevel,
  note,
}: {
  title: string;
  meta?: Record<string, unknown>;
  currentLevel?: number;
  note?: string;
}) {
  const levels = Array.isArray(meta?.levels) ? (meta.levels as MaturityLevel[]) : [];
  if (levels.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? <p className="text-sm text-gray-600">{meta.principle}</p> : null}
      {note ? <p className="text-xs text-gray-500">{note}</p> : null}
      <div className="space-y-2">
        {levels.map((level) => {
          const isCurrent = currentLevel != null && level.level === currentLevel;
          return (
            <div
              key={level.level ?? level.key}
              className={`rounded-lg border px-3 py-2 text-sm ${
                isCurrent
                  ? "border-teal-300 bg-teal-50 ring-1 ring-teal-200"
                  : "border-gray-100 bg-gray-50/50"
              }`}
            >
              <span className="font-medium text-gray-900">{level.label}</span>
              {level.description ? <p className="mt-1 text-xs text-gray-600">{level.description}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AugmentedOrganizationEngineDashboardPanel({
  labels,
}: AugmentedOrganizationEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AugmentedOrganizationDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/augmented-organization-engine/dashboard");
    if (res.ok) setDashboard(parseAugmentedOrganizationDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const eraLinks: IntegrationLink[] =
    dashboard.auorgbp140_era_capstone_summary ?? dashboard.integration_links ?? [];
  const extendedLinks: IntegrationLink[] = dashboard.auorgbp140_extended_cross_links ?? [];
  const limitationItems = dashboard.companion_limitations_meta?.must_avoid ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
        <h2 className="text-sm font-semibold text-teal-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint?.phase ? (
          <p className="mt-1 text-xs text-teal-700">
            {dashboard.implementation_blueprint.phase}
            {dashboard.implementation_blueprint.engine_phase
              ? ` · ${dashboard.implementation_blueprint.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.augmented_organization_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.augmented_organization_mission}</p>
        ) : null}
        {dashboard.augmented_organization_philosophy ? (
          <p className="mt-2 text-sm text-teal-900">{dashboard.augmented_organization_philosophy}</p>
        ) : null}
        {dashboard.augmented_organization_distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">{dashboard.augmented_organization_distinction_note}</p>
        ) : null}
        {dashboard.augmented_organization_vision ? (
          <p className="mt-2 text-xs italic text-teal-800">{dashboard.augmented_organization_vision}</p>
        ) : null}
      </section>

      {eraLinks.length > 0 ? (
        <section className="rounded-xl border-2 border-teal-300 bg-gradient-to-br from-teal-100/80 to-white p-5">
          <h2 className="text-lg font-semibold text-teal-950">{labels.eraCapstoneBanner}</h2>
          <p className="mt-1 text-sm text-teal-800">{labels.eraCrossLinksNote}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eraLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-teal-200 bg-white/80 px-3 py-2 text-sm hover:border-teal-300"
                >
                  <span className="font-medium text-teal-900">
                    {link.phase ? `Phase ${link.phase} · ` : ""}
                    {link.label ?? link.route}
                  </span>
                  {link.description ? (
                    <p className="mt-1 text-xs text-teal-700">{link.description}</p>
                  ) : link.relationship ? (
                    <p className="mt-1 text-xs text-teal-700">{link.relationship}</p>
                  ) : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-800">{labels.symbiosisCenter}</p>
            <p className="text-3xl font-bold text-teal-900">{dashboard.symbiosis_score ?? 0}</p>
            <p className="mt-1 text-sm text-teal-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-teal-600">{labels.humanOversightRequired}</p>
            ) : null}
            {dashboard.human_agency_protection_enabled ? (
              <p className="mt-1 text-xs text-teal-600">{labels.humanAgencyProtection}</p>
            ) : null}
          </div>
          <div className="rounded-lg border border-teal-200 bg-white/90 px-4 py-3 text-center">
            <p className="text-xs text-teal-600">{labels.currentMaturityLevel}</p>
            <p className="text-2xl font-bold text-teal-900">{dashboard.symbiosis_maturity_level ?? 1}</p>
            <p className="text-xs text-teal-700">{labels.maturityNotSpeed}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.symbiosisAssessments}</span>
            <p className="font-semibold">{dashboard.symbiosis_assessments_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.trustSignals}</span>
            <p className="font-semibold">{dashboard.trust_signals_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.agencyRecords}</span>
            <p className="font-semibold">{dashboard.agency_records_count ?? 0}</p>
          </div>
        </div>
      </div>

      <MaturityModelSection
        title={labels.maturityModel}
        meta={dashboard.augmented_organization_maturity_model_meta}
        currentLevel={dashboard.symbiosis_maturity_level}
        note={labels.maturityNotSpeed}
      />

      <SymbiosisModelSection
        title={labels.symbiosisModel}
        meta={dashboard.human_companion_symbiosis_model_meta}
        labels={{
          humanContributions: labels.humanContributions,
          companionContributions: labels.companionContributions,
        }}
      />

      {extendedLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.extendedCrossLinks}</h2>
          <div className="flex flex-wrap gap-2">
            {extendedLinks.map((link) =>
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
        </section>
      ) : null}

      <MetaListSection
        title={labels.augmentedOrganizationCenter}
        meta={dashboard.augmented_organization_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.symbiosisDesignPrinciples}
        meta={dashboard.symbiosis_design_principles_meta}
        itemsKey="principles"
      />

      <MetaListSection
        title={labels.augmentedExperienceEngine}
        meta={dashboard.augmented_experience_engine_meta}
        itemsKey="experiences"
      />

      <MetaListSection
        title={labels.humanAgencyFramework}
        meta={dashboard.human_agency_protection_framework_meta}
        itemsKey="protections"
      />

      <MetaListSection
        title={labels.trustEngine}
        meta={dashboard.trust_engine_meta}
        itemsKey="capabilities"
      />

      {dashboard.relationship_intelligence_engine_meta ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.relationshipIntelligence}</h2>
          {typeof dashboard.relationship_intelligence_engine_meta.principle === "string" ? (
            <p className="mt-2 text-sm text-rose-800">
              {dashboard.relationship_intelligence_engine_meta.principle as string}
            </p>
          ) : null}
          {typeof dashboard.relationship_intelligence_engine_meta.rsi_route === "string" ? (
            <Link
              href={dashboard.relationship_intelligence_engine_meta.rsi_route as string}
              className="mt-2 inline-block text-sm text-rose-700 underline"
            >
              {labels.rsiCrossLink}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.symbiosis_assessments.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.symbiosisAssessmentsSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.symbiosis_assessments.map((assessment) => (
              <AssessmentRow key={assessment.id} assessment={assessment} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trust_signals.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.trustSignalsSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.trust_signals.map((signal) => (
              <TrustRow key={signal.id} signal={signal} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.agency_records.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.agencyRecordsSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.agency_records.map((record) => (
              <AgencyRow key={record.id} record={record} />
            ))}
          </div>
        </section>
      ) : null}

      {typeof dashboard.self_love_connection_meta?.principle === "string" ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveConnection}</h2>
          <p className="mt-2 text-sm text-rose-800">{dashboard.self_love_connection_meta.principle as string}</p>
        </section>
      ) : null}

      {dashboard.augmented_organization_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.augmented_organization_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.companionLimitations}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.augmented_organization_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.augmented_organization_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.augmented_organization_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.augmented_organization_privacy_note}</p>
      ) : null}
    </div>
  );
}
