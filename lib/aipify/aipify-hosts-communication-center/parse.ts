import type {
  HostsCommunicationAnnouncementRow,
  HostsCommunicationCenterActionResult,
  HostsCommunicationCenterDashboard,
  HostsCommunicationHistoryRow,
  HostsCommunicationStats,
  HostsCommunicationTemplateRow,
  HostsGuestCommunicationRow,
  HostsTeamCommunicationRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseGuestComms(data: unknown): HostsGuestCommunicationRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        comm_key: typeof d.comm_key === "string" ? d.comm_key : "",
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        message_type: typeof d.message_type === "string" ? d.message_type : "",
        delivery_channel: typeof d.delivery_channel === "string" ? d.delivery_channel : "email",
        comm_status: typeof d.comm_status === "string" ? d.comm_status : "",
        subject: typeof d.subject === "string" ? d.subject : "",
        body_preview: typeof d.body_preview === "string" ? d.body_preview : "",
        sender_name: typeof d.sender_name === "string" ? d.sender_name : "—",
        sent_at: typeof d.sent_at === "string" ? d.sent_at : "",
        scheduled_at: typeof d.scheduled_at === "string" ? d.scheduled_at : "",
        recipient_type: "guest",
      };
    })
    .filter((r): r is HostsGuestCommunicationRow => r !== null);
}

function parseTeamComms(data: unknown): HostsTeamCommunicationRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        comm_key: typeof d.comm_key === "string" ? d.comm_key : "",
        recipient: typeof d.recipient === "string" ? d.recipient : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        subject: typeof d.subject === "string" ? d.subject : "",
        category: typeof d.category === "string" ? d.category : "",
        comm_status: typeof d.comm_status === "string" ? d.comm_status : "",
        sender_name: typeof d.sender_name === "string" ? d.sender_name : "—",
        sent_at: typeof d.sent_at === "string" ? d.sent_at : "",
        recipient_type: "team",
      };
    })
    .filter((r): r is HostsTeamCommunicationRow => r !== null);
}

function parseTemplates(data: unknown): HostsCommunicationTemplateRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        template_key: typeof d.template_key === "string" ? d.template_key : "",
        template_name: typeof d.template_name === "string" ? d.template_name : "",
        template_type: typeof d.template_type === "string" ? d.template_type : "",
        subject_line: typeof d.subject_line === "string" ? d.subject_line : "",
        body_template: typeof d.body_template === "string" ? d.body_template : "",
        delivery_channel: typeof d.delivery_channel === "string" ? d.delivery_channel : "email",
        is_active: Boolean(d.is_active),
      };
    })
    .filter((r): r is HostsCommunicationTemplateRow => r !== null);
}

function parseAnnouncements(data: unknown): HostsCommunicationAnnouncementRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        announcement_key: typeof d.announcement_key === "string" ? d.announcement_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        announcement_type: typeof d.announcement_type === "string" ? d.announcement_type : "",
        title: typeof d.title === "string" ? d.title : "",
        body: typeof d.body === "string" ? d.body : "",
        comm_status: typeof d.comm_status === "string" ? d.comm_status : "",
        is_critical: Boolean(d.is_critical),
        scheduled_at: typeof d.scheduled_at === "string" ? d.scheduled_at : "",
        sent_at: typeof d.sent_at === "string" ? d.sent_at : "",
      };
    })
    .filter((r): r is HostsCommunicationAnnouncementRow => r !== null);
}

function parseHistory(data: unknown): HostsCommunicationHistoryRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.sender && !d.recipient) return null;
      return {
        id: d.id != null ? String(d.id) : null,
        sender: typeof d.sender === "string" ? d.sender : "—",
        recipient: typeof d.recipient === "string" ? d.recipient : "—",
        property: typeof d.property === "string" ? d.property : "—",
        message_type: typeof d.message_type === "string" ? d.message_type : "",
        comm_status: typeof d.comm_status === "string" ? d.comm_status : "",
        sent_at: typeof d.sent_at === "string" ? d.sent_at : "",
        delivery_channel: typeof d.delivery_channel === "string" ? d.delivery_channel : "email",
      };
    })
    .filter((r): r is HostsCommunicationHistoryRow => r !== null);
}

function parseStats(data: unknown): HostsCommunicationStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    guest_messages_30d: Number(d.guest_messages_30d ?? 0),
    team_messages_30d: Number(d.team_messages_30d ?? 0),
    scheduled_count: Number(d.scheduled_count ?? 0),
    failed_count: Number(d.failed_count ?? 0),
    active_templates: Number(d.active_templates ?? 0),
    pending_critical_announcements: Number(d.pending_critical_announcements ?? 0),
    delivered_count: Number(d.delivered_count ?? 0),
  };
}

export function parseAipifyHostsCommunicationCenterDashboard(data: unknown): HostsCommunicationCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "guest_communications",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    communication_types: asArray<string>(d.communication_types),
    communication_statuses: asArray<string>(d.communication_statuses),
    delivery_channels: asArray<string>(d.delivery_channels),
    recipient_types: asArray<string>(d.recipient_types),
    stats: parseStats(d.stats),
    properties: asArray<{ id: string; display_name: string }>(d.properties),
    guest_communications: parseGuestComms(d.guest_communications),
    team_communications: parseTeamComms(d.team_communications),
    templates: parseTemplates(d.templates),
    announcements: parseAnnouncements(d.announcements),
    communication_history: parseHistory(d.communication_history),
  };
}

export function parseAipifyHostsCommunicationCenterActionResult(data: unknown): HostsCommunicationCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}
