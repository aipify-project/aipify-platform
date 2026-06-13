"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ACTION_MARKETPLACE_CORE_PRINCIPLE,
  ACTION_MARKETPLACE_VISION,
  parseCompanionActionMarketplaceCenter,
  type ActionProvider,
  type CompanionActionMarketplaceCenter,
} from "@/lib/companion-action-marketplace";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  visionTitle: string;
  installedTitle: string;
  recommendedTitle: string;
  catalogTitle: string;
  historyTitle: string;
  governanceTitle: string;
  usageTitle: string;
  executionFlowTitle: string;
  install: string;
  requestAction: string;
  usageContext: string;
  savePreferences: string;
  privacyNote: string;
  marketplaceLink: string;
  companionMarketplaceLink: string;
  approvalsLink: string;
  lifeEventsLink: string;
  categories: Record<string, string>;
};

type CompanionActionMarketplacePanelProps = {
  labels: PanelLabels;
};

function ProviderCard({
  provider,
  labels,
  canActivate,
  onInstall,
  onRequest,
}: {
  provider: ActionProvider;
  labels: PanelLabels;
  canActivate: boolean;
  onInstall: (key: string) => void;
  onRequest: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{provider.provider_name}</p>
          <p className="text-xs text-gray-500">L{provider.governance_level}</p>
        </div>
        {provider.health_score != null && (
          <span className="text-xs text-emerald-700">{provider.health_score}% health</span>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">{provider.integration_status}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {canActivate && !provider.installed && (
          <button
            type="button"
            onClick={() => onInstall(provider.provider_key)}
            className="rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-800"
          >
            {labels.install}
          </button>
        )}
        {provider.installed && canActivate && (
          <button
            type="button"
            onClick={() => onRequest(provider.provider_key)}
            className="rounded-lg border border-violet-300 px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-50"
          >
            {labels.requestAction}
          </button>
        )}
      </div>
    </div>
  );
}

export function CompanionActionMarketplacePanel({ labels }: CompanionActionMarketplacePanelProps) {
  const [center, setCenter] = useState<CompanionActionMarketplaceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageContext, setUsageContext] = useState("both");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/companion-action-marketplace/center");
    if (res.ok) {
      const parsed = parseCompanionActionMarketplaceCenter(await res.json());
      setCenter(parsed);
      if (parsed.user_preferences?.usage_context) {
        setUsageContext(parsed.user_preferences.usage_context);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/companion-action-marketplace/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.marketplace && (
          <Link href={center.links.marketplace} className="text-violet-600 hover:underline">
            {labels.marketplaceLink}
          </Link>
        )}
        {center?.links?.companion_marketplace && (
          <Link href={center.links.companion_marketplace} className="text-violet-600 hover:underline">
            {labels.companionMarketplaceLink}
          </Link>
        )}
        {center?.links?.approvals && (
          <Link href={center.links.approvals} className="text-violet-600 hover:underline">
            {labels.approvalsLink}
          </Link>
        )}
        {center?.links?.life_events && (
          <Link href={center.links.life_events} className="text-violet-600 hover:underline">
            {labels.lifeEventsLink}
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <h2 className="text-xl font-bold text-gray-900">{labels.title}</h2>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-violet-900">
          {labels.corePrinciple}: {ACTION_MARKETPLACE_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.visionTitle}: {ACTION_MARKETPLACE_VISION}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-xs text-gray-500">
            {labels.privacyNote}: {center.privacy_note}
          </p>
        )}
      </div>

      {center?.usage_trends && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.usageTitle}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {Object.entries(center.usage_trends).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
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
              <li key={rec.provider_key} className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="font-medium">{rec.provider_name ?? rec.provider_key}</p>
                <p className="mt-1 text-gray-600">{rec.message}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.installed_providers.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.installedTitle}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.installed_providers.map((provider) => (
              <ProviderCard
                key={provider.provider_key}
                provider={provider}
                labels={labels}
                canActivate={center.can_activate}
                onInstall={(key) => void postAction({ action: "install", provider_key: key })}
                onRequest={(key) =>
                  void postAction({
                    action: "request",
                    provider_key: key,
                    action_category: provider.category,
                  })
                }
              />
            ))}
          </div>
        </section>
      )}

      {center?.governance_warnings && center.governance_warnings.length > 0 && (
        <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
          <h3 className="font-semibold text-rose-900">{labels.governanceTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm text-rose-800">
            {center.governance_warnings.map((w) => (
              <li key={`${w.provider_key}-${w.message}`}>{w.message}</li>
            ))}
          </ul>
        </section>
      )}

      {center && center.action_history.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.historyTitle}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {center.action_history.map((entry) => (
              <li key={entry.request_key} className="rounded-lg border px-3 py-2">
                <span className="font-medium">{entry.provider_key}</span>
                <span className="ml-2 text-gray-500">{entry.status}</span>
                {entry.outcome_summary && (
                  <p className="mt-1 text-xs text-gray-600">{entry.outcome_summary}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center?.execution_flow && center.execution_flow.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.executionFlowTitle}</h3>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-gray-700">
            {center.execution_flow.map((step) => (
              <li key={step.step}>
                <span className="font-medium">{step.step}</span>
                {step.description ? <span className="text-gray-600"> — {step.description}</span> : null}
              </li>
            ))}
          </ol>
        </section>
      )}

      {center?.can_manage && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm">
          <label className="flex flex-col gap-1 max-w-xs">
            <span>{labels.usageContext}</span>
            <select
              value={usageContext}
              onChange={(e) => setUsageContext(e.target.value)}
              className="rounded-lg border px-3 py-2"
            >
              <option value="business">Business</option>
              <option value="personal">Personal</option>
              <option value="both">Both</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void postAction({ action: "update_preferences", usage_context: usageContext })}
            className="mt-3 rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-800"
          >
            {labels.savePreferences}
          </button>
        </section>
      )}

      {center && (
        <section className="space-y-6">
          <h3 className="font-semibold text-gray-900">{labels.catalogTitle}</h3>
          {(
            [
              "transportation",
              "food_delivery",
              "flowers_gifts",
              "travel",
              "business_services",
              "lifestyle_services",
            ] as const
          ).map((category) => {
            const items = center.catalog_by_category[category] ?? [];
            if (items.length === 0) return null;
            return (
              <div key={category} className="space-y-3">
                <h4 className="text-sm font-medium text-violet-800">{labels.categories[category]}</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((provider) => (
                    <ProviderCard
                      key={provider.provider_key}
                      provider={provider}
                      labels={labels}
                      canActivate={center.can_activate}
                      onInstall={(key) => void postAction({ action: "install", provider_key: key })}
                      onRequest={(key) =>
                        void postAction({
                          action: "request",
                          provider_key: key,
                          action_category: category,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
