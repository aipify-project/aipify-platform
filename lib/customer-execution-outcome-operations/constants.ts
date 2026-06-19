export const EXECUTION_OUTCOME_TABS = [
  "overview",
  "initiatives",
  "actions",
  "owners",
  "deadlines",
  "dependencies",
  "outcomes",
  "reports",
] as const;

export const HEALTH_STATUS_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  delayed: "bg-amber-50 text-amber-800 ring-amber-200",
  at_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const ACTION_STATUS_BADGES: Record<string, string> = {
  pending: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  in_progress: "bg-blue-50 text-blue-800 ring-blue-200",
  blocked: "bg-red-50 text-red-800 ring-red-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  overdue: "bg-orange-50 text-orange-800 ring-orange-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const PRIORITY_BADGES: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const BLOCKER_STATUS_BADGES: Record<string, string> = {
  open: "bg-red-50 text-red-800 ring-red-200",
  mitigating: "bg-amber-50 text-amber-800 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};
