import type {
  DigitalEmployeeAdvisorSignal,
  DigitalEmployeeLifecycleManagementCenter,
  DigitalEmployeeRecord,
  DigitalEmployeeReview,
  DigitalEmployeeRole,
  DigitalEmployeeTraining,
} from "./types";

function parseEmployee(raw: unknown): DigitalEmployeeRecord {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    employee_key: typeof d.employee_key === "string" ? d.employee_key : undefined,
    employee_name: typeof d.employee_name === "string" ? d.employee_name : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
    employee_role: typeof d.employee_role === "string" ? d.employee_role : undefined,
    career_level: typeof d.career_level === "string" ? d.career_level : undefined,
    employee_status: typeof d.employee_status === "string" ? d.employee_status : undefined,
    supervisor_name: typeof d.supervisor_name === "string" ? d.supervisor_name : undefined,
    performance_score: Number(d.performance_score ?? 0),
    health_score: Number(d.health_score ?? 0),
    tasks_completed: Number(d.tasks_completed ?? 0),
    success_rate: Number(d.success_rate ?? 0),
  };
}

function parseRole(raw: unknown): DigitalEmployeeRole {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    role_key: typeof d.role_key === "string" ? d.role_key : undefined,
    role_name: typeof d.role_name === "string" ? d.role_name : undefined,
    responsibilities: d.responsibilities,
    permissions: d.permissions,
  };
}

function parseTraining(raw: unknown): DigitalEmployeeTraining {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    training_key: typeof d.training_key === "string" ? d.training_key : undefined,
    training_title: typeof d.training_title === "string" ? d.training_title : undefined,
    training_type: typeof d.training_type === "string" ? d.training_type : undefined,
    training_status: typeof d.training_status === "string" ? d.training_status : undefined,
    coverage_percent: Number(d.coverage_percent ?? 0),
    employee_id: typeof d.employee_id === "string" ? d.employee_id : null,
  };
}

function parseReview(raw: unknown): DigitalEmployeeReview {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    review_key: typeof d.review_key === "string" ? d.review_key : undefined,
    review_type: typeof d.review_type === "string" ? d.review_type : undefined,
    review_status: typeof d.review_status === "string" ? d.review_status : undefined,
    performance_score: typeof d.performance_score === "number" ? d.performance_score : null,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    employee_id: typeof d.employee_id === "string" ? d.employee_id : null,
  };
}

function parseSignal(raw: unknown): DigitalEmployeeAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseDigitalEmployeeLifecycleManagementCenter(
  raw: unknown
): DigitalEmployeeLifecycleManagementCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    orchestration_route: typeof d.orchestration_route === "string" ? d.orchestration_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    employees: Array.isArray(d.employees) ? d.employees.map(parseEmployee) : [],
    roles: Array.isArray(d.roles) ? d.roles.map(parseRole) : [],
    training_records: Array.isArray(d.training_records) ? d.training_records.map(parseTraining) : [],
    reviews: Array.isArray(d.reviews) ? d.reviews.map(parseReview) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
