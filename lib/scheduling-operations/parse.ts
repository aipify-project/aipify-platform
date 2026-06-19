import type {
  AvailabilityItem,
  BookingItem,
  RecurringItem,
  ResourceItem,
  ScheduleEventItem,
  SchedulingOperationsCenter,
} from "./types";

function mapArr(arr: unknown) {
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
}

function parseEvent(row: Record<string, unknown>): ScheduleEventItem {
  return {
    id: String(row.id ?? ""),
    event_number: typeof row.event_number === "string" ? row.event_number : null,
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    event_type: String(row.event_type ?? "meeting"),
    status: String(row.status ?? "planned"),
    starts_at: String(row.starts_at ?? ""),
    ends_at: String(row.ends_at ?? ""),
    location: typeof row.location === "string" ? row.location : null,
    department_id: typeof row.department_id === "string" ? row.department_id : null,
    domain_id: typeof row.domain_id === "string" ? row.domain_id : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
  };
}

function parseBooking(row: Record<string, unknown>): BookingItem {
  return {
    booking_id: String(row.booking_id ?? row.id ?? ""),
    event_id: String(row.event_id ?? ""),
    resource_id: String(row.resource_id ?? ""),
    resource_name: String(row.resource_name ?? ""),
    resource_type: typeof row.resource_type === "string" ? row.resource_type : null,
    event_title: String(row.event_title ?? ""),
    starts_at: String(row.starts_at ?? ""),
    ends_at: String(row.ends_at ?? ""),
    booking_status: String(row.booking_status ?? "confirmed"),
    conflict_warning: row.conflict_warning === true,
  };
}

function parseResource(row: Record<string, unknown>): ResourceItem {
  return {
    id: String(row.id ?? ""),
    resource_key: String(row.resource_key ?? ""),
    name: String(row.name ?? ""),
    resource_type: String(row.resource_type ?? ""),
    location: typeof row.location === "string" ? row.location : null,
    capacity: row.capacity != null ? Number(row.capacity) : null,
    is_active: row.is_active !== false,
  };
}

function parseAvailability(row: Record<string, unknown>): AvailabilityItem {
  return {
    id: String(row.id ?? ""),
    block_number: typeof row.block_number === "string" ? row.block_number : null,
    block_type: String(row.block_type ?? "blocked"),
    resource_id: typeof row.resource_id === "string" ? row.resource_id : null,
    starts_at: String(row.starts_at ?? ""),
    ends_at: String(row.ends_at ?? ""),
    reason: typeof row.reason === "string" ? row.reason : null,
  };
}

function parseRecurring(row: Record<string, unknown>): RecurringItem {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    frequency: String(row.frequency ?? "weekly"),
    next_run_at: String(row.next_run_at ?? ""),
    active: row.active !== false,
    event_type: typeof row.event_type === "string" ? row.event_type : null,
  };
}

export function parseSchedulingOperationsCenter(data: unknown): SchedulingOperationsCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    philosophy: typeof row.philosophy === "string" ? row.philosophy : undefined,
    calendar_views: Array.isArray(row.calendar_views) ? (row.calendar_views as string[]) : [],
    overview: row.overview as Record<string, unknown> | undefined,
    calendar_events: mapArr(row.calendar_events).map(parseEvent),
    events: mapArr(row.events).map(parseEvent),
    bookings: mapArr(row.bookings).map(parseBooking),
    appointments: mapArr(row.appointments).map(parseEvent),
    resources: mapArr(row.resources).map(parseResource),
    availability: mapArr(row.availability).map(parseAvailability),
    recurring: mapArr(row.recurring).map(parseRecurring),
    sync_connections: mapArr(row.sync_connections) as SchedulingOperationsCenter["sync_connections"],
    department_calendars: mapArr(row.department_calendars) as SchedulingOperationsCenter["department_calendars"],
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
