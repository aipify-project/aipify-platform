export const PERSONALITY_TABS = [
  "overview",
  "personality",
  "communication",
  "preferences",
  "relationship_model",
  "interaction_history",
  "adaptation",
  "reports",
  "executive",
] as const;

export const TRAIT_CATEGORY_BADGES: Record<string, string> = {
  positive: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  forbidden: "bg-red-50 text-red-800 ring-red-200",
};

export const CHANNEL_STATUS_BADGES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  attention: "bg-amber-50 text-amber-800 ring-amber-200",
  planned: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};
