import type { ServiceCase, ServiceCaseCenter, ServiceCustomerSuccessCenter } from "./types";

function parseCase(row: Record<string, unknown>): ServiceCase {
  return {
    id: String(row.id ?? ""),
    case_number: typeof row.case_number === "string" ? row.case_number : null,
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    customer_id: typeof row.customer_id === "string" ? row.customer_id : null,
    customer_name: typeof row.customer_name === "string" ? row.customer_name : null,
    assigned_employee_name: typeof row.assigned_employee_name === "string" ? row.assigned_employee_name : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    priority: String(row.priority ?? "normal"),
    status: String(row.status ?? "new"),
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    due_date: typeof row.due_date === "string" ? row.due_date : null,
    resolution_due_at: typeof row.resolution_due_at === "string" ? row.resolution_due_at : null,
  };
}

export function parseServiceCaseCenter(data: unknown): ServiceCaseCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const mapCases = (arr: unknown) =>
    Array.isArray(arr) ? (arr as Record<string, unknown>[]).map(parseCase) : [];

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    open_cases: mapCases(row.open_cases),
    assigned_cases: mapCases(row.assigned_cases),
    escalations: Array.isArray(row.escalations) ? (row.escalations as Record<string, unknown>[]) : [],
    completed_cases: mapCases(row.completed_cases),
    sla: row.sla as Record<string, unknown> | undefined,
    timeline: Array.isArray(row.timeline) ? (row.timeline as Record<string, unknown>[]) : [],
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}

export function parseServiceCustomerSuccessCenter(data: unknown): ServiceCustomerSuccessCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    summary: row.summary as Record<string, unknown> | undefined,
    customer_health: Array.isArray(row.customer_health) ? (row.customer_health as Record<string, unknown>[]) : [],
    success_actions: Array.isArray(row.success_actions) ? (row.success_actions as Record<string, unknown>[]) : [],
    feedback: Array.isArray(row.feedback) ? (row.feedback as Record<string, unknown>[]) : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
