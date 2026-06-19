export type AppointmentBookingCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  vacation_message?: string;
  settings?: Record<string, unknown>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  booking_statuses?: Record<string, unknown>[];
  business_pack?: Record<string, unknown>;
  routes?: Record<string, string>;
  scopes?: Record<string, unknown>[];
  channels?: Record<string, unknown>[];
  services?: Record<string, unknown>[];
  appointments?: Record<string, unknown>[];
  customers?: Record<string, unknown>[];
  employees?: Record<string, unknown>[];
  locations?: Record<string, unknown>[];
  resources?: Record<string, unknown>[];
  availability_rules?: Record<string, unknown>[];
  slot_holds?: Record<string, unknown>[];
  waiting_list?: Record<string, unknown>[];
  payments?: Record<string, unknown>[];
  policies?: Record<string, unknown>[];
  calendar_connections?: Record<string, unknown>[];
  vacation_integration?: Record<string, unknown>[];
  phase_integrations?: Record<string, unknown>[];
  capacity_rules?: Record<string, unknown>[];
  analytics?: Record<string, unknown>[];
  reports?: Record<string, unknown>[];
  section_items?: Record<string, unknown>[];
  section_detail?: Record<string, unknown>[];
  audit_recent?: Record<string, unknown>[];
  sections_registered?: number;
};

export type CompanionBookingAdvisorBundle = {
  found: boolean;
  briefing_title?: string;
  principle?: string;
  vacation_message?: string;
  insights?: Record<string, unknown>[];
  pre_day_briefing?: Record<string, unknown>;
  center?: AppointmentBookingCenter;
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asArray(raw: unknown): Record<string, unknown>[] {
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

export function parseAppointmentBookingCenter(raw: unknown): AppointmentBookingCenter {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    vacation_message: typeof row.vacation_message === "string" ? row.vacation_message : undefined,
    settings: asRecord(row.settings) ?? undefined,
    stats: asRecord(row.stats) ?? {},
    companion_recommendations: asArray(row.companion_recommendations),
    booking_statuses: asArray(row.booking_statuses),
    business_pack: asRecord(row.business_pack) ?? undefined,
    routes: asRecord(row.routes) as Record<string, string> | undefined,
    scopes: asArray(row.scopes),
    channels: asArray(row.channels),
    services: asArray(row.services),
    appointments: asArray(row.appointments),
    customers: asArray(row.customers),
    employees: asArray(row.employees),
    locations: asArray(row.locations),
    resources: asArray(row.resources),
    availability_rules: asArray(row.availability_rules),
    slot_holds: asArray(row.slot_holds),
    waiting_list: asArray(row.waiting_list),
    payments: asArray(row.payments),
    policies: asArray(row.policies),
    calendar_connections: asArray(row.calendar_connections),
    vacation_integration: asArray(row.vacation_integration),
    phase_integrations: asArray(row.phase_integrations),
    capacity_rules: asArray(row.capacity_rules),
    analytics: asArray(row.analytics),
    reports: asArray(row.reports),
    section_items: asArray(row.section_items),
    section_detail: asArray(row.section_detail),
    audit_recent: asArray(row.audit_recent),
    sections_registered:
      typeof row.sections_registered === "number" ? row.sections_registered : undefined,
  };
}

export function parseCompanionBookingAdvisorBundle(raw: unknown): CompanionBookingAdvisorBundle {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    briefing_title: typeof row.briefing_title === "string" ? row.briefing_title : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    vacation_message: typeof row.vacation_message === "string" ? row.vacation_message : undefined,
    insights: asArray(row.insights),
    pre_day_briefing: asRecord(row.pre_day_briefing) ?? undefined,
    center: row.center ? parseAppointmentBookingCenter(row.center) : undefined,
  };
}
