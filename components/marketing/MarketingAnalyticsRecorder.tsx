"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import type { MarketingEventName } from "@/lib/marketing/analytics";
import {
  getOrCreateMarketingSessionId,
  getStoredCampaignSource,
  getStoredLeadSource,
  ingestMarketingWebsiteEvent,
  shouldIngestMarketingPageView,
  storeCampaignSource,
  storeLeadSource,
} from "@/lib/marketing/analytics";
import {
  resolveCampaignSource,
  resolveContentType,
  resolveFunnelStage,
  resolveLeadSource,
} from "@/lib/marketing/website-intelligence/constants";

function buildIngestPayload(
  name: MarketingEventName,
  pagePath: string,
  previousPath: string | undefined,
  extra: Record<string, string | number | boolean | undefined> = {}
) {
  const leadSource = getStoredLeadSource() ?? resolveLeadSource(document.referrer, window.location.search);
  storeLeadSource(leadSource);
  const campaign = getStoredCampaignSource() ?? resolveCampaignSource(window.location.search);
  if (campaign) storeCampaignSource(campaign);

  return {
    session_id: getOrCreateMarketingSessionId(),
    event_type: name,
    page_path: pagePath,
    previous_path: previousPath,
    content_type: resolveContentType(pagePath),
    funnel_stage: resolveFunnelStage(pagePath, name) ?? undefined,
    lead_source: leadSource,
    campaign_source: campaign,
    locale: document.documentElement.lang || "en",
    cta_label: typeof extra.label === "string" ? extra.label : undefined,
    scroll_depth: typeof extra.depth === "number" ? extra.depth : undefined,
    metadata: Object.fromEntries(
      Object.entries(extra).filter(([k]) => !["label", "depth"].includes(k))
    ),
  };
}

export default function MarketingAnalyticsRecorder() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const leadSource = resolveLeadSource(document.referrer, window.location.search);
    storeLeadSource(leadSource);
    const campaign = resolveCampaignSource(window.location.search);
    if (campaign) storeCampaignSource(campaign);

    try {
      const params = new URLSearchParams(window.location.search);
      const ref =
        params.get("ref") ||
        params.get("partner") ||
        params.get("partner_ref") ||
        params.get("csp_ref");
      if (ref && ref.trim()) {
        void import("@/lib/product-analytics/track").then(({ trackPartnerReferralVisit }) => {
          trackPartnerReferralVisit(ref.trim().slice(0, 80));
        });
      }
    } catch {
      // Analytics must never block marketing pages.
    }
  }, []);

  useEffect(() => {
    const pagePath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    const prev = previousPath.current;

    if (prev && prev !== pagePath) {
      void ingestMarketingWebsiteEvent(
        buildIngestPayload("page_exit", prev, undefined)
      );
      void ingestMarketingWebsiteEvent(
        buildIngestPayload("navigation", pagePath, prev, { from: prev, to: pagePath })
      );
    }

    if (shouldIngestMarketingPageView(pagePath)) {
      void ingestMarketingWebsiteEvent(buildIngestPayload("page_view", pagePath, prev ?? undefined));
    }

    previousPath.current = pagePath;
  }, [pathname, searchParams]);

  useEffect(() => {
    function onMarketingEvent(e: Event) {
      const detail = (e as CustomEvent).detail as {
        name?: MarketingEventName;
        label?: string;
        depth?: number;
        [key: string]: string | number | boolean | undefined;
      };
      if (!detail?.name || detail.name === "page_view") return;

      const pagePath = previousPath.current ?? window.location.pathname;
      const { name, ...rest } = detail;
      void ingestMarketingWebsiteEvent(buildIngestPayload(name, pagePath, undefined, rest));
    }

    window.addEventListener("aipify:marketing", onMarketingEvent);
    return () => window.removeEventListener("aipify:marketing", onMarketingEvent);
  }, []);

  useEffect(() => {
    function onBeforeUnload() {
      const pagePath = previousPath.current;
      if (!pagePath) return;
      void ingestMarketingWebsiteEvent(buildIngestPayload("page_exit", pagePath, undefined));
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return null;
}
