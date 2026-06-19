export const PROACTIVE_TABS = [
  "overview",
  "observations",
  "recommendations",
  "prepared_actions",
  "approvals",
  "insights",
  "opportunities",
  "reports",
] as const;

export const OBSERVATION_STATUS_BADGES: Record<string, string> = {
  informational: "bg-blue-50 text-blue-800 ring-blue-200",
  attention_required: "bg-amber-50 text-amber-800 ring-amber-200",
  immediate_review: "bg-red-50 text-red-800 ring-red-200",
};

export const HEALTH_STATUS_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  watch_closely: "bg-amber-50 text-amber-800 ring-amber-200",
  immediate_action: "bg-red-50 text-red-800 ring-red-200",
};

export const PRIORITY_BADGES: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const ACTION_STATUS_BADGES: Record<string, string> = {
  preparing: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  prepared: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pending_approval: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-blue-50 text-blue-800 ring-blue-200",
  rejected: "bg-red-50 text-red-800 ring-red-200",
  delivered: "bg-indigo-50 text-indigo-800 ring-indigo-200",
};

export const RECOMMENDATION_STATUS_BADGES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-800 ring-red-200",
  delivered: "bg-blue-50 text-blue-800 ring-blue-200",
  expired: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};
