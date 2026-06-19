export const EXPERTISE_TABS = [
  "overview",
  "expert_directory",
  "knowledge_owners",
  "departments",
  "skills",
  "projects",
  "mentors",
  "reports",
] as const;

export const RISK_LEVEL_BADGES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const OWNERSHIP_STATUS_BADGES: Record<string, string> = {
  owned: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  unowned: "bg-red-50 text-red-800 ring-red-200",
  review_due: "bg-amber-50 text-amber-800 ring-amber-200",
  at_risk: "bg-orange-50 text-orange-800 ring-orange-200",
};

export const AVAILABILITY_BADGES: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  limited: "bg-amber-50 text-amber-800 ring-amber-200",
  busy: "bg-orange-50 text-orange-800 ring-orange-200",
  unavailable: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const CONFIDENCE_BADGES: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const PROFILE_TYPE_BADGES: Record<string, string> = {
  employee: "bg-blue-50 text-blue-800 ring-blue-200",
  manager: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  partner: "bg-purple-50 text-purple-800 ring-purple-200",
  consultant: "bg-violet-50 text-violet-800 ring-violet-200",
  external_expert: "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200",
  knowledge_contributor: "bg-teal-50 text-teal-800 ring-teal-200",
};
