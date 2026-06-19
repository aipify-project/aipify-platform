export const NETWORK_TABS = [
  "overview",
  "organizations",
  "connections",
  "invitations",
  "collaborations",
  "workspaces",
  "trust",
  "reports",
] as const;

export const ORGANIZATION_STATUS_BADGES: Record<string, string> = {
  pending: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  verified: "bg-blue-50 text-blue-800 ring-blue-200",
  connected: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-800 ring-amber-200",
  suspended: "bg-red-50 text-red-800 ring-red-200",
};

export const TRUST_LEVEL_BADGES: Record<string, string> = {
  trusted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  verified: "bg-blue-50 text-blue-800 ring-blue-200",
  limited_trust: "bg-amber-50 text-amber-800 ring-amber-200",
  review_required: "bg-orange-50 text-orange-800 ring-orange-200",
};

export const REPUTATION_BADGES: Record<string, string> = {
  excellent_partner: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  trusted_supplier: "bg-blue-50 text-blue-800 ring-blue-200",
  review_recommended: "bg-amber-50 text-amber-800 ring-amber-200",
  limited_history: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};
