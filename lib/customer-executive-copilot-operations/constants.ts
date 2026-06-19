export const EXECUTIVE_COPILOT_TABS = [
  "overview",
  "briefings",
  "decisions",
  "approvals",
  "recommendations",
  "execution",
  "reports",
  "strategy",
] as const;

export const CONFIDENCE_BADGES: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  limited: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export const APPROVAL_STATUS_BADGES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  denied: "bg-red-50 text-red-800 ring-red-200",
  expired: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export const PRIORITY_BADGES: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const HEALTH_STATUS_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  watch: "bg-amber-50 text-amber-800 ring-amber-200",
  at_risk: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const DECISION_STATUS_BADGES: Record<string, string> = {
  requested: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  analysis: "bg-blue-50 text-blue-800 ring-blue-200",
  options_ready: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  pending_approval: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-800 ring-red-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const EXECUTION_STATUS_BADGES: Record<string, string> = {
  queued: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  in_progress: "bg-blue-50 text-blue-800 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  failed: "bg-red-50 text-red-800 ring-red-200",
  cancelled: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};
