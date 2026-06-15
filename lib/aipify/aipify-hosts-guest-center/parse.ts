import type {
  HostsGuestCenterActionResult,
  HostsGuestCenterDashboard,
  HostsGuestNoteRow,
  HostsGuestNotification,
  HostsGuestRequestRow,
  HostsGuestRow,
  HostsGuestTimelineEvent,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseGuestRow(data: unknown): HostsGuestRow | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.id) return null;
  return {
    id: String(d.id),
    guest_key: typeof d.guest_key === "string" ? d.guest_key : "",
    full_name: typeof d.full_name === "string" ? d.full_name : "",
    property: typeof d.property === "string" ? d.property : "",
    property_id: d.property_id != null ? String(d.property_id) : null,
    check_in_date: d.check_in_date != null ? String(d.check_in_date) : null,
    check_out_date: d.check_out_date != null ? String(d.check_out_date) : null,
    status: typeof d.status === "string" ? d.status : "",
    guest_tier: typeof d.guest_tier === "string" ? d.guest_tier : "",
    requires_attention: Boolean(d.requires_attention),
    contact_email: typeof d.contact_email === "string" ? d.contact_email : null,
    contact_phone: typeof d.contact_phone === "string" ? d.contact_phone : null,
  };
}

function parseGuests(data: unknown): HostsGuestRow[] {
  return asArray<unknown>(data)
    .map((row) => parseGuestRow(row))
    .filter((r): r is HostsGuestRow => r !== null);
}

function parseRequests(data: unknown): HostsGuestRequestRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        guest_id: String(d.guest_id ?? ""),
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        property: typeof d.property === "string" ? d.property : "",
        request_type: typeof d.request_type === "string" ? d.request_type : "",
        status: typeof d.status === "string" ? d.status : "",
        summary: typeof d.summary === "string" ? d.summary : null,
        assigned_to: typeof d.assigned_to === "string" ? d.assigned_to : null,
        submitted_at: typeof d.submitted_at === "string" ? d.submitted_at : "",
      };
    })
    .filter((r): r is HostsGuestRequestRow => r !== null);
}

function parseNotes(data: unknown): HostsGuestNoteRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        guest_id: String(d.guest_id ?? ""),
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        note_text: typeof d.note_text === "string" ? d.note_text : "",
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsGuestNoteRow => r !== null);
}

function parseTimeline(data: unknown): HostsGuestTimelineEvent[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.type) return null;
      return {
        type: String(d.type),
        label: typeof d.label === "string" ? d.label : "",
        when: typeof d.when === "string" ? d.when : "",
      };
    })
    .filter((r): r is HostsGuestTimelineEvent => r !== null);
}

function parseNotifications(data: unknown): HostsGuestNotification[] {
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
    .filter((r): r is HostsGuestNotification => r !== null);
}

export function parseAipifyHostsGuestCenterDashboard(data: unknown): HostsGuestCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "active_guests",
    active_filter: typeof d.active_filter === "string" ? d.active_filter : "active_guests",
    selected_guest_id: d.selected_guest_id != null ? String(d.selected_guest_id) : null,
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    filters: asArray<{ key: string; label: string }>(d.filters),
    guest_tiers: asArray<string>(d.guest_tiers),
    request_types: asArray<string>(d.request_types),
    request_statuses: asArray<string>(d.request_statuses),
    stay_statuses: asArray<string>(d.stay_statuses),
    notifications: parseNotifications(d.notifications),
    guests: parseGuests(d.guests),
    active_guests: parseGuests(d.active_guests),
    upcoming_guests: parseGuests(d.upcoming_guests),
    guest_history: parseGuests(d.guest_history),
    guest_requests: parseRequests(d.guest_requests),
    guest_notes: parseNotes(d.guest_notes),
    guest_profile: parseGuestRow(d.guest_profile),
    guest_timeline: parseTimeline(d.guest_timeline),
  };
}

export function parseAipifyHostsGuestCenterActionResult(data: unknown): HostsGuestCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    note_id: d.note_id != null ? String(d.note_id) : undefined,
    request_id: d.request_id != null ? String(d.request_id) : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}
