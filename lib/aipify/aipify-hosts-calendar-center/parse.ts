import type {
  HostsCalendarBlockRow,
  HostsCalendarCenterActionResult,
  HostsCalendarCenterDashboard,
  HostsCalendarEventRow,
  HostsCalendarStats,
  HostsPropertyOccupancyRow,
  HostsPropertyOption,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseEvents(data: unknown): HostsCalendarEventRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        event_key: typeof d.event_key === "string" ? d.event_key : "",
        event_type: typeof d.event_type === "string" ? d.event_type : "",
        title: typeof d.title === "string" ? d.title : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        start_date: typeof d.start_date === "string" ? d.start_date : "",
        end_date: typeof d.end_date === "string" ? d.end_date : "",
        status: typeof d.status === "string" ? d.status : "",
        assigned_users: typeof d.assigned_users === "string" ? d.assigned_users : "—",
        internal_notes: typeof d.internal_notes === "string" ? d.internal_notes : "",
        occupancy_status: typeof d.occupancy_status === "string" ? d.occupancy_status : "",
      };
    })
    .filter((r): r is HostsCalendarEventRow => r !== null);
}

function parseBlocks(data: unknown): HostsCalendarBlockRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        block_key: typeof d.block_key === "string" ? d.block_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        start_date: typeof d.start_date === "string" ? d.start_date : "",
        end_date: typeof d.end_date === "string" ? d.end_date : "",
        block_reason: typeof d.block_reason === "string" ? d.block_reason : "—",
        internal_notes: typeof d.internal_notes === "string" ? d.internal_notes : "",
        is_active: Boolean(d.is_active ?? true),
      };
    })
    .filter((r): r is HostsCalendarBlockRow => r !== null);
}

function parseOccupancy(data: unknown): HostsPropertyOccupancyRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.property_id) return null;
      return {
        property_id: String(d.property_id),
        property_name: typeof d.property_name === "string" ? d.property_name : "—",
        occupancy_status: typeof d.occupancy_status === "string" ? d.occupancy_status : "",
        upcoming_arrivals: Number(d.upcoming_arrivals ?? 0),
        upcoming_departures: Number(d.upcoming_departures ?? 0),
      };
    })
    .filter((r): r is HostsPropertyOccupancyRow => r !== null);
}

function parseProperties(data: unknown): HostsPropertyOption[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        display_name: typeof d.display_name === "string" ? d.display_name : "—",
      };
    })
    .filter((r): r is HostsPropertyOption => r !== null);
}

function parseStats(data: unknown): HostsCalendarStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    occupancy_rate: Number(d.occupancy_rate ?? 0),
    available_nights: Number(d.available_nights ?? 0),
    blocked_nights: Number(d.blocked_nights ?? 0),
    upcoming_arrivals: Number(d.upcoming_arrivals ?? 0),
    upcoming_departures: Number(d.upcoming_departures ?? 0),
    property_count: Number(d.property_count ?? 0),
  };
}

export function parseAipifyHostsCalendarCenterDashboard(data: unknown): HostsCalendarCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  const dateRange = (d.date_range ?? {}) as Record<string, unknown>;
  const settings = (d.calendar_settings ?? {}) as Record<string, unknown>;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "master_calendar",
    active_view: typeof d.active_view === "string" ? d.active_view : "month",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    calendar_views: asArray<string>(d.calendar_views),
    event_types: asArray<string>(d.event_types),
    occupancy_statuses: asArray<string>(d.occupancy_statuses),
    event_statuses: asArray<string>(d.event_statuses),
    stats: parseStats(d.stats),
    property_occupancy: parseOccupancy(d.property_occupancy),
    properties: parseProperties(d.properties),
    team_members: asArray<string>(d.team_members),
    calendar_events: parseEvents(d.calendar_events),
    blocked_periods: parseBlocks(d.blocked_periods),
    date_range: {
      from: typeof dateRange.from === "string" ? dateRange.from : "",
      to: typeof dateRange.to === "string" ? dateRange.to : "",
    },
    calendar_settings: {
      default_view: typeof settings.default_view === "string" ? settings.default_view : "month",
      default_section: typeof settings.default_section === "string" ? settings.default_section : "master_calendar",
    },
  };
}

export function parseAipifyHostsCalendarCenterActionResult(data: unknown): HostsCalendarCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    event_id: d.event_id != null ? String(d.event_id) : undefined,
  };
}
