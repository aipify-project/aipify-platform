import type {
  HostsBookingCancellationRow,
  HostsBookingCenterActionResult,
  HostsBookingCenterDashboard,
  HostsBookingReports,
  HostsBookingReservationRow,
  HostsBookingStats,
  HostsBookingTimelineRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseReservations(data: unknown): HostsBookingReservationRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        reservation_reference: typeof d.reservation_reference === "string" ? d.reservation_reference : "",
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        check_in_date: typeof d.check_in_date === "string" ? d.check_in_date : "",
        check_out_date: typeof d.check_out_date === "string" ? d.check_out_date : "",
        number_of_guests: Number(d.number_of_guests ?? 1),
        booking_status: typeof d.booking_status === "string" ? d.booking_status : "pending",
        booking_channel: typeof d.booking_channel === "string" ? d.booking_channel : "",
        internal_notes: typeof d.internal_notes === "string" ? d.internal_notes : "",
        guest_profile_key: typeof d.guest_profile_key === "string" ? d.guest_profile_key : "",
        is_arrival_today: Boolean(d.is_arrival_today),
        is_departure_today: Boolean(d.is_departure_today),
        nights: Number(d.nights ?? 1),
      };
    })
    .filter((r): r is HostsBookingReservationRow => r !== null);
}

function parseCancellations(data: unknown): HostsBookingCancellationRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        reservation_id: d.reservation_id != null ? String(d.reservation_id) : null,
        reservation_reference: typeof d.reservation_reference === "string" ? d.reservation_reference : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        cancellation_date: typeof d.cancellation_date === "string" ? d.cancellation_date : "",
        cancellation_reason: typeof d.cancellation_reason === "string" ? d.cancellation_reason : "",
      };
    })
    .filter((r): r is HostsBookingCancellationRow => r !== null);
}

function parseTimeline(data: unknown): HostsBookingTimelineRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        reservation_id: typeof d.reservation_id === "string" ? d.reservation_id : "",
        event_type: typeof d.event_type === "string" ? d.event_type : "",
        summary: typeof d.summary === "string" ? d.summary : "",
        occurred_at: typeof d.occurred_at === "string" ? d.occurred_at : "",
      };
    })
    .filter((r): r is HostsBookingTimelineRow => r !== null);
}

function parseStats(data: unknown): HostsBookingStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    arrivals_today: Number(d.arrivals_today ?? 0),
    departures_today: Number(d.departures_today ?? 0),
    upcoming_reservations: Number(d.upcoming_reservations ?? 0),
    recent_cancellations: Number(d.recent_cancellations ?? 0),
    active_stays_count: Number(d.active_stays_count ?? 0),
    confirmed_upcoming: Number(d.confirmed_upcoming ?? 0),
  };
}

function parseReports(data: unknown): HostsBookingReports | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  return {
    total_reservations: Number(d.total_reservations ?? 0),
    by_status: (d.by_status as Record<string, number>) ?? {},
    by_channel: (d.by_channel as Record<string, number>) ?? {},
    avg_nights: Number(d.avg_nights ?? 0),
    avg_guests: Number(d.avg_guests ?? 0),
  };
}

export function parseAipifyHostsBookingCenterDashboard(
  data: unknown,
): HostsBookingCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "",
    active_section: typeof d.active_section === "string" ? d.active_section : "upcoming_bookings",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    booking_statuses: asArray<string>(d.booking_statuses),
    stats: parseStats(d.stats),
    properties: asArray<{ id: string; display_name: string }>(d.properties),
    reservations: parseReservations(d.reservations),
    cancellations: parseCancellations(d.cancellations),
    booking_reports: parseReports(d.booking_reports),
    timeline: parseTimeline(d.timeline),
  };
}

export function parseAipifyHostsBookingCenterActionResult(
  data: unknown,
): HostsBookingCenterActionResult {
  if (!data || typeof data !== "object") return { success: false };
  const d = data as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    availability: d.availability && typeof d.availability === "object"
      ? (d.availability as Record<string, unknown>)
      : undefined,
  };
}
