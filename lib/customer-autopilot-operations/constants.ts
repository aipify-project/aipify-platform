export const AUTOPILOT_TABS = [
  "overview",
  "policies",
  "automation_rules",
  "approval_chains",
  "prepared_actions",
  "execution_queue",
  "insights",
  "reports",
] as const;

export const AUTOPILOT_PROFILES = [
  "conservative",
  "balanced",
  "advanced",
  "enterprise",
  "custom",
] as const;

export const POLICY_CATEGORY_BADGES: Record<string, string> = {
  allowed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  approval_required: "bg-amber-50 text-amber-800 ring-amber-200",
  restricted: "bg-orange-50 text-orange-800 ring-orange-200",
  prohibited: "bg-red-50 text-red-800 ring-red-200",
};

export const QUEUE_STATUS_BADGES: Record<string, string> = {
  pending_approval: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  denied: "bg-red-50 text-red-800 ring-red-200",
  executing: "bg-blue-50 text-blue-800 ring-blue-200",
  completed: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  failed: "bg-red-50 text-red-800 ring-red-200",
};

export const CONFIDENCE_BADGES: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  limited: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export const WORKFLOW_STATUS_BADGES: Record<string, string> = {
  available: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  paused: "bg-amber-50 text-amber-800 ring-amber-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const SIGNAL_STATUS_BADGES: Record<string, string> = {
  monitoring: "bg-blue-50 text-blue-800 ring-blue-200",
  attention: "bg-amber-50 text-amber-800 ring-amber-200",
  risk: "bg-red-50 text-red-800 ring-red-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};
