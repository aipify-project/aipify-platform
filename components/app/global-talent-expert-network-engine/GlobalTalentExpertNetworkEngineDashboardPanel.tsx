"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGlobalTalentExpertNetworkDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ExpertContribution,
  type ExpertEngagement,
  type ExpertProfile,
  type GlobalTalentExpertNetworkDashboard,
  type IntegrationLink,
} from "@/lib/aipify/global-talent-expert-network-engine";

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

function ProfileRow({ profile }: { profile: ExpertProfile }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{profile.display_label}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {profile.status}
        </span>
      </div>
      {profile.biography_summary ? (
        <p className="mt-1 text-xs text-teal-800">{profile.biography_summary}</p>
      ) : null}
    </div>
  );
}

function EngagementRow({ engagement }: { engagement: ExpertEngagement }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{engagement.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {engagement.status}
        </span>
      </div>
      {engagement.role_definition_summary ? (
        <p className="mt-1 text-xs text-gray-600">{engagement.role_definition_summary}</p>
      ) : null}
    </div>
  );
}

function ContributionRow({ contribution }: { contribution: ExpertContribution }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{contribution.title}</span>
        <span className="text-xs text-teal-700">{contribution.contribution_count ?? 0}</span>
      </div>
      {contribution.summary ? (
        <p className="mt-1 text-xs text-teal-800">{contribution.summary}</p>
      ) : null}
    </div>
  );
}

export function GlobalTalentExpertNetworkEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GlobalTalentExpertNetworkDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-talent-expert-network-engine/dashboard");
    if (res.ok) {
      setDashboard(parseGlobalTalentExpertNetworkDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.gtenbp147_integration_links?.length
      ? dashboard.gtenbp147_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-teal-900">{dashboard.network_score ?? 0}</p>
        <p className="text-xs text-teal-700">{labels.networkScore}</p>
        {dashboard.global_talent_expert_network_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">
            {dashboard.global_talent_expert_network_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.global_talent_expert_network_vision ? (
          <p className="mt-2 text-xs italic text-teal-800">
            {dashboard.global_talent_expert_network_vision}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.discoveryMaturityLevel}:</span>{" "}
            {dashboard.discovery_maturity_level}
          </div>
          <div>
            <span className="font-medium">{labels.profilesCount}:</span>{" "}
            {dashboard.profiles_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activeProfiles}:</span>{" "}
            {dashboard.active_profiles_count ?? 0}
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
          <p className="mt-2 text-xs text-teal-800">{labels.executiveApprovalRequired}</p>
        ) : null}
        {dashboard.procurement_disclaimer ? (
          <p className="mt-2 text-xs font-medium text-amber-900">{labels.procurementDisclaimer}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.globalExpertNetworkCenter}
        meta={dashboard.global_expert_network_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.expertDiscovery}
        meta={dashboard.expert_discovery_engine_meta}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.executiveAdvisoryNetwork}
        meta={dashboard.executive_advisory_network_engine_meta}
        itemsKey="roles"
      />

      <MetaListSection
        title={labels.growthPartnerMatching}
        meta={dashboard.growth_partner_matching_engine_meta}
        itemsKey="criteria"
      />

      <MetaListSection
        title={labels.specialistCollaboration}
        meta={dashboard.specialist_collaboration_framework_meta}
        itemsKey="elements"
      />

      <MetaListSection
        title={labels.professionalProfileEngine}
        meta={dashboard.professional_profile_engine_meta}
        itemsKey="fields"
      />

      <MetaListSection
        title={labels.talentCompanion}
        meta={dashboard.talent_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.professionalContributions}
        meta={dashboard.professional_contribution_engine_meta}
        itemsKey="contribution_types"
      />

      {dashboard.expert_profiles.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.expertProfiles}</h2>
          <div className="space-y-2">
            {dashboard.expert_profiles.map((profile) => (
              <ProfileRow key={profile.id} profile={profile} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.expert_engagements.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.expertEngagements}</h2>
          <div className="space-y-2">
            {dashboard.expert_engagements.map((engagement) => (
              <EngagementRow key={engagement.id} engagement={engagement} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.expert_contributions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.contributionsList}</h2>
          <div className="space-y-2">
            {dashboard.expert_contributions.map((contribution) => (
              <ContributionRow key={contribution.id} contribution={contribution} />
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

      {dashboard.global_talent_expert_network_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.global_talent_expert_network_objectives.map((objective) => (
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

      {dashboard.global_talent_expert_network_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.global_talent_expert_network_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}
