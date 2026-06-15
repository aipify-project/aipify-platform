export type HostsIncidentCenterSectionKey =
  | "active_incidents"
  | "emergency_events"
  | "incident_history"
  | "recovery_actions"
  | "incident_playbooks";

export type HostsIncidentRow = {
  id: string;
  incident_key: string;
  property: string;
  property_id: string | null;
  incident_type: string;
  severity: string;
  status: string;
  description: string;
  reported_by: string;
  assigned_owner: string;
  escalated: boolean;
  created_at: string;
  resolved_at: string | null;
};

export type HostsEmergencyEventRow = {
  id: string;
  event_key: string;
  property: string;
  property_id: string | null;
  event_type: string;
  severity: string;
  status: string;
  description: string;
  reported_by: string;
  created_at: string;
};

export type HostsRecoveryActionRow = {
  id: string;
  incident_id: string;
  action_type: string;
  summary: string;
  created_at: string;
};

export type HostsTimelineRow = {
  id: string;
  incident_id: string | null;
  timeline_type: string;
  summary: string;
  created_at: string;
};

export type HostsEmergencyContactRow = {
  id: string;
  contact_role: string;
  contact_name: string;
  contact_phone: string | null;
  contact_email: string | null;
};

export type HostsIncidentPlaybook = {
  key: string;
  label: string;
  steps: string[];
};

export type HostsIncidentStats = {
  active_incidents: number;
  critical_incidents: number;
  open_emergencies: number;
  recovery_actions_count: number;
};

export type HostsPropertyOption = {
  id: string;
  display_name: string;
};

export type HostsIncidentCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  incident_categories: string[];
  severity_levels: string[];
  incident_statuses: string[];
  emergency_types: string[];
  emergency_statuses: string[];
  recovery_action_types: string[];
  playbooks: HostsIncidentPlaybook[];
  stats: HostsIncidentStats;
  properties: HostsPropertyOption[];
  emergency_contacts: HostsEmergencyContactRow[];
  timeline: HostsTimelineRow[];
  active_incidents: HostsIncidentRow[];
  emergency_events: HostsEmergencyEventRow[];
  incident_history: HostsIncidentRow[];
  recovery_actions: HostsRecoveryActionRow[];
};

export type HostsIncidentCenterActionResult = {
  success: boolean;
  incident_id?: string;
  emergency_id?: string;
  status?: string;
  severity?: string;
  action_type?: string;
};
