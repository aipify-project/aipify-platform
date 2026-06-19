export const WORKFLOW_PROCESS_TABS = [
  "overview",
  "workflows",
  "templates",
  "automation",
  "approvals",
  "monitoring",
  "analytics",
  "reports",
] as const;

export const HEALTH_STATUS_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_review: "bg-amber-50 text-amber-800 ring-amber-200",
  bottleneck: "bg-red-50 text-red-800 ring-red-200",
};

export const WORKFLOW_STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  paused: "bg-amber-50 text-amber-800 ring-amber-200",
  needs_review: "bg-orange-50 text-orange-800 ring-orange-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const AUTOMATION_LEVEL_BADGES: Record<string, string> = {
  manual: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  assisted: "bg-blue-50 text-blue-800 ring-blue-200",
  semi_automated: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  automated: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const APPROVAL_STATUS_BADGES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  granted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  denied: "bg-red-50 text-red-800 ring-red-200",
  delayed: "bg-orange-50 text-orange-800 ring-orange-200",
};

export const COMPONENT_TYPE_BADGES: Record<string, string> = {
  trigger: "bg-purple-50 text-purple-800 ring-purple-200",
  action: "bg-blue-50 text-blue-800 ring-blue-200",
  decision: "bg-amber-50 text-amber-800 ring-amber-200",
  approval: "bg-orange-50 text-orange-800 ring-orange-200",
  notification: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  task: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  condition: "bg-cyan-50 text-cyan-800 ring-cyan-200",
  outcome: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};
