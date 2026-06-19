import type {
  AssetItem,
  AudienceItem,
  CalendarEventItem,
  CampaignItem,
  ChannelItem,
  ContentItem,
  MarketingBrandOperationsCenter,
  PartnerMaterialItem,
} from "./types";

function mapArr(arr: unknown) {
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
}

function parseCampaign(row: Record<string, unknown>): CampaignItem {
  return {
    id: String(row.id ?? ""),
    campaign_number: typeof row.campaign_number === "string" ? row.campaign_number : null,
    name: String(row.name ?? ""),
    campaign_type: String(row.campaign_type ?? "custom"),
    status: String(row.status ?? "draft"),
    budget_amount: row.budget_amount != null ? Number(row.budget_amount) : null,
    budget_currency: typeof row.budget_currency === "string" ? row.budget_currency : null,
    start_date: typeof row.start_date === "string" ? row.start_date : null,
    end_date: typeof row.end_date === "string" ? row.end_date : null,
    performance_metrics:
      row.performance_metrics && typeof row.performance_metrics === "object"
        ? (row.performance_metrics as Record<string, unknown>)
        : undefined,
    domain_id: typeof row.domain_id === "string" ? row.domain_id : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseAudience(row: Record<string, unknown>): AudienceItem {
  return {
    id: String(row.id ?? ""),
    audience_number: typeof row.audience_number === "string" ? row.audience_number : null,
    name: String(row.name ?? ""),
    segment: String(row.segment ?? "custom"),
    size_estimate: row.size_estimate != null ? Number(row.size_estimate) : null,
    country: typeof row.country === "string" ? row.country : null,
    language: typeof row.language === "string" ? row.language : null,
    tags: Array.isArray(row.tags) ? row.tags : [],
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseContent(row: Record<string, unknown>): ContentItem {
  return {
    id: String(row.id ?? ""),
    content_number: typeof row.content_number === "string" ? row.content_number : null,
    title: String(row.title ?? ""),
    content_type: String(row.content_type ?? "article"),
    status: String(row.status ?? "draft"),
    version: row.version != null ? Number(row.version) : null,
    campaign_id: typeof row.campaign_id === "string" ? row.campaign_id : null,
    channel_keys: Array.isArray(row.channel_keys) ? row.channel_keys : [],
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseAsset(row: Record<string, unknown>): AssetItem {
  return {
    id: String(row.id ?? ""),
    asset_number: typeof row.asset_number === "string" ? row.asset_number : null,
    title: String(row.title ?? ""),
    asset_type: String(row.asset_type ?? "image"),
    status: String(row.status ?? "draft"),
    version: row.version != null ? Number(row.version) : null,
    expires_at: typeof row.expires_at === "string" ? row.expires_at : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseChannel(row: Record<string, unknown>): ChannelItem {
  return {
    id: String(row.id ?? ""),
    channel_key: String(row.channel_key ?? ""),
    name: String(row.name ?? ""),
    channel_type: String(row.channel_type ?? "custom"),
    platform: typeof row.platform === "string" ? row.platform : null,
    is_active: row.is_active !== false,
  };
}

function parseCalendarEvent(row: Record<string, unknown>): CalendarEventItem {
  return {
    id: String(row.id ?? ""),
    event_number: typeof row.event_number === "string" ? row.event_number : null,
    title: String(row.title ?? ""),
    event_type: String(row.event_type ?? "campaign_launch"),
    starts_at: String(row.starts_at ?? ""),
    ends_at: typeof row.ends_at === "string" ? row.ends_at : null,
    campaign_id: typeof row.campaign_id === "string" ? row.campaign_id : null,
  };
}

function parsePartnerMaterial(row: Record<string, unknown>): PartnerMaterialItem {
  return {
    id: String(row.id ?? ""),
    material_number: typeof row.material_number === "string" ? row.material_number : null,
    title: String(row.title ?? ""),
    material_type: String(row.material_type ?? "campaign_asset"),
    status: String(row.status ?? "draft"),
    partner_referral_required: row.partner_referral_required !== false,
    referral_link_template: typeof row.referral_link_template === "string" ? row.referral_link_template : null,
    distributed_at: typeof row.distributed_at === "string" ? row.distributed_at : null,
  };
}

export function parseMarketingBrandOperationsCenter(data: unknown): MarketingBrandOperationsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    philosophy: typeof row.philosophy === "string" ? row.philosophy : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    campaigns: mapArr(row.campaigns).map(parseCampaign),
    audiences: mapArr(row.audiences).map(parseAudience),
    content: mapArr(row.content).map(parseContent),
    assets: mapArr(row.assets).map(parseAsset),
    channels: mapArr(row.channels).map(parseChannel),
    calendar_events: mapArr(row.calendar_events).map(parseCalendarEvent),
    partner_materials: mapArr(row.partner_materials).map(parsePartnerMaterial),
    pending_content: mapArr(row.pending_content).map(parseContent),
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
