import type { EmployeeLifecycleCenter, LifecycleEmployee, OffboardingCenter, OnboardingCenter } from "./types";

function parseEmployee(row: Record<string, unknown>): LifecycleEmployee {
  return {
    id: String(row.id ?? ""),
    employee_number: typeof row.employee_number === "string" ? row.employee_number : null,
    full_name: String(row.full_name ?? ""),
    email: String(row.email ?? ""),
    phone: typeof row.phone === "string" ? row.phone : null,
    department_name: typeof row.department_name === "string" ? row.department_name : null,
    job_title: typeof row.job_title === "string" ? row.job_title : null,
    org_role: String(row.org_role ?? "employee"),
    employee_status: String(row.employee_status ?? ""),
    lifecycle_stage: String(row.lifecycle_stage ?? "active"),
    employment_type: String(row.employment_type ?? "full_time"),
    start_date: typeof row.start_date === "string" ? row.start_date : null,
  };
}

export function parseEmployeeLifecycleCenter(data: unknown): EmployeeLifecycleCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    employees: Array.isArray(row.employees)
      ? (row.employees as Record<string, unknown>[]).map(parseEmployee)
      : [],
    invitations: Array.isArray(row.invitations) ? (row.invitations as Record<string, unknown>[]) : [],
    onboarding: Array.isArray(row.onboarding) ? (row.onboarding as Record<string, unknown>[]) : [],
    offboarding: Array.isArray(row.offboarding) ? (row.offboarding as Record<string, unknown>[]) : [],
    training: Array.isArray(row.training) ? (row.training as Record<string, unknown>[]) : [],
    assets_summary: row.assets_summary as Record<string, unknown> | undefined,
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

export function parseOnboardingCenter(data: unknown): OnboardingCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    templates: Array.isArray(row.templates) ? (row.templates as Record<string, unknown>[]) : [],
    runs: Array.isArray(row.runs) ? (row.runs as Record<string, unknown>[]) : [],
  };
}

export function parseOffboardingCenter(data: unknown): OffboardingCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    runs: Array.isArray(row.runs) ? (row.runs as Record<string, unknown>[]) : [],
  };
}
