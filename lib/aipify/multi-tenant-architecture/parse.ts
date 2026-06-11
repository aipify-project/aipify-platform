import type {
  MultiTenantArchitectureCard,
  MultiTenantArchitectureDashboard,
  OrganizationSummary,
} from "./types";

export function parseOrganizationSummary(data: unknown): OrganizationSummary {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    id: String(d.id ?? ""),
    name: String(d.name ?? ""),
    slug: String(d.slug ?? ""),
    status: String(d.status ?? ""),
    subscription_plan: String(d.subscription_plan ?? ""),
    role: String(d.role ?? ""),
    membership_status: String(d.membership_status ?? ""),
  };
}

export function parseMultiTenantArchitectureCard(data: unknown): MultiTenantArchitectureCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    organization_name: typeof d.organization_name === "string" ? d.organization_name : undefined,
    modules_enabled: Number(d.modules_enabled ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseMultiTenantArchitectureDashboard(
  data: unknown
): MultiTenantArchitectureDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    organization:
      typeof d.organization === "object" && d.organization
        ? (d.organization as MultiTenantArchitectureDashboard["organization"])
        : undefined,
    current_role: typeof d.current_role === "string" ? d.current_role : undefined,
    modules_enabled: Number(d.modules_enabled ?? 0),
    pending_tasks: Number(d.pending_tasks ?? 0),
    active_alerts: Number(d.active_alerts ?? 0),
    available_organizations: Array.isArray(d.available_organizations)
      ? (d.available_organizations as OrganizationSummary[])
      : [],
    enabled_modules: Array.isArray(d.enabled_modules)
      ? (d.enabled_modules as MultiTenantArchitectureDashboard["enabled_modules"])
      : [],
    integrations: Array.isArray(d.integrations)
      ? (d.integrations as MultiTenantArchitectureDashboard["integrations"])
      : [],
    knowledge_center:
      typeof d.knowledge_center === "object" && d.knowledge_center
        ? (d.knowledge_center as MultiTenantArchitectureDashboard["knowledge_center"])
        : undefined,
    recent_audit_events: Array.isArray(d.recent_audit_events)
      ? (d.recent_audit_events as MultiTenantArchitectureDashboard["recent_audit_events"])
      : [],
    role_permissions:
      typeof d.role_permissions === "object" && d.role_permissions
        ? (d.role_permissions as MultiTenantArchitectureDashboard["role_permissions"])
        : undefined,
    isolation_checks: Array.isArray(d.isolation_checks)
      ? (d.isolation_checks as string[])
      : undefined,
  };
}
