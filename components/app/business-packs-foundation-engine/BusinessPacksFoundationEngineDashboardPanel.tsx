"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseBusinessPacksFoundationEngineDashboard,
  type BlueprintObjective,
  type BusinessPackRecord,
  type BusinessPacksFoundationEngineDashboard,
  type ExampleIndustryPack,
  type InstallFlowStep,
  type ModularAddon,
  type ProductizationPack,
} from "@/lib/aipify/business-packs-foundation-engine";

type Props = { labels: Record<string, string> };

export function BusinessPacksFoundationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<BusinessPacksFoundationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/business-packs-foundation-engine/dashboard");
    if (res.ok) setDashboard(parseBusinessPacksFoundationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activatePack = async (packKey: string) => {
    setActivating(packKey);
    setActionError(null);
    const res = await fetch("/api/aipify/business-packs-foundation-engine/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pack_key: packKey }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.activateFailed);
    } else {
      await load();
    }
    setActivating(null);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const blueprint = dashboard.industry_packs_business_specialization_blueprint;
  const blueprintLinks = blueprint?.integration_links ?? [];
  const allLinks = [...(dashboard.integration_links ?? []), ...blueprintLinks].filter(
    (link, index, arr) => arr.findIndex((l) => (l.key ?? l.route) === (link.key ?? link.route)) === index
  );

  return (
    <div className="space-y-6">
      {allLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allLinks.map((link) =>
            link.route ? (
              <Link key={link.key ?? link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? labels[link.key as keyof typeof labels] ?? link.key?.replace(/_/g, " ")}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.implementation_blueprint?.title ? (
          <p className="mt-1 text-xs text-indigo-700">
            {dashboard.implementation_blueprint.title}
            {dashboard.implementation_blueprint.phase ? ` · Phase ${dashboard.implementation_blueprint.phase}` : ""}
          </p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      {blueprint?.example_industry_packs && blueprint.example_industry_packs.length > 0 ? (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6">
          <h3 className="text-sm font-semibold text-emerald-900">{labels.industryPackExamples}</h3>
          <p className="mt-1 text-xs text-emerald-800">{labels.industryPackExamplesNote}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {blueprint.example_industry_packs.map((pack) => (
              <ExampleIndustryPackCard
                key={pack.pack_key ?? pack.display_name}
                pack={pack}
                labels={labels}
                onActivate={
                  pack.mapped_catalog_pack_key && !pack.is_future
                    ? () => void activatePack(pack.mapped_catalog_pack_key!)
                    : undefined
                }
                activating={activating === pack.mapped_catalog_pack_key}
              />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint?.objectives && blueprint.objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {blueprint.objectives.map((obj) => (
              <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
            ))}
          </div>
        </section>
      ) : null}

      {blueprint?.installation_engine_connection?.steps &&
      blueprint.installation_engine_connection.steps.length > 0 ? (
        <section className="rounded-xl border border-sky-200 bg-sky-50/40 p-6">
          <h3 className="text-sm font-semibold text-sky-900">{labels.installFlow}</h3>
          {blueprint.installation_engine_connection.principle ? (
            <p className="mt-1 text-xs text-sky-800">{blueprint.installation_engine_connection.principle}</p>
          ) : null}
          <ol className="mt-3 space-y-2">
            {blueprint.installation_engine_connection.steps.map((step) => (
              <InstallFlowStepCard key={step.key ?? step.label} step={step} />
            ))}
          </ol>
        </section>
      ) : null}

      {blueprint?.companion_adaptation?.examples && blueprint.companion_adaptation.examples.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4">
          <h3 className="text-sm font-semibold text-violet-900">{labels.companionAdaptation}</h3>
          {blueprint.companion_adaptation.principle ? (
            <p className="mt-1 text-xs text-violet-800">{blueprint.companion_adaptation.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {blueprint.companion_adaptation.examples.map((ex) => (
              <li key={ex.key ?? ex.prompt} className="rounded border border-violet-100 bg-white/60 px-3 py-2">
                <span className="font-medium">
                  {ex.emoji ? `${ex.emoji} ` : ""}
                  {ex.prompt}
                </span>
                {ex.consideration ? <p className="mt-1 text-xs text-violet-700">{ex.consideration}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {blueprint?.limitation_principles?.must_avoid &&
      blueprint.limitation_principles.must_avoid.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
          <h3 className="text-sm font-semibold text-amber-900">{labels.limitationPrinciples}</h3>
          {blueprint.limitation_principles.principle ? (
            <p className="mt-1 text-xs text-amber-800">{blueprint.limitation_principles.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900">
            {blueprint.limitation_principles.must_avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(blueprint?.success_criteria) && blueprint.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {blueprint.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {blueprint?.vision ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-4 py-3">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.blueprintVision}</h3>
          <p className="mt-2 text-sm italic text-indigo-800">{blueprint.vision}</p>
        </section>
      ) : null}

      {dashboard.productization_packs && dashboard.productization_packs.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.productizationPacks}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.productizationPacksNote}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.productization_packs.map((pack) => (
              <ProductizationPackCard
                key={pack.blueprint_key ?? pack.display_name}
                pack={pack}
                labels={labels}
                onActivate={pack.mapped_pack_key && !pack.is_reserved ? () => void activatePack(pack.mapped_pack_key!) : undefined}
                activating={activating === pack.mapped_pack_key}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.modular_addons && dashboard.modular_addons.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.modularAddons}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.modular_addons.map((addon) => (
              <ModularAddonCard key={addon.addon_key ?? addon.label} addon={addon} />
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.packaging_principles && dashboard.packaging_principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.packagingPrinciples}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.packaging_principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      ) : null}

      {dashboard.commercial_packages_distinction ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.commercialPackagesDistinction}</h3>
          {dashboard.commercial_packages_distinction.productization_layer ? (
            <p className="mt-2 text-xs">{dashboard.commercial_packages_distinction.productization_layer}</p>
          ) : null}
          {dashboard.commercial_packages_distinction.subscription_layer ? (
            <p className="mt-1 text-xs">{dashboard.commercial_packages_distinction.subscription_layer}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.website_presentation_principles?.principle ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          <h3 className="text-sm font-semibold text-gray-800">{labels.websitePresentation}</h3>
          <p className="mt-2">{dashboard.website_presentation_principles.principle}</p>
          {dashboard.website_presentation_principles.plain_language ? (
            <p className="mt-2 italic text-gray-700">{dashboard.website_presentation_principles.plain_language}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-4 py-3">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-indigo-800">
            {dashboard.vision_phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}
          </ul>
        </section>
      ) : null}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.active_packs && dashboard.active_packs.length > 0 && (
        <PackSection title={labels.activePacks}>
          {dashboard.active_packs.map((item) => (
            <PackCard
              key={item.pack?.pack_key ?? String(item.activation?.id)}
              pack={item.pack}
              badge={item.customization_status}
              labels={labels}
            />
          ))}
        </PackSection>
      )}

      {dashboard.recommended_packs && dashboard.recommended_packs.length > 0 && (
        <PackSection title={labels.recommendedPacks}>
          {dashboard.recommended_packs.map((pack) => (
            <PackCard
              key={pack.pack_key}
              pack={pack}
              onActivate={() => void activatePack(pack.pack_key)}
              activating={activating === pack.pack_key}
              labels={labels}
            />
          ))}
        </PackSection>
      )}

      {dashboard.available_packs && dashboard.available_packs.length > 0 && (
        <PackSection title={labels.availablePacks}>
          {dashboard.available_packs.map((pack) => (
            <PackCard
              key={pack.pack_key}
              pack={pack}
              onActivate={() => void activatePack(pack.pack_key)}
              activating={activating === pack.pack_key}
              labels={labels}
            />
          ))}
        </PackSection>
      )}

      {dashboard.future_packs && dashboard.future_packs.length > 0 && (
        <PackSection title={labels.futurePacks}>
          {dashboard.future_packs.map((pack) => (
            <div key={String(pack.pack_key)} className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{String(pack.pack_name)}</span>
              <span className="ml-2 text-xs uppercase">{labels.comingSoon}</span>
            </div>
          ))}
        </PackSection>
      )}
    </div>
  );
}

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function ExampleIndustryPackCard({
  pack,
  labels,
  onActivate,
  activating,
}: {
  pack: ExampleIndustryPack;
  labels: Record<string, string>;
  onActivate?: () => void;
  activating?: boolean;
}) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-white/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-emerald-900">{pack.display_name}</p>
        {pack.is_future ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{labels.comingSoon}</span>
        ) : null}
      </div>
      {pack.included_capabilities && pack.included_capabilities.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          {pack.included_capabilities.map((cap) => (
            <li key={cap}>{cap}</li>
          ))}
        </ul>
      ) : null}
      {pack.mapped_catalog_pack_key ? (
        <p className="mt-2 text-xs text-emerald-700">
          {labels.mappedCatalogPack}: {pack.mapped_catalog_pack_key}
        </p>
      ) : null}
      {pack.module_routes && pack.module_routes.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {pack.module_routes.map((route) => (
            <Link key={route} href={route} className="rounded border border-emerald-100 px-2 py-0.5 text-xs text-emerald-800 hover:border-emerald-300">
              {route.replace("/app/", "")}
            </Link>
          ))}
        </div>
      ) : null}
      {onActivate ? (
        <button
          type="button"
          disabled={activating}
          onClick={onActivate}
          className="mt-3 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {activating ? labels.activating : labels.activateCatalogPack}
        </button>
      ) : null}
    </div>
  );
}

function InstallFlowStepCard({ step }: { step: InstallFlowStep }) {
  const content = (
    <>
      <span className="font-medium text-sky-900">
        {step.step ? `${step.step}. ` : ""}
        {step.label}
      </span>
      {step.description ? <p className="mt-1 text-xs text-sky-800">{step.description}</p> : null}
    </>
  );
  if (step.route) {
    return (
      <li>
        <Link href={step.route} className="block rounded-lg border border-sky-100 bg-white/70 px-3 py-2 text-sm hover:border-sky-300">
          {content}
        </Link>
      </li>
    );
  }
  return <li className="rounded-lg border border-sky-100 bg-white/70 px-3 py-2 text-sm">{content}</li>;
}

function ProductizationPackCard({
  pack,
  labels,
  onActivate,
  activating,
}: {
  pack: ProductizationPack;
  labels: Record<string, string>;
  onActivate?: () => void;
  activating?: boolean;
}) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-indigo-900">{pack.display_name}</p>
        {pack.is_reserved ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{labels.comingSoon}</span>
        ) : null}
      </div>
      {pack.outcome_summary ? <p className="mt-1 text-sm text-gray-700">{pack.outcome_summary}</p> : null}
      {pack.target_audience ? (
        <p className="mt-1 text-xs text-gray-500">
          {labels.targetAudience}: {pack.target_audience}
        </p>
      ) : null}
      {pack.examples && pack.examples.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          {pack.examples.map((ex) => <li key={ex}>{ex}</li>)}
        </ul>
      ) : null}
      {pack.mapped_pack_key ? (
        <p className="mt-2 text-xs text-indigo-700">
          {labels.mappedCatalogPack}: {pack.mapped_pack_key}
        </p>
      ) : null}
      {onActivate ? (
        <button
          type="button"
          disabled={activating}
          onClick={onActivate}
          className="mt-3 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {activating ? labels.activating : labels.activateCatalogPack}
        </button>
      ) : null}
    </div>
  );
}

function ModularAddonCard({ addon }: { addon: ModularAddon }) {
  const content = (
    <>
      <p className="text-sm font-medium text-gray-900">{addon.label}</p>
      {addon.outcome ? <p className="mt-1 text-xs text-gray-600">{addon.outcome}</p> : null}
    </>
  );
  if (addon.route) {
    return (
      <Link href={addon.route} className="block rounded-lg border border-gray-100 bg-gray-50/50 p-3 hover:border-indigo-200">
        {content}
      </Link>
    );
  }
  return <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">{content}</div>;
}

function PackSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function PackCard({
  pack,
  badge,
  onActivate,
  activating,
  labels,
}: {
  pack?: BusinessPackRecord;
  badge?: string;
  onActivate?: () => void;
  activating?: boolean;
  labels: Record<string, string>;
}) {
  if (!pack) return null;
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
      <div>
        <p className="font-medium text-gray-900">{pack.pack_name}</p>
        {pack.description && <p className="mt-1 text-sm text-gray-600">{pack.description}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {pack.industry} · v{pack.version ?? "1.0.0"}
          {badge ? ` · ${badge}` : ""}
        </p>
      </div>
      {onActivate && (
        <button
          type="button"
          disabled={activating}
          onClick={onActivate}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {activating ? labels.activating : labels.activate}
        </button>
      )}
    </div>
  );
}
