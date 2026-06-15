import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  CAMPAIGN_STATUSES,
  CAMPAIGN_TYPES,
  EMAIL_TEMPLATE_TYPES,
  MARKETING_LANGUAGES,
  PRESENTATION_TYPES,
  PROHIBITED_ACTIONS,
} from "./constants";
import type {
  BrandGuideline,
  GrowthPartnerMarketingCenter,
  MarketingAnalytics,
  MarketingAsset,
  MarketingAuditEntry,
  MarketingCampaign,
  MarketingEmailTemplate,
  MarketingOverview,
  MarketingPresentation,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): MarketingOverview {
  const row = asRecord(raw) ?? {};
  return {
    available_campaigns: asNumber(row.available_campaigns),
    marketing_assets: asNumber(row.marketing_assets),
    recently_updated: asNumber(row.recently_updated),
    campaign_performance: asNumber(row.campaign_performance),
    upcoming_promotions: asNumber(row.upcoming_promotions),
    localized_resources: asNumber(row.localized_resources),
  };
}

function parseAsset(raw: unknown): MarketingAsset | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    asset_name: asString(row.asset_name),
    category: parseEnum(row.category, ASSET_CATEGORIES, "banner"),
    language: parseEnum(row.language, MARKETING_LANGUAGES, "en"),
    version: asString(row.version, "1.0"),
    status: parseEnum(row.status, ASSET_STATUSES, "published"),
    file_format: asString(row.file_format, "pdf"),
    download_count: asNumber(row.download_count),
    updated_at: asString(row.updated_at),
  };
}

function parseCampaign(raw: unknown): MarketingCampaign | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    campaign_name: asString(row.campaign_name),
    objective: asString(row.objective),
    campaign_type: parseEnum(row.campaign_type, CAMPAIGN_TYPES, "awareness"),
    target_audience: asString(row.target_audience),
    start_date: asString(row.start_date),
    end_date: row.end_date ? asString(row.end_date) : null,
    status: parseEnum(row.status, CAMPAIGN_STATUSES, "active"),
    performance_score: asNumber(row.performance_score),
    asset_count: asNumber(row.asset_count),
  };
}

function parseEmailTemplate(raw: unknown): MarketingEmailTemplate | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    template_name: asString(row.template_name),
    template_type: parseEnum(row.template_type, EMAIL_TEMPLATE_TYPES, "initial_outreach"),
    language: parseEnum(row.language, MARKETING_LANGUAGES, "en"),
    subject_line: asString(row.subject_line),
    body_preview: asString(row.body_preview),
    download_count: asNumber(row.download_count),
  };
}

function parsePresentation(raw: unknown): MarketingPresentation | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    presentation_type: parseEnum(row.presentation_type, PRESENTATION_TYPES, "what_is_aipify"),
    language: parseEnum(row.language, MARKETING_LANGUAGES, "en"),
    slide_count: asNumber(row.slide_count),
    download_count: asNumber(row.download_count),
  };
}

function parseGuideline(raw: unknown): BrandGuideline | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    guideline_key: asString(row.guideline_key),
    title: asString(row.title),
    content: asString(row.content),
    sort_order: asNumber(row.sort_order),
    updated_at: asString(row.updated_at),
  };
}

function parseAnalytics(raw: unknown): MarketingAnalytics {
  const row = asRecord(raw) ?? {};
  const mapPairs = (items: unknown, nameKey: string, countKey: string) =>
    Array.isArray(items)
      ? items.map((item) => {
          const r = asRecord(item) ?? {};
          return {
            [nameKey]: asString(r[nameKey]),
            [countKey]: asNumber(r[countKey]),
          } as Record<string, string | number>;
        })
      : [];

  return {
    most_downloaded_assets: mapPairs(row.most_downloaded_assets, "asset_name", "download_count") as MarketingAnalytics["most_downloaded_assets"],
    most_used_presentations: mapPairs(row.most_used_presentations, "title", "download_count") as MarketingAnalytics["most_used_presentations"],
    highest_performing_campaigns: mapPairs(row.highest_performing_campaigns, "campaign_name", "performance_score") as MarketingAnalytics["highest_performing_campaigns"],
    engagement_trend: asString(row.engagement_trend, "stable"),
  };
}

function parseAudit(raw: unknown): MarketingAuditEntry | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

export function parseGrowthPartnerMarketingCenter(raw: unknown): GrowthPartnerMarketingCenter {
  const row = asRecord(raw) ?? {};
  if (!row.has_access) return { has_access: false };

  return {
    has_access: true,
    surface: asString(row.surface) as GrowthPartnerMarketingCenter["surface"],
    overview: parseOverview(row.overview),
    assets: Array.isArray(row.assets)
      ? row.assets.map(parseAsset).filter((a): a is MarketingAsset => a != null)
      : [],
    campaigns: Array.isArray(row.campaigns)
      ? row.campaigns.map(parseCampaign).filter((c): c is MarketingCampaign => c != null)
      : [],
    email_templates: Array.isArray(row.email_templates)
      ? row.email_templates.map(parseEmailTemplate).filter((e): e is MarketingEmailTemplate => e != null)
      : [],
    presentations: Array.isArray(row.presentations)
      ? row.presentations.map(parsePresentation).filter((p): p is MarketingPresentation => p != null)
      : [],
    brand_guidelines: Array.isArray(row.brand_guidelines)
      ? row.brand_guidelines.map(parseGuideline).filter((g): g is BrandGuideline => g != null)
      : [],
    analytics: parseAnalytics(row.analytics),
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter((a): a is MarketingAuditEntry => a != null)
      : [],
    prohibited_actions: Array.isArray(row.prohibited_actions)
      ? row.prohibited_actions.map((a) => parseEnum(a, PROHIBITED_ACTIONS, "modify_official_logos"))
      : [],
    supported_languages: Array.isArray(row.supported_languages)
      ? row.supported_languages.map((l) => asString(l))
      : [],
    principle: asString(row.principle),
  };
}
