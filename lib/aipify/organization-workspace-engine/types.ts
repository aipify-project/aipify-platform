export type OrganizationWorkspace = {
  id?: string;
  organization_id?: string;
  name?: string;
  slug?: string;
  description?: string;
  status?: string;
  settings?: Record<string, unknown>;
  member_count?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type WorkspaceMember = {
  id?: string;
  workspace_id?: string;
  user_id?: string;
  role?: string;
  custom_role_id?: string | null;
  status?: string;
  [key: string]: unknown;
};

export type WorkspaceCustomRole = {
  id?: string;
  organization_id?: string;
  name?: string;
  description?: string;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type WorkspaceSettings = {
  organization_id?: string;
  default_workspace_slug?: string | null;
  allow_custom_roles?: boolean;
  max_workspaces?: number;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationWorkspaceEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  total_workspaces?: number;
  active_workspaces?: number;
  total_members?: number;
  current_workspace_id?: string;
  [key: string]: unknown;
};

export type OrganizationWorkspaceEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  organization?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  settings?: WorkspaceSettings;
  current_workspace?: Record<string, unknown>;
  workspaces?: OrganizationWorkspace[];
  custom_roles?: WorkspaceCustomRole[];
  members_by_workspace?: {
    workspace_id?: string;
    workspace_slug?: string;
    members?: WorkspaceMember[];
  }[];
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type OrganizationWorkspaceExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: WorkspaceSettings;
  summary?: Record<string, unknown>;
  workspaces?: OrganizationWorkspace[];
  custom_roles?: WorkspaceCustomRole[];
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
