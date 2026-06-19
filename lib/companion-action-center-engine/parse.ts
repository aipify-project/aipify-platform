export type CompanionActionCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  registry?: Record<string, unknown>[];
  approval_matrix?: Record<string, unknown>[];
  permissions?: Record<string, unknown>[];
  templates?: Record<string, unknown>[];
  real_world?: Record<string, unknown>[];
  safety_rules?: Record<string, unknown>[];
  confirmations?: Record<string, unknown>[];
  execution_flow?: string[];
  business_packs?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseCompanionActionCenter(raw: unknown): CompanionActionCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    executive_dashboard:
      typeof row.executive_dashboard === "object" && row.executive_dashboard
        ? (row.executive_dashboard as Record<string, number | string>)
        : {},
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {},
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    registry: Array.isArray(row.registry) ? (row.registry as Record<string, unknown>[]) : [],
    approval_matrix: Array.isArray(row.approval_matrix) ? (row.approval_matrix as Record<string, unknown>[]) : [],
    permissions: Array.isArray(row.permissions) ? (row.permissions as Record<string, unknown>[]) : [],
    templates: Array.isArray(row.templates) ? (row.templates as Record<string, unknown>[]) : [],
    real_world: Array.isArray(row.real_world) ? (row.real_world as Record<string, unknown>[]) : [],
    safety_rules: Array.isArray(row.safety_rules) ? (row.safety_rules as Record<string, unknown>[]) : [],
    confirmations: Array.isArray(row.confirmations) ? (row.confirmations as Record<string, unknown>[]) : [],
    execution_flow: Array.isArray(row.execution_flow) ? (row.execution_flow as string[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

export function filterActionsByStatus(
  registry: Record<string, unknown>[] | undefined,
  status: string
): Record<string, unknown>[] {
  return (registry ?? []).filter((a) => String(a.action_status) === status);
}
