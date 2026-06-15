export const EXECUTIVE_PERIODS = ["today", "7d", "30d", "quarter", "year"] as const;

export type ExecutivePeriod = (typeof EXECUTIVE_PERIODS)[number];

export const ACTION_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export type ActionPriority = (typeof ACTION_PRIORITIES)[number];

export const ACTION_CATEGORIES = [
  "enterprise_contract",
  "billing_exception",
  "security_incident",
  "customer_escalation",
  "major_opportunity",
] as const;

export type ActionCategory = (typeof ACTION_CATEGORIES)[number];

export const HEALTH_STATUSES = [
  "excellent",
  "healthy",
  "attention_required",
  "critical",
] as const;

export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export const ALERT_TYPES = [
  "revenue_decline",
  "churn_spike",
  "security_incident",
  "payment_provider_failure",
  "major_outage",
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

export const CALENDAR_EVENT_TYPES = [
  "enterprise_renewal",
  "customer_review",
  "product_launch",
  "strategic_meeting",
] as const;

export type CalendarEventType = (typeof CALENDAR_EVENT_TYPES)[number];

export const SYSTEM_STATUSES = ["operational", "healthy", "degraded", "attention"] as const;

export type SystemStatus = (typeof SYSTEM_STATUSES)[number];

export const PRIORITY_BADGES: Record<ActionPriority, string> = {
  low: "bg-gray-100 text-gray-800 ring-gray-200",
  medium: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const HEALTH_STATUS_BADGES: Record<HealthStatus, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-sky-50 text-sky-800 ring-sky-200",
  attention_required: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const SYSTEM_STATUS_BADGES: Record<string, string> = {
  operational: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  degraded: "bg-amber-50 text-amber-900 ring-amber-200",
  attention: "bg-amber-50 text-amber-900 ring-amber-200",
};
