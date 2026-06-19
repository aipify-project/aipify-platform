export type CampaignItem = {
  id: string;
  campaign_number?: string | null;
  name: string;
  campaign_type: string;
  status: string;
  budget_amount?: number | null;
  budget_currency?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  performance_metrics?: Record<string, unknown>;
  domain_id?: string | null;
  business_pack_key?: string | null;
  updated_at?: string | null;
};

export type AudienceItem = {
  id: string;
  audience_number?: string | null;
  name: string;
  segment: string;
  size_estimate?: number | null;
  country?: string | null;
  language?: string | null;
  tags?: unknown[];
  updated_at?: string | null;
};

export type ContentItem = {
  id: string;
  content_number?: string | null;
  title: string;
  content_type: string;
  status: string;
  version?: number | null;
  campaign_id?: string | null;
  channel_keys?: unknown[];
  updated_at?: string | null;
};

export type AssetItem = {
  id: string;
  asset_number?: string | null;
  title: string;
  asset_type: string;
  status: string;
  version?: number | null;
  expires_at?: string | null;
  updated_at?: string | null;
};

export type ChannelItem = {
  id: string;
  channel_key: string;
  name: string;
  channel_type: string;
  platform?: string | null;
  is_active: boolean;
};

export type CalendarEventItem = {
  id: string;
  event_number?: string | null;
  title: string;
  event_type: string;
  starts_at: string;
  ends_at?: string | null;
  campaign_id?: string | null;
};

export type PartnerMaterialItem = {
  id: string;
  material_number?: string | null;
  title: string;
  material_type: string;
  status: string;
  partner_referral_required?: boolean;
  referral_link_template?: string | null;
  distributed_at?: string | null;
};

export type MarketingBrandOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, unknown>;
  campaigns?: CampaignItem[];
  audiences?: AudienceItem[];
  content?: ContentItem[];
  assets?: AssetItem[];
  channels?: ChannelItem[];
  calendar_events?: CalendarEventItem[];
  partner_materials?: PartnerMaterialItem[];
  pending_content?: ContentItem[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  sections?: string[];
  routes?: Record<string, string>;
};
