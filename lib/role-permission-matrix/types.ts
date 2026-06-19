export type RolePermissionMatrixCenter = {
  found: boolean;
  principle?: string;
  visibility_rule?: string;
  default_roles?: string[];
  permission_categories?: string[];
  roles?: RoleMatrixRole[];
  permissions?: { permission_key: string; module_key: string; permission_kind: string; description: string }[];
  templates?: { template_key: string; name: string; description: string; industry: string }[];
  employees_route?: string;
  module_access_route?: string;
};

export type RoleMatrixRole = {
  id: string;
  role_key: string;
  name: string;
  description?: string;
  base_role: string;
  is_system: boolean;
  status: string;
  department_scope_type?: string;
  department_id?: string | null;
  assigned_count?: number;
  permission_count?: number;
};

export type RolePermissionAuditEntry = {
  id: string;
  action: string;
  summary?: string;
  role_key?: string | null;
  created_at?: string;
};

export type RolePermissionMatrixRoleDetail = {
  found: boolean;
  role?: RoleMatrixRole;
  permissions?: { permission_key: string; granted: boolean }[];
  assigned_employees?: { employee_id: string; full_name: string; email: string }[];
};

export type SuperAdminRolePermissionOverview = {
  found: boolean;
  privacy_note?: string;
  principle?: string;
  catalog?: Record<string, unknown>;
  adoption?: Record<string, number>;
  templates?: number;
  governance_note?: string;
};
