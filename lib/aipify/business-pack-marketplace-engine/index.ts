export * from "./types";
export * from "./parse";

export const BUSINESS_PACK_MARKETPLACE_PRINCIPLE = "Discover. Understand. Install. Scale.";

export const MARKETPLACE_CARD_STATUS_STYLE: Record<string, string> = {
  installed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  available: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  upgrade_required: "bg-amber-50 text-amber-900 ring-amber-200",
  trial_available: "bg-sky-50 text-sky-800 ring-sky-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  beta: "bg-sky-50 text-sky-800 ring-sky-200",
  coming_soon: "bg-violet-50 text-violet-800 ring-violet-200",
  deprecated: "bg-amber-50 text-amber-900 ring-amber-200",
  retired: "bg-gray-100 text-gray-600 ring-gray-200",
};
