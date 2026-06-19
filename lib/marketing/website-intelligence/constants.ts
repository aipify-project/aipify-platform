export const WEBSITE_INTELLIGENCE_SECTIONS = [
  "overview",
  "traffic",
  "conversions",
  "funnels",
  "content",
  "partners",
  "campaigns",
  "reports",
] as const;

export type WebsiteIntelligenceSection = (typeof WEBSITE_INTELLIGENCE_SECTIONS)[number];

export const MARKETING_FUNNEL_STAGES = [
  "visitor",
  "product_page",
  "business_pack",
  "demo_page",
  "form_submission",
  "qualified_lead",
] as const;

export type MarketingFunnelStage = (typeof MARKETING_FUNNEL_STAGES)[number];

export const MARKETING_LEAD_SOURCES = [
  "direct",
  "organic",
  "growth_partner",
  "social",
  "referral",
  "campaign",
] as const;

export type MarketingLeadSource = (typeof MARKETING_LEAD_SOURCES)[number];

export const MARKETING_CONTENT_TYPES = [
  "general",
  "knowledge",
  "business_pack",
  "enterprise",
  "growth_partner",
  "security",
  "companion",
  "product",
  "pricing",
] as const;

export type MarketingContentType = (typeof MARKETING_CONTENT_TYPES)[number];

export const TRACKED_CTA_LABELS = [
  "book_demo",
  "early_access",
  "growth_partner",
  "learn_more",
  "see_how_it_works",
  "get_started",
] as const;

/** Phase 399 — heatmap provider architecture (implementation optional). */
export const HEATMAP_ARCHITECTURE = {
  clickHeatmaps: { status: "architecture_ready" as const, eventTypes: ["cta_click", "navigation"] },
  scrollHeatmaps: { status: "architecture_ready" as const, eventTypes: ["scroll_depth"] },
  attentionMaps: { status: "architecture_ready" as const, eventTypes: ["scroll_depth", "cta_view"] },
  sessionRecordings: { status: "architecture_ready" as const, requiresConsent: true },
};

export const WEBSITE_REPORT_TYPES = [
  "weekly_website",
  "monthly_growth",
  "quarterly_conversion",
  "partner_acquisition",
  "seo_performance",
  "board_summary",
] as const;

export type WebsiteReportType = (typeof WEBSITE_REPORT_TYPES)[number];

export function resolveContentType(pathname: string): MarketingContentType {
  if (pathname.startsWith("/knowledge")) return "knowledge";
  if (pathname.startsWith("/business-packs")) return "business_pack";
  if (pathname.startsWith("/enterprise")) return "enterprise";
  if (pathname.startsWith("/growth-partners")) return "growth_partner";
  if (pathname.startsWith("/security")) return "security";
  if (pathname.startsWith("/product")) return "product";
  if (pathname.startsWith("/pricing")) return "pricing";
  if (pathname.includes("companion")) return "companion";
  return "general";
}

export function resolveFunnelStage(pathname: string, eventType: string): MarketingFunnelStage | null {
  if (eventType === "book_demo_submit" || eventType === "early_access_submit" || eventType === "growth_partner_signup") {
    return "form_submission";
  }
  if (eventType === "conversion") return "qualified_lead";
  if (pathname.startsWith("/product")) return "product_page";
  if (pathname.startsWith("/business-packs")) return "business_pack";
  if (pathname.startsWith("/book-demo")) return "demo_page";
  if (eventType === "page_view") return "visitor";
  return null;
}

export function resolveLeadSource(referrer: string, search: string): MarketingLeadSource {
  const params = new URLSearchParams(search);
  const utmMedium = params.get("utm_medium")?.toLowerCase() ?? "";
  const utmSource = params.get("utm_source")?.toLowerCase() ?? "";

  if (utmMedium.includes("partner") || utmSource.includes("partner")) return "growth_partner";
  if (utmMedium.includes("cpc") || utmMedium.includes("paid") || params.has("utm_campaign")) return "campaign";
  if (utmMedium.includes("social") || utmSource.includes("linkedin") || utmSource.includes("twitter")) return "social";

  if (!referrer) return "direct";

  try {
    const ref = new URL(referrer);
    const host = ref.hostname.toLowerCase();
    if (host.includes("google") || host.includes("bing") || host.includes("duckduckgo")) return "organic";
    if (host.includes("linkedin") || host.includes("twitter") || host.includes("facebook")) return "social";
    return "referral";
  } catch {
    return "referral";
  }
}

export function resolveCampaignSource(search: string): string | undefined {
  const params = new URLSearchParams(search);
  const campaign = params.get("utm_campaign");
  return campaign ?? undefined;
}
