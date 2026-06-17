import type {
  HospitalityAccommodationCenter,
  HospitalityAdvisorSignal,
  HospitalityProperty,
  HospitalityReservation,
} from "./types";

function parseProperty(raw: unknown): HospitalityProperty {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    property_key: typeof d.property_key === "string" ? d.property_key : undefined,
    display_name: typeof d.display_name === "string" ? d.display_name : undefined,
    platform_source: typeof d.platform_source === "string" ? d.platform_source : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    health_score: Number(d.health_score ?? 0),
    property_type: typeof d.property_type === "string" ? d.property_type : undefined,
    location: typeof d.location === "string" ? d.location : undefined,
    capacity: Number(d.capacity ?? 0),
    owner_name: typeof d.owner_name === "string" ? d.owner_name : undefined,
    performance_label: typeof d.performance_label === "string" ? d.performance_label : undefined,
  };
}

function parseReservation(raw: unknown): HospitalityReservation {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    reservation_reference: typeof d.reservation_reference === "string" ? d.reservation_reference : undefined,
    guest_name: typeof d.guest_name === "string" ? d.guest_name : undefined,
    check_in_date: typeof d.check_in_date === "string" ? d.check_in_date : undefined,
    check_out_date: typeof d.check_out_date === "string" ? d.check_out_date : undefined,
    booking_status: typeof d.booking_status === "string" ? d.booking_status : undefined,
    booking_channel: typeof d.booking_channel === "string" ? d.booking_channel : undefined,
    number_of_guests: Number(d.number_of_guests ?? 0),
    property_id: typeof d.property_id === "string" ? d.property_id : null,
  };
}

function parseSignal(raw: unknown): HospitalityAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseHospitalityAccommodationCenter(raw: unknown): HospitalityAccommodationCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    aipify_hosts_route: typeof d.aipify_hosts_route === "string" ? d.aipify_hosts_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    properties: Array.isArray(d.properties) ? d.properties.map(parseProperty) : [],
    reservations: Array.isArray(d.reservations) ? d.reservations.map(parseReservation) : [],
    guests: Array.isArray(d.guests) ? (d.guests as Array<Record<string, unknown>>) : [],
    channels: Array.isArray(d.channels) ? (d.channels as Array<Record<string, unknown>>) : [],
    portfolios: Array.isArray(d.portfolios) ? (d.portfolios as Array<Record<string, unknown>>) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
