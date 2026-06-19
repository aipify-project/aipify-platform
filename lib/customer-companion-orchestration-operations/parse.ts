import type { CompanionOrchestrationCenter, SpecialistRow } from "./types";

function parseSpecialist(row: Record<string, unknown>): SpecialistRow {
  return {
    specialist_key: String(row.specialist_key ?? ""),
    specialist_name: String(row.specialist_name ?? ""),
    specialist_type: row.specialist_type ? String(row.specialist_type) : undefined,
    specialist_status: row.specialist_status ? String(row.specialist_status) : undefined,
    description: row.description ? String(row.description) : undefined,
    linked_skills: row.linked_skills,
    business_packs: row.business_packs,
    workload_pct: row.workload_pct != null ? Number(row.workload_pct) : undefined,
    response_quality_score: row.response_quality_score != null ? Number(row.response_quality_score) : undefined,
    usage_count: row.usage_count != null ? Number(row.usage_count) : undefined,
  };
}

export function parseCompanionOrchestrationOperationsCenter(
  row: Record<string, unknown> | null
): CompanionOrchestrationCenter | null {
  if (!row || typeof row !== "object") return null;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    section: row.section ? String(row.section) : undefined,
    organization: row.organization as { id: string; name: string } | undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    specialists: Array.isArray(row.specialists)
      ? row.specialists.map((r) => parseSpecialist(r as Record<string, unknown>))
      : undefined,
    assignments: Array.isArray(row.assignments) ? row.assignments : undefined,
    coordination: row.coordination as Record<string, unknown> | undefined,
    workloads: Array.isArray(row.workloads) ? row.workloads : undefined,
    approvals: row.approvals as Record<string, unknown> | undefined,
    teams: Array.isArray(row.teams) ? row.teams : undefined,
    meeting_council: Array.isArray(row.meeting_council) ? row.meeting_council : undefined,
    decision_collaborations: Array.isArray(row.decision_collaborations)
      ? row.decision_collaborations
      : undefined,
    integrations: row.integrations as Record<string, unknown> | undefined,
    performance: row.performance as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            event_type: String(e.event_type ?? ""),
            summary: String(e.summary ?? ""),
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    notifications: row.notifications as Record<string, unknown> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
