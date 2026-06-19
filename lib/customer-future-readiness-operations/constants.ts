export const FUTURE_READINESS_TABS = [
  "overview",
  "planning",
  "scenarios",
  "roadmaps",
  "initiatives",
  "opportunities",
  "threats",
  "reports",
] as const;

export const READINESS_LABEL_BADGES: Record<string, string> = {
  future_ready: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  prepared: "bg-blue-50 text-blue-800 ring-blue-200",
  gaps_identified: "bg-amber-50 text-amber-800 ring-amber-200",
  strategic_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const INITIATIVE_STATUS_BADGES: Record<string, string> = {
  planned: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  delayed: "bg-amber-50 text-amber-800 ring-amber-200",
  completed: "bg-blue-50 text-blue-800 ring-blue-200",
  on_hold: "bg-red-50 text-red-800 ring-red-200",
};

export const THREAT_LEVEL_BADGES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  elevated: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
