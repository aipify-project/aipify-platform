export const REVENUE_HEALTH_STATUSES = ["strong_growth", "healthy", "watch_closely", "revenue_risk"] as const;
export const RISK_SEVERITIES = ["information", "attention", "critical"] as const;
export const PIPELINE_STAGES = ["lead", "qualified", "proposal", "negotiation", "decision", "won", "lost", "custom"] as const;

export const REVENUE_HEALTH_BADGES: Record<string, string> = {
  strong_growth: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-blue-50 text-blue-800 ring-blue-200",
  watch_closely: "bg-amber-50 text-amber-800 ring-amber-200",
  revenue_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const RISK_SEVERITY_BADGES: Record<string, string> = {
  information: "bg-zinc-50 text-zinc-700 ring-zinc-200",
  attention: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
