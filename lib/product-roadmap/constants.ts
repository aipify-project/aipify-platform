export const ROADMAP_CATEGORIES = [
  "new_feature",
  "improvement",
  "technical_debt",
  "security_enhancement",
  "customer_request",
  "growth_opportunity",
  "strategic_initiative",
] as const;

export type RoadmapCategory = (typeof ROADMAP_CATEGORIES)[number];

export const ROADMAP_VIEWS = [
  "now",
  "next",
  "later",
  "under_consideration",
  "completed",
] as const;

export type RoadmapView = (typeof ROADMAP_VIEWS)[number];

export const IDEA_SOURCES = [
  "customer_feedback",
  "super_admin",
  "platform_admin",
  "growth_partner",
  "support_team",
  "internal_product",
  "executive_review",
] as const;

export type IdeaSource = (typeof IDEA_SOURCES)[number];

export const PRIORITY_LEVELS = [
  "critical",
  "high",
  "medium",
  "low",
  "future_consideration",
] as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

export const INITIATIVE_STATUSES = [
  "new",
  "under_review",
  "approved",
  "planned",
  "in_development",
  "testing",
  "released",
  "declined",
] as const;

export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number];

export const EFFORT_LEVELS = ["xs", "small", "medium", "large", "xl"] as const;

export type EffortLevel = (typeof EFFORT_LEVELS)[number];

export const IMPACT_LEVELS = ["critical", "high", "medium", "low"] as const;

export type ImpactLevel = (typeof IMPACT_LEVELS)[number];

export const REQUEST_SOURCES = ["customer_feedback", "enterprise", "growth_partner"] as const;

export type RequestSource = (typeof REQUEST_SOURCES)[number];

export const RELEASE_CHANNELS = [
  "release_notes",
  "customer_announcement",
  "in_app_notification",
] as const;

export type ReleaseChannel = (typeof RELEASE_CHANNELS)[number];

export const CATEGORY_BADGES: Record<RoadmapCategory, string> = {
  new_feature: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  improvement: "bg-blue-50 text-blue-800 ring-blue-200",
  technical_debt: "bg-gray-100 text-gray-800 ring-gray-200",
  security_enhancement: "bg-red-50 text-red-800 ring-red-200",
  customer_request: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  growth_opportunity: "bg-violet-50 text-violet-800 ring-violet-200",
  strategic_initiative: "bg-amber-50 text-amber-900 ring-amber-200",
};

export const STATUS_BADGES: Record<InitiativeStatus, string> = {
  new: "bg-gray-100 text-gray-800 ring-gray-200",
  under_review: "bg-sky-50 text-sky-800 ring-sky-200",
  approved: "bg-teal-50 text-teal-800 ring-teal-200",
  planned: "bg-blue-50 text-blue-800 ring-blue-200",
  in_development: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  testing: "bg-amber-50 text-amber-900 ring-amber-200",
  released: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  declined: "bg-red-50 text-red-800 ring-red-200",
};

export const PRIORITY_BADGES: Record<PriorityLevel, string> = {
  critical: "bg-red-50 text-red-800 ring-red-200",
  high: "bg-orange-50 text-orange-900 ring-orange-200",
  medium: "bg-amber-50 text-amber-900 ring-amber-200",
  low: "bg-gray-100 text-gray-700 ring-gray-200",
  future_consideration: "bg-slate-100 text-slate-700 ring-slate-200",
};
