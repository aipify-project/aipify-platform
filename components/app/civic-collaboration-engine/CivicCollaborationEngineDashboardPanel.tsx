"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCivicCollaborationDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CivicCollaborationDashboard,
  type CommunityPartnership,
  type IntegrationLink,
  type PublicValueInitiative,
  type TrustReflection,
} from "@/lib/aipify/civic-collaboration-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-teal-900">{objective.description}</p>
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
              <Link href={item.cross_link} className="mt-1 block text-xs text-teal-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnershipRow({ partnership }: { partnership: CommunityPartnership }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{partnership.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {partnership.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-teal-800">{partnership.summary}</p>
      <p className="mt-1 text-xs text-gray-500">{partnership.partnership_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function InitiativeRow({ initiative }: { initiative: PublicValueInitiative }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{initiative.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {initiative.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{initiative.summary}</p>
    </div>
  );
}

function TrustReflectionRow({ reflection }: { reflection: TrustReflection }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{reflection.title}</span>
        <span className="text-xs text-teal-700">{reflection.reflection_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-teal-800">{reflection.reflection_summary}</p>
    </div>
  );
}

export function CivicCollaborationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CivicCollaborationDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/civic-collaboration-engine/dashboard");
    if (res.ok) {
      setDashboard(parseCivicCollaborationDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.ccvebp161_integration_links?.length
      ? dashboard.ccvebp161_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-teal-900">{dashboard.public_value_score ?? 0}</p>
        <p className="text-xs text-teal-700">{labels.publicValueScore}</p>
        {dashboard.civic_collaboration_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.civic_collaboration_mission}</p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.civic_collaboration_vision ? (
          <p className="mt-2 text-xs italic text-teal-800">{dashboard.civic_collaboration_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.collaborationMode}:</span> {dashboard.collaboration_mode}
          </div>
          <div>
            <span className="font-medium">{labels.partnershipsCount}:</span> {dashboard.partnerships_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activeInitiatives}:</span>{" "}
            {dashboard.active_initiatives_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.trustReflections}:</span>{" "}
            {dashboard.trust_reflections_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-teal-800">{labels.enableRequired}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-teal-800">{dashboard.safety_note}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.publicValueCenter}
        meta={dashboard.public_value_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.civicCollaborationEngine}
        meta={dashboard.civic_collaboration_engine_meta}
        itemsKey="relationship_types"
      />

      <MetaListSection
        title={labels.communityPartnershipFramework}
        meta={dashboard.community_partnership_framework_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.publicTrustEngine}
        meta={dashboard.public_trust_engine_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.civicCompanion}
        meta={dashboard.civic_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.educationMentorshipEngine}
        meta={dashboard.education_mentorship_engine_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.collectiveResilienceFramework}
        meta={dashboard.collective_resilience_framework_meta}
        itemsKey="themes"
      />

      {dashboard.initiatives.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.publicValueInitiatives}</h2>
          <div className="space-y-2">
            {dashboard.initiatives.map((initiative) => (
              <InitiativeRow key={initiative.id} initiative={initiative} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.partnerships.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.communityPartnerships}</h2>
          <div className="space-y-2">
            {dashboard.partnerships.map((partnership) => (
              <PartnershipRow key={partnership.id} partnership={partnership} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trust_reflections.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.trustReflectionEntries}</h2>
          <div className="space-y-2">
            {dashboard.trust_reflections.map((reflection) => (
              <TrustReflectionRow key={reflection.id} reflection={reflection} />
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
                  <Link href={link.route} className="font-medium text-teal-800 hover:underline">
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

      {dashboard.civic_collaboration_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.civic_collaboration_objectives.map((objective) => (
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

      {dashboard.civic_collaboration_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.civic_collaboration_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.civic_collaboration_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.civic_collaboration_privacy_note}</p>
      ) : null}
    </div>
  );
}
