export const DEVELOPER_TABS = [
  "overview",
  "documentation",
  "apis",
  "sdks",
  "testing",
  "publishing",
  "analytics",
  "audit",
] as const;

export const CERTIFICATION_BADGES: Record<string, string> = {
  pending: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  review: "bg-amber-50 text-amber-800 ring-amber-200",
  certified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};
