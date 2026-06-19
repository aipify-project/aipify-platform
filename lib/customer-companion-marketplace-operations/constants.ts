export const MARKETPLACE_TABS = [
  "overview",
  "extensions",
  "installed",
  "updates",
  "publishers",
  "reviews",
  "categories",
  "reports",
  "executive",
] as const;

export const EXTENSION_STATUS_BADGES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  installing: "bg-blue-50 text-blue-800 ring-blue-200",
  update_available: "bg-amber-50 text-amber-800 ring-amber-200",
  permission_required: "bg-orange-50 text-orange-800 ring-orange-200",
  disabled: "bg-red-50 text-red-800 ring-red-200",
};

export const CERTIFICATION_BADGES: Record<string, string> = {
  pending: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  review: "bg-amber-50 text-amber-800 ring-amber-200",
  certified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};
