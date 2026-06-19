export const MEMORY_EVOLUTION_TABS = [
  "overview",
  "personal_memory",
  "organization_memory",
  "preferences",
  "context",
  "learning",
  "memory_governance",
  "reports",
  "executive",
] as const;

export const MEMORY_STATUS_BADGES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-800 ring-amber-200",
  restricted: "bg-orange-50 text-orange-800 ring-orange-200",
  disabled: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export const HEALTH_LABEL_BADGES: Record<string, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-800 ring-amber-200",
  attention: "bg-red-50 text-red-800 ring-red-200",
};
