export const RESOURCE_CAPACITY_TABS = [
  "overview",
  "capacity",
  "teams",
  "workloads",
  "allocations",
  "forecasts",
  "availability",
  "reports",
] as const;

export const HEALTH_STATUS_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  at_risk: "bg-amber-50 text-amber-800 ring-amber-200",
  overloaded: "bg-red-50 text-red-800 ring-red-200",
  underutilized: "bg-blue-50 text-blue-800 ring-blue-200",
};

export const AVAILABILITY_STATUS_BADGES: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  partial: "bg-amber-50 text-amber-800 ring-amber-200",
  unavailable: "bg-red-50 text-red-800 ring-red-200",
  idle: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export const DELIVERY_RISK_BADGES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const RESOURCE_TYPE_BADGES: Record<string, string> = {
  employee: "bg-blue-50 text-blue-800 ring-blue-200",
  team: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  department: "bg-purple-50 text-purple-800 ring-purple-200",
  partner: "bg-cyan-50 text-cyan-800 ring-cyan-200",
  contractor: "bg-amber-50 text-amber-800 ring-amber-200",
  vendor: "bg-orange-50 text-orange-800 ring-orange-200",
  specialist: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  asset: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};
