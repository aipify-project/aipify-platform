import type { DirectoryCapabilityKey } from "@/lib/integration-intelligence/directory/types";

export type AppEmployeeSourceStatus = "live" | "partial" | "placeholder" | "missing";

export type AppEmployeeSourceDefinition = {
  capability_key: DirectoryCapabilityKey;
  source_kind: "rpc";
  source_id: string;
  provider_key: "app_employee_directory";
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string | null;
  status: AppEmployeeSourceStatus;
  read_only: boolean;
  limitations: readonly string[];
};

export const APP_EMPLOYEE_DIRECTORY_SOURCE_MAP: readonly AppEmployeeSourceDefinition[] = [
  {
    capability_key: "employee.search",
    source_kind: "rpc",
    source_id: "get_employee_directory",
    provider_key: "app_employee_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_emae503_org()",
    available_fields: [
      "employees[].employee_id",
      "employees[].full_name",
      "employees[].email",
      "employees[].phone",
      "employees[].department_name",
      "employees[].job_title",
      "employees[].org_role",
      "employees[].employee_status",
      "employees[].employee_number",
    ],
    required_permission: "employees.view",
    status: "live",
    read_only: true,
    limitations: ["Primary employee directory — team assignment enriched from Organization Center when available."],
  },
  {
    capability_key: "employee.read",
    source_kind: "rpc",
    source_id: "get_employee_profile",
    provider_key: "app_employee_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_emae503_org()",
    available_fields: ["profile.*", "assigned_modules[]"],
    required_permission: "employees.view",
    status: "live",
    read_only: true,
    limitations: ["Profile detail excludes notes, emergency contact, and salary fields in Companion."],
  },
  {
    capability_key: "employee.search",
    source_kind: "rpc",
    source_id: "get_employee_management_invitations",
    provider_key: "app_employee_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_emae503_org()",
    available_fields: ["invitations[].email", "invitations[].full_name", "invitations[].status", "invitations[].org_role"],
    required_permission: "employees.view",
    status: "live",
    read_only: true,
    limitations: ["Pending invitations surfaced with status pending_invitation — not active employees."],
  },
  {
    capability_key: "department.read",
    source_kind: "rpc",
    source_id: "get_organization_management_center",
    provider_key: "app_employee_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_org511_org()",
    available_fields: ["departments[].name", "departments[].employees[]", "departments[].teams[]"],
    required_permission: "employees.view",
    status: "partial",
    read_only: true,
    limitations: ["Department and team enrichment — team membership may be partial when team_id is unset."],
  },
  {
    capability_key: "role.read",
    source_kind: "rpc",
    source_id: "get_employee_access_control",
    provider_key: "app_employee_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_emae503_org()",
    available_fields: ["role_grants[]", "user_grants[]"],
    required_permission: "permissions.view",
    status: "live",
    read_only: true,
    limitations: ["Effective module permissions — role name alone does not imply access."],
  },
  {
    capability_key: "team.read",
    source_kind: "rpc",
    source_id: "get_organization_management_center",
    provider_key: "app_employee_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_org511_org()",
    available_fields: ["teams[].name", "teams[].department_name", "teams[].member_count"],
    required_permission: "employees.view",
    status: "partial",
    read_only: true,
    limitations: ["Team names available — per-employee team assignment depends on profile team_id enrichment."],
  },
];

export function getAppEmployeeSourceDefinition(
  capabilityKey: DirectoryCapabilityKey,
): AppEmployeeSourceDefinition | null {
  return APP_EMPLOYEE_DIRECTORY_SOURCE_MAP.find((entry) => entry.capability_key === capabilityKey) ?? null;
}
