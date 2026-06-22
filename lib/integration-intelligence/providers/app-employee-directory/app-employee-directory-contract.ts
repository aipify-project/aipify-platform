import { parseEmployeeDirectory } from "@/lib/employee-management/parse";
import type { EmployeeRecord } from "@/lib/employee-management/types";
import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import type { DirectoryFreshness, DirectoryCompleteness } from "@/lib/integration-intelligence/directory/types";

export const APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY = "app_employee_directory" as const;

type RawRow = Record<string, unknown>;

function asArray(value: unknown): RawRow[] {
  return Array.isArray(value) ? (value as RawRow[]) : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeEmployeeStatus(status: string | null | undefined): string {
  const value = String(status ?? "active").toLowerCase();
  if (value === "pending") return "pending_invitation";
  return value;
}

function normalizeOrgRole(role: string | null | undefined): string | null {
  if (!role) return null;
  return role.trim().toLowerCase();
}

export type AppEmployeeTeamMap = Readonly<Record<string, string>>;

export function buildTeamNameMapFromOrganizationCenter(data: unknown): AppEmployeeTeamMap {
  const record = asRecord(data);
  if (record.found === false) return {};

  const teamMap: Record<string, string> = {};
  const teams = asArray(record.teams);
  for (const team of teams) {
    const id = String(team.id ?? "").trim();
    const name = String(team.name ?? "").trim();
    if (id && name) teamMap[id] = name;
  }

  const departments = asArray(record.departments);
  for (const department of departments) {
    const deptTeams = asArray(department.teams);
    for (const team of deptTeams) {
      const id = String(team.id ?? "").trim();
      const name = String(team.name ?? "").trim();
      if (id && name) teamMap[id] = name;
    }
    const employees = asArray(department.employees);
    for (const employee of employees) {
      const teamId = String(employee.team_id ?? "").trim();
      if (!teamId || teamMap[teamId]) continue;
      const matchedTeam = deptTeams.find((row) => String(row.id ?? "") === teamId);
      if (matchedTeam?.name) teamMap[teamId] = String(matchedTeam.name);
    }
  }

  return teamMap;
}

export function mapEmployeeRecordToCandidate(input: {
  employee: EmployeeRecord | RawRow;
  organizationId: string;
  teamMap?: AppEmployeeTeamMap;
  sourceReference?: string;
  invitationPending?: boolean;
}): DirectoryMatchCandidate {
  const row = input.employee as RawRow;
  const employeeId = String(row.employee_id ?? row.id ?? "").trim();
  const fullName = String(row.full_name ?? row.display_name ?? "Employee").trim();
  const email = row.email ? String(row.email).trim() : null;
  const phone = row.phone ? String(row.phone).trim() : null;
  const department = row.department_name ? String(row.department_name).trim() : null;
  const role = row.job_title
    ? String(row.job_title).trim()
    : row.org_role
      ? String(row.org_role).trim()
      : null;
  const orgRole = normalizeOrgRole(row.org_role ? String(row.org_role) : null);
  const status = input.invitationPending
    ? "pending_invitation"
    : normalizeEmployeeStatus(row.employee_status ? String(row.employee_status) : row.status ? String(row.status) : "active");
  const teamId = row.team_id ? String(row.team_id).trim() : null;
  const team = teamId && input.teamMap?.[teamId] ? input.teamMap[teamId] : null;
  const externalId = row.employee_number ? String(row.employee_number).trim() : null;

  return {
    entity_id: employeeId || `invite:${email ?? fullName}`,
    entity_type: "person",
    display_name: fullName,
    company_name: null,
    role: role ?? orgRole,
    department,
    team,
    status,
    email_raw: email,
    phone_raw: phone,
    email_masked: email,
    phone_masked: phone,
    external_id: externalId,
    organization_number: null,
  };
}

export function mapInvitationRowsToCandidates(
  rows: unknown,
  organizationId: string,
  teamMap?: AppEmployeeTeamMap,
): DirectoryMatchCandidate[] {
  return asArray(rows).map((row) =>
    mapEmployeeRecordToCandidate({
      employee: {
        employee_id: `invitation:${String(row.id ?? row.email ?? "")}`,
        full_name: String(row.full_name ?? row.email ?? "Pending invitation"),
        email: row.email ? String(row.email) : null,
        org_role: row.org_role ? String(row.org_role) : null,
        employee_status: "pending_invitation",
        department_name: null,
      },
      organizationId,
      teamMap,
      sourceReference: "get_employee_management_invitations",
      invitationPending: true,
    }),
  );
}

export type AppEmployeeDirectoryBundle = {
  candidates: DirectoryMatchCandidate[];
  active_count: number;
  inactive_count: number;
  pending_invitation_count: number;
  missing_team_assignment_count: number;
  access_review_required_count: number;
  recent_role_change_count: number;
  new_employee_count: number;
  source_exact: boolean;
  freshness: DirectoryFreshness;
  completeness: DirectoryCompleteness;
  limitations: readonly string[];
};

export function mapAppEmployeeDirectoryBundle(input: {
  organizationId: string;
  directoryData?: unknown;
  invitationsData?: unknown;
  organizationCenterData?: unknown;
  accessControlData?: unknown;
}): AppEmployeeDirectoryBundle {
  const limitations: string[] = [];
  const teamMap = buildTeamNameMapFromOrganizationCenter(input.organizationCenterData ?? null);
  if (Object.keys(teamMap).length === 0) {
    limitations.push("Team enrichment unavailable — team search may be partial.");
  }

  const employees = parseEmployeeDirectory(input.directoryData ?? null);
  const directoryFound =
    input.directoryData &&
    typeof input.directoryData === "object" &&
    (input.directoryData as Record<string, unknown>).found !== false;

  if (!directoryFound && employees.length === 0) {
    limitations.push("Employee directory RPC returned no records.");
  }

  const candidates: DirectoryMatchCandidate[] = employees.map((employee) =>
    mapEmployeeRecordToCandidate({
      employee,
      organizationId: input.organizationId,
      teamMap,
      sourceReference: "get_employee_directory",
    }),
  );

  const invitationRows = asArray(asRecord(input.invitationsData).invitations);
  if (invitationRows.length > 0) {
    candidates.push(...mapInvitationRowsToCandidates(invitationRows, input.organizationId, teamMap));
  }

  const activeCount = candidates.filter((row) => row.status === "active").length;
  const inactiveCount = candidates.filter((row) =>
    ["inactive", "suspended", "disabled", "offboarded"].includes(String(row.status ?? "")),
  ).length;
  const pendingCount = candidates.filter((row) => row.status === "pending_invitation").length;
  const missingTeamCount = candidates.filter(
    (row) => row.status === "active" && !row.team && !row.department,
  ).length;

  const accessRecord = asRecord(input.accessControlData);
  const userGrants = asArray(accessRecord.user_grants);
  const accessReviewRequired = userGrants.filter((grant) => grant.can_manage === true).length;

  const sourceExact = directoryFound === true && employees.length >= 0;

  return {
    candidates,
    active_count: activeCount,
    inactive_count: inactiveCount,
    pending_invitation_count: pendingCount,
    missing_team_assignment_count: missingTeamCount,
    access_review_required_count: accessReviewRequired > 0 ? 1 : 0,
    recent_role_change_count: 0,
    new_employee_count: 0,
    source_exact: sourceExact,
    freshness: sourceExact ? "fresh" : "unknown",
    completeness: teamMap && Object.keys(teamMap).length > 0 ? "partial" : "partial",
    limitations,
  };
}

export type AppEmployeeEffectivePermission = {
  module_key: string;
  can_view: boolean;
  can_manage: boolean;
  source: "role_grant" | "user_grant";
};

export function mapEffectivePermissions(accessControlData: unknown): AppEmployeeEffectivePermission[] {
  const record = asRecord(accessControlData);
  if (record.found === false) return [];

  const permissions: AppEmployeeEffectivePermission[] = [];
  for (const grant of asArray(record.role_grants)) {
    permissions.push({
      module_key: String(grant.module_key ?? ""),
      can_view: grant.can_view === true || grant.can_use === true,
      can_manage: grant.can_manage === true,
      source: "role_grant",
    });
  }
  for (const grant of asArray(record.user_grants)) {
    permissions.push({
      module_key: String(grant.module_key ?? ""),
      can_view: grant.can_view === true,
      can_manage: grant.can_manage === true,
      source: "user_grant",
    });
  }
  return permissions.filter((entry) => entry.module_key.length > 0);
}

export function resolveEmployeeRoleVsPermissions(input: {
  orgRole: string | null;
  permissions: readonly AppEmployeeEffectivePermission[];
  moduleKey: string;
}): { role_suggests_access: boolean; effective_access: boolean } {
  const role = normalizeOrgRole(input.orgRole);
  const roleSuggests =
    role === "owner" ||
    role === "administrator" ||
    role === "admin" ||
    role === "manager";
  const effective = input.permissions.some(
    (entry) =>
      entry.module_key === input.moduleKey && (entry.can_view || entry.can_manage),
  );
  return { role_suggests_access: roleSuggests, effective_access: effective };
}
