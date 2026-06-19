export type CalendarEventStatus =
  | "scheduled"
  | "information"
  | "pending"
  | "confirmed"
  | "cancelled"
  | "awaiting_approval";

export type CalendarEventType =
  | "meeting"
  | "task"
  | "appointment"
  | "booking"
  | "inspection"
  | "maintenance"
  | "training"
  | "customer_visit"
  | "property_stay"
  | "internal_event"
  | "custom_event";

export type CalendarView = "day" | "week" | "month" | "quarter" | "year" | "agenda" | "timeline" | "resource";

export type CalendarEvent = {
  id: string;
  event_number: string | null;
  title: string;
  description: string;
  event_type: CalendarEventType;
  status: CalendarEventStatus;
  owner_user_id: string | null;
  created_by: string | null;
  department_id: string | null;
  domain_id: string | null;
  related_module_key: string | null;
  business_pack_key: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  requires_approval: boolean;
  recurrence_rule: string | null;
  created_at: string;
};

export type CalendarResource = {
  id: string;
  resource_key: string;
  name: string;
  resource_type: string;
  location: string | null;
  is_active: boolean;
};

export type ResourceBooking = {
  booking_id: string;
  event_id: string;
  resource_id: string;
  resource_name: string;
  event_title: string;
  starts_at: string;
  booking_status: string;
  conflict_warning: boolean;
};

export type CalendarApproval = {
  approval_id: string;
  event_id: string;
  event_title: string;
  approval_status: string;
  starts_at: string;
  created_at: string;
};

export type RecurringSchedule = {
  id: string;
  title: string;
  frequency: string;
  next_run_at: string;
  active: boolean;
};

export type LeaveRecord = {
  id: string;
  user_id: string;
  leave_type: string;
  starts_at: string;
  ends_at: string;
  status: string;
};

export type SyncConnection = {
  id: string;
  provider: string;
  sync_mode: string;
  connection_status: string;
};

export type DepartmentCalendarStats = {
  department_id: string;
  department_name: string;
  upcoming: number;
};

export type CalendarManagementCenter = {
  found: boolean;
  principle?: string;
  structure?: string;
  views?: CalendarView[];
  statuses?: CalendarEventStatus[];
  event_types?: CalendarEventType[];
  overview?: {
    upcoming: number;
    my_upcoming: number;
    pending_approvals: number;
    conflicts: number;
    leave_pending: number;
  };
  my_calendar?: CalendarEvent[];
  team_calendar?: CalendarEvent[];
  department_calendar?: DepartmentCalendarStats[];
  resources?: CalendarResource[];
  bookings?: ResourceBooking[];
  approvals?: CalendarApproval[];
  schedules?: RecurringSchedule[];
  leave?: LeaveRecord[];
  sync_connections?: SyncConnection[];
  reports?: {
    meeting_volume: number;
    booking_count: number;
    resource_usage: { resource_name: string; bookings: number }[];
    by_pack: { pack_key: string; count: number }[];
  };
  manager_dashboard?: {
    team_availability_note: string;
    pending_approvals: number;
    upcoming_conflicts: number;
  };
  personal_calendar_route?: string;
};
