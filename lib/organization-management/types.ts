export type OrgDepartment = {
  id: string;
  department_key?: string;
  name: string;
  description?: string;
  head_user_id?: string | null;
  metrics?: { active_employees?: number; teams?: number; open_tasks?: number };
  employees?: { employee_id: string; full_name: string; email: string; job_title?: string }[];
  teams?: { id: string; name: string; member_count?: number }[];
  assigned_domains?: { domain_id: string; domain: string }[];
  assigned_packs?: { pack_key: string; domain?: string }[];
};

export type OrgTeam = {
  id: string;
  name: string;
  team_key?: string;
  department_id?: string;
  department_name?: string;
  manager_user_id?: string | null;
  member_count?: number;
};

export type OrgLocation = {
  id: string;
  location_key?: string;
  name: string;
  location_type?: string;
  city?: string | null;
  country?: string | null;
  employee_count?: number;
};

export type OrganizationManagementCenter = {
  found: boolean;
  principle?: string;
  organization?: { id: string; name: string };
  overview?: {
    departments?: number;
    teams?: number;
    locations?: number;
    active_employees?: number;
    managers?: number;
  };
  departments?: OrgDepartment[];
  teams?: OrgTeam[];
  locations?: OrgLocation[];
  managers?: Record<string, unknown>[];
  organization_chart?: Record<string, unknown>;
  policies?: { id: string; title: string; policy_key?: string }[];
  custom_fields?: { field_key: string; label: string; applies_to?: string }[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: { employees?: string; domains?: string; tasks?: string; calendar?: string; activity?: string };
};
