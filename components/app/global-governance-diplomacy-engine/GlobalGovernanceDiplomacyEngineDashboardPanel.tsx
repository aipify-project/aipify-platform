"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGlobalGovernanceDiplomacyDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type DiplomacyEngagement,
  type GlobalGovernanceDiplomacyDashboard,
  type IntegrationLink,
  type PartnershipCharter,
  type PolicyLibraryRef,
} from "@/lib/aipify/global-governance-diplomacy-engine";

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

function CharterRow({ charter }: { charter: PartnershipCharter }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{charter.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {charter.status}
        </span>
      </div>
      {charter.shared_objectives_summary ? (
        <p className="mt-1 text-xs text-indigo-800">{charter.shared_objectives_summary}</p>
      ) : null}
      {charter.joint_operations_partnership_id ? (
        <p className="mt-1 text-xs text-gray-500">
          Joint operations link: {charter.joint_operations_partnership_id}
        </p>
      ) : null}
    </div>
  );
}

function EngagementRow({ engagement }: { engagement: DiplomacyEngagement }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{engagement.title}</span>
        <span className="text-xs text-gray-500">{engagement.status}</span>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        {engagement.engagement_type?.replace(/_/g, " ")}
      </p>
    </div>
  );
}

function PolicyRefRow({ ref }: { ref: PolicyLibraryRef }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="font-medium">{ref.title}</div>
      <p className="mt-1 text-xs text-gray-600">
        {ref.template_category?.replace(/_/g, " ")}
        {ref.summary ? ` · ${ref.summary}` : ""}
      </p>
    </div>
  );
}

export function GlobalGovernanceDiplomacyEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GlobalGovernanceDiplomacyDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-governance-diplomacy-engine/dashboard");
    if (res.ok) {
      setDashboard(parseGlobalGovernanceDiplomacyDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.ggdebp144_integration_links?.length
      ? dashboard.ggdebp144_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-indigo-900">{dashboard.governance_score ?? 0}</p>
        <p className="text-xs text-indigo-700">{labels.governanceScore}</p>
        {dashboard.global_governance_diplomacy_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">
            {dashboard.global_governance_diplomacy_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.global_governance_diplomacy_vision ? (
          <p className="mt-2 text-xs italic text-indigo-800">
            {dashboard.global_governance_diplomacy_vision}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.governanceMaturityLevel}:</span>{" "}
            {dashboard.governance_maturity_level}
          </div>
          <div>
            <span className="font-medium">{labels.chartersCount}:</span>{" "}
            {dashboard.charters_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activeCharters}:</span>{" "}
            {dashboard.active_charters_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activeEngagements}:</span>{" "}
            {dashboard.active_engagements_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-amber-800">{labels.optInRequired}</p>
        ) : null}
        {dashboard.executive_approval_required ? (
          <p className="mt-2 text-xs text-indigo-800">{labels.executiveApprovalRequired}</p>
        ) : null}
        {dashboard.legal_disclaimer ? (
          <p className="mt-2 text-xs font-medium text-amber-900">{labels.legalDisclaimer}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.globalGovernanceCenter}
        meta={dashboard.global_governance_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.digitalDiplomacy}
        meta={dashboard.digital_diplomacy_engine_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.partnershipCharterEngine}
        meta={dashboard.partnership_charter_engine_meta}
        itemsKey="elements"
      />

      <MetaListSection
        title={labels.executiveAlignment}
        meta={dashboard.executive_alignment_engine_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.crossCulturalCollaboration}
        meta={dashboard.cross_cultural_collaboration_engine_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.governanceCompanion}
        meta={dashboard.governance_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.conflictPrevention}
        meta={dashboard.conflict_prevention_framework_meta}
        itemsKey="risk_areas"
      />

      <MetaListSection
        title={labels.globalPolicyLibrary}
        meta={dashboard.global_policy_library_meta}
        itemsKey="categories"
      />

      {dashboard.partnership_charters.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.partnershipCharters}</h2>
          <div className="space-y-2">
            {dashboard.partnership_charters.map((charter) => (
              <CharterRow key={charter.id} charter={charter} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.diplomacy_engagements.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.diplomacyEngagements}</h2>
          <div className="space-y-2">
            {dashboard.diplomacy_engagements.map((engagement) => (
              <EngagementRow key={engagement.id} engagement={engagement} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.policy_library_refs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.policyLibraryRefs}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.policy_library_refs.map((ref) => (
              <PolicyRefRow key={ref.id} ref={ref} />
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

      {dashboard.global_governance_diplomacy_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.global_governance_diplomacy_objectives.map((objective) => (
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

      {dashboard.global_governance_diplomacy_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.global_governance_diplomacy_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.global_governance_diplomacy_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.global_governance_diplomacy_privacy_note}</p>
      ) : null}
    </div>
  );
}
