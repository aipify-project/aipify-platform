import type {
  OrgBrandRow,
  OrgDomainRow,
  OrgEntityRow,
  OrganizationOperationsCenter,
  OrgWorkspaceRow,
} from "./types";

function parseEntity(row: Record<string, unknown>): OrgEntityRow {
  return {
    id: String(row.id ?? ""),
    entity_key: row.entity_key ? String(row.entity_key) : undefined,
    name: String(row.name ?? ""),
    entity_type: row.entity_type ? String(row.entity_type) : undefined,
    status: row.status ? String(row.status) : undefined,
    employee_count: row.employee_count != null ? Number(row.employee_count) : undefined,
  };
}

function parseBrand(row: Record<string, unknown>): OrgBrandRow {
  return {
    id: String(row.id ?? ""),
    brand_key: row.brand_key ? String(row.brand_key) : undefined,
    name: String(row.name ?? ""),
    employee_count: row.employee_count != null ? Number(row.employee_count) : undefined,
  };
}

function parseWorkspace(row: Record<string, unknown>): OrgWorkspaceRow {
  return {
    id: String(row.id ?? ""),
    workspace_key: row.workspace_key ? String(row.workspace_key) : undefined,
    name: String(row.name ?? ""),
    workspace_type: row.workspace_type ? String(row.workspace_type) : undefined,
    user_count: row.user_count != null ? Number(row.user_count) : undefined,
    business_packs: row.business_packs,
  };
}

function parseDomain(row: Record<string, unknown>): OrgDomainRow {
  return {
    id: String(row.id ?? ""),
    domain: String(row.domain ?? ""),
    verification_status: row.verification_status ? String(row.verification_status) : undefined,
  };
}

export function parseOrganizationOperationsCenter(
  row: Record<string, unknown> | null
): OrganizationOperationsCenter | null {
  if (!row || typeof row !== "object") return null;
  const org = row.organization as Record<string, unknown> | undefined;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    section: row.section ? String(row.section) : undefined,
    organization: org
      ? { id: String(org.id ?? ""), name: String(org.name ?? "") }
      : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    structure_engine: row.structure_engine as Record<string, unknown> | undefined,
    structure_map: row.structure_map as Record<string, unknown> | undefined,
    business_entities: Array.isArray(row.business_entities)
      ? row.business_entities.map((r) => parseEntity(r as Record<string, unknown>))
      : undefined,
    brands: Array.isArray(row.brands)
      ? row.brands.map((r) => parseBrand(r as Record<string, unknown>))
      : undefined,
    business_units: Array.isArray(row.business_units) ? row.business_units : undefined,
    workspaces: Array.isArray(row.workspaces)
      ? row.workspaces.map((r) => parseWorkspace(r as Record<string, unknown>))
      : undefined,
    domains: Array.isArray(row.domains)
      ? row.domains.map((r) => parseDomain(r as Record<string, unknown>))
      : undefined,
    departments: Array.isArray(row.departments) ? row.departments : undefined,
    locations: Array.isArray(row.locations) ? row.locations : undefined,
    organization_health: Array.isArray(row.organization_health) ? row.organization_health : undefined,
    health_engine: row.health_engine as Record<string, unknown> | undefined,
    executive_view: row.executive_view as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    department_view: Array.isArray(row.department_view) ? row.department_view : undefined,
    manager_view: Array.isArray(row.manager_view) ? row.manager_view : undefined,
    cross_entity_reporting: row.cross_entity_reporting as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    companion_advisor: row.companion_advisor as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            event_type: String(e.event_type ?? ""),
            summary: String(e.summary ?? ""),
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

export function parseOrganizationSearchResults(row: Record<string, unknown>) {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results as Record<string, unknown>[];
}
