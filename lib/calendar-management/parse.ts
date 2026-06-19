import type {
  CalendarApproval,
  CalendarEvent,
  CalendarManagementCenter,
  CalendarResource,
  DepartmentCalendarStats,
  LeaveRecord,
  RecurringSchedule,
  ResourceBooking,
  SyncConnection,
} from "./types";

function parseEvent(raw: unknown): CalendarEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string") return null;
  return {
    id: o.id,
    event_number: typeof o.event_number === "string" ? o.event_number : null,
    title: o.title,
    description: typeof o.description === "string" ? o.description : "",
    event_type: (o.event_type as CalendarEvent["event_type"]) ?? "meeting",
    status: (o.status as CalendarEvent["status"]) ?? "scheduled",
    owner_user_id: typeof o.owner_user_id === "string" ? o.owner_user_id : null,
    created_by: typeof o.created_by === "string" ? o.created_by : null,
    department_id: typeof o.department_id === "string" ? o.department_id : null,
    domain_id: typeof o.domain_id === "string" ? o.domain_id : null,
    related_module_key: typeof o.related_module_key === "string" ? o.related_module_key : null,
    business_pack_key: typeof o.business_pack_key === "string" ? o.business_pack_key : null,
    location: typeof o.location === "string" ? o.location : null,
    starts_at: typeof o.starts_at === "string" ? o.starts_at : "",
    ends_at: typeof o.ends_at === "string" ? o.ends_at : "",
    all_day: Boolean(o.all_day),
    requires_approval: Boolean(o.requires_approval),
    recurrence_rule: typeof o.recurrence_rule === "string" ? o.recurrence_rule : null,
    created_at: typeof o.created_at === "string" ? o.created_at : "",
  };
}

function parseEvents(raw: unknown): CalendarEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseEvent).filter((e): e is CalendarEvent => e !== null);
}

export function parseCalendarManagementCenter(data: unknown): CalendarManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const overview = o.overview as Record<string, unknown> | undefined;
  const reports = o.reports as Record<string, unknown> | undefined;
  const manager = o.manager_dashboard as Record<string, unknown> | undefined;

  return {
    found: Boolean(o.found),
    principle: typeof o.principle === "string" ? o.principle : undefined,
    structure: typeof o.structure === "string" ? o.structure : undefined,
    views: Array.isArray(o.views) ? (o.views as CalendarManagementCenter["views"]) : undefined,
    statuses: Array.isArray(o.statuses) ? (o.statuses as CalendarManagementCenter["statuses"]) : undefined,
    event_types: Array.isArray(o.event_types) ? (o.event_types as CalendarManagementCenter["event_types"]) : undefined,
    overview: overview
      ? {
          upcoming: Number(overview.upcoming ?? 0),
          my_upcoming: Number(overview.my_upcoming ?? 0),
          pending_approvals: Number(overview.pending_approvals ?? 0),
          conflicts: Number(overview.conflicts ?? 0),
          leave_pending: Number(overview.leave_pending ?? 0),
        }
      : undefined,
    my_calendar: parseEvents(o.my_calendar),
    team_calendar: parseEvents(o.team_calendar),
    department_calendar: Array.isArray(o.department_calendar)
      ? (o.department_calendar as DepartmentCalendarStats[])
      : [],
    resources: Array.isArray(o.resources) ? (o.resources as CalendarResource[]) : [],
    bookings: Array.isArray(o.bookings) ? (o.bookings as ResourceBooking[]) : [],
    approvals: Array.isArray(o.approvals) ? (o.approvals as CalendarApproval[]) : [],
    schedules: Array.isArray(o.schedules) ? (o.schedules as RecurringSchedule[]) : [],
    leave: Array.isArray(o.leave) ? (o.leave as LeaveRecord[]) : [],
    sync_connections: Array.isArray(o.sync_connections) ? (o.sync_connections as SyncConnection[]) : [],
    reports: reports
      ? {
          meeting_volume: Number(reports.meeting_volume ?? 0),
          booking_count: Number(reports.booking_count ?? 0),
          resource_usage: Array.isArray(reports.resource_usage)
            ? (reports.resource_usage as { resource_name: string; bookings: number }[])
            : [],
          by_pack: Array.isArray(reports.by_pack)
            ? (reports.by_pack as { pack_key: string; count: number }[])
            : [],
        }
      : undefined,
    manager_dashboard: manager
      ? {
          team_availability_note: String(manager.team_availability_note ?? ""),
          pending_approvals: Number(manager.pending_approvals ?? 0),
          upcoming_conflicts: Number(manager.upcoming_conflicts ?? 0),
        }
      : undefined,
    personal_calendar_route: typeof o.personal_calendar_route === "string" ? o.personal_calendar_route : undefined,
  };
}
