export type HostsTeamCenterSectionKey =
  | "team_members"
  | "roles"
  | "permissions"
  | "invitations"
  | "activity_log";

export type HostsTeamMemberRow = {
  id: string;
  member_key: string;
  full_name: string;
  email: string;
  role_key: string;
  member_status: string;
  property_ids: string[];
  property_names: string[];
  property_count: number;
  created_at: string;
};

export type HostsTeamInvitationRow = {
  id: string;
  email: string;
  role_key: string;
  status: string;
  property_ids: string[];
  property_names: string[];
  invited_at: string;
  expires_at: string | null;
};

export type HostsTeamActivityRow = {
  id: string;
  event_type: string;
  summary: string | null;
  when: string;
};

export type HostsTeamPropertyOption = {
  id: string;
  display_name: string;
};

export type HostsTeamRoleOption = {
  key: string;
  label: string;
};

export type HostsTeamNotification = {
  key: string;
  active: boolean;
  count: number;
  message: string;
};

export type HostsTeamCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  roles: HostsTeamRoleOption[];
  role_permissions: Record<string, string[]>;
  invitation_statuses: string[];
  notifications: HostsTeamNotification[];
  team_members: HostsTeamMemberRow[];
  invitations: HostsTeamInvitationRow[];
  activity_log: HostsTeamActivityRow[];
  properties: HostsTeamPropertyOption[];
};

export type HostsTeamCenterActionResult = {
  success: boolean;
  invitation_id?: string;
  member_id?: string;
  role_key?: string;
};
