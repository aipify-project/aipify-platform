export const SKILL_STATUSES = ["active", "installing", "requires_attention", "permission_required", "disabled"] as const;
export const SKILL_HEALTH_STATUSES = ["healthy", "needs_attention", "review_required"] as const;

export const SKILL_STATUS_BADGES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  installing: "bg-blue-50 text-blue-800 ring-blue-200",
  requires_attention: "bg-amber-50 text-amber-800 ring-amber-200",
  permission_required: "bg-orange-50 text-orange-800 ring-orange-200",
  disabled: "bg-red-50 text-red-800 ring-red-200",
};

export const SKILL_HEALTH_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_attention: "bg-amber-50 text-amber-800 ring-amber-200",
  review_required: "bg-red-50 text-red-800 ring-red-200",
};
