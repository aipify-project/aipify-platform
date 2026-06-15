import type {
  HostsTeamActivityRow,
  HostsTeamCenterActionResult,
  HostsTeamCenterDashboard,
  HostsTeamInvitationRow,
  HostsTeamMemberRow,
  HostsTeamNotification,
  HostsTeamPropertyOption,
  HostsTeamRoleOption,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseMembers(data: unknown): HostsTeamMemberRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        member_key: typeof d.member_key === "string" ? d.member_key : "",
        full_name: typeof d.full_name === "string" ? d.full_name : "",
        email: typeof d.email === "string" ? d.email : "",
        role_key: typeof d.role_key === "string" ? d.role_key : "",
        member_status: typeof d.member_status === "string" ? d.member_status : "",
        property_ids: asArray<string>(d.property_ids).map(String),
        property_names: asArray<string>(d.property_names).map(String),
        property_count: Number(d.property_count ?? 0),
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsTeamMemberRow => r !== null);
}

function parseInvitations(data: unknown): HostsTeamInvitationRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        email: typeof d.email === "string" ? d.email : "",
        role_key: typeof d.role_key === "string" ? d.role_key : "",
        status: typeof d.status === "string" ? d.status : "",
        property_ids: asArray<string>(d.property_ids).map(String),
        property_names: asArray<string>(d.property_names).map(String),
        invited_at: typeof d.invited_at === "string" ? d.invited_at : "",
        expires_at: d.expires_at != null ? String(d.expires_at) : null,
      };
    })
    .filter((r): r is HostsTeamInvitationRow => r !== null);
}

function parseActivity(data: unknown): HostsTeamActivityRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        event_type: typeof d.event_type === "string" ? d.event_type : "",
        summary: typeof d.summary === "string" ? d.summary : null,
        when: typeof d.when === "string" ? d.when : "",
      };
    })
    .filter((r): r is HostsTeamActivityRow => r !== null);
}

function parseProperties(data: unknown): HostsTeamPropertyOption[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        display_name: typeof d.display_name === "string" ? d.display_name : "",
      };
    })
    .filter((r): r is HostsTeamPropertyOption => r !== null);
}

function parseNotifications(data: unknown): HostsTeamNotification[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        active: Boolean(d.active),
        count: Number(d.count ?? 0),
        message: typeof d.message === "string" ? d.message : "",
      };
    })
    .filter((r): r is HostsTeamNotification => r !== null);
}

export function parseAipifyHostsTeamCenterDashboard(data: unknown): HostsTeamCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "team_members",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    roles: asArray<HostsTeamRoleOption>(d.roles),
    role_permissions: (d.role_permissions as Record<string, string[]>) ?? {},
    invitation_statuses: asArray<string>(d.invitation_statuses),
    notifications: parseNotifications(d.notifications),
    team_members: parseMembers(d.team_members),
    invitations: parseInvitations(d.invitations),
    activity_log: parseActivity(d.activity_log),
    properties: parseProperties(d.properties),
  };
}

export function parseAipifyHostsTeamCenterActionResult(data: unknown): HostsTeamCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    invitation_id: d.invitation_id != null ? String(d.invitation_id) : undefined,
    member_id: d.member_id != null ? String(d.member_id) : undefined,
    role_key: typeof d.role_key === "string" ? d.role_key : undefined,
  };
}
