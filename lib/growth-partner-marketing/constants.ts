export const ASSET_CATEGORIES = [
  "banner",
  "social_media_graphic",
  "presentation_deck",
  "brochure",
  "email_template",
  "landing_page_template",
  "product_one_pager",
  "case_study",
  "brand_guidelines",
] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export const ASSET_STATUSES = ["draft", "under_review", "approved", "published", "archived"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const REQUEST_TYPES = [
  "local_campaign",
  "industry_campaign",
  "language_adaptation",
  "event_materials",
  "presentation_concept",
  "customer_collateral",
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export const WORKFLOW_STAGES = [
  "submitted",
  "brand_review",
  "design_production",
  "legal_review",
  "approved",
  "published",
] as const;
export type WorkflowStage = (typeof WORKFLOW_STAGES)[number];

export const APPROVED_MATERIAL_TYPES = [
  "logos",
  "social_media_graphics",
  "presentation_decks",
  "product_brochures",
  "email_templates",
  "case_studies",
  "campaign_assets",
  "video_materials",
  "event_materials",
  "sales_one_pagers",
] as const;
export type ApprovedMaterialType = (typeof APPROVED_MATERIAL_TYPES)[number];

export const CAMPAIGN_TYPES = [
  "awareness",
  "lead_generation",
  "product_launch",
  "enterprise_outreach",
  "referral_growth",
  "seasonal_promotion",
] as const;
export type CampaignType = (typeof CAMPAIGN_TYPES)[number];

export const CAMPAIGN_STATUSES = ["draft", "active", "archived"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const EMAIL_TEMPLATE_TYPES = [
  "initial_outreach",
  "demonstration_invitation",
  "follow_up",
  "proposal_delivery",
  "renewal_conversation",
  "enterprise_introduction",
] as const;
export type EmailTemplateType = (typeof EMAIL_TEMPLATE_TYPES)[number];

export const PRESENTATION_TYPES = [
  "what_is_aipify",
  "executive_overview",
  "enterprise_procurement",
  "growth_partner_introduction",
  "customer_success_stories",
  "industry_use_case",
] as const;
export type PresentationType = (typeof PRESENTATION_TYPES)[number];

export const MARKETING_LANGUAGES = ["en", "no", "sv", "da"] as const;
export type MarketingLanguage = (typeof MARKETING_LANGUAGES)[number];

export const MARKETING_SURFACES = ["super", "partner"] as const;
export type MarketingSurface = (typeof MARKETING_SURFACES)[number];

export const PROHIBITED_ACTIONS = [
  "modify_official_logos",
  "unofficial_advertisements",
  "self_made_videos",
  "unofficial_brochures",
  "edit_recolor_assets",
  "alter_messaging",
  "unofficial_landing_pages",
  "independent_certification",
  "unofficial_social_campaigns",
  "ai_generated_unofficial",
] as const;
export type ProhibitedAction = (typeof PROHIBITED_ACTIONS)[number];

export const STATUS_BADGES: Record<AssetStatus, string> = {
  draft: "bg-amber-50 text-amber-900 ring-amber-200",
  under_review: "bg-blue-50 text-blue-900 ring-blue-200",
  approved: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  published: "bg-green-50 text-green-800 ring-green-200",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const WORKFLOW_STAGE_BADGES: Record<WorkflowStage, string> = {
  submitted: "bg-slate-100 text-slate-700 ring-slate-200",
  brand_review: "bg-blue-50 text-blue-900 ring-blue-200",
  design_production: "bg-indigo-50 text-indigo-900 ring-indigo-200",
  legal_review: "bg-purple-50 text-purple-900 ring-purple-200",
  approved: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  published: "bg-green-50 text-green-800 ring-green-200",
};

export const CAMPAIGN_STATUS_BADGES: Record<CampaignStatus, string> = {
  draft: "bg-amber-50 text-amber-900 ring-amber-200",
  active: "bg-green-50 text-green-800 ring-green-200",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
};
