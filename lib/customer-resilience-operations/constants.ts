export const RESILIENCE_TABS = [
  "overview",
  "incidents",
  "continuity",
  "recovery",
  "crisis",
  "dependencies",
  "preparedness",
  "reports",
] as const;

export const RESILIENCE_LABEL_BADGES: Record<string, string> = {
  strong: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-blue-50 text-blue-800 ring-blue-200",
  vulnerable: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const SEVERITY_BADGES: Record<string, string> = {
  minor: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  major: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const INCIDENT_STATUS_BADGES: Record<string, string> = {
  open: "bg-red-50 text-red-800 ring-red-200",
  investigating: "bg-amber-50 text-amber-800 ring-amber-200",
  recovering: "bg-blue-50 text-blue-800 ring-blue-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  closed: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export const RISK_LEVEL_BADGES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  elevated: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
