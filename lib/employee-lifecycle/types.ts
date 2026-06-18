export type LifecycleEmployee = {
  id: string;
  employee_number?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  department_name?: string | null;
  job_title?: string | null;
  org_role: string;
  employee_status: string;
  lifecycle_stage: string;
  employment_type: string;
  start_date?: string | null;
};

export type EmployeeLifecycleCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  employees?: LifecycleEmployee[];
  invitations?: Record<string, unknown>[];
  onboarding?: Record<string, unknown>[];
  offboarding?: Record<string, unknown>[];
  training?: Record<string, unknown>[];
  assets_summary?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};

export type OnboardingCenter = {
  found: boolean;
  principle?: string;
  templates?: Record<string, unknown>[];
  runs?: Record<string, unknown>[];
};

export type OffboardingCenter = {
  found: boolean;
  principle?: string;
  runs?: Record<string, unknown>[];
};
