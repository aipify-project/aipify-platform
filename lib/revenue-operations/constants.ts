export const REVENUE_PROVIDERS = ["stripe", "klarna", "vipps", "dnb"] as const;

export type RevenueProvider = (typeof REVENUE_PROVIDERS)[number];

export const BILLING_EVENT_TYPES = [
  "subscription_created",
  "subscription_activated",
  "subscription_renewed",
  "subscription_upgraded",
  "subscription_downgraded",
  "subscription_cancelled",
  "invoice_paid",
  "payment_failed",
  "refund_processed",
  "trial_converted",
] as const;

export type BillingEventType = (typeof BILLING_EVENT_TYPES)[number];

export const ACTIVATION_STATUSES = ["pending", "completed", "failed"] as const;

export type ActivationStatus = (typeof ACTIVATION_STATUSES)[number];

export const RESOLUTION_STATUSES = ["open", "retrying", "resolved", "escalated"] as const;

export type ResolutionStatus = (typeof RESOLUTION_STATUSES)[number];

export const REVENUE_ACTIONS = [
  "retry_activation",
  "escalate_issue",
  "contact_customer",
  "override_package",
  "review_logs",
  "process_payment_event",
] as const;

export type RevenueAction = (typeof REVENUE_ACTIONS)[number];

export const RESOLUTION_BADGES: Record<string, string> = {
  open: "bg-amber-50 text-amber-900 ring-amber-200",
  retrying: "bg-indigo-50 text-indigo-900 ring-indigo-200",
  resolved: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  escalated: "bg-red-50 text-red-900 ring-red-200",
};

export const OUTCOME_BADGES: Record<string, string> = {
  received: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  processed: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  failed: "bg-red-50 text-red-900 ring-red-200",
  ignored: "bg-neutral-50 text-neutral-600 ring-neutral-200",
};
