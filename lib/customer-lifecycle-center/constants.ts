export const LIFECYCLE_STAGES = [
  "lead",
  "registered",
  "trial",
  "active",
  "expansion",
  "at_risk",
  "churned",
  "reactivated",
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

export const HEALTH_STATUSES = [
  "excellent",
  "healthy",
  "monitor",
  "at_risk",
  "critical",
] as const;

export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export const RECOMMENDED_ACTIONS = [
  "contact_customer",
  "schedule_onboarding",
  "offer_training",
  "escalate_success",
  "monitor",
] as const;

export type RecommendedAction = (typeof RECOMMENDED_ACTIONS)[number];

export const PLAN_TYPES = ["starter", "growth", "business", "enterprise"] as const;

export type PlanType = (typeof PLAN_TYPES)[number];

export const STAGE_BADGES: Record<LifecycleStage, string> = {
  lead: "bg-gray-100 text-gray-800 ring-gray-200",
  registered: "bg-blue-50 text-blue-800 ring-blue-200",
  trial: "bg-sky-50 text-sky-800 ring-sky-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  expansion: "bg-violet-50 text-violet-800 ring-violet-200",
  at_risk: "bg-amber-50 text-amber-900 ring-amber-200",
  churned: "bg-red-50 text-red-800 ring-red-200",
  reactivated: "bg-teal-50 text-teal-800 ring-teal-200",
};

export const HEALTH_STATUS_BADGES: Record<HealthStatus, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-green-50 text-green-800 ring-green-200",
  monitor: "bg-amber-50 text-amber-900 ring-amber-200",
  at_risk: "bg-orange-50 text-orange-900 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const HEALTH_SCORE_EXCELLENT = 90;
export const HEALTH_SCORE_HEALTHY = 75;
export const HEALTH_SCORE_MONITOR = 60;
export const HEALTH_SCORE_AT_RISK = 40;
