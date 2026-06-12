"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type {
  MarketingBanner,
  MarketingSuccessCriterion,
  SalesExpertMarketingCenter,
} from "@/lib/aipify/sales-expert-operating-system";

type Props = {
  center?: SalesExpertMarketingCenter;
  labels: Record<string, string>;
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
    >
      {copied ? "✓" : label}
    </button>
  );
}

function CopyableBlock({
  content,
  labels,
  mono,
}: {
  content: string;
  labels: Record<string, string>;
  mono?: boolean;
}) {
  return (
    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <pre
        className={`flex-1 overflow-x-auto rounded border border-gray-100 bg-gray-50 p-3 text-xs text-gray-800 ${mono ? "font-mono whitespace-pre-wrap" : "whitespace-pre-wrap"}`}
      >
        {content}
      </pre>
      <CopyButton text={content} label={labels.marketingCopy} />
    </div>
  );
}

function BannerBlock({ banner, labels }: { banner: MarketingBanner; labels: Record<string, string> }) {
  return (
    <li className="rounded border border-gray-100 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{banner.label}</span>
        <span className="text-xs text-gray-500">{banner.width}×{banner.height}</span>
      </div>
      {banner.note ? <p className="mt-1 text-xs text-gray-500">{banner.note}</p> : null}
      {banner.embed_html ? (
        <CopyableBlock content={banner.embed_html} labels={labels} mono />
      ) : null}
    </li>
  );
}

