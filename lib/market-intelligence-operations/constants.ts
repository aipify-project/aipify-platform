export const MARKET_STATUSES = ["growing", "stable", "competitive", "high_risk"] as const;
export const THREAT_SEVERITIES = ["information", "attention", "critical"] as const;

export const MARKET_STATUS_BADGES: Record<string, string> = {
  growing: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-blue-50 text-blue-800 ring-blue-200",
  competitive: "bg-amber-50 text-amber-800 ring-amber-200",
  high_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const THREAT_SEVERITY_BADGES: Record<string, string> = {
  information: "bg-zinc-50 text-zinc-700 ring-zinc-200",
  attention: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
