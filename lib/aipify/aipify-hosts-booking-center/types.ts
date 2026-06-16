export type HostsBookingSectionKey =
  | "upcoming_bookings"
  | "active_stays"
  | "past_bookings"
  | "cancellations"
  | "booking_reports";

export type HostsBookingReservationRow = {
  id: string;
  reservation_reference: string;
  guest_name: string;
  property_id: string | null;
  property: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  booking_status: string;
  booking_channel: string;
  internal_notes: string;
  guest_profile_key: string;
  is_arrival_today: boolean;
  is_departure_today: boolean;
  nights: number;
};

export type HostsBookingCancellationRow = {
  id: string;
  reservation_id: string | null;
  reservation_reference: string;
  property_id: string | null;
  property: string;
  cancellation_date: string;
  cancellation_reason: string;
};

export type HostsBookingTimelineRow = {
  id: string;
  reservation_id: string;
  event_type: string;
  summary: string;
  occurred_at: string;
};

export type HostsBookingStats = {
  arrivals_today: number;
  departures_today: number;
  upcoming_reservations: number;
  recent_cancellations: number;
  active_stays_count: number;
  confirmed_upcoming: number;
};

export type HostsBookingReports = {
  total_reservations: number;
  by_status: Record<string, number>;
  by_channel: Record<string, number>;
  avg_nights: number;
  avg_guests: number;
};

export type HostsBookingCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  booking_statuses: string[];
  stats: HostsBookingStats;
  properties: Array<{ id: string; display_name: string }>;
  reservations: HostsBookingReservationRow[];
  cancellations: HostsBookingCancellationRow[];
  booking_reports: HostsBookingReports | null;
  timeline: HostsBookingTimelineRow[];
};

export type HostsBookingCenterActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
  availability?: Record<string, unknown>;
};
