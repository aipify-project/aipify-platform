import type { ProjectExecutionCenter, ProjectRecord } from "./types";

function parseProject(row: Record<string, unknown>): ProjectRecord {
  return {
    id: String(row.id ?? ""),
    project_number: typeof row.project_number === "string" ? row.project_number : null,
    name: String(row.name ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    project_type: String(row.project_type ?? "internal"),
    customer_name: typeof row.customer_name === "string" ? row.customer_name : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    project_manager_name: typeof row.project_manager_name === "string" ? row.project_manager_name : null,
    domain_name: typeof row.domain_name === "string" ? row.domain_name : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    status: String(row.status ?? "planning"),
    start_date: typeof row.start_date === "string" ? row.start_date : null,
    target_date: typeof row.target_date === "string" ? row.target_date : null,
    budget_amount: Number(row.budget_amount ?? 0),
    budget_spent: Number(row.budget_spent ?? 0),
    budget_remaining: row.budget_remaining != null ? Number(row.budget_remaining) : undefined,
    completion_percent: Number(row.completion_percent ?? 0),
  };
}

export function parseProjectExecutionCenter(data: unknown): ProjectExecutionCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const mapProjects = (arr: unknown) =>
    Array.isArray(arr) ? (arr as Record<string, unknown>[]).map(parseProject) : [];

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    active_projects: mapProjects(row.active_projects),
    planning_projects: mapProjects(row.planning_projects),
    milestones: Array.isArray(row.milestones) ? (row.milestones as Record<string, unknown>[]) : [],
    deliverables: Array.isArray(row.deliverables) ? (row.deliverables as Record<string, unknown>[]) : [],
    resources: Array.isArray(row.resources) ? (row.resources as Record<string, unknown>[]) : [],
    budgets: Array.isArray(row.budgets) ? (row.budgets as Record<string, unknown>[]) : [],
    risks: Array.isArray(row.risks) ? (row.risks as Record<string, unknown>[]) : [],
    approvals: Array.isArray(row.approvals) ? (row.approvals as Record<string, unknown>[]) : [],
    templates: Array.isArray(row.templates) ? (row.templates as Record<string, unknown>[]) : [],
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
