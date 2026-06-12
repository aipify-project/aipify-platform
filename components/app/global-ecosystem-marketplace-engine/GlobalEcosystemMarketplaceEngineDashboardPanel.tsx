"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGlobalEcosystemMarketplaceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type GlobalEcosystemMarketplaceDashboard,
  type IntegrationLink,
  type SolutionContribution,
  type SolutionListing,
  type SolutionValidation,
} from "@/lib/aipify/global-ecosystem-marketplace-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-violet-900">{objective.description}</p>
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
              <Link href={item.cross_link} className="mt-1 block text-xs text-violet-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ListingRow({ listing }: { listing: SolutionListing }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{listing.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {listing.validation_status}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{listing.summary}</p>
      <p className="mt-1 text-xs text-gray-500">
        {listing.category?.replace(/_/g, " ")}
        {listing.industry_tags?.length ? ` · ${listing.industry_tags.join(", ")}` : ""}
      </p>
    </div>
  );
}

function ValidationRow({ validation }: { validation: SolutionValidation }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="font-medium">{validation.validation_key}</div>
      <p className="mt-1 text-xs text-gray-600">
        {validation.status}
        {validation.documentation_quality_score != null
          ? ` · Doc: ${validation.documentation_quality_score}`
          : ""}
        {validation.governance_alignment_score != null
          ? ` · Gov: ${validation.governance_alignment_score}`
          : ""}
      </p>
    </div>
  );
}

function ContributionRow({ contribution }: { contribution: SolutionContribution }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{contribution.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {contribution.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{contribution.summary}</p>
    </div>
  );
}

export function GlobalEcosystemMarketplaceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GlobalEcosystemMarketplaceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-ecosystem-marketplace-engine/dashboard");
    if (res.ok) {
      setDashboard(parseGlobalEcosystemMarketplaceDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.gsembp148_integration_links?.length
      ? dashboard.gsembp148_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-violet-900">{dashboard.marketplace_score ?? 0}</p>
        <p className="text-xs text-violet-700">{labels.marketplaceScore}</p>
        {dashboard.global_ecosystem_marketplace_mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">
            {dashboard.global_ecosystem_marketplace_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p> : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-violet-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.global_ecosystem_marketplace_vision ? (
          <p className="mt-2 text-xs italic text-violet-800">{dashboard.global_ecosystem_marketplace_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.participationStatus}:</span>{" "}
            {dashboard.participation_status}
          </div>
          <div>
            <span className="font-medium">{labels.listingsCount}:</span> {dashboard.listings_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.approvedListings}:</span>{" "}
            {dashboard.approved_listings_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.pendingListings}:</span>{" "}
            {dashboard.pending_listings_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-amber-800">{labels.optInRequired}</p>
        ) : null}
        {dashboard.approval_required ? (
          <p className="mt-2 text-xs text-violet-800">{labels.approvalRequired}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.globalSolutionMarketplaceCenter}
        meta={dashboard.global_solution_marketplace_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.marketplaceCategories}
        meta={dashboard.marketplace_categories_meta}
        itemsKey="categories"
      />

      <MetaListSection
        title={labels.industrySolutionPacks}
        meta={dashboard.industry_solution_pack_engine_meta}
        itemsKey="industries"
      />

      <MetaListSection
        title={labels.solutionValidationFramework}
        meta={dashboard.solution_validation_framework_meta}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.procurementReadiness}
        meta={dashboard.procurement_readiness_engine_meta}
        itemsKey="fields"
      />

      <MetaListSection
        title={labels.marketplaceCompanion}
        meta={dashboard.marketplace_companion_meta}
        itemsKey="capabilities"
      />

      {dashboard.listings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.solutionListings}</h2>
          <div className="space-y-2">
            {dashboard.listings.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.validations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.solutionValidations}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.validations.map((validation) => (
              <ValidationRow key={validation.id} validation={validation} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.contributions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.solutionContributions}</h2>
          <div className="space-y-2">
            {dashboard.contributions.map((contribution) => (
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
                  <Link href={link.route} className="font-medium text-violet-800 hover:underline">
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

      {dashboard.global_ecosystem_marketplace_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.global_ecosystem_marketplace_objectives.map((objective) => (
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

      {dashboard.global_ecosystem_marketplace_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.global_ecosystem_marketplace_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.global_ecosystem_marketplace_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.global_ecosystem_marketplace_privacy_note}</p>
      ) : null}
    </div>
  );
}
