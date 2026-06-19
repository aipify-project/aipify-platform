export const EMPLOYEE_STATUSES = ["active", "training", "requires_review", "restricted", "disabled"] as const;
export const PERFORMANCE_STATUSES = ["excellent", "healthy", "needs_review", "poor_performance"] as const;
export const GOVERNANCE_SEVERITIES = ["information", "attention", "critical"] as const;

export const EMPLOYEE_STATUS_BADGES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  training: "bg-blue-50 text-blue-800 ring-blue-200",
  requires_review: "bg-amber-50 text-amber-800 ring-amber-200",
  restricted: "bg-orange-50 text-orange-800 ring-orange-200",
  disabled: "bg-red-50 text-red-800 ring-red-200",
};

export const PERFORMANCE_STATUS_BADGES: Record<string, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-blue-50 text-blue-800 ring-blue-200",
  needs_review: "bg-amber-50 text-amber-800 ring-amber-200",
  poor_performance: "bg-red-50 text-red-800 ring-red-200",
};

export const GOVERNANCE_SEVERITY_BADGES: Record<string, string> = {
  information: "bg-zinc-50 text-zinc-700 ring-zinc-200",
  attention: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
