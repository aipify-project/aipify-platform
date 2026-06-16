"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  businessPackMarketplaceRoute,
  parseBusinessPackMarketplaceEngineDashboard,
  type BusinessPackMarketplaceEngineDashboard,
} from "@/lib/aipify/business-pack-marketplace-engine";

type Props = { labels: Record<string, string> };

export function BusinessPackMarketplaceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<BusinessPackMarketplaceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/business-pack-marketplace-engine/dashboard");
    if (res.ok) setDashboard(parseBusinessPackMarketplaceEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!dashboard?.has_access) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.engineTitle}</h2>
        <p className="mt-2 text-lg font-bold text-indigo-950">{dashboard.principle}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {[
          ["publishedListings", summary.published_listings],
          ["totalViews", summary.total_views],
          ["trialActivations", summary.trial_activations],
          ["installations", summary.installations],
          ["upgradeConversions", summary.upgrade_conversions],
          ["analyticsEvents", summary.analytics_events],
          ["inProgressInstalls", summary.in_progress_installs],
        ].map(([key, value]) => (
          <div key={key as string} className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900">{value ?? 0}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-500">{labels[key as string]}</p>
          </div>
        ))}
      </section>

      {dashboard.governance && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.governance}</h3>
          <dl className="mt-3 space-y-2">
            {Object.entries(dashboard.governance).map(([role, note]) => (
              <div key={role}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{role.replace(/_/g, " ")}</dt>
                <dd className="text-sm text-gray-700">{note}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">{labels.catalogTitle}</h3>
        {(dashboard.listings ?? []).map((listing) => (
          <article key={String(listing.pack_key)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <h4 className="font-semibold text-gray-900">{String(listing.pack_key)}</h4>
              <p className="text-xs text-gray-500">
                {String(listing.category)} · {String(listing.view_count ?? 0)} {labels.views}
              </p>
            </div>
            <Link
              href={String(listing.marketplace_route ?? `/app/marketplace/packs/${listing.pack_key}`)}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
            >
              {labels.viewListing}
            </Link>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-red-100 bg-red-50/40 p-5">
        <h3 className="text-sm font-semibold text-red-900">{labels.forbiddenTitle}</h3>
        <ul className="mt-2 space-y-1 text-sm text-red-950">
          {(dashboard.forbidden ?? []).map((item) => (
            <li key={item} className="flex gap-2"><span>×</span>{item}</li>
          ))}
        </ul>
      </section>

      <Link href={businessPackMarketplaceRoute()} className="inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900">
        {labels.openMarketplace}
      </Link>
    </div>
  );
}
