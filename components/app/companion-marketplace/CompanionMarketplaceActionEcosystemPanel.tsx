"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COMPANION_EXPANSION_PRINCIPLE,
  MARKETPLACE_CORE_PRINCIPLE,
  MARKETPLACE_PHILOSOPHY,
  parseMarketplaceActionEcosystemCenter,
  type MarketplaceActionCapability,
  type MarketplaceActionEcosystemCenter,
  type MarketplaceCategory,
} from "@/lib/companion-marketplace-action";

type ActionEcosystemLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  expansionPrinciple: string;
  installedTitle: string;
  recommendedTitle: string;
  catalogTitle: string;
  governanceTitle: string;
  usageTitle: string;
  installationFlowTitle: string;
  activate: string;
  deactivate: string;
  activated: string;
  packageRequired: string;
  governanceLevel: string;
  provider: string;
  rating: string;
  pricing: string;
  permissions: string;
  noRecommendations: string;
  noInstalled: string;
  privacyNote: string;
  trustAdoptionLink: string;
  approvalsLink: string;
  billingLink: string;
  categories: Record<MarketplaceCategory, string>;
  governanceLevels: Record<string, string>;
};

type CompanionMarketplaceActionEcosystemPanelProps = {
  labels: ActionEcosystemLabels;
};

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "high":
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function CapabilityCard({
  capability,
  labels,
  canActivate,
  onActivate,
  onDeactivate,
}: {
  capability: MarketplaceActionCapability;
  labels: ActionEcosystemLabels;
  canActivate: boolean;
  onActivate: (key: string) => void;
  onDeactivate: (key: string) => void;
}) {
  const isActive = capability.installed?.status === "active";
  const isPending = capability.installed?.status === "pending";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{capability.skill_name}</p>
          <p className="text-xs text-gray-500">
            {labels.provider}: {capability.provider_name}
          </p>
        </div>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(isActive ? "active" : "pending")}`}>
          L{capability.governance_level}
        </span>
      </div>
      <p className="mt-2 text-gray-600">{capability.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
        {capability.rating != null && (
          <span>
            {labels.rating}: {capability.rating.toFixed(1)}
          </span>
        )}
        {capability.pricing_model && (
          <span>
            {labels.pricing}: {capability.pricing_model}
          </span>
        )}
        <span>{capability.required_package}</span>
      </div>
      {capability.package_allowed === false && (
        <p className="mt-2 text-xs text-amber-700">{labels.packageRequired}</p>
      )}
      {canActivate && !isActive && capability.package_allowed !== false && (
        <button
          type="button"
          onClick={() => onActivate(capability.capability_key)}
          className="mt-3 rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-800"
        >
          {labels.activate}
        </button>
      )}
      {isActive && canActivate && (
        <button
          type="button"
          onClick={() => onDeactivate(capability.capability_key)}
          className="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          {labels.deactivate}
        </button>
      )}
      {isPending && <p className="mt-2 text-xs text-amber-700">{labels.activated}</p>}
    </div>
  );
}

export function CompanionMarketplaceActionEcosystemPanel({
  labels,
}: CompanionMarketplaceActionEcosystemPanelProps) {
  const [center, setCenter] = useState<MarketplaceActionEcosystemCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/companion-marketplace/action-ecosystem/center");
    if (res.ok) setCenter(parseMarketplaceActionEcosystemCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleActivate = async (capabilityKey: string) => {
    setMessage(null);
    const res = await fetch("/api/companion-marketplace/action-ecosystem/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "activate", capability_key: capabilityKey }),
    });
    const data = (await res.json()) as { error?: string; message?: string };
    if (!res.ok || data.error) {
      setMessage(data.message ?? data.error ?? "Activation failed");
      return;
    }
    setMessage(labels.activated);
    await load();
  };

  const handleDeactivate = async (capabilityKey: string) => {
    setMessage(null);
    const res = await fetch("/api/companion-marketplace/action-ecosystem/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deactivate", capability_key: capabilityKey }),
    });
    if (res.ok) await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.trust_adoption && (
          <Link href={center.links.trust_adoption} className="text-violet-600 hover:underline">
            {labels.trustAdoptionLink}
          </Link>
        )}
        {center?.links?.approvals && (
          <Link href={center.links.approvals} className="text-violet-600 hover:underline">
            {labels.approvalsLink}
          </Link>
        )}
        {center?.links?.billing_packages && (
          <Link href={center.links.billing_packages} className="text-violet-600 hover:underline">
            {labels.billingLink}
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <h2 className="text-xl font-bold text-gray-900">{labels.title}</h2>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-violet-900">
          {labels.corePrinciple}: {MARKETPLACE_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-violet-800">
          {labels.philosophyTitle}: {MARKETPLACE_PHILOSOPHY}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.expansionPrinciple}: {COMPANION_EXPANSION_PRINCIPLE}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-xs text-gray-500">
            {labels.privacyNote}: {center.privacy_note}
          </p>
        )}
      </div>

      {message && (
        <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}

      {center?.usage_insights && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.usageTitle}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {Object.entries(center.usage_insights).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold text-gray-900">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center && center.recommended.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h3 className="font-semibold text-indigo-900">{labels.recommendedTitle}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {center.recommended.map((rec) => (
              <li key={rec.capability_key} className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="font-medium">{rec.skill_name ?? rec.capability_key}</p>
                <p className="mt-1 text-gray-600">{rec.message}</p>
                {center.can_activate && rec.package_allowed !== false && (
                  <button
                    type="button"
                    onClick={() => handleActivate(rec.capability_key)}
                    className="mt-2 text-xs font-medium text-indigo-700 hover:underline"
                  >
                    {labels.activate}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.installed.length > 0 ? (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.installedTitle}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.installed.map((cap) => (
              <CapabilityCard
                key={cap.capability_key}
                capability={cap}
                labels={labels}
                canActivate={center.can_activate}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-sm text-gray-500">{labels.noInstalled}</p>
      )}

      {center?.governance_warnings && center.governance_warnings.length > 0 && (
        <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
          <h3 className="font-semibold text-rose-900">{labels.governanceTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {center.governance_warnings.map((warning) => (
              <li key={`${warning.capability_key}-${warning.message}`} className="text-rose-800">
                {warning.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center?.installation_flow && center.installation_flow.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.installationFlowTitle}</h3>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-gray-700">
            {center.installation_flow.map((step) => (
              <li key={step.step}>
                <span className="font-medium">{step.step}</span>
                {step.description ? <span className="text-gray-600"> — {step.description}</span> : null}
              </li>
            ))}
          </ol>
        </section>
      )}

      {center && (
        <section className="space-y-6">
          <h3 className="font-semibold text-gray-900">{labels.catalogTitle}</h3>
          {(["personal_actions", "business_actions", "commerce_actions", "companion_skills"] as const).map(
            (category) => {
              const items = center.catalog_by_category[category] ?? [];
              if (items.length === 0) return null;
              return (
                <div key={category} className="space-y-3">
                  <h4 className="text-sm font-medium text-violet-800">{labels.categories[category]}</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((cap) => (
                      <CapabilityCard
                        key={cap.capability_key}
                        capability={cap}
                        labels={labels}
                        canActivate={center.can_activate}
                        onActivate={handleActivate}
                        onDeactivate={handleDeactivate}
                      />
                    ))}
                  </div>
                </div>
              );
            },
          )}
        </section>
      )}

      {center && center.recommended.length === 0 && (
        <p className="text-sm text-gray-500">{labels.noRecommendations}</p>
      )}
    </div>
  );
}
