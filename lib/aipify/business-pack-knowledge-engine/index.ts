export * from "./types";
export * from "./parse";

export const BUSINESS_PACK_KNOWLEDGE_PRINCIPLE =
  "Knowledge should scale faster than support — customers find answers quickly without contacting support.";

export const CATEGORY_STYLE: Record<string, string> = {
  overview: "bg-slate-50 text-slate-800 ring-slate-200",
  getting_started: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  features: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  best_practices: "bg-violet-50 text-violet-800 ring-violet-200",
  troubleshooting: "bg-amber-50 text-amber-900 ring-amber-200",
  release_notes: "bg-blue-50 text-blue-800 ring-blue-200",
  upgrade_guidance: "bg-teal-50 text-teal-800 ring-teal-200",
  advanced_topics: "bg-gray-100 text-gray-700 ring-gray-200",
};
