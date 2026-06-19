export const DECISION_MEMORY_TABS = [
  "overview",
  "decisions",
  "approvals",
  "outcomes",
  "lessons",
  "reviews",
  "reports",
] as const;

export const HEALTH_STATUS_BADGES: Record<string, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-green-50 text-green-800 ring-green-200",
  needs_review: "bg-amber-50 text-amber-800 ring-amber-200",
  decision_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const SUCCESS_LEVEL_BADGES: Record<string, string> = {
  successful: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  partially_successful: "bg-amber-50 text-amber-800 ring-amber-200",
  needs_review: "bg-orange-50 text-orange-800 ring-orange-200",
  unsuccessful: "bg-red-50 text-red-800 ring-red-200",
  pending: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export const DECISION_STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-blue-50 text-blue-800 ring-blue-200",
  rejected: "bg-red-50 text-red-800 ring-red-200",
  executed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_due: "bg-orange-50 text-orange-800 ring-orange-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const REVIEW_STATUS_BADGES: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-800 ring-blue-200",
  due: "bg-amber-50 text-amber-800 ring-amber-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  overdue: "bg-red-50 text-red-800 ring-red-200",
  skipped: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const PATTERN_TYPE_BADGES: Record<string, string> = {
  repeated_success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  repeated_failure: "bg-red-50 text-red-800 ring-red-200",
  approval_bottleneck: "bg-orange-50 text-orange-800 ring-orange-200",
  risk_pattern: "bg-amber-50 text-amber-800 ring-amber-200",
  forecast_accuracy: "bg-violet-50 text-violet-800 ring-violet-200",
};
