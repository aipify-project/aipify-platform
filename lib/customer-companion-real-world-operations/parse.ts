import type {
  CompanionRealWorldCenter,
  RealWorldApproval,
  RealWorldBooking,
} from "./types";

function parseApproval(raw: Record<string, unknown>): RealWorldApproval {
  return {
    approval_key: String(raw.approval_key ?? ""),
    approval_title: String(raw.approval_title ?? ""),
    request_key: raw.request_key ? String(raw.request_key) : undefined,
    approval_level: raw.approval_level ? String(raw.approval_level) : undefined,
    approval_status: raw.approval_status ? String(raw.approval_status) : undefined,
    step_order: raw.step_order != null ? Number(raw.step_order) : undefined,
    cost_threshold_nok: raw.cost_threshold_nok != null ? Number(raw.cost_threshold_nok) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

function parseBooking(raw: Record<string, unknown>): RealWorldBooking {
  return {
    booking_key: String(raw.booking_key ?? ""),
    service_title: String(raw.service_title ?? ""),
    request_key: raw.request_key ? String(raw.request_key) : undefined,
    provider_name: raw.provider_name ? String(raw.provider_name) : undefined,
    booking_status: raw.booking_status ? String(raw.booking_status) : undefined,
    scheduled_at: raw.scheduled_at ? String(raw.scheduled_at) : undefined,
    location_label: raw.location_label ? String(raw.location_label) : undefined,
    estimated_cost_nok: raw.estimated_cost_nok != null ? Number(raw.estimated_cost_nok) : undefined,
    approval_status: raw.approval_status ? String(raw.approval_status) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseCompanionRealWorldCenter(raw: Record<string, unknown>): CompanionRealWorldCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as CompanionRealWorldCenter["organization"],
    overview: raw.overview as CompanionRealWorldCenter["overview"],
    requests: Array.isArray(raw.requests) ? (raw.requests as Record<string, unknown>[]) : [],
    approvals: Array.isArray(raw.approvals)
      ? (raw.approvals as Record<string, unknown>[]).map(parseApproval)
      : [],
    providers: Array.isArray(raw.providers) ? (raw.providers as Record<string, unknown>[]) : [],
    bookings: Array.isArray(raw.bookings)
      ? (raw.bookings as Record<string, unknown>[]).map(parseBooking)
      : [],
    deliveries: Array.isArray(raw.deliveries) ? (raw.deliveries as Record<string, unknown>[]) : [],
    executions: Array.isArray(raw.executions) ? (raw.executions as Record<string, unknown>[]) : [],
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as CompanionRealWorldCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
