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

export const STATUS_BADGES: Record<SubscriptionDisplayStatus, string> = {
  trial: "bg-sky-50 text-sky-800 ring-sky-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  past_due: "bg-amber-50 text-amber-900 ring-amber-200",
  suspended: "bg-gray-100 text-gray-800 ring-gray-200",
  cancelled: "bg-red-50 text-red-800 ring-red-200",
  enterprise_contract: "bg-violet-50 text-violet-800 ring-violet-200",
};

export const PAST_DUE_ACTIONS = [
  "retry_payment",
  "contact_customer",
  "generate_invoice",
  "escalate",
] as const;
