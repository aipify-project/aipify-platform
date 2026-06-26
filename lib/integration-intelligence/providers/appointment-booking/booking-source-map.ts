import type { BookingCapabilityKey } from "@/lib/integration-intelligence/booking/types";

export type AppointmentBookingSourceStatus = "live" | "partial" | "placeholder" | "missing";

export type AppointmentBookingSourceDefinition = {
  capability_key: BookingCapabilityKey;
  source_kind: "tenant_rpc" | "integration_http";
  source_id: string;
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string | null;
  status: AppointmentBookingSourceStatus;
  read_only: boolean;
  limitations: readonly string[];
};

export const APPOINTMENT_BOOKING_SOURCE_MAP: readonly AppointmentBookingSourceDefinition[] = [
  {
    capability_key: "service.read",
    source_kind: "tenant_rpc",
    source_id: "get_organization_appointment_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["services[].service_key", "services[].name", "services[].duration_minutes", "services[].buffer_minutes"],
    required_permission: "appointments.view",
    status: "partial",
    read_only: true,
    limitations: ["Services metadata from appointment center overview — not transactional catalog sync."],
  },
  {
    capability_key: "employee.read",
    source_kind: "tenant_rpc",
    source_id: "get_organization_appointment_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["employees[].employee_key", "employees[].label", "resources[].resource_key"],
    required_permission: "appointments.view",
    status: "partial",
    read_only: true,
    limitations: ["Employee/resource labels only — no private calendar titles."],
  },
  {
    capability_key: "availability.read",
    source_kind: "tenant_rpc",
    source_id: "get_organization_appointment_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["availability_rules[]", "slot_holds[]", "settings.prevent_double_booking"],
    required_permission: "appointments.view",
    status: "partial",
    read_only: true,
    limitations: ["Availability rules metadata only — slot computation requires live engine write path."],
  },
  {
    capability_key: "schedule.read",
    source_kind: "tenant_rpc",
    source_id: "get_organization_appointment_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["appointments[].start_at", "appointments[].end_at", "appointments[].status_key"],
    required_permission: "appointments.view",
    status: "partial",
    read_only: true,
    limitations: ["Schedule read from appointment center metadata — partial completeness."],
  },
  {
    capability_key: "booking.read",
    source_kind: "tenant_rpc",
    source_id: "get_organization_appointment_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["appointments[].appointment_key", "appointments[].service_key", "appointments[].employee_label"],
    required_permission: "appointments.view",
    status: "partial",
    read_only: true,
    limitations: ["Booking summaries mask customer contact data in Companion runtime."],
  },
  {
    capability_key: "vacation_mode.read",
    source_kind: "tenant_rpc",
    source_id: "get_organization_absence_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["vacation_mode", "coverage_items[]", "vacation_integration[]"],
    required_permission: "absence.view",
    status: "partial",
    read_only: true,
    limitations: ["Vacation mode read via absence center integration."],
  },
  {
    capability_key: "post_vacation_availability.read",
    source_kind: "tenant_rpc",
    source_id: "get_organization_appointment_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["vacation_integration[].return_at", "vacation_integration[].post_vacation_buffer"],
    required_permission: "appointments.view",
    status: "partial",
    read_only: true,
    limitations: ["Post-vacation availability uses integration metadata — not computed slots."],
  },
  {
    capability_key: "absence.read",
    source_kind: "tenant_rpc",
    source_id: "get_organization_absence_center",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: ["unexpected_absence[]", "team_availability[]"],
    required_permission: "absence.view",
    status: "partial",
    read_only: true,
    limitations: ["Absence metadata only — no private HR notes."],
  },
  {
    capability_key: "booking.create",
    source_kind: "tenant_rpc",
    source_id: "none",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: [],
    required_permission: "appointments.manage",
    status: "missing",
    read_only: false,
    limitations: ["No reversible booking.create RPC approved for Companion runtime yet."],
  },
  {
    capability_key: "booking.update",
    source_kind: "tenant_rpc",
    source_id: "none",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: [],
    required_permission: "appointments.manage",
    status: "missing",
    read_only: false,
    limitations: ["No booking.update RPC approved for Companion runtime yet."],
  },
  {
    capability_key: "booking.cancel",
    source_kind: "tenant_rpc",
    source_id: "none",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: [],
    required_permission: "appointments.manage",
    status: "missing",
    read_only: false,
    limitations: ["No booking.cancel RPC approved for Companion runtime yet."],
  },
];

export const APPOINTMENT_BOOKING_READINESS = {
  provider_key: "appointment_booking",
  business_pack_key: "appointments_services",
  readiness: "connected_but_partial" as const,
  write_ready: false,
  source_rpc: "get_organization_appointment_center",
  absence_rpc: "get_organization_absence_center",
  workforce_rpc: "get_organization_workforce_scheduling_center",
};

export function getAppointmentBookingSource(capabilityKey: BookingCapabilityKey) {
  return APPOINTMENT_BOOKING_SOURCE_MAP.find((entry) => entry.capability_key === capabilityKey) ?? null;
}

export const BOOKING_WRITE_CAPABILITY_KEYS = [
  "booking.create",
  "booking.update",
  "booking.cancel",
] as const;

export type BookingWriteCapabilityKey = (typeof BOOKING_WRITE_CAPABILITY_KEYS)[number];

function isBookingWriteCapabilityKey(
  capabilityKey: BookingCapabilityKey,
): capabilityKey is BookingWriteCapabilityKey {
  return (BOOKING_WRITE_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

export function evaluateBookingWriteSourceConnected(input: {
  capabilityKey: BookingCapabilityKey;
  definition: AppointmentBookingSourceDefinition | null;
  writeReady: boolean;
}): boolean {
  if (!isBookingWriteCapabilityKey(input.capabilityKey)) {
    return false;
  }

  const definition = input.definition;
  if (!definition) {
    return false;
  }

  if (definition.capability_key !== input.capabilityKey) {
    return false;
  }

  if (definition.status !== "live") {
    return false;
  }

  const sourceId = definition.source_id?.trim();
  if (!sourceId || sourceId === "none") {
    return false;
  }

  if (definition.read_only) {
    return false;
  }

  if (!input.writeReady) {
    return false;
  }

  return true;
}

export function isBookingWriteSourceConnected(capabilityKey: BookingCapabilityKey): boolean {
  return evaluateBookingWriteSourceConnected({
    capabilityKey,
    definition: getAppointmentBookingSource(capabilityKey),
    writeReady: APPOINTMENT_BOOKING_READINESS.write_ready,
  });
}
