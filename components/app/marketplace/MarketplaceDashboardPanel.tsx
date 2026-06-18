"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseMarketplaceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CompanionAdaptationExample,
  type InstallFlowStep,
  type MarketplaceDashboard,
  type MarketplaceItem,
  type SkillCategory,
} from "@/lib/aipify/marketplace";

type MarketplaceDashboardPanelProps = {
  labels: Record<string, string>;
};

const RISK_COLOR: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

function ItemCard({ item, labels }: { item: MarketplaceItem; labels: Record<string, string> }) {
  return (
    <Link
      href={`/app/marketplace/item/${item.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-violet-300"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{item.title}</h3>
        <span className={`rounded px-2 py-0.5 text-xs capitalize ${RISK_COLOR[item.risk_level] ?? "bg-gray-100"}`}>
          {item.risk_level}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">{item.short_description}</p>
      <p className="mt-2 text-xs text-gray-500">
        {item.item_type.replace(/_/g, " ")} · {item.pricing_model === "free" ? labels.free : item.pricing_model}
      </p>
    </Link>
  );
}

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-violet-900">{objective.description}</p> : null}
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

export function MarketplaceDashboardPanel({ labels }: MarketplaceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<MarketplaceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/marketplace/dashboard");
    if (res.ok) setDashboard(parseMarketplaceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const skillCategories: SkillCategory[] = dashboard.skill_categories?.categories ?? [];
  const installSteps: InstallFlowStep[] = dashboard.installation_experience?.steps ?? [];
  const companionExamples: CompanionAdaptationExample[] = dashboard.companion_adaptation?.examples ?? [];
  const qaDimensions = (dashboard.skill_quality_assurance?.dimensions ?? []) as Array<{
    key?: string;
    label?: string;
    description?: string;
  }>;
  const developerCapabilities = (dashboard.developer_ecosystem?.capabilities ?? []) as Array<{
    key?: string;
    label?: string;
    description?: string;
    route?: string;
  }>;
  const extensionTypes = (dashboard.extensions_marketplace?.extension_types ?? []) as Array<{
    key?: string;
    label?: string;
    description?: string;
    route?: string;
  }>;
  const limitationItems = dashboard.marketplace_limitation_principles?.must_avoid ?? [];
  const integrationLinks = dashboard.sembp112_integration_links ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/marketplace/catalog" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.catalog}
        </Link>
        <Link href="/app/marketplace/installed" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.installed}
        </Link>
        <Link href="/app/skills" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.skillStore}
        </Link>
        {labels.openSelfServiceActivation && (
          <Link href="/app/marketplace/business-packs" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100">
            {labels.openSelfServiceActivation}
          </Link>
        )}
        <Link
          href="/app/marketplace-governance"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.marketplaceGovernance}
        </Link>
      </div>

      {dashboard.marketplace_mission ? (
        <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <p className="text-sm font-medium text-violet-800">{labels.blueprintTitle}</p>
          <p className="mt-1 text-sm text-violet-900">{dashboard.marketplace_mission}</p>
          {dashboard.marketplace_philosophy ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.marketplace_philosophy}</p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
              <span className="text-violet-600">{labels.catalogItems}</span>
              <p className="font-semibold">{dashboard.catalog_count ?? 0}</p>
            </div>
            <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
              <span className="text-violet-600">{labels.installedCount}</span>
              <p className="font-semibold">{dashboard.marketplace_engagement_summary?.installed_count ?? 0}</p>
            </div>
            <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
              <span className="text-violet-600">{labels.updatesAvailable}</span>
              <p className="font-semibold">{dashboard.marketplace_engagement_summary?.updates_available ?? 0}</p>
            </div>
          </div>
        </div>
      ) : null}

      {dashboard.recommended.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">{labels.recommended}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.recommended.map((item) => (
              <ItemCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.featured.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">{labels.featured}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.featured.map((item) => (
              <ItemCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.marketplace_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.marketplace_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {skillCategories.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.skillCategories}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {skillCategories.map((category) => (
              <div key={category.key} className="rounded-lg border border-gray-100 bg-white p-3 text-sm">
                <p className="font-medium text-gray-900">{category.label}</p>
                {category.description ? <p className="mt-1 text-xs text-gray-600">{category.description}</p> : null}
                {category.example_skills?.length ? (
                  <ul className="mt-2 space-y-1 text-xs text-gray-500">
                    {category.example_skills.map((skill) => (
                      <li key={`${category.key}-${skill.skill_id}-${skill.label}`}>
                        {skill.label}
                        {skill.marketplace_item ? ` · ${skill.marketplace_item.replace("aipify.", "")}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {extensionTypes.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.extensionsMarketplace}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {extensionTypes.map((ext) =>
              ext.route ? (
                <Link
                  key={ext.key}
                  href={ext.route}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-violet-300 hover:bg-violet-50/50"
                >
                  <span className="font-medium">{ext.label}</span>
                  {ext.description ? <p className="mt-1 text-xs text-gray-500">{ext.description}</p> : null}
                </Link>
              ) : (
                <div key={ext.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                  <span className="font-medium">{ext.label}</span>
                  {ext.description ? <p className="mt-1 text-xs text-gray-500">{ext.description}</p> : null}
                </div>
              ),
            )}
          </div>
        </section>
      ) : null}

      {installSteps.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.installFlow}</h2>
          <ol className="space-y-2">
            {installSteps.map((step) => (
              <li key={step.key} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium">
                  {step.order}. {step.label}
                </span>
                {step.description ? <p className="mt-1 text-xs text-gray-600">{step.description}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {companionExamples.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionAdaptation}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {companionExamples.map((example) => (
              <div key={example.key} className="rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2 text-sm">
                <p className="font-medium">
                  {example.emoji ? `${example.emoji} ` : ""}
                  {example.prompt}
                </p>
                {example.consideration ? (
                  <p className="mt-1 text-xs text-amber-900">{example.consideration}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {qaDimensions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.qaPrinciples}</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {qaDimensions.map((dim) => (
              <li key={dim.key} className="rounded border border-gray-100 px-3 py-2">
                <span className="font-medium">{dim.label}</span>
                {dim.description ? <p className="mt-1 text-xs text-gray-500">{dim.description}</p> : null}
              </li>
            ))}
          </ul>
          <Link href="/app/marketplace-governance" className="text-xs text-violet-700 hover:underline">
            {labels.openMarketplaceGovernance}
          </Link>
        </section>
      ) : null}

      {developerCapabilities.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.developerEcosystem}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {developerCapabilities.map((cap) =>
              cap.route ? (
                <Link
                  key={cap.key}
                  href={cap.route}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-violet-300"
                >
                  <span className="font-medium">{cap.label}</span>
                  {cap.description ? <p className="mt-1 text-xs text-gray-500">{cap.description}</p> : null}
                </Link>
              ) : (
                <div key={cap.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                  <span className="font-medium">{cap.label}</span>
                  {cap.description ? <p className="mt-1 text-xs text-gray-500">{cap.description}</p> : null}
                </div>
              ),
            )}
          </div>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.integrationLinks}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {integrationLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.key ?? link.route}
                  href={link.route}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-violet-300 hover:bg-violet-50/50"
                >
                  <span className="font-medium text-gray-900">{link.label}</span>
                  {link.note ? <p className="mt-1 text-xs text-gray-500">{link.note}</p> : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.limitationPrinciples}</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.marketplace_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="space-y-2">
            {dashboard.marketplace_success_criteria.map((criterion) => (
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

      {dashboard.marketplace_vision ? (
        <p className="rounded-lg border border-violet-100 bg-violet-50/30 px-4 py-3 text-sm italic text-violet-900">
          {dashboard.marketplace_vision}
        </p>
      ) : null}

      <p className="text-xs text-gray-500">{labels.principle}</p>
      {dashboard.marketplace_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.marketplace_privacy_note}</p>
      ) : null}
    </div>
  );
}
