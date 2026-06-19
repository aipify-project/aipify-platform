import type { AiWorkforceCenter } from "./types";

export function parseAiWorkforceCenter(data: unknown): AiWorkforceCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    principle: row.principle as string | undefined,
    supervisor_rule: row.supervisor_rule as string | undefined,
    section: row.section as string | undefined,
    organization: row.organization as AiWorkforceCenter["organization"],
    overview: row.overview as AiWorkforceCenter["overview"],
    digital_employee_registry: row.digital_employee_registry as AiWorkforceCenter["digital_employee_registry"],
    digital_departments: row.digital_departments as AiWorkforceCenter["digital_departments"],
    assignment_engine: row.assignment_engine as AiWorkforceCenter["assignment_engine"],
    skills_framework: row.skills_framework as AiWorkforceCenter["skills_framework"],
    training_engine: row.training_engine as AiWorkforceCenter["training_engine"],
    performance_engine: row.performance_engine as AiWorkforceCenter["performance_engine"],
    workload_balancing: row.workload_balancing as AiWorkforceCenter["workload_balancing"],
    team_structures: row.team_structures as AiWorkforceCenter["team_structures"],
    business_pack_integration: row.business_pack_integration as AiWorkforceCenter["business_pack_integration"],
    marketplace_prepared: row.marketplace_prepared as AiWorkforceCenter["marketplace_prepared"],
    governance_center: row.governance_center as AiWorkforceCenter["governance_center"],
    companion_workforce_manager: row.companion_workforce_manager as Record<string, unknown> | undefined,
    permission_framework: row.permission_framework as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: row.audit_recent as AiWorkforceCenter["audit_recent"],
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error as string | undefined,
  };
}
