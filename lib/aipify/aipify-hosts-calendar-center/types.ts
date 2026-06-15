export type HostsCalendarCenterSectionKey =
  | "master_calendar"
  | "property_calendars"
  | "occupancy_overview"
  | "availability_management"
  | "calendar_settings";

export type HostsCalendarViewKey = "day" | "week" | "month" | "agenda";

export type HostsCalendarEventRow = {
  id: string;
  event_key: string;
  event_type: string;
  title: string;
  property_id: string | null;
  property: string;
  start_date: string;
  end_date: string;
  status: string;
  assigned_users: string;
  internal_notes: string;
  occupancy_status: string;
};

export type HostsCalendarBlockRow = {
  id: string;
  block_key: string;
  property_id: string | null;
  property: string;
  start_date: string;
  end_date: string;
  block_reason: string;
  internal_notes: string;
  is_active: boolean;
};

export type HostsPropertyOccupancyRow = {
  property_id: string;
  property_name: string;
  occupancy_status: string;
  upcoming_arrivals: number;
  upcoming_departures: number;
};

export type HostsCalendarStats = {
  occupancy_rate: number;
  available_nights: number;
  blocked_nights: number;
  upcoming_arrivals: number;
  upcoming_departures: number;
  property_count: number;
};

export type HostsPropertyOption = {
  id: string;
  display_name: string;
};

export type HostsCalendarCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  active_view: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  calendar_views: string[];
  event_types: string[];
  occupancy_statuses: string[];
  event_statuses: string[];
  stats: HostsCalendarStats;
  property_occupancy: HostsPropertyOccupancyRow[];
  properties: HostsPropertyOption[];
  team_members: string[];
  calendar_events: HostsCalendarEventRow[];
  blocked_periods: HostsCalendarBlockRow[];
  date_range: { from: string; to: string };
  calendar_settings: { default_view: string; default_section: string };
};

export type HostsCalendarCenterActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
  event_id?: string;
};
