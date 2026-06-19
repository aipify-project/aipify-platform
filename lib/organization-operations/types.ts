export type OrganizationOperationsTab =
  | "overview"
  | "structure"
  | "domains"
  | "departments"
  | "locations"
  | "business_units"
  | "brands"
  | "entities"
  | "workspaces"
  | "health"
  | "executive"
  | "reports"
  | "companion";

export type OrgEntityRow = {
  id: string;
  entity_key?: string;
  name: string;
  entity_type?: string;
  status?: string;
  employee_count?: number;
};

export type OrgBrandRow = {
  id: string;
  brand_key?: string;
  name: string;
  employee_count?: number;
};

export type OrgWorkspaceRow = {
  id: string;
  workspace_key?: string;
  name: string;
  workspace_type?: string;
  user_count?: number;
  business_packs?: unknown;
};

export type OrgDomainRow = {
  id: string;
  domain: string;
  verification_status?: string;
};

export type OrganizationOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  structure_engine?: Record<string, unknown>;
  structure_map?: Record<string, unknown>;
  business_entities?: OrgEntityRow[];
  brands?: OrgBrandRow[];
  business_units?: Record<string, unknown>[];
  workspaces?: OrgWorkspaceRow[];
  domains?: OrgDomainRow[];
  departments?: Record<string, unknown>[];
  locations?: Record<string, unknown>[];
  organization_health?: Record<string, unknown>[];
  health_engine?: Record<string, unknown>;
  executive_view?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  department_view?: Record<string, unknown>[];
  manager_view?: Record<string, unknown>[];
  cross_entity_reporting?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  companion_advisor?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type OrganizationOperationsLabels = {
  title: string;
  subtitle: string;
  principle: string;
  accessDenied: string;
  overview: string;
  structure: string;
  domains: string;
  departments: string;
  locations: string;
  businessUnits: string;
  brands: string;
  entities: string;
  workspaces: string;
  health: string;
  executive: string;
  reports: string;
  companionInsights: string;
  searchPlaceholder: string;
  search: string;
  createEntity: string;
  createBrand: string;
  createWorkspace: string;
  createBusinessUnit: string;
  refreshHealth: string;
  workspacesLink: string;
  employeesLink: string;
  domainsLink: string;
  healthStatuses: Record<string, string>;
  entityTypes: Record<string, string>;
  workspaceTypes: Record<string, string>;
  tabs: Record<OrganizationOperationsTab, string>;
};
