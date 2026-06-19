export const MATURITY_EVOLUTION_TABS = [
  "overview",
  "capabilities",
  "assessments",
  "benchmarks",
  "roadmaps",
  "recommendations",
  "reports",
] as const;

export const EVOLUTION_STATUS_BADGES: Record<string, string> = {
  high_maturity: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  improving: "bg-green-50 text-green-800 ring-green-200",
  needs_attention: "bg-amber-50 text-amber-800 ring-amber-200",
  capability_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const MATURITY_LEVEL_BADGES: Record<string, string> = {
  ad_hoc: "bg-red-50 text-red-800 ring-red-200",
  developing: "bg-orange-50 text-orange-800 ring-orange-200",
  defined: "bg-blue-50 text-blue-800 ring-blue-200",
  managed: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  optimized: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const READINESS_STATUS_BADGES: Record<string, string> = {
  low: "bg-red-50 text-red-800 ring-red-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-green-50 text-green-800 ring-green-200",
  ready: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const GAP_STATUS_BADGES: Record<string, string> = {
  open: "bg-red-50 text-red-800 ring-red-200",
  planned: "bg-amber-50 text-amber-800 ring-amber-200",
  in_progress: "bg-blue-50 text-blue-800 ring-blue-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const ROADMAP_STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  active: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};
