export const HEALTH_STATUSES = ["healthy", "needs_attention", "at_risk"] as const;
export const GUIDANCE_STATUSES = ["pending", "in_progress", "completed", "skipped"] as const;
export const RISK_TYPES = [
  "low_adoption",
  "inactive_users",
  "failed_integration",
  "missing_setup",
  "unfinished_onboarding",
  "renewal_risk",
  "support_spike",
] as const;
export const RISK_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export const PLAYBOOK_TYPES = [
  "new_customer",
  "low_adoption",
  "renewal",
  "expansion",
  "enterprise",
  "partner_referred",
] as const;
export const PACK_STAGES = [
  "installed",
  "configured",
  "actively_used",
  "optimized",
  "value_measured",
] as const;

export const HEALTH_STATUS_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_attention: "bg-amber-50 text-amber-800 ring-amber-200",
  at_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const SEVERITY_BADGES: Record<string, string> = {
  low: "bg-zinc-50 text-zinc-700 ring-zinc-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
