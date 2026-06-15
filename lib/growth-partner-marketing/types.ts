import type {
  AssetCategory,
  AssetStatus,
  CampaignStatus,
  CampaignType,
  EmailTemplateType,
  MarketingLanguage,
  MarketingSurface,
  PresentationType,
  ProhibitedAction,
} from "./constants";

export type MarketingOverview = {
  available_campaigns: number;
  marketing_assets: number;
  recently_updated: number;
  campaign_performance: number;
  upcoming_promotions: number;
  localized_resources: number;
};

export type MarketingAsset = {
  id: string;
  asset_name: string;
  category: AssetCategory;
  language: MarketingLanguage;
  version: string;
  status: AssetStatus;
  file_format: string;
  download_count: number;
  updated_at: string;
};

export type MarketingCampaign = {
  id: string;
  campaign_name: string;
  objective: string;
  campaign_type: CampaignType;
  target_audience: string;
  start_date: string;
  end_date: string | null;
  status: CampaignStatus;
  performance_score: number;
  asset_count: number;
};

export type MarketingEmailTemplate = {
  id: string;
  template_name: string;
  template_type: EmailTemplateType;
  language: MarketingLanguage;
  subject_line: string;
  body_preview: string;
  download_count: number;
};

export type MarketingPresentation = {
  id: string;
  title: string;
  presentation_type: PresentationType;
  language: MarketingLanguage;
  slide_count: number;
  download_count: number;
};

export type BrandGuideline = {
  id: string;
  guideline_key: string;
  title: string;
  content: string;
  sort_order: number;
  updated_at: string;
};

export type MarketingAnalytics = {
  most_downloaded_assets: Array<{ asset_name: string; download_count: number }>;
  most_used_presentations: Array<{ title: string; download_count: number }>;
  highest_performing_campaigns: Array<{ campaign_name: string; performance_score: number }>;
  engagement_trend: string;
};

export type MarketingAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type GrowthPartnerMarketingCenter = {
  has_access: boolean;
  surface?: MarketingSurface;
  overview?: MarketingOverview;
  assets?: MarketingAsset[];
  campaigns?: MarketingCampaign[];
  email_templates?: MarketingEmailTemplate[];
  presentations?: MarketingPresentation[];
  brand_guidelines?: BrandGuideline[];
  analytics?: MarketingAnalytics;
  audit?: MarketingAuditEntry[];
  prohibited_actions?: ProhibitedAction[];
  supported_languages?: string[];
  principle?: string;
};

export type GrowthPartnerMarketingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  overview: Record<string, string>;
  sections: Record<string, string>;
  table: Record<string, string>;
  categories: Record<string, string>;
  assetStatuses: Record<string, string>;
  campaignTypes: Record<string, string>;
  campaignStatuses: Record<string, string>;
  emailTypes: Record<string, string>;
  presentationTypes: Record<string, string>;
  languages: Record<string, string>;
  prohibited: Record<string, string>;
  analytics: Record<string, string>;
  quickActions: Record<string, string>;
  youDecide: string;
};
