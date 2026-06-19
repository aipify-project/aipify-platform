export const FEDERATION_TABS = [
  "overview",
  "networks",
  "organizations",
  "trust",
  "intelligence",
  "workspaces",
  "governance",
  "reports",
] as const;

export const FEDERATION_STATUS_BADGES: Record<string, string> = {
  pending: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  verified: "bg-blue-50 text-blue-800 ring-blue-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-800 ring-amber-200",
  suspended: "bg-red-50 text-red-800 ring-red-200",
};

export const RISK_LEVEL_BADGES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  elevated: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
