import type { OrganizationManagementCenter, OrgDepartment, OrgLocation, OrgTeam } from "./types";

function num(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function parseDepartment(d: Record<string, unknown>): OrgDepartment {
  return {
    id: String(d.id ?? ""),
    department_key: typeof d.department_key === "string" ? d.department_key : undefined,
    name: String(d.name ?? ""),
    description: typeof d.description === "string" ? d.description : undefined,
    head_user_id: typeof d.head_user_id === "string" ? d.head_user_id : null,
    metrics: d.metrics as OrgDepartment["metrics"],
    employees: Array.isArray(d.employees) ? (d.employees as OrgDepartment["employees"]) : [],
    teams: Array.isArray(d.teams) ? (d.teams as OrgDepartment["teams"]) : [],
    assigned_domains: Array.isArray(d.assigned_domains) ? (d.assigned_domains as OrgDepartment["assigned_domains"]) : [],
    assigned_packs: Array.isArray(d.assigned_packs) ? (d.assigned_packs as OrgDepartment["assigned_packs"]) : [],
  };
}

export function parseOrganizationManagementCenter(data: unknown): OrganizationManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const org = row.organization as Record<string, unknown> | undefined;
  const overview = row.overview as Record<string, unknown> | undefined;

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    organization: org ? { id: String(org.id ?? ""), name: String(org.name ?? "") } : undefined,
    overview: overview
      ? {
          departments: num(overview.departments),
          teams: num(overview.teams),
          locations: num(overview.locations),
          active_employees: num(overview.active_employees),
          managers: num(overview.managers),
        }
      : undefined,
    departments: Array.isArray(row.departments)
      ? (row.departments as Record<string, unknown>[]).map(parseDepartment)
      : [],
    teams: Array.isArray(row.teams)
      ? (row.teams as Record<string, unknown>[]).map((t) => ({
          id: String(t.id ?? ""),
          name: String(t.name ?? ""),
          team_key: typeof t.team_key === "string" ? t.team_key : undefined,
          department_id: typeof t.department_id === "string" ? t.department_id : undefined,
          department_name: typeof t.department_name === "string" ? t.department_name : undefined,
          manager_user_id: typeof t.manager_user_id === "string" ? t.manager_user_id : null,
          member_count: num(t.member_count),
        }) satisfies OrgTeam)
      : [],
    locations: Array.isArray(row.locations)
      ? (row.locations as Record<string, unknown>[]).map((l) => ({
          id: String(l.id ?? ""),
          location_key: typeof l.location_key === "string" ? l.location_key : undefined,
          name: String(l.name ?? ""),
          location_type: typeof l.location_type === "string" ? l.location_type : undefined,
          city: typeof l.city === "string" ? l.city : null,
          country: typeof l.country === "string" ? l.country : null,
          employee_count: num(l.employee_count),
        }) satisfies OrgLocation)
      : [],
    managers: Array.isArray(row.managers) ? (row.managers as Record<string, unknown>[]) : [],
    organization_chart: row.organization_chart as Record<string, unknown> | undefined,
    policies: Array.isArray(row.policies)
      ? (row.policies as Record<string, unknown>[]).map((p) => ({
          id: String(p.id ?? ""),
          title: String(p.title ?? ""),
          policy_key: typeof p.policy_key === "string" ? p.policy_key : undefined,
        }))
      : [],
    custom_fields: Array.isArray(row.custom_fields)
      ? (row.custom_fields as Record<string, unknown>[]).map((f) => ({
          field_key: String(f.field_key ?? ""),
          label: String(f.label ?? ""),
          applies_to: typeof f.applies_to === "string" ? f.applies_to : undefined,
        }))
      : [],
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    routes: row.routes as OrganizationManagementCenter["routes"],
  };
}
