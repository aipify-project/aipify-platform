import type {
  HostsMaintenanceCenterActionResult,
  HostsMaintenanceCenterDashboard,
  HostsMaintenanceContractorRow,
  HostsMaintenanceStats,
  HostsMaintenanceTimelineRow,
  HostsPreventiveScheduleRow,
  HostsWorkOrderRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseWorkOrders(data: unknown): HostsWorkOrderRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        work_order_key: typeof d.work_order_key === "string" ? d.work_order_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        contractor_id: d.contractor_id != null ? String(d.contractor_id) : null,
        contractor: typeof d.contractor === "string" ? d.contractor : "—",
        category: typeof d.category === "string" ? d.category : "",
        description: typeof d.description === "string" ? d.description : "",
        priority: typeof d.priority === "string" ? d.priority : "medium",
        assigned_to: typeof d.assigned_to === "string" ? d.assigned_to : "—",
        due_date: typeof d.due_date === "string" ? d.due_date : "",
        wo_status: typeof d.wo_status === "string" ? d.wo_status : "new",
        scheduled_at: typeof d.scheduled_at === "string" ? d.scheduled_at : "",
        started_at: typeof d.started_at === "string" ? d.started_at : "",
        completed_at: typeof d.completed_at === "string" ? d.completed_at : "",
        issue_reported_at: typeof d.issue_reported_at === "string" ? d.issue_reported_at : "",
        is_overdue: Boolean(d.is_overdue),
      };
    })
    .filter((r): r is HostsWorkOrderRow => r !== null);
}

function parsePreventive(data: unknown): HostsPreventiveScheduleRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        schedule_key: typeof d.schedule_key === "string" ? d.schedule_key : "",
        task_name: typeof d.task_name === "string" ? d.task_name : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        category: typeof d.category === "string" ? d.category : "",
        recurrence: typeof d.recurrence === "string" ? d.recurrence : "",
        next_due_date: typeof d.next_due_date === "string" ? d.next_due_date : "",
        last_completed_at: typeof d.last_completed_at === "string" ? d.last_completed_at : "",
        is_active: Boolean(d.is_active),
        is_due: Boolean(d.is_due),
      };
    })
    .filter((r): r is HostsPreventiveScheduleRow => r !== null);
}

function parseContractors(data: unknown): HostsMaintenanceContractorRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        contractor_key: typeof d.contractor_key === "string" ? d.contractor_key : "",
        company_name: typeof d.company_name === "string" ? d.company_name : "",
        contact_name: typeof d.contact_name === "string" ? d.contact_name : "—",
        contact_email: typeof d.contact_email === "string" ? d.contact_email : "",
        contact_phone: typeof d.contact_phone === "string" ? d.contact_phone : "",
        trade_category: typeof d.trade_category === "string" ? d.trade_category : "",
        coverage_area: typeof d.coverage_area === "string" ? d.coverage_area : "—",
        contractor_status: typeof d.contractor_status === "string" ? d.contractor_status : "active",
      };
    })
    .filter((r): r is HostsMaintenanceContractorRow => r !== null);
}

function parseTimeline(data: unknown): HostsMaintenanceTimelineRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        work_order_id: typeof d.work_order_id === "string" ? d.work_order_id : "",
        event_type: typeof d.event_type === "string" ? d.event_type : "",
        summary: typeof d.summary === "string" ? d.summary : "",
        occurred_at: typeof d.occurred_at === "string" ? d.occurred_at : "",
      };
    })
    .filter((r): r is HostsMaintenanceTimelineRow => r !== null);
}

function parseStats(data: unknown): HostsMaintenanceStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    open_work_orders: Number(d.open_work_orders ?? 0),
    critical_items: Number(d.critical_items ?? 0),
    upcoming_preventive: Number(d.upcoming_preventive ?? 0),
    overdue_tasks: Number(d.overdue_tasks ?? 0),
    scheduled_count: Number(d.scheduled_count ?? 0),
    active_contractors: Number(d.active_contractors ?? 0),
  };
}

export function parseAipifyHostsMaintenanceCenterDashboard(
  data: unknown,
): HostsMaintenanceCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "",
    active_section: typeof d.active_section === "string" ? d.active_section : "open_work_orders",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    stats: parseStats(d.stats),
    properties: asArray<{ id: string; display_name: string }>(d.properties),
    work_orders: parseWorkOrders(d.work_orders),
    preventive_schedules: parsePreventive(d.preventive_schedules),
    contractors: parseContractors(d.contractors),
    timeline: parseTimeline(d.timeline),
  };
}

export function parseAipifyHostsMaintenanceCenterActionResult(
  data: unknown,
): HostsMaintenanceCenterActionResult {
  if (!data || typeof data !== "object") return { success: false };
  const d = data as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    work_order_id: typeof d.work_order_id === "string" ? d.work_order_id : undefined,
  };
}
