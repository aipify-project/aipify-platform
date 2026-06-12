"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCivilizationalCoordinationDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CivilizationalCoordinationDashboard,
  type CoordinationMilestone,
  type CoordinationPartnership,
  type IntegrationLink,
  type SharedActionProgram,
} from "@/lib/aipify/civilizational-coordination-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-indigo-900">{objective.description}</p>
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
  const items = Array.isArray(meta?.[itemsKey])
    ? (meta[itemsKey] as Array<Record<string, unknown>>)
    : [];
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? (
        <p className="text-sm text-gray-600">{meta.principle}</p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={String(item.key ?? item.label)}
            className="rounded-lg border border-gray-100 px-3 py-2 text-sm"
          >
            <span className="font-medium text-gray-900">{String(item.label ?? item.key)}</span>
            {typeof item.cross_link === "string" ? (
              <Link href={item.cross_link} className="mt-1 block text-xs text-indigo-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgramRow({ program }: { program: SharedActionProgram }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{program.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {program.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{program.summary}</p>
      <p className="mt-1 text-xs text-gray-500">{program.program_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function PartnershipRow({ partnership }: { partnership: CoordinationPartnership }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{partnership.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {partnership.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{partnership.summary}</p>
      <p className="mt-1 text-xs text-gray-500">
        {partnership.partner_org_label} · {partnership.partnership_type?.replace(/_/g, " ")}
        {partnership.opt_in ? " · opt-in" : ""}
      </p>
    </div>
  );
}

function MilestoneRow({ milestone }: { milestone: CoordinationMilestone }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">{milestone.title}</span>
        <span className="text-xs text-sky-700">{milestone.milestone_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{milestone.summary}</p>
    </div>
  );
}

export function CivilizationalCoordinationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CivilizationalCoordinationDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/civilizational-coordination-engine/dashboard");
    if (res.ok) {
      setDashboard(parseCivilizationalCoordinationDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.ccaebp166_integration_links?.length
      ? dashboard.ccaebp166_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-indigo-900">{dashboard.coordination_score ?? 0}</p>
        <p className="text-xs text-indigo-700">{labels.coordinationScore}</p>
        {dashboard.civilizational_coordination_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">
            {dashboard.civilizational_coordination_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.civilizational_coordination_vision ? (
          <p className="mt-2 text-xs italic text-indigo-800">
            {dashboard.civilizational_coordination_vision}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.coordinationMode}:</span> {dashboard.coordination_mode}
          </div>
          <div>
            <span className="font-medium">{labels.programsCount}:</span> {dashboard.programs_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activePartnerships}:</span>{" "}
            {dashboard.active_partnerships_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.milestonesCount}:</span>{" "}
            {dashboard.milestones_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-indigo-800">{labels.enableRequired}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.safety_note}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.sharedActionCenter}
        meta={dashboard.shared_action_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.coordinationEngine}
        meta={dashboard.coordination_engine_meta}
        itemsKey="participant_types"
      />

      <MetaListSection
        title={labels.sharedActionFramework}
        meta={dashboard.shared_action_framework_meta}
        itemsKey="elements"
      />

      <MetaListSection
        title={labels.executiveCoordinationReviews}
        meta={dashboard.executive_coordination_reviews_meta}
        itemsKey="review_themes"
      />

      <MetaListSection
        title={labels.coordinationCompanion}
        meta={dashboard.coordination_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.voluntaryAlignmentEngine}
        meta={dashboard.voluntary_alignment_engine_meta}
        itemsKey="principles"
      />

      <MetaListSection
        title={labels.collectiveExecutionEngine}
        meta={dashboard.collective_execution_engine_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.relationshipStewardshipEngine}
        meta={dashboard.relationship_stewardship_engine_meta}
        itemsKey="values"
      />

      {dashboard.programs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sharedActionPrograms}</h2>
          <div className="space-y-2">
            {dashboard.programs.map((program) => (
              <ProgramRow key={program.id} program={program} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.partnerships.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.coordinationPartnerships}</h2>
          <div className="space-y-2">
            {dashboard.partnerships.map((partnership) => (
              <PartnershipRow key={partnership.id} partnership={partnership} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.milestones.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.coordinationMilestones}</h2>
          <div className="space-y-2">
            {dashboard.milestones.map((milestone) => (
              <MilestoneRow key={milestone.id} milestone={milestone} />
            ))}
          </div>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.crossLinks}</h2>
          <ul className="space-y-2 text-sm">
            {integrationLinks.map((link: IntegrationLink) => (
              <li key={link.key ?? link.label} className="rounded border border-gray-100 px-3 py-2">
                {link.route ? (
                  <Link href={link.route} className="font-medium text-indigo-800 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.relationship ? (
                  <p className="mt-1 text-xs text-gray-500">{link.relationship}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.civilizational_coordination_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.civilizational_coordination_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_limitations_meta?.must_avoid?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionLimitations}</h2>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {dashboard.companion_limitations_meta.must_avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.civilizational_coordination_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.civilizational_coordination_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.civilizational_coordination_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.civilizational_coordination_privacy_note}</p>
      ) : null}
    </div>
  );
}
