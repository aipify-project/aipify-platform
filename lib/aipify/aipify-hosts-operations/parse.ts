import type {
  HostsApprovalRow,
  HostsArrivalRow,
  HostsCleaningRow,
  HostsDepartureRow,
  HostsGuestRequestRow,
  HostsIncidentRow,
  HostsMaintenanceRow,
  HostsOperationsActionResult,
  HostsOperationsDashboard,
  HostsOperationsNotification,
  HostsTodaySnapshot,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseTodaySnapshot(data: unknown): HostsTodaySnapshot {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    arrivals_today: Number(d.arrivals_today ?? 0),
    departures_today: Number(d.departures_today ?? 0),
    open_guest_requests: Number(d.open_guest_requests ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    cleaning_status: typeof d.cleaning_status === "string" ? d.cleaning_status : "—",
    maintenance_status: typeof d.maintenance_status === "string" ? d.maintenance_status : "—",
    active_incidents: Number(d.active_incidents ?? 0),
  };
}

function parseNotifications(data: unknown): HostsOperationsNotification[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        active: Boolean(d.active),
        count: Number(d.count ?? 0),
        message: typeof d.message === "string" ? d.message : "",
      };
    })
    .filter((r): r is HostsOperationsNotification => r !== null);
}

function parseArrivals(data: unknown): HostsArrivalRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        property: typeof d.property === "string" ? d.property : "",
        property_id: String(d.property_id ?? ""),
        arrival_time: typeof d.arrival_time === "string" ? d.arrival_time : "",
        check_in_status: typeof d.check_in_status === "string" ? d.check_in_status : "",
        cleaning_status: typeof d.cleaning_status === "string" ? d.cleaning_status : "",
        property_readiness: typeof d.property_readiness === "string" ? d.property_readiness : "",
      };
    })
    .filter((r): r is HostsArrivalRow => r !== null);
}

function parseDepartures(data: unknown): HostsDepartureRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        property: typeof d.property === "string" ? d.property : "",
        property_id: String(d.property_id ?? ""),
        departure_time: typeof d.departure_time === "string" ? d.departure_time : "",
        checkout_status: typeof d.checkout_status === "string" ? d.checkout_status : "",
        inspection_status: typeof d.inspection_status === "string" ? d.inspection_status : "",
        cleaning_assigned: typeof d.cleaning_assigned === "string" ? d.cleaning_assigned : "",
      };
    })
    .filter((r): r is HostsDepartureRow => r !== null);
}

function parseCleaning(data: unknown): HostsCleaningRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        property: typeof d.property === "string" ? d.property : "",
        property_id: String(d.property_id ?? ""),
        assigned_cleaner: typeof d.assigned_cleaner === "string" ? d.assigned_cleaner : "",
        scheduled_time: typeof d.scheduled_time === "string" ? d.scheduled_time : "",
        completion_status: typeof d.completion_status === "string" ? d.completion_status : "",
        reported_issues: typeof d.reported_issues === "string" ? d.reported_issues : null,
      };
    })
    .filter((r): r is HostsCleaningRow => r !== null);
}

function parseMaintenance(data: unknown): HostsMaintenanceRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        property: typeof d.property === "string" ? d.property : "",
        property_id: String(d.property_id ?? ""),
        issue_summary: typeof d.issue_summary === "string" ? d.issue_summary : "",
        priority: typeof d.priority === "string" ? d.priority : "",
        assigned_to: typeof d.assigned_to === "string" ? d.assigned_to : null,
        due_date: typeof d.due_date === "string" ? d.due_date : "",
      };
    })
    .filter((r): r is HostsMaintenanceRow => r !== null);
}

function parseGuestRequests(data: unknown): HostsGuestRequestRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        property: typeof d.property === "string" ? d.property : "",
        property_id: String(d.property_id ?? ""),
        request_type: typeof d.request_type === "string" ? d.request_type : "",
        submitted_time: typeof d.submitted_time === "string" ? d.submitted_time : "",
        assigned_to: typeof d.assigned_to === "string" ? d.assigned_to : null,
        status: typeof d.status === "string" ? d.status : "",
      };
    })
    .filter((r): r is HostsGuestRequestRow => r !== null);
}

function parseIncidents(data: unknown): HostsIncidentRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        property: typeof d.property === "string" ? d.property : "",
        property_id: String(d.property_id ?? ""),
        incident_type: typeof d.incident_type === "string" ? d.incident_type : "",
        severity: typeof d.severity === "string" ? d.severity : "",
        status: typeof d.status === "string" ? d.status : "",
        owner: typeof d.owner === "string" ? d.owner : "",
      };
    })
    .filter((r): r is HostsIncidentRow => r !== null);
}

function parseApprovals(data: unknown): HostsApprovalRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        request_type: typeof d.request_type === "string" ? d.request_type : "",
        property: typeof d.property === "string" ? d.property : "",
        property_id: String(d.property_id ?? ""),
        submitted_by: typeof d.submitted_by === "string" ? d.submitted_by : "",
        waiting_since: typeof d.waiting_since === "string" ? d.waiting_since : "",
        approval_status: typeof d.approval_status === "string" ? d.approval_status : "",
      };
    })
    .filter((r): r is HostsApprovalRow => r !== null);
}

export function parseAipifyHostsOperationsDashboard(data: unknown): HostsOperationsDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  const b = (d.boards ?? {}) as Record<string, unknown>;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "today",
    active_filter: typeof d.active_filter === "string" ? d.active_filter : "today",
    selected_property_id: d.selected_property_id != null ? String(d.selected_property_id) : null,
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    filters: asArray<{ key: string; label: string }>(d.filters),
    notification_triggers: asArray<{ key: string; label: string }>(d.notification_triggers),
    properties: asArray<{ id: string; name: string }>(d.properties),
    today_snapshot: parseTodaySnapshot(d.today_snapshot),
    notifications: parseNotifications(d.notifications),
    boards: {
      arrivals: parseArrivals(b.arrivals),
      departures: parseDepartures(b.departures),
      cleaning: parseCleaning(b.cleaning),
      maintenance: parseMaintenance(b.maintenance),
      guest_requests: parseGuestRequests(b.guest_requests),
      incidents: parseIncidents(b.incidents),
      approvals: parseApprovals(b.approvals),
    },
  };
}

export function parseAipifyHostsOperationsActionResult(data: unknown): HostsOperationsActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action: typeof d.action === "string" ? d.action : undefined,
    item_id: typeof d.item_id === "string" ? d.item_id : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}
