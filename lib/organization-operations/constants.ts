export const HEALTH_STATUSES = ["healthy", "needs_attention", "critical"] as const;
export const ENTITY_TYPES = [
  "company",
  "division",
  "brand",
  "department",
  "location",
  "subsidiary",
  "branch_office",
  "operating_unit",
  "custom",
] as const;
export const WORKSPACE_TYPES = [
  "head_office",
  "retail",
  "support",
  "commerce",
  "warehouse",
  "property_management",
  "executive",
  "general",
  "custom",
] as const;

export const HEALTH_STATUS_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_attention: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
