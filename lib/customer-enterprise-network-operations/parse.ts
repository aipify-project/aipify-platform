import type {
  EnterpriseNetworkCenter,
  NetworkConnection,
  NetworkInvitation,
  NetworkWorkspace,
} from "./types";

function parseInvitation(raw: Record<string, unknown>): NetworkInvitation {
  return {
    invitation_key: String(raw.invitation_key ?? ""),
    target_org_name: String(raw.target_org_name ?? ""),
    relationship_type: raw.relationship_type ? String(raw.relationship_type) : undefined,
    invitation_status: raw.invitation_status ? String(raw.invitation_status) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
    sent_at: raw.sent_at ? String(raw.sent_at) : undefined,
  };
}

function parseConnection(raw: Record<string, unknown>): NetworkConnection {
  return {
    connection_key: String(raw.connection_key ?? ""),
    partner_org_name: String(raw.partner_org_name ?? ""),
    connection_status: raw.connection_status ? String(raw.connection_status) : undefined,
    relationship_type: raw.relationship_type ? String(raw.relationship_type) : undefined,
    trust_level: raw.trust_level ? String(raw.trust_level) : undefined,
    permissions_granted: Array.isArray(raw.permissions_granted) ? raw.permissions_granted : undefined,
    connected_at: raw.connected_at ? String(raw.connected_at) : undefined,
  };
}

function parseWorkspace(raw: Record<string, unknown>): NetworkWorkspace {
  return {
    workspace_key: String(raw.workspace_key ?? ""),
    workspace_title: String(raw.workspace_title ?? ""),
    partner_org_name: raw.partner_org_name ? String(raw.partner_org_name) : undefined,
    workspace_type: raw.workspace_type ? String(raw.workspace_type) : undefined,
    workspace_status: raw.workspace_status ? String(raw.workspace_status) : undefined,
    permission_categories: Array.isArray(raw.permission_categories) ? raw.permission_categories : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseEnterpriseNetworkCenter(raw: Record<string, unknown>): EnterpriseNetworkCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as EnterpriseNetworkCenter["organization"],
    overview: raw.overview as EnterpriseNetworkCenter["overview"],
    organizations: Array.isArray(raw.organizations) ? (raw.organizations as Record<string, unknown>[]) : [],
    connections: Array.isArray(raw.connections)
      ? (raw.connections as Record<string, unknown>[]).map(parseConnection)
      : [],
    invitations: Array.isArray(raw.invitations)
      ? (raw.invitations as Record<string, unknown>[]).map(parseInvitation)
      : [],
    collaborations: Array.isArray(raw.collaborations) ? (raw.collaborations as Record<string, unknown>[]) : [],
    workspaces: Array.isArray(raw.workspaces)
      ? (raw.workspaces as Record<string, unknown>[]).map(parseWorkspace)
      : [],
    trust: raw.trust as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as EnterpriseNetworkCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
