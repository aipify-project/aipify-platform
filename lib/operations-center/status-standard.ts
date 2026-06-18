export type OperationsStatusKey =
  | "completed"
  | "not_allowed"
  | "requires_attention"
  | "information"
  | "restricted"
  | "verified"
  | "waiting";

export type OperationsStatusLabelKey =
  | "completed"
  | "notAllowed"
  | "requiresAttention"
  | "information"
  | "restricted"
  | "verified"
  | "waiting";

export type OperationsStatusDefinition = {
  symbol: string;
  labelKey: OperationsStatusLabelKey;
};

export const OPERATIONS_STATUS_STANDARD: Record<OperationsStatusKey, OperationsStatusDefinition> = {
  completed: { symbol: "✅", labelKey: "completed" },
  not_allowed: { symbol: "❌", labelKey: "notAllowed" },
  requires_attention: { symbol: "⚠️", labelKey: "requiresAttention" },
  information: { symbol: "ℹ️", labelKey: "information" },
  restricted: { symbol: "🔒", labelKey: "restricted" },
  verified: { symbol: "🛡️", labelKey: "verified" },
  waiting: { symbol: "⏳", labelKey: "waiting" },
};

export const OPERATIONS_DASHBOARD_SECTIONS = [
  "completed",
  "requires_attention",
  "waiting",
  "information",
] as const;

export type OperationsDashboardSection = (typeof OPERATIONS_DASHBOARD_SECTIONS)[number];

export function getOperationsStatusDefinition(
  statusKey: string
): OperationsStatusDefinition {
  if (statusKey in OPERATIONS_STATUS_STANDARD) {
    return OPERATIONS_STATUS_STANDARD[statusKey as OperationsStatusKey];
  }
  return OPERATIONS_STATUS_STANDARD.information;
}
