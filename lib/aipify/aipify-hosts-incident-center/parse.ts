import type {
  HostsEmergencyContactRow,
  HostsEmergencyEventRow,
  HostsIncidentCenterActionResult,
  HostsIncidentCenterDashboard,
  HostsIncidentPlaybook,
  HostsIncidentRow,
  HostsIncidentStats,
  HostsPropertyOption,
  HostsRecoveryActionRow,
  HostsTimelineRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseIncidents(data: unknown): HostsIncidentRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        incident_key: typeof d.incident_key === "string" ? d.incident_key : "",
        property: typeof d.property === "string" ? d.property : "—",
        property_id: d.property_id != null ? String(d.property_id) : null,
        incident_type: typeof d.incident_type === "string" ? d.incident_type : "",
        severity: typeof d.severity === "string" ? d.severity : "",
        status: typeof d.status === "string" ? d.status : "",
        description: typeof d.description === "string" ? d.description : "",
        reported_by: typeof d.reported_by === "string" ? d.reported_by : "—",
        assigned_owner: typeof d.assigned_owner === "string" ? d.assigned_owner : "—",
        escalated: Boolean(d.escalated),
        created_at: typeof d.created_at === "string" ? d.created_at : "",
        resolved_at: typeof d.resolved_at === "string" ? d.resolved_at : null,
      };
    })
    .filter((r): r is HostsIncidentRow => r !== null);
}

function parseEmergencies(data: unknown): HostsEmergencyEventRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        event_key: typeof d.event_key === "string" ? d.event_key : "",
        property: typeof d.property === "string" ? d.property : "—",
        property_id: d.property_id != null ? String(d.property_id) : null,
        event_type: typeof d.event_type === "string" ? d.event_type : "",
        severity: typeof d.severity === "string" ? d.severity : "",
        status: typeof d.status === "string" ? d.status : "",
        description: typeof d.description === "string" ? d.description : "",
        reported_by: typeof d.reported_by === "string" ? d.reported_by : "—",
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsEmergencyEventRow => r !== null);
}

function parseRecoveryActions(data: unknown): HostsRecoveryActionRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        incident_id: String(d.incident_id ?? ""),
        action_type: typeof d.action_type === "string" ? d.action_type : "",
        summary: typeof d.summary === "string" ? d.summary : "",
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsRecoveryActionRow => r !== null);
}

function parseTimeline(data: unknown): HostsTimelineRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        incident_id: d.incident_id != null ? String(d.incident_id) : null,
        timeline_type: typeof d.timeline_type === "string" ? d.timeline_type : "",
        summary: typeof d.summary === "string" ? d.summary : "",
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsTimelineRow => r !== null);
}

function parseContacts(data: unknown): HostsEmergencyContactRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        contact_role: typeof d.contact_role === "string" ? d.contact_role : "",
        contact_name: typeof d.contact_name === "string" ? d.contact_name : "",
        contact_phone: typeof d.contact_phone === "string" ? d.contact_phone : null,
        contact_email: typeof d.contact_email === "string" ? d.contact_email : null,
      };
    })
    .filter((r): r is HostsEmergencyContactRow => r !== null);
}

function parsePlaybooks(data: unknown): HostsIncidentPlaybook[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        label: typeof d.label === "string" ? d.label : String(d.key),
        steps: asArray<string>(d.steps),
      };
    })
    .filter((r): r is HostsIncidentPlaybook => r !== null);
}

function parseProperties(data: unknown): HostsPropertyOption[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        display_name: typeof d.display_name === "string" ? d.display_name : "",
      };
    })
    .filter((r): r is HostsPropertyOption => r !== null);
}

function parseStats(data: unknown): HostsIncidentStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    active_incidents: Number(d.active_incidents ?? 0),
    critical_incidents: Number(d.critical_incidents ?? 0),
    open_emergencies: Number(d.open_emergencies ?? 0),
    recovery_actions_count: Number(d.recovery_actions_count ?? 0),
  };
}

export function parseAipifyHostsIncidentCenterDashboard(data: unknown): HostsIncidentCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "active_incidents",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    incident_categories: asArray<string>(d.incident_categories),
    severity_levels: asArray<string>(d.severity_levels),
    incident_statuses: asArray<string>(d.incident_statuses),
    emergency_types: asArray<string>(d.emergency_types),
    emergency_statuses: asArray<string>(d.emergency_statuses),
    recovery_action_types: asArray<string>(d.recovery_action_types),
    playbooks: parsePlaybooks(d.playbooks),
    stats: parseStats(d.stats),
    properties: parseProperties(d.properties),
    emergency_contacts: parseContacts(d.emergency_contacts),
    timeline: parseTimeline(d.timeline),
    active_incidents: parseIncidents(d.active_incidents),
    emergency_events: parseEmergencies(d.emergency_events),
    incident_history: parseIncidents(d.incident_history),
    recovery_actions: parseRecoveryActions(d.recovery_actions),
  };
}

export function parseAipifyHostsIncidentCenterActionResult(data: unknown): HostsIncidentCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    incident_id: d.incident_id != null ? String(d.incident_id) : undefined,
    emergency_id: d.emergency_id != null ? String(d.emergency_id) : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    severity: typeof d.severity === "string" ? d.severity : undefined,
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
  };
}
