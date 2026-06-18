import type { AppLicenseStatus, EmployeeAccessLevel } from "./types";

/**
 * Phase 500 license hierarchy:
 * PLATFORM → APP license → APP status → Employee access
 */
export const APP_STATUS_TO_EMPLOYEE_ACCESS: Record<AppLicenseStatus, EmployeeAccessLevel> = {
  active: "active",
  trial: "active",
  suspended: "suspended",
  cancelled: "disabled",
};

export function resolveEmployeeAccessFromAppStatus(
  appStatus: AppLicenseStatus
): EmployeeAccessLevel {
  return APP_STATUS_TO_EMPLOYEE_ACCESS[appStatus];
}

export function isBusinessPackModuleVisible(
  packActive: boolean,
  roleGranted: boolean
): boolean {
  return packActive && roleGranted;
}

export const LICENSE_HIERARCHY_RULES = [
  "APP is always the customer (license holder).",
  "Employees never own licenses directly.",
  "Employee access inherits from APP subscription status.",
  "Business Pack modules require pack active AND role grant.",
] as const;
