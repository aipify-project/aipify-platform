export type FederationTab =
  | "overview"
  | "networks"
  | "organizations"
  | "trust"
  | "intelligence"
  | "workspaces"
  | "governance"
  | "reports";

export type FederationRegistry = {
  federation_key: string;
  federation_name: string;
  federation_type?: string;
  federation_status?: string;
  trust_status?: string;
  region?: string;
  industry?: string;
  participating_orgs_count?: number;
  description?: string;
};

export type FederationWorkspace = {
  workspace_key: string;
  workspace_title: string;
  workspace_type?: string;
  workspace_status?: string;
  federation_key?: string;
  summary?: string;
};

export type FederationCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  federations?: FederationRegistry[];
  networks?: Record<string, unknown>[];
  organizations?: FederationRegistry[];
  trust_relationships?: Record<string, unknown>;
  shared_intelligence?: Record<string, unknown>[];
  workspaces?: FederationWorkspace[];
  governance?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type FederationLabels = {
  title: string;
  subtitle: string;
  workspacesTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<FederationTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  federationStatuses: Record<string, string>;
  trustStatuses: Record<string, string>;
};
