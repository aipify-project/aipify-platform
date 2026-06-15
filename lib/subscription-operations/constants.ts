export const SUBSCRIPTION_STATUSES = [
  "trial",
  "active",
  "past_due",
  "suspended",
  "cancelled",
  "enterprise_contract",
] as const;

export type SubscriptionDisplayStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const PLAN_TYPES = ["starter", "growth", "business", "enterprise"] as const;

export type PlanType = (typeof PLAN_TYPES)[number];

export const RENEWAL_PERIODS = ["7d", "30d", "90d"] as const;

export type RenewalPeriod = (typeof RENEWAL_PERIODS)[number];

export const FILTER_PRESETS = ["today", "7d", "30d", "quarter", "year"] as const;

export type FilterPreset = (typeof FILTER_PRESETS)[number];

export const SUBSCRIPTION_ACTIONS = [
  "view",
  "upgrade",
  "downgrade",
  "extend_trial",
  "suspend",
  "reactivate",
  "cancel",
  "convert_to_paid",
  "send_reminder",
] as const;

export type SubscriptionAction = (typeof SUBSCRIPTION_ACTIONS)[number];

export const HEALTH_BANDS = ["healthy", "stable", "attention", "critical"] as const;

export type HealthBand = (typeof HEALTH_BANDS)[number];

export const RISK_LEVELS = ["healthy", "needs_attention", "high_risk"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export const STATUS_BADGES: Record<SubscriptionDisplayStatus, string> = {
  trial: "bg-sky-50 text-sky-800 ring-sky-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  past_due: "bg-amber-50 text-amber-900 ring-amber-200",
  suspended: "bg-gray-100 text-gray-800 ring-gray-200",
  cancelled: "bg-red-50 text-red-800 ring-red-200",
  enterprise_contract: "bg-violet-50 text-violet-800 ring-violet-200",
};

export const HEALTH_BAND_BADGES: Record<HealthBand, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-sky-50 text-sky-800 ring-sky-200",
  attention: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const RISK_LEVEL_BADGES: Record<RiskLevel, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_attention: "bg-amber-50 text-amber-900 ring-amber-200",
  high_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const EXPANSION_BADGES: Record<string, string> = {
  high: "bg-violet-50 text-violet-800 ring-violet-200",
  medium: "bg-sky-50 text-sky-800 ring-sky-200",
  low: "bg-gray-50 text-gray-700 ring-gray-200",
};

export const TREND_STYLES = {
  up: "text-emerald-700",
  down: "text-red-700",
  flat: "text-gray-500",
} as const;

export const PAST_DUE_ACTIONS = [
  "retry_payment",
  "contact_customer",
  "switch_payment_method",
  "collections",
  "pause_access",
] as const;

export const TRIAL_AUTOMATED_ACTIONS = [
  "send_reminder",
  "offer_onboarding",
  "discount_campaign",
  "escalate_sales",
] as const;

export const RENEWAL_SUGGESTED_ACTIONS = [
  "schedule_meeting",
  "send_reminder",
  "expansion_package",
  "escalate_leadership",
] as const;
