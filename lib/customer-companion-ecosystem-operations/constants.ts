export const ECOSYSTEM_TABS = [
  "overview",
  "providers",
  "services",
  "marketplace",
  "requests",
  "approvals",
  "ratings",
  "reports",
  "executive",
] as const;

export const PERFORMANCE_BADGES: Record<string, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-800 ring-amber-200",
};

export const VERIFICATION_BADGES: Record<string, string> = {
  pending: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  verified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-800 ring-amber-200",
  suspended: "bg-red-50 text-red-800 ring-red-200",
};

export const CONFIDENCE_BADGES: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  limited: "bg-orange-50 text-orange-800 ring-orange-200",
};
