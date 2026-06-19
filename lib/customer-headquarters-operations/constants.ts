export const HEADQUARTERS_TABS = [
  "overview",
  "operations_room",
  "executive_room",
  "departments",
  "live_activity",
  "approvals",
  "alerts",
  "companion",
  "reports",
] as const;

export const PULSE_STATUS_BADGES: Record<string, string> = {
  strong: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  slowing: "bg-amber-50 text-amber-800 ring-amber-200",
  immediate_review: "bg-red-50 text-red-800 ring-red-200",
};

export const DEPARTMENT_STATUS_BADGES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  overloaded: "bg-orange-50 text-orange-800 ring-orange-200",
  watch: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
  offline: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const ACTIVITY_STATUS_BADGES: Record<string, string> = {
  live: "bg-blue-50 text-blue-800 ring-blue-200",
  attention: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const ALERT_PRIORITY_BADGES: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const ACTION_STATUS_BADGES: Record<string, string> = {
  open: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  in_progress: "bg-blue-50 text-blue-800 ring-blue-200",
  blocked: "bg-red-50 text-red-800 ring-red-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  overdue: "bg-orange-50 text-orange-800 ring-orange-200",
};

export const WAR_ROOM_STATUS_BADGES: Record<string, string> = {
  standby: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  active: "bg-red-50 text-red-800 ring-red-200",
  monitoring: "bg-amber-50 text-amber-800 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const METRIC_TREND_BADGES: Record<string, string> = {
  up: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  down: "bg-red-50 text-red-800 ring-red-200",
  stable: "bg-blue-50 text-blue-800 ring-blue-200",
  volatile: "bg-amber-50 text-amber-800 ring-amber-200",
};
