export type EnterpriseNetworkTab =
  | "overview"
  | "organizations"
  | "connections"
  | "invitations"
  | "collaborations"
  | "workspaces"
  | "trust"
  | "reports";

export type NetworkInvitation = {
  invitation_key: string;
  target_org_name: string;
  relationship_type?: string;
  invitation_status?: string;
  summary?: string;
  sent_at?: string;
};

export type NetworkConnection = {
  connection_key: string;
  partner_org_name: string;
  connection_status?: string;
  relationship_type?: string;
  trust_level?: string;
  permissions_granted?: unknown[];
  connected_at?: string;
};

export type NetworkWorkspace = {
  workspace_key: string;
  workspace_title: string;
  partner_org_name?: string;
  workspace_type?: string;
  workspace_status?: string;
  permission_categories?: unknown[];
  summary?: string;
};

export type EnterpriseNetworkCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  organizations?: Record<string, unknown>[];
  connections?: NetworkConnection[];
  invitations?: NetworkInvitation[];
  collaborations?: Record<string, unknown>[];
  workspaces?: NetworkWorkspace[];
  trust?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type EnterpriseNetworkLabels = {
  title: string;
  subtitle: string;
  workspacesTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<EnterpriseNetworkTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  organizationStatuses: Record<string, string>;
  trustLevels: Record<string, string>;
};
