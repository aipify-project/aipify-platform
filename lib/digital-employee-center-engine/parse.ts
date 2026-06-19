export type DigitalEmployeeCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  employees?: Record<string, unknown>[];
  roles?: Record<string, unknown>[];
  responsibilities?: Record<string, unknown>[];
  tasks?: Record<string, unknown>[];
  autonomy_levels?: Record<string, unknown>[];
  performance_metrics?: Record<string, unknown>[];
  teams?: Record<string, unknown>[];
  escalations?: Record<string, unknown>[];
  collaboration?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseDigitalEmployeeCenter(raw: unknown): DigitalEmployeeCenter {
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
    employees: Array.isArray(row.employees) ? (row.employees as Record<string, unknown>[]) : [],
    roles: Array.isArray(row.roles) ? (row.roles as Record<string, unknown>[]) : [],
    responsibilities: Array.isArray(row.responsibilities) ? (row.responsibilities as Record<string, unknown>[]) : [],
    tasks: Array.isArray(row.tasks) ? (row.tasks as Record<string, unknown>[]) : [],
    autonomy_levels: Array.isArray(row.autonomy_levels) ? (row.autonomy_levels as Record<string, unknown>[]) : [],
    performance_metrics: Array.isArray(row.performance_metrics)
      ? (row.performance_metrics as Record<string, unknown>[])
      : [],
    teams: Array.isArray(row.teams) ? (row.teams as Record<string, unknown>[]) : [],
    escalations: Array.isArray(row.escalations) ? (row.escalations as Record<string, unknown>[]) : [],
    collaboration: Array.isArray(row.collaboration) ? (row.collaboration as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

export function filterTasksByStatus(
  tasks: Record<string, unknown>[] | undefined,
  status: string
): Record<string, unknown>[] {
  return (tasks ?? []).filter((t) => String(t.task_status) === status);
}
