import type {
  HostsCheckinCenterActionResult,
  HostsCheckinCenterDashboard,
  HostsCheckinRow,
  HostsCheckinStats,
  HostsCheckoutRow,
  HostsTaskPreparation,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseCheckins(data: unknown): HostsCheckinRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        checkin_key: typeof d.checkin_key === "string" ? d.checkin_key : "",
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        check_in_date: typeof d.check_in_date === "string" ? d.check_in_date : "",
        expected_check_out_date: typeof d.expected_check_out_date === "string" ? d.expected_check_out_date : "",
        checkin_status: typeof d.checkin_status === "string" ? d.checkin_status : "",
        access_instructions: typeof d.access_instructions === "string" ? d.access_instructions : "—",
        team_assigned: typeof d.team_assigned === "string" ? d.team_assigned : "—",
        guest_info_summary: typeof d.guest_info_summary === "string" ? d.guest_info_summary : "—",
        ready_score: Number(d.ready_score ?? 0),
        readiness_indicator: typeof d.readiness_indicator === "string" ? d.readiness_indicator : "not_ready",
        cleaning_completed: Boolean(d.cleaning_completed),
        inspection_completed: Boolean(d.inspection_completed),
        supplies_ready: Boolean(d.supplies_ready),
        access_instructions_available: Boolean(d.access_instructions_available),
        team_assigned_flag: Boolean(d.team_assigned_flag),
      };
    })
    .filter((r): r is HostsCheckinRow => r !== null);
}

function parseCheckouts(data: unknown): HostsCheckoutRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        checkout_key: typeof d.checkout_key === "string" ? d.checkout_key : "",
        checkin_id: d.checkin_id != null ? String(d.checkin_id) : null,
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        checkout_date: typeof d.checkout_date === "string" ? d.checkout_date : "",
        checkout_status: typeof d.checkout_status === "string" ? d.checkout_status : "",
        property_status_notes: typeof d.property_status_notes === "string" ? d.property_status_notes : "",
        damage_observed: Boolean(d.damage_observed),
        missing_items: Boolean(d.missing_items),
        maintenance_required: Boolean(d.maintenance_required),
        exceptional_condition: Boolean(d.exceptional_condition),
        departure_outcome: typeof d.departure_outcome === "string" ? d.departure_outcome : "standard_departure",
        review_notes: typeof d.review_notes === "string" ? d.review_notes : "",
      };
    })
    .filter((r): r is HostsCheckoutRow => r !== null);
}

function parseStats(data: unknown): HostsCheckinStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    todays_check_ins: Number(d.todays_check_ins ?? 0),
    todays_check_outs: Number(d.todays_check_outs ?? 0),
    properties_requiring_attention: Number(d.properties_requiring_attention ?? 0),
    readiness_ready: Number(d.readiness_ready ?? 0),
    readiness_attention: Number(d.readiness_attention ?? 0),
    readiness_not_ready: Number(d.readiness_not_ready ?? 0),
    active_stays: Number(d.active_stays ?? 0),
  };
}

function parseTaskPrep(data: unknown): HostsTaskPreparation {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    arrival_tasks: Number(d.arrival_tasks ?? 0),
    departure_tasks: Number(d.departure_tasks ?? 0),
    inspection_tasks: Number(d.inspection_tasks ?? 0),
    cleaning_tasks: Number(d.cleaning_tasks ?? 0),
  };
}

export function parseAipifyHostsCheckinCenterDashboard(data: unknown): HostsCheckinCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  const checkIns = parseCheckins(d.check_ins);
  const checkOuts = parseCheckouts(d.check_outs);
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "upcoming_check_ins",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    checkin_statuses: asArray<string>(d.checkin_statuses),
    checkout_statuses: asArray<string>(d.checkout_statuses),
    readiness_indicators: asArray<string>(d.readiness_indicators),
    departure_outcomes: asArray<string>(d.departure_outcomes),
    stats: parseStats(d.stats),
    task_preparation: parseTaskPrep(d.task_preparation),
    check_ins: checkIns,
    check_outs: checkOuts,
    checkout_reviews: parseCheckouts(d.checkout_reviews).length > 0 ? parseCheckouts(d.checkout_reviews) : checkOuts,
  };
}

export function parseAipifyHostsCheckinCenterActionResult(data: unknown): HostsCheckinCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}
