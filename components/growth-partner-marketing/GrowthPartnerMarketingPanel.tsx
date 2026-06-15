"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CAMPAIGN_STATUS_BADGES,
  parseGrowthPartnerMarketingCenter,
  type GrowthPartnerMarketingCenter,
  type GrowthPartnerMarketingLabels,
  type MarketingSurface,
} from "@/lib/growth-partner-marketing";

type GrowthPartnerMarketingPanelProps = {
  surface: MarketingSurface;
  labels: GrowthPartnerMarketingLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function Pill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

export function GrowthPartnerMarketingPanel({
  surface,
  labels,
  backHref,
}: GrowthPartnerMarketingPanelProps) {
  const [center, setCenter] = useState<GrowthPartnerMarketingCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/growth-partner-marketing/overview?surface=${surface}`);
    if (res.ok) setCenter(parseGrowthPartnerMarketingCenter(await res.json()));
    setLoading(false);
  }, [surface]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const id = String(payload.resource_id ?? payload.campaign_id ?? payload.asset_id ?? action);
      setBusyId(id);
      try {
        const res = await fetch("/api/growth-partner-marketing/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, payload, surface }),
        });
        const data = (await res.json()) as { center?: GrowthPartnerMarketingCenter };
        if (data.center) setCenter(data.center);
        else await load();
      } finally {
        setBusyId(null);
      }
    },
    [load, surface]
  );

  if (loading && !center) {
    return <p className="text-sm text-gray-600">{labels.loading}</p>;
  }

  if (!center?.has_access) {
    return <p className="text-sm text-gray-600">{labels.emptyState}</p>;
  }

  const overview = center.overview;
  const isSuper = surface === "super";

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          </div>
          <Link href={backHref} className="text-sm text-indigo-700 hover:text-indigo-900">
            {labels.back}
          </Link>
        </div>
        {center.principle ? (
          <p className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-900">
            {center.principle}
          </p>
        ) : null}
      </header>

      {overview ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {labels.sections.overview}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <OverviewCard label={labels.overview.availableCampaigns} value={overview.available_campaigns} />
            <OverviewCard label={labels.overview.marketingAssets} value={overview.marketing_assets} />
            <OverviewCard label={labels.overview.recentlyUpdated} value={overview.recently_updated} />
            <OverviewCard
              label={labels.overview.campaignPerformance}
              value={`${overview.campaign_performance}%`}
            />
            <OverviewCard label={labels.overview.upcomingPromotions} value={overview.upcoming_promotions} />
            <OverviewCard label={labels.overview.localizedResources} value={overview.localized_resources} />
          </dl>
        </section>
      ) : null}

      {center.campaigns && center.campaigns.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.campaigns}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2 pr-4">{labels.table.name}</th>
                  <th className="py-2 pr-4">{labels.table.objective}</th>
                  <th className="py-2 pr-4">{labels.table.status}</th>
                  <th className="py-2 pr-4">{labels.table.assets}</th>
                  {isSuper ? <th className="py-2">{labels.table.actions}</th> : null}
                </tr>
              </thead>
              <tbody>
                {center.campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-900">{campaign.campaign_name}</td>
                    <td className="py-3 pr-4 text-gray-600">{campaign.objective}</td>
                    <td className="py-3 pr-4">
                      <Pill
                        label={labels.campaignStatuses[campaign.status]}
                        className={CAMPAIGN_STATUS_BADGES[campaign.status]}
                      />
                    </td>
                    <td className="py-3 pr-4">{campaign.asset_count}</td>
                    {isSuper ? (
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          {campaign.status === "draft" ? (
                            <button
                              type="button"
                              disabled={busyId === campaign.id}
                              onClick={() => handleAction("publish_campaign", { campaign_id: campaign.id })}
                              className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                              {labels.quickActions.publishCampaign}
                            </button>
                          ) : null}
                          {campaign.status !== "archived" ? (
                            <button
                              type="button"
                              disabled={busyId === campaign.id}
                              onClick={() => handleAction("archive_campaign", { campaign_id: campaign.id })}
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              {labels.quickActions.archiveCampaign}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {center.assets && center.assets.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.assetLibrary}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2 pr-4">{labels.table.name}</th>
                  <th className="py-2 pr-4">{labels.table.category}</th>
                  <th className="py-2 pr-4">{labels.table.language}</th>
                  <th className="py-2 pr-4">{labels.table.version}</th>
                  <th className="py-2 pr-4">{labels.table.downloads}</th>
                  <th className="py-2">{labels.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {center.assets.map((asset) => (
                  <tr key={asset.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-900">{asset.asset_name}</td>
                    <td className="py-3 pr-4">{labels.categories[asset.category]}</td>
                    <td className="py-3 pr-4">{labels.languages[asset.language]}</td>
                    <td className="py-3 pr-4">{asset.version}</td>
                    <td className="py-3 pr-4">{asset.download_count}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busyId === asset.id}
                          onClick={() =>
                            handleAction("download", {
                              resource_type: "asset",
                              resource_id: asset.id,
                              format: asset.file_format,
                            })
                          }
                          className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {labels.quickActions.download}
                        </button>
                        {isSuper && asset.status !== "archived" ? (
                          <button
                            type="button"
                            disabled={busyId === asset.id}
                            onClick={() => handleAction("archive_asset", { asset_id: asset.id })}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            {labels.quickActions.archiveAsset}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {center.email_templates && center.email_templates.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.emailTemplates}</h2>
          <ul className="mt-4 space-y-3">
            {center.email_templates.map((template) => (
              <li key={template.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{template.template_name}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {labels.emailTypes[template.template_type]} · {labels.languages[template.language]}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">{template.subject_line}</p>
                    <p className="mt-1 text-sm text-gray-500">{template.body_preview}</p>
                  </div>
                  <button
                    type="button"
                    disabled={busyId === template.id}
                    onClick={() =>
                      handleAction("download", {
                        resource_type: "email_template",
                        resource_id: template.id,
                        format: "html",
                      })
                    }
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {labels.quickActions.download}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.presentations && center.presentations.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.presentations}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {center.presentations.map((deck) => (
              <li key={deck.id} className="rounded-xl border border-gray-100 p-4">
                <p className="font-medium text-gray-900">{deck.title}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.presentationTypes[deck.presentation_type]} · {labels.languages[deck.language]}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {deck.slide_count} {labels.table.slides} · {deck.download_count} {labels.table.downloads}
                </p>
                <button
                  type="button"
                  disabled={busyId === deck.id}
                  onClick={() =>
                    handleAction("download", {
                      resource_type: "presentation",
                      resource_id: deck.id,
                      format: "pptx",
                    })
                  }
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {labels.quickActions.download}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.brand_guidelines && center.brand_guidelines.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.brandGuidelines}</h2>
          <dl className="mt-4 space-y-4">
            {center.brand_guidelines.map((guide) => (
              <div key={guide.id} className="rounded-xl border border-indigo-50 bg-indigo-50/30 p-4">
                <dt className="font-medium text-gray-900">{guide.title}</dt>
                <dd className="mt-1 text-sm text-gray-600">{guide.content}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {center.prohibited_actions && center.prohibited_actions.length > 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <h2 className="text-lg font-semibold text-amber-950">{labels.sections.prohibited}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {center.prohibited_actions.map((key) => (
              <li key={key}>{labels.prohibited[key]}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-amber-800">{labels.youDecide}</p>
        </section>
      ) : null}

      {isSuper && center.analytics ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.analytics}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700">{labels.analytics.mostDownloaded}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {center.analytics.most_downloaded_assets.map((item) => (
                  <li key={item.asset_name}>
                    {item.asset_name} ({item.download_count})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">{labels.analytics.mostUsedPresentations}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {center.analytics.most_used_presentations.map((item) => (
                  <li key={item.title}>
                    {item.title} ({item.download_count})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">{labels.analytics.topCampaigns}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {center.analytics.highest_performing_campaigns.map((item) => (
                  <li key={item.campaign_name}>
                    {item.campaign_name} ({item.performance_score}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {isSuper && center.audit && center.audit.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {center.audit.map((entry) => (
              <li key={entry.id} className="border-b border-gray-50 pb-2">
                <span className="font-medium text-gray-800">{entry.summary}</span>
                <span className="ml-2 text-xs text-gray-400">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
