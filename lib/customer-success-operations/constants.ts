export const SUCCESS_STATUSES = [
  "onboarding",
  "growing",
  "stable",
  "expansion",
  "at_risk",
  "recovery",
] as const;

export type SuccessStatus = (typeof SUCCESS_STATUSES)[number];

export const PLAN_STATUSES = ["active", "completed", "delayed", "cancelled"] as const;

export type PlanStatus = (typeof PLAN_STATUSES)[number];

export const CHECK_IN_TYPES = ["7_day", "30_day", "quarterly_review", "renewal_review"] as const;

export type CheckInType = (typeof CHECK_IN_TYPES)[number];

export const RENEWAL_WINDOWS = ["30d", "60d", "90d"] as const;

export type RenewalWindow = (typeof RENEWAL_WINDOWS)[number];

export const SUCCESS_STATUS_BADGES: Record<SuccessStatus, string> = {
  onboarding: "bg-sky-50 text-sky-800 ring-sky-200",
  growing: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-blue-50 text-blue-800 ring-blue-200",
  expansion: "bg-violet-50 text-violet-800 ring-violet-200",
  at_risk: "bg-amber-50 text-amber-900 ring-amber-200",
  recovery: "bg-orange-50 text-orange-900 ring-orange-200",
};

export const PLAN_STATUS_BADGES: Record<PlanStatus, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  completed: "bg-gray-100 text-gray-800 ring-gray-200",
  delayed: "bg-amber-50 text-amber-900 ring-amber-200",
  cancelled: "bg-red-50 text-red-800 ring-red-200",
};
