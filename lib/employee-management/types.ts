export type EmployeeStatus =
  | "active"
  | "pending_invitation"
  | "suspended"
  | "disabled"
  | "offboarded";

export type EmployeeRecord = {
  employee_id: string;
  employee_number?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  department_id?: string | null;
  department_name?: string | null;
  job_title?: string | null;
  manager_user_id?: string | null;
  org_role: string;
  custom_role_id?: string | null;
  employee_status: EmployeeStatus;
  start_date?: string | null;
  end_date?: string | null;
  organization_user_id?: string | null;
  profile_photo_url?: string | null;
  office_location?: string | null;
};

export type EmployeeManagementCenter = {
  found: boolean;
  principle?: string;
  privacy_note?: string;
  app_license_active?: boolean;
  seat_licensing?: {
    total_seats: number;
    active_employees: number;
    available_seats: number;
    pending_invitations: number;
    used_seats: number;
  };
  employee_counts?: Record<string, number>;
  sections?: string[];
  module_access_route?: string;
  app_store_route?: string;
};

export type EmployeeDashboard = {
  found: boolean;
  error?: string;
  principle?: string;
  profile?: { full_name?: string; job_title?: string; employee_status?: string };
  assigned_modules?: { module_key: string; module_name: string; route_href?: string | null }[];
};
