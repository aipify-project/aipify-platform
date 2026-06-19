export type AbsenceCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  max_coverage_level?: number;
  can_manage?: boolean;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  availability_levels?: Record<string, unknown>[];
  coverage_levels?: Record<string, unknown>[];
  scopes?: Record<string, unknown>[];
  activation_options?: Record<string, unknown>[];
  employee_settings?: Record<string, unknown>[];
  active_modes?: Record<string, unknown>[];
  team_availability?: Record<string, unknown>[];
  coverage_items?: Record<string, unknown>[];
  delegations?: Record<string, unknown>[];
  response_templates?: Record<string, unknown>[];
  schedules?: Record<string, unknown>[];
  policies?: Record<string, unknown>[];
  return_summaries?: Record<string, unknown>[];
  history_events?: Record<string, unknown>[];
  lead_continuity?: Record<string, unknown>[];
  org_closure?: Record<string, unknown>[];
  department_routing?: Record<string, unknown>[];
  task_coverage?: Record<string, unknown>[];
  message_coverage?: Record<string, unknown>[];
  approval_coverage?: Record<string, unknown>[];
  calendar_integration?: Record<string, unknown>[];
  unexpected_absence?: Record<string, unknown>[];
  urgency_rules?: Record<string, unknown>[];
  knowledge_governance?: Record<string, unknown>[];
  return_workflows?: Record<string, unknown>[];
  since_last_login_meta?: Record<string, unknown>[];
  permission_governance?: Record<string, unknown>[];
  privacy_controls?: Record<string, unknown>[];
  notification_behavior?: Record<string, unknown>[];
  status_display?: Record<string, unknown>[];
  meeting_scheduling?: Record<string, unknown>[];
  customer_expectations?: Record<string, unknown>[];
  business_pack_behavior?: Record<string, unknown>[];
  readiness_checks?: Record<string, unknown>[];
  reports?: Record<string, unknown>[];
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  admin_policies?: Record<string, unknown>[];
};

function arr(row: Record<string, unknown>, key: string) {
  return Array.isArray(row[key]) ? (row[key] as Record<string, unknown>[]) : [];
}

export function parseAbsenceCenter(raw: unknown): AbsenceCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  const stats =
    typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {};

  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    max_coverage_level: typeof row.max_coverage_level === "number" ? row.max_coverage_level : undefined,
    can_manage: row.can_manage === true || row.can_manage === "true",
    stats,
    companion_recommendations: arr(row, "companion_recommendations"),
    availability_levels: arr(row, "availability_levels"),
    coverage_levels: arr(row, "coverage_levels"),
    scopes: arr(row, "scopes"),
    activation_options: arr(row, "activation_options"),
    employee_settings: arr(row, "employee_settings"),
    active_modes: arr(row, "active_modes"),
    team_availability: arr(row, "team_availability"),
    coverage_items: arr(row, "coverage_items"),
    delegations: arr(row, "delegations"),
    response_templates: arr(row, "response_templates"),
    schedules: arr(row, "schedules"),
    policies: arr(row, "policies"),
    return_summaries: arr(row, "return_summaries"),
    history_events: arr(row, "history_events"),
    lead_continuity: arr(row, "lead_continuity"),
    org_closure: arr(row, "org_closure"),
    department_routing: arr(row, "department_routing"),
    task_coverage: arr(row, "task_coverage"),
    message_coverage: arr(row, "message_coverage"),
    approval_coverage: arr(row, "approval_coverage"),
    calendar_integration: arr(row, "calendar_integration"),
    unexpected_absence: arr(row, "unexpected_absence"),
    urgency_rules: arr(row, "urgency_rules"),
    knowledge_governance: arr(row, "knowledge_governance"),
    return_workflows: arr(row, "return_workflows"),
    since_last_login_meta: arr(row, "since_last_login_meta"),
    permission_governance: arr(row, "permission_governance"),
    privacy_controls: arr(row, "privacy_controls"),
    notification_behavior: arr(row, "notification_behavior"),
    status_display: arr(row, "status_display"),
    meeting_scheduling: arr(row, "meeting_scheduling"),
    customer_expectations: arr(row, "customer_expectations"),
    business_pack_behavior: arr(row, "business_pack_behavior"),
    readiness_checks: arr(row, "readiness_checks"),
    reports: arr(row, "reports"),
    audit_recent: arr(row, "audit_recent"),
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
    settings:
      typeof row.settings === "object" && row.settings ? (row.settings as Record<string, unknown>) : undefined,
    admin_policies: arr(row, "admin_policies"),
  };
}
