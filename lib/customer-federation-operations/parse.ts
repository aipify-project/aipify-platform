import type { FederationCenter, FederationRegistry, FederationWorkspace } from "./types";

function parseRegistry(raw: Record<string, unknown>): FederationRegistry {
  return {
    federation_key: String(raw.federation_key ?? ""),
    federation_name: String(raw.federation_name ?? ""),
    federation_type: raw.federation_type ? String(raw.federation_type) : undefined,
    federation_status: raw.federation_status ? String(raw.federation_status) : undefined,
    trust_status: raw.trust_status ? String(raw.trust_status) : undefined,
    region: raw.region ? String(raw.region) : undefined,
    industry: raw.industry ? String(raw.industry) : undefined,
    participating_orgs_count: raw.participating_orgs_count != null ? Number(raw.participating_orgs_count) : undefined,
    description: raw.description ? String(raw.description) : undefined,
  };
}

function parseWorkspace(raw: Record<string, unknown>): FederationWorkspace {
  return {
    workspace_key: String(raw.workspace_key ?? ""),
    workspace_title: String(raw.workspace_title ?? ""),
    workspace_type: raw.workspace_type ? String(raw.workspace_type) : undefined,
    workspace_status: raw.workspace_status ? String(raw.workspace_status) : undefined,
    federation_key: raw.federation_key ? String(raw.federation_key) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseFederationCenter(raw: Record<string, unknown>): FederationCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const federations = Array.isArray(raw.federations)
    ? (raw.federations as Record<string, unknown>[]).map(parseRegistry)
    : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as FederationCenter["organization"],
    overview: raw.overview as FederationCenter["overview"],
    federations,
    networks: Array.isArray(raw.networks) ? (raw.networks as Record<string, unknown>[]) : [],
    organizations: Array.isArray(raw.organizations)
      ? (raw.organizations as Record<string, unknown>[]).map(parseRegistry)
      : federations,
    trust_relationships: raw.trust_relationships as Record<string, unknown>,
    shared_intelligence: Array.isArray(raw.shared_intelligence)
      ? (raw.shared_intelligence as Record<string, unknown>[])
      : [],
    workspaces: Array.isArray(raw.workspaces)
      ? (raw.workspaces as Record<string, unknown>[]).map(parseWorkspace)
      : [],
    governance: raw.governance as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as FederationCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
