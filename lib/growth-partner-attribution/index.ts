import { COMPANY_CONFIG } from "@/lib/company/company.config";

export const GROWTH_PARTNER_ATTRIBUTION_COOKIE = "aipify_gp_ref";
export const GROWTH_PARTNER_SESSION_COOKIE = "aipify_gp_session";

export type GrowthPartnerAttributionCookie = {
  partnerPublicId: string;
  partnerSlug: string;
  profileId?: string;
  sessionKey: string;
  campaignId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  firstTouchAt: string;
  lastTouchAt: string;
};

export type PartnerLinkDestination =
  | "home"
  | "pricing"
  | "book-demo"
  | "business-packs"
  | "growth-partners";

export type PartnerLinkPack = "commerce" | "support" | "hosts";

export function getGrowthPartnerMarketingBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? COMPANY_CONFIG.website).replace(/\/$/, "");
}

export function buildGrowthPartnerPublicUrl(
  slug: string,
  options?: { to?: PartnerLinkDestination; pack?: PartnerLinkPack; campaign?: string }
): string {
  const base = getGrowthPartnerMarketingBaseUrl();
  const params = new URLSearchParams();
  if (options?.to && options.to !== "home") params.set("to", options.to);
  if (options?.pack) params.set("pack", options.pack);
  if (options?.campaign) params.set("campaign", options.campaign);
  const qs = params.toString();
  return `${base}/p/${slug}${qs ? `?${qs}` : ""}`;
}

export function resolvePartnerLinkDestination(
  to: string | null | undefined,
  pack: string | null | undefined
): string {
  if (pack === "commerce") return "/modules?highlight=commerce";
  if (pack === "support") return "/modules?highlight=support";
  if (pack === "hosts") return "/modules?highlight=hosts";
  switch (to) {
    case "pricing":
      return "/pricing";
    case "book-demo":
      return "/book-demo";
    case "business-packs":
      return "/modules";
    case "growth-partners":
      return "/growth-partners";
    default:
      return "/";
  }
}

export function parseAttributionCookie(raw: string | undefined): GrowthPartnerAttributionCookie | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (typeof parsed.partnerPublicId !== "string" || typeof parsed.partnerSlug !== "string") return null;
    return {
      partnerPublicId: parsed.partnerPublicId,
      partnerSlug: parsed.partnerSlug,
      profileId: typeof parsed.profileId === "string" ? parsed.profileId : undefined,
      sessionKey: typeof parsed.sessionKey === "string" ? parsed.sessionKey : "",
      campaignId: typeof parsed.campaignId === "string" ? parsed.campaignId : undefined,
      utmSource: typeof parsed.utmSource === "string" ? parsed.utmSource : undefined,
      utmMedium: typeof parsed.utmMedium === "string" ? parsed.utmMedium : undefined,
      utmCampaign: typeof parsed.utmCampaign === "string" ? parsed.utmCampaign : undefined,
      firstTouchAt: typeof parsed.firstTouchAt === "string" ? parsed.firstTouchAt : new Date().toISOString(),
      lastTouchAt: typeof parsed.lastTouchAt === "string" ? parsed.lastTouchAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function serializeAttributionCookie(value: GrowthPartnerAttributionCookie): string {
  return JSON.stringify(value);
}

export const MARKETING_TEMPLATE_VARIABLES = [
  "partner_name",
  "partner_company",
  "partner_link",
  "partner_qr_code",
  "book_demo_link",
  "pricing_link",
  "business_packs_link",
  "commerce_pack_link",
  "support_pack_link",
  "hosts_pack_link",
] as const;

export function renderMarketingTemplate(body: string, vars: Record<string, string>): string {
  let result = body;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}
