import type {
  OrganizationWorkspace,
  OrganizationWorkspaceEngineCard,
  OrganizationWorkspaceEngineDashboard,
  OrganizationWorkspaceExport,
  WorkspaceCustomRole,
  WorkspaceMember,
  WorkspaceSettings,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): WorkspaceSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as WorkspaceSettings;
}

function parseMembersByWorkspace(
  data: unknown
): OrganizationWorkspaceEngineDashboard["members_by_workspace"] {
  if (!Array.isArray(data)) return undefined;
  return data.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      workspace_id: typeof row.workspace_id === "string" ? row.workspace_id : undefined,
      workspace_slug: typeof row.workspace_slug === "string" ? row.workspace_slug : undefined,
      members: parseRecordList<WorkspaceMember>(row.members),
    };
  });
}

export function parseOrganizationWorkspaceEngineCard(data: unknown): OrganizationWorkspaceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as OrganizationWorkspaceEngineCard;
}

export function parseOrganizationWorkspaceEngineDashboard(
  data: unknown
): OrganizationWorkspaceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    organization:
      typeof d.organization === "object" && d.organization
        ? (d.organization as Record<string, unknown>)
        : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    settings: parseSettings(d.settings),
    current_workspace:
      typeof d.current_workspace === "object" && d.current_workspace
        ? (d.current_workspace as Record<string, unknown>)
        : undefined,
    workspaces: parseRecordList<OrganizationWorkspace>(d.workspaces),
    custom_roles: parseRecordList<WorkspaceCustomRole>(d.custom_roles),
    members_by_workspace: parseMembersByWorkspace(d.members_by_workspace),
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as OrganizationWorkspaceEngineDashboard;
}

export function parseOrganizationWorkspaceExport(data: unknown): OrganizationWorkspaceExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    workspaces: parseRecordList<OrganizationWorkspace>(d.workspaces),
    custom_roles: parseRecordList<WorkspaceCustomRole>(d.custom_roles),
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as OrganizationWorkspaceExport;
}
