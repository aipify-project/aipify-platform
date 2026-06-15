export const HEALTH_CATEGORIES = [
  "healthy",
  "stable",
  "attention_needed",
  "at_risk",
] as const;

export type HealthCategory = (typeof HEALTH_CATEGORIES)[number];

export const HEALTH_TRENDS = ["improving", "stable", "declining"] as const;

export type HealthTrend = (typeof HEALTH_TRENDS)[number];

export const SUPPORT_STATUSES = ["none", "open", "escalated", "resolved"] as const;

export type SupportStatus = (typeof SUPPORT_STATUSES)[number];

export const WARNING_SIGNALS = [
  "inactive_30_days",
  "usage_decline",
  "failed_onboarding",
  "repeated_support_topic",
  "unresolved_tickets",
  "negative_feedback",
  "expiring_payment",
  "declining_engagement",
] as const;

export type WarningSignal = (typeof WARNING_SIGNALS)[number];

export const RECOMMENDATION_TYPES = [
  "onboarding_assistance",
  "training_session",
  "unused_features",
  "follow_up_communication",
  "review_support_cases",
  "verify_billing",
] as const;

export type RecommendationType = (typeof RECOMMENDATION_TYPES)[number];

export const RECOVERY_WORKFLOW_TYPES = [
  "success_outreach",
  "guided_onboarding",
  "training_recommendation",
  "customer_check_in",
] as const;

export type RecoveryWorkflowType = (typeof RECOVERY_WORKFLOW_TYPES)[number];

export const HEALTH_CATEGORY_BADGES: Record<HealthCategory, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-blue-50 text-blue-800 ring-blue-200",
  attention_needed: "bg-amber-50 text-amber-900 ring-amber-200",
  at_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const TREND_ICONS: Record<HealthTrend, string> = {
  improving: "↑",
  stable: "→",
  declining: "↓",
};