function SuccessCriteriaList({
  criteria,
  labels,
}: {
  criteria?: MarketingSuccessCriterion[];
  labels: Record<string, string>;
}) {
  if (!criteria || criteria.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.marketingSuccessCriteria}</h3>
      <ul className="mt-3 space-y-2">
        {criteria.map((c) => (
          <li key={c.key ?? c.label} className="flex items-start gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
            <span className={c.met ? "text-emerald-600" : "text-gray-400"}>{c.met ? "✓" : "○"}</span>
            <div>
              <span className="font-medium">{c.label}</span>
              {c.note ? <p className="mt-0.5 text-xs text-gray-600">{c.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MarketingCenterTab({ center, labels }: Props) {
  if (!center) {
    return <p className="text-sm text-gray-600">{labels.loading}</p>;
  }

  const packs = center.promotional_text_packs;
  const tracking = center.performance_tracking;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.marketingTitle}</h2>
        {center.mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">
            {labels.marketingMission}: {center.mission}
          </p>
        ) : null}
        {center.abos_principle ? (
          <p className="mt-2 text-xs text-teal-800">{labels.marketingAbosPrinciple}: {center.abos_principle}</p>
        ) : null}
        {center.distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">{labels.marketingDistinctionNote}: {center.distinction_note}</p>
        ) : null}
        {center.mass_unsolicited_outreach === false ? (
          <p className="mt-2 text-xs font-medium text-teal-800">{labels.marketingNoMassEmail}</p>
        ) : null}
      </section>

      {tracking ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.marketingPerformanceTracking}</h3>
          {tracking.privacy_note ? (
            <p className="mt-1 text-xs text-gray-500">{tracking.privacy_note}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.marketingLinkClicks}</p>
              <p className="text-lg font-semibold">{tracking.link_clicks ?? 0}</p>
            </div>
            <div className="rounded border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.marketingLeads}</p>
              <p className="text-lg font-semibold">{tracking.leads ?? 0}</p>
            </div>
            <div className="rounded border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.marketingSignups}</p>
              <p className="text-lg font-semibold">{tracking.signups ?? 0}</p>
            </div>
            <div className="rounded border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.marketingSubscriptions}</p>
              <p className="text-lg font-semibold">{tracking.subscriptions ?? 0}</p>
            </div>
          </div>
          {(tracking.best_banner_key || tracking.best_channel_key) ? (
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
              {tracking.best_banner_key ? (
                <span>{labels.marketingBestBanner}: {tracking.best_banner_key}</span>
              ) : null}
              {tracking.best_channel_key ? (
                <span>{labels.marketingBestChannel}: {tracking.best_channel_key}</span>
              ) : null}
              {tracking.estimated_commission_metadata != null ? (
                <span>
                  {labels.marketingEstimatedCommission}: {tracking.estimated_commission_metadata}{" "}
                  {tracking.currency ?? "NOK"}
                </span>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.marketingPersonalLinks}</h3>
        {center.tracking_slug ? (
          <p className="mt-1 text-xs text-gray-500">
            {labels.marketingTrackingSlug}: {center.tracking_slug}
            {center.preferred_locale ? ` · ${labels.marketingLocale}: ${center.preferred_locale}` : null}
          </p>
        ) : null}
        <ul className="mt-3 space-y-3">
          {(center.personal_links ?? []).map((link) => (
            <li key={link.key} className="rounded border border-gray-100 p-3 text-sm">
              <span className="font-medium">{link.label}</span>
              {link.pattern ? <p className="text-xs text-gray-500">{link.pattern}</p> : null}
              {link.url ? <CopyableBlock content={link.url} labels={labels} /> : null}
            </li>
          ))}
        </ul>
      </section>

      {(center.banners ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.marketingBanners}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.marketingBannerNote}</p>
          <ul className="mt-3 space-y-4">
            {center.banners!.map((banner) => (
              <BannerBlock key={banner.key} banner={banner} labels={labels} />
            ))}
          </ul>
        </section>
      ) : null}

      {packs ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.marketingPromotionalPacks}</h3>
          {packs.locale ? (
            <p className="mt-1 text-xs text-gray-500">{labels.marketingLocale}: {packs.locale}</p>
          ) : null}
          <ul className="mt-3 space-y-4">
            {(packs.packs ?? []).map((pack) => (
              <li key={pack.key} className="rounded border border-gray-100 p-3 text-sm">
                <span className="font-medium">{pack.label}</span>
                {pack.text ? <CopyableBlock content={pack.text} labels={labels} /> : null}
              </li>
            ))}
          </ul>

          {(packs.social_media ?? []).length > 0 ? (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase text-gray-600">{labels.marketingSocialMedia}</h4>
              <ul className="mt-2 space-y-3">
                {packs.social_media!.map((item) => (
                  <li key={item.key} className="rounded border border-gray-100 p-3 text-sm">
                    <span className="font-medium capitalize">{item.key}</span>
                    {item.text ? <CopyableBlock content={item.text} labels={labels} /> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {packs.forum_post ? (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase text-gray-600">{labels.marketingForumPost}</h4>
              <CopyableBlock
                content={`${packs.forum_post.title ?? ""}\n\n${packs.forum_post.body ?? ""}`}
                labels={labels}
              />
            </div>
          ) : null}

          {packs.email_snippet ? (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase text-gray-600">{labels.marketingEmailSnippet}</h4>
              <CopyableBlock
                content={`Subject: ${packs.email_snippet.subject ?? ""}\n\n${packs.email_snippet.body ?? ""}`}
                labels={labels}
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {center.channel_guidance ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.marketingChannelGuidance}</h3>
          {center.channel_guidance.principle ? (
            <p className="mt-1 text-xs text-gray-500">{center.channel_guidance.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {(center.channel_guidance.channels ?? []).map((ch) => (
              <li key={ch.key}>
                <span className="font-medium">{ch.label}</span>
                {ch.guidance ? <span className="text-gray-600"> — {ch.guidance}</span> : null}
              </li>
            ))}
          </ul>
          {(center.channel_guidance.platform_guidance ?? []).length > 0 ? (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase text-gray-600">{labels.marketingPlatformGuidance}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {center.channel_guidance.platform_guidance!.map((pg) => (
                  <li key={pg.platform}>
                    <span className="font-medium">{pg.platform}</span>
                    {pg.note ? <span className="text-gray-600"> — {pg.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {center.forum_guidelines ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm">
          <h3 className="font-semibold">{labels.marketingForumGuidelines}</h3>
          {center.forum_guidelines.principle ? (
            <p className="mt-2 text-gray-700">{center.forum_guidelines.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase text-emerald-800">{labels.marketingEncourage}</h4>
              <ul className="mt-1 list-inside list-disc text-gray-700">
                {(center.forum_guidelines.encourage ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-rose-800">{labels.marketingDiscourage}</h4>
              <ul className="mt-1 list-inside list-disc text-gray-700">
                {(center.forum_guidelines.discourage ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {(center.video_ideas ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.marketingVideoIdeas}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {center.video_ideas!.map((v) => (
              <li key={v.key}>
                <span className="font-medium">{v.title}</span>
                {v.idea ? <span className="text-gray-600"> — {v.idea}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.coach_marketing_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.marketingCoachConnection}</h3>
          {center.coach_marketing_connection.principle ? (
            <p className="mt-2 text-gray-600">{center.coach_marketing_connection.principle}</p>
          ) : null}
          {(center.coach_marketing_connection.companion_examples ?? []).map((ex) => (
            <p key={ex.example} className="mt-1 text-gray-600">
              {ex.emoji} {ex.example}
            </p>
          ))}
        </section>
      ) : null}

      {center.self_love ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm">
          <h3 className="font-semibold">{labels.selfLoveConnection}</h3>
          {center.self_love.principle ? <p className="mt-2 text-gray-700">{center.self_love.principle}</p> : null}
          {(center.self_love.examples ?? []).map((ex) => (
            <p key={ex.example} className="mt-1 text-gray-600">
              {ex.emoji} {ex.example}
            </p>
          ))}
          {center.self_love.route ? (
            <Link href={center.self_love.route} className="mt-3 inline-block text-teal-700 underline">
              {labels.selfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {center.trust ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.marketingTrust}</h3>
          {center.trust.principle ? <p className="mt-2 text-gray-600">{center.trust.principle}</p> : null}
          {(center.trust.experts_should_understand ?? []).length > 0 ? (
            <ul className="mt-3 list-inside list-disc text-gray-600">
              {center.trust.experts_should_understand!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <SuccessCriteriaList criteria={center.success_criteria} labels={labels} />

      {(center.integration_links ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {center.integration_links!.map((link) => (
              <li key={link.key ?? link.route}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-teal-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(center.vision ?? []).length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-teal-900">
            {center.vision!.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
