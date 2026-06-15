export const JOURNEY_STAGES = [
  "registration",
  "email_verification",
  "first_login",
  "onboarding_started",
  "onboarding_completed",
  "first_user_invited",
  "first_integration_connected",
  "first_ai_interaction",
  "first_business_outcome",
  "subscription_activated",
  "expansion",
] as const;

export type JourneyStage = (typeof JOURNEY_STAGES)[number];

export const DROP_OFF_TYPES = [
  "registration_abandoned",
  "verification_incomplete",
  "onboarding_unfinished",
  "integration_not_completed",
  "trial_expired",
] as const;

export type DropOffType = (typeof DROP_OFF_TYPES)[number];

export const RECOMMENDATION_TYPES = [
  "simplify_onboarding",
  "guidance_tooltip",
  "improve_documentation",
  "proactive_outreach",
  "automation_opportunity",
] as const;

export type RecommendationType = (typeof RECOMMENDATION_TYPES)[number];

export const COMPANY_SIZES = ["solo", "small", "medium", "large", "enterprise"] as const;

export type CompanySize = (typeof COMPANY_SIZES)[number];

export const CUSTOMER_SEGMENTS = [
  "self_service",
  "smb",
  "mid_market",
  "enterprise",
  "pilot",
] as const;

export type CustomerSegment = (typeof CUSTOMER_SEGMENTS)[number];

export const INDUSTRIES = [
  "general",
  "technology",
  "retail",
  "professional_services",
  "healthcare",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const PLAN_TYPES = ["starter", "growth", "business", "enterprise"] as const;

export type PlanType = (typeof PLAN_TYPES)[number];

export const TRENDS = ["improving", "stable", "declining"] as const;

export type JourneyTrend = (typeof TRENDS)[number];

export const EXPORT_FORMATS = ["csv", "xlsx", "pdf"] as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export const STAGE_BADGES: Record<JourneyStage, string> = {
  registration: "bg-gray-100 text-gray-800 ring-gray-200",
  email_verification: "bg-blue-50 text-blue-800 ring-blue-200",
  first_login: "bg-sky-50 text-sky-800 ring-sky-200",
  onboarding_started: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  onboarding_completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  first_user_invited: "bg-violet-50 text-violet-800 ring-violet-200",
  first_integration_connected: "bg-teal-50 text-teal-800 ring-teal-200",
  first_ai_interaction: "bg-cyan-50 text-cyan-800 ring-cyan-200",
  first_business_outcome: "bg-amber-50 text-amber-900 ring-amber-200",
  subscription_activated: "bg-green-50 text-green-800 ring-green-200",
  expansion: "bg-purple-50 text-purple-800 ring-purple-200",
};

export const TREND_ICONS: Record<JourneyTrend, string> = {
  improving: "↑",
  stable: "→",
  declining: "↓",
};
