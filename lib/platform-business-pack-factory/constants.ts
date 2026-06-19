export const BLUEPRINT_STATUSES = [
  "development",
  "review",
  "certified",
  "marketplace_ready",
  "published",
  "deprecated",
] as const;

export const CERTIFICATION_REVIEW_TYPES = [
  "security",
  "governance",
  "localization",
  "companion",
  "mobile",
  "marketplace",
] as const;

export const STATUS_BADGES: Record<string, string> = {
  development: "bg-zinc-50 text-zinc-700 ring-zinc-200",
  review: "bg-amber-50 text-amber-800 ring-amber-200",
  certified: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  marketplace_ready: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  deprecated: "bg-red-50 text-red-800 ring-red-200",
};
