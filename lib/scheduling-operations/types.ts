export type ScheduleEventItem = {
  id: string;
  event_number?: string | null;
  title: string;
  description?: string | null;
  event_type: string;
  status: string;
  starts_at: string;
  ends_at: string;
  location?: string | null;
  department_id?: string | null;
  domain_id?: string | null;
  business_pack_key?: string | null;
};

export type BookingItem = {
  booking_id: string;
  event_id: string;
  resource_id: string;
  resource_name: string;
  resource_type?: string | null;
  event_title: string;
  starts_at: string;
  ends_at: string;
  booking_status: string;
  conflict_warning?: boolean;
};

export type ResourceItem = {
  id: string;
  resource_key: string;
  name: string;
  resource_type: string;
  location?: string | null;
  capacity?: number | null;
  is_active: boolean;
};

export type AvailabilityItem = {
  id: string;
  block_number?: string | null;
  block_type: string;
  resource_id?: string | null;
  starts_at: string;
  ends_at: string;
  reason?: string | null;
};

export type RecurringItem = {
  id: string;
  title: string;
  frequency: string;
  next_run_at: string;
  active: boolean;
  event_type?: string | null;
};

export type SchedulingOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  calendar_views?: string[];
  overview?: Record<string, unknown>;
  calendar_events?: ScheduleEventItem[];
  events?: ScheduleEventItem[];
  bookings?: BookingItem[];
  appointments?: ScheduleEventItem[];
  resources?: ResourceItem[];
  availability?: AvailabilityItem[];
  recurring?: RecurringItem[];
  sync_connections?: { id: string; provider: string; connection_status: string }[];
  department_calendars?: { department_id: string; department_name: string; upcoming: number }[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  sections?: string[];
  routes?: Record<string, string>;
};
