import type { EmployeeManagementCenter, EmployeeRecord, EmployeeDashboard } from "./types";

export function parseEmployeeManagementCenter(data: unknown): EmployeeManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    app_license_active: row.app_license_active === true,
    seat_licensing: row.seat_licensing as EmployeeManagementCenter["seat_licensing"],
    employee_counts: row.employee_counts as Record<string, number> | undefined,
    sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    module_access_route: typeof row.module_access_route === "string" ? row.module_access_route : undefined,
    app_store_route: typeof row.app_store_route === "string" ? row.app_store_route : undefined,
  };
}

export function parseEmployeeDirectory(data: unknown): EmployeeRecord[] {
  if (!data || typeof data !== "object") return [];
  const row = data as Record<string, unknown>;
  if (!Array.isArray(row.employees)) return [];
  return row.employees as EmployeeRecord[];
}

export function parseEmployeeDashboard(data: unknown): EmployeeDashboard | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) {
    return { found: false, error: typeof row.error === "string" ? row.error : undefined };
  }
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    profile: row.profile as EmployeeDashboard["profile"],
    assigned_modules: Array.isArray(row.assigned_modules)
      ? (row.assigned_modules as EmployeeDashboard["assigned_modules"])
      : [],
  };
}

export const EMPLOYEE_STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pending_invitation: "bg-amber-50 text-amber-900 ring-amber-200",
  suspended: "bg-orange-50 text-orange-900 ring-orange-200",
  disabled: "bg-gray-50 text-gray-700 ring-gray-200",
  offboarded: "bg-red-50 text-red-800 ring-red-200",
};
