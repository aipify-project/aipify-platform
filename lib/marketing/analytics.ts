/** Lightweight marketing analytics — client events + server ingestion (Phase 399). */

export type MarketingEventName =
  | "page_view"
  | "page_exit"
  | "navigation"
  | "cta_click"
  | "cta_view"
  | "early_access_submit"
  | "book_demo_submit"
  | "growth_partner_signup"
  | "orb_state_change"
  | "demo_step_view"
  | "scroll_depth"
  | "knowledge_view"
  | "business_pack_view"
  | "conversion";

export type MarketingEventPayload = Record<string, string | number | boolean | undefined>;

/** Module-scoped dedup survives React Strict Mode remounts for the same path. */
let lastIngestedMarketingPageViewPath: string | null = null;

export function shouldIngestMarketingPageView(pagePath: string): boolean {
  if (lastIngestedMarketingPageViewPath === pagePath) return false;
  lastIngestedMarketingPageViewPath = pagePath;
  return true;
}

export function resetMarketingPageViewDedupForTests(): void {
  lastIngestedMarketingPageViewPath = null;
}

export function trackEvent(
  name: MarketingEventName,
  payload: MarketingEventPayload = {}
): void {
  if (typeof window === "undefined") return;

  const detail = { name, ...payload, ts: Date.now() };

  window.dispatchEvent(new CustomEvent("aipify:marketing", { detail }));

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info("[marketing]", name, payload);
  }
}

export const marketingDataAttr = (event: MarketingEventName, label?: string) => ({
  "data-aipify-event": event,
  ...(label ? { "data-aipify-label": label } : {}),
});

export type MarketingWebsiteEventIngest = {
  session_id: string;
  event_type: MarketingEventName;
  page_path?: string;
  previous_path?: string;
  cta_label?: string;
  scroll_depth?: number;
  content_type?: string;
  funnel_stage?: string;
  lead_source?: string;
  campaign_source?: string;
  locale?: string;
  metadata?: MarketingEventPayload;
};

export async function ingestMarketingWebsiteEvent(payload: MarketingWebsiteEventIngest): Promise<void> {
  try {
    await fetch("/api/marketing/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Non-blocking — website must remain usable if analytics fails
  }
}

export function getOrCreateMarketingSessionId(): string {
  if (typeof window === "undefined") return "server";

  const key = "aipify:mkt-session";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;

  const id = `mkt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  sessionStorage.setItem(key, id);
  return id;
}

export function getStoredLeadSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return sessionStorage.getItem("aipify:mkt-lead-source") ?? undefined;
}

export function storeLeadSource(source: string): void {
  if (typeof window === "undefined") return;
  if (!sessionStorage.getItem("aipify:mkt-lead-source")) {
    sessionStorage.setItem("aipify:mkt-lead-source", source);
  }
}

export function getStoredCampaignSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return sessionStorage.getItem("aipify:mkt-campaign") ?? undefined;
}

export function storeCampaignSource(source: string): void {
  if (typeof window === "undefined") return;
  if (!sessionStorage.getItem("aipify:mkt-campaign")) {
    sessionStorage.setItem("aipify:mkt-campaign", source);
  }
}
