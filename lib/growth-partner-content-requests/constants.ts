export const RESOURCE_TYPES = [
  "social_media_campaign",
  "tiktok_video",
  "linkedin_campaign",
  "presentation_deck",
  "one_pager",
  "industry_brochure",
  "email_sequence",
  "webinar_materials",
  "event_materials",
  "customer_case_study",
  "product_demo_video",
  "industry_campaign",
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const TARGET_AUDIENCES = [
  "small_business",
  "enterprise",
  "healthcare",
  "accounting",
  "ecommerce",
  "education",
  "government",
  "manufacturing",
] as const;
export type TargetAudience = (typeof TARGET_AUDIENCES)[number];

export const REQUEST_STATUSES = [
  "submitted",
  "under_review",
  "approved",
  "in_production",
  "internal_review",
  "published",
  "declined",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const WORKFLOW_STAGES = [
  "submitted",
  "under_review",
  "approved",
  "in_production",
  "internal_review",
  "published",
] as const;
export type WorkflowStage = (typeof WORKFLOW_STAGES)[number];

export const DELIVERY_METHODS = [
  "marketing_center",
  "direct_download",
  "campaign_library",
  "presentation_center",
] as const;
export type DeliveryMethod = (typeof DELIVERY_METHODS)[number];

export const MARKETING_LANGUAGES = ["en", "no", "sv", "da"] as const;
export type ContentLanguage = (typeof MARKETING_LANGUAGES)[number];

export const CONTENT_SURFACES = ["super", "partner"] as const;
export type ContentSurface = (typeof CONTENT_SURFACES)[number];

export const NOTIFICATION_TYPES = [
  "submitted",
  "approved",
  "clarification_required",
  "published",
  "declined",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const STATUS_BADGES: Record<RequestStatus, string> = {
  submitted: "bg-slate-100 text-slate-700 ring-slate-200",
  under_review: "bg-blue-50 text-blue-900 ring-blue-200",
  approved: "bg-indigo-50 text-indigo-900 ring-indigo-200",
  in_production: "bg-amber-50 text-amber-900 ring-amber-200",
  internal_review: "bg-purple-50 text-purple-900 ring-purple-200",
  published: "bg-green-50 text-green-800 ring-green-200",
  declined: "bg-red-50 text-red-900 ring-red-200",
};

export const WORKFLOW_BADGES: Record<WorkflowStage, string> = {
  submitted: "bg-slate-100 text-slate-700 ring-slate-200",
  under_review: "bg-blue-50 text-blue-900 ring-blue-200",
  approved: "bg-indigo-50 text-indigo-900 ring-indigo-200",
  in_production: "bg-amber-50 text-amber-900 ring-amber-200",
  internal_review: "bg-purple-50 text-purple-900 ring-purple-200",
  published: "bg-green-50 text-green-800 ring-green-200",
};
