export const MEMORY_GRAPH_TABS = [
  "overview",
  "relationships",
  "entities",
  "connections",
  "knowledge",
  "decisions",
  "projects",
  "reports",
] as const;

export const RELATIONSHIP_STRENGTH_BADGES: Record<string, string> = {
  weak: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  strong: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const DEPENDENCY_RISK_BADGES: Record<string, string> = {
  low: "bg-green-50 text-green-800 ring-green-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const ENTITY_TYPE_BADGES: Record<string, string> = {
  employee: "bg-blue-50 text-blue-800 ring-blue-200",
  customer: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  partner: "bg-violet-50 text-violet-800 ring-violet-200",
  project: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  document: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  knowledge_asset: "bg-amber-50 text-amber-800 ring-amber-200",
  business_pack: "bg-purple-50 text-purple-800 ring-purple-200",
  custom: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};
