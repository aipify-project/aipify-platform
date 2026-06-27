import {
  defaultBookingAvailabilityPolicy,
  evaluateAvailabilityFromSource,
  type BookingAvailabilityPolicy,
} from "@/lib/integration-intelligence/booking/availability-policy";
import {
  maskBookingCustomerReference,
  maskEmployeeDisplayName,
  stripForbiddenBookingFields,
} from "@/lib/integration-intelligence/booking/masking";
import {
  normalizeAvailabilitySlotStatus,
  normalizeBookingStatus,
} from "@/lib/integration-intelligence/booking/status-normalization";
import type {
  AbsenceSummary,
  AvailabilitySlot,
  BookingSummary,
  EmployeeResourceSummary,
  ServiceSummary,
  VacationModeSummary,
} from "@/lib/integration-intelligence/booking/types";
import { APPOINTMENT_BOOKING_READINESS } from "./booking-source-map";

export type AppointmentCenterProxyRow = {
  service_key?: string;
  id?: string;
  name?: string;
  label?: string;
  duration_minutes?: number;
  prep_minutes?: number;
  cleanup_minutes?: number;
  buffer_minutes?: number;
  price_label?: string;
  resource_type?: string;
  location_label?: string;
  appointment_key?: string;
  service_id?: string;
  employee_key?: string;
  resource_key?: string;
  employee_label?: string;
  customer_label?: string;
  start_at?: string;
  end_at?: string;
  status_key?: string;
  timezone?: string;
  availability_status?: string;
  absence_key?: string;
  absence_type?: string;
  vacation_key?: string;
  scope?: string;
  return_at?: string;
  post_vacation_available_from?: string;
};

export type AppointmentCenterProxyPayload = {
  organization_id: string;
  source_reference: string;
  fetched_at: string;
  settings?: Record<string, unknown>;
  services?: readonly AppointmentCenterProxyRow[];
  employees?: readonly AppointmentCenterProxyRow[];
  resources?: readonly AppointmentCenterProxyRow[];
  appointments?: readonly AppointmentCenterProxyRow[];
  availability_rules?: readonly AppointmentCenterProxyRow[];
  absences?: readonly AppointmentCenterProxyRow[];
  vacation_integration?: readonly AppointmentCenterProxyRow[];
};

const FORBIDDEN_KEYS = ["email", "phone", "full_name", "address", "private_note"] as const;

function resolveId(row: AppointmentCenterProxyRow, fallbackKeys: (keyof AppointmentCenterProxyRow)[]): string {
  for (const key of fallbackKeys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function mapAppointmentServiceSummary(
  row: AppointmentCenterProxyRow,
  input: { source_reference: string; fetched_at: string },
): ServiceSummary | null {
  const sanitized = stripForbiddenBookingFields(row as Record<string, unknown>);
  for (const key of FORBIDDEN_KEYS) {
    if (key in sanitized) return null;
  }
  const serviceId = resolveId(row, ["service_key", "id"]);
  if (!serviceId) return null;
  const buffer = typeof row.buffer_minutes === "number" ? row.buffer_minutes : null;
  return {
    service_id: serviceId,
    name: String(row.name ?? row.label ?? serviceId),
    duration_minutes: typeof row.duration_minutes === "number" ? row.duration_minutes : null,
    buffer_before: typeof row.prep_minutes === "number" ? row.prep_minutes : buffer,
    buffer_after: typeof row.cleanup_minutes === "number" ? row.cleanup_minutes : buffer,
    price_summary: typeof row.price_label === "string" ? row.price_label : null,
    required_resource_type: typeof row.resource_type === "string" ? row.resource_type : "employee",
    location: typeof row.location_label === "string" ? row.location_label : null,
    source_reference: input.source_reference,
    freshness: "fresh",
    completeness: "partial",
  };
}

function resolveCanonicalEmployeeLabel(row: AppointmentCenterProxyRow): string | null {
  if (typeof row.employee_label === "string" && row.employee_label.trim()) {
    return row.employee_label.trim();
  }
  if (typeof row.label === "string" && row.label.trim()) {
    return row.label.trim();
  }
  if (typeof row.name === "string" && row.name.trim()) {
    return row.name.trim();
  }
  return null;
}

export function mapAppointmentResourceSummary(
  row: AppointmentCenterProxyRow,
  input: { source_reference: string; fetched_at: string },
): EmployeeResourceSummary | null {
  const resourceId = resolveId(row, ["employee_key", "resource_key", "id"]);
  if (!resourceId) return null;
  const canonicalLabel = resolveCanonicalEmployeeLabel(row);
  return {
    resource_id: resourceId,
    display_name: maskEmployeeDisplayName(canonicalLabel ?? resourceId),
    match_label: canonicalLabel,
    resource_type: row.employee_key ? "employee" : row.resource_key ? "resource" : "unknown",
    location: typeof row.location_label === "string" ? row.location_label : null,
    source_reference: input.source_reference,
    freshness: "fresh",
    completeness: "partial",
  };
}

/** Omits server-internal match_label before customer-facing bundle serialization. */
export function toCustomerFacingEmployeeResourceSummary(
  resource: EmployeeResourceSummary,
): EmployeeResourceSummary {
  const { match_label: _internal, ...customerFacing } = resource;
  return customerFacing;
}

export function mapAppointmentBookingSummary(
  row: AppointmentCenterProxyRow,
  input: { source_reference: string; fetched_at: string },
): BookingSummary | null {
  const bookingId = resolveId(row, ["appointment_key", "id"]);
  if (!bookingId) return null;
  return {
    booking_id: bookingId,
    service_id: typeof row.service_id === "string" ? row.service_id : typeof row.service_key === "string" ? row.service_key : null,
    resource_id: typeof row.employee_key === "string" ? row.employee_key : typeof row.resource_key === "string" ? row.resource_key : null,
    customer_reference: maskBookingCustomerReference(row.customer_label ?? bookingId),
    start_at: typeof row.start_at === "string" ? row.start_at : null,
    end_at: typeof row.end_at === "string" ? row.end_at : null,
    status: normalizeBookingStatus(row.status_key),
    location: typeof row.location_label === "string" ? row.location_label : null,
    source_reference: input.source_reference,
    freshness: "fresh",
    completeness: "partial",
  };
}

export function mapAppointmentAvailabilitySlot(
  row: AppointmentCenterProxyRow,
  input: { source_reference: string; fetched_at: string },
): AvailabilitySlot | null {
  const resourceId = resolveId(row, ["employee_key", "resource_key", "id"]);
  if (!resourceId || !row.start_at || !row.end_at) return null;
  return {
    resource_id: resourceId,
    start_at: row.start_at,
    end_at: row.end_at,
    timezone: typeof row.timezone === "string" ? row.timezone : "UTC",
    service_id: typeof row.service_id === "string" ? row.service_id : typeof row.service_key === "string" ? row.service_key : null,
    location_id: typeof row.location_label === "string" ? row.location_label : null,
    availability_status: normalizeAvailabilitySlotStatus(row.availability_status),
    source_reference: input.source_reference,
    freshness: "fresh",
    completeness: "partial",
  };
}

export function mapAppointmentAbsenceSummary(
  row: AppointmentCenterProxyRow,
  input: { source_reference: string; fetched_at: string },
): AbsenceSummary | null {
  const absenceId = resolveId(row, ["absence_key", "id"]);
  if (!absenceId) return null;
  return {
    absence_id: absenceId,
    resource_id: typeof row.employee_key === "string" ? row.employee_key : typeof row.resource_key === "string" ? row.resource_key : null,
    start_at: typeof row.start_at === "string" ? row.start_at : null,
    end_at: typeof row.end_at === "string" ? row.end_at : null,
    absence_type: typeof row.absence_type === "string" ? row.absence_type : null,
    source_reference: input.source_reference,
    freshness: "fresh",
    completeness: "partial",
  };
}

export function mapAppointmentVacationSummary(
  row: AppointmentCenterProxyRow,
  input: { source_reference: string; fetched_at: string },
): VacationModeSummary | null {
  const vacationId = resolveId(row, ["vacation_key", "id"]);
  if (!vacationId) return null;
  const scopeRaw = String(row.scope ?? "unknown").toLowerCase();
  const scope =
    scopeRaw.includes("employee") ? "employee"
    : scopeRaw.includes("department") ? "department"
    : scopeRaw.includes("organization") ? "organization"
    : "unknown";
  return {
    vacation_id: vacationId,
    resource_id: typeof row.employee_key === "string" ? row.employee_key : null,
    scope,
    start_at: typeof row.start_at === "string" ? row.start_at : null,
    end_at: typeof row.end_at === "string" ? row.end_at : null,
    return_at: typeof row.return_at === "string" ? row.return_at : null,
    post_vacation_available_from:
      typeof row.post_vacation_available_from === "string" ? row.post_vacation_available_from : typeof row.return_at === "string" ? row.return_at : null,
    source_reference: input.source_reference,
    freshness: "fresh",
    completeness: "partial",
  };
}

export function extractBookingPolicyFromSettings(
  settings: Record<string, unknown> | undefined,
  services: readonly AppointmentCenterProxyRow[],
): BookingAvailabilityPolicy {
  const firstService = services[0];
  const bufferMinutes =
    firstService && typeof firstService.buffer_minutes === "number" ? firstService.buffer_minutes : null;
  return defaultBookingAvailabilityPolicy({
    prevent_double_booking: settings?.prevent_double_booking !== false,
    overbooking_allowed: settings?.overbooking_allowed === true,
    slot_hold_minutes: typeof settings?.slot_hold_minutes === "number" ? settings.slot_hold_minutes : null,
    default_buffer_minutes: bufferMinutes,
    vacation_mode_integration_enabled: settings?.vacation_revenue_mode_enabled === true,
    timezone: typeof settings?.timezone === "string" ? settings.timezone : "UTC",
  });
}

export function buildAppointmentBookingReadBundle(
  payload: AppointmentCenterProxyPayload,
  options?: { retainInternalMatchLabels?: boolean },
) {
  const meta = {
    source_reference: payload.source_reference,
    fetched_at: payload.fetched_at,
  };
  const services = (payload.services ?? [])
    .map((row) => mapAppointmentServiceSummary(row, meta))
    .filter((entry): entry is ServiceSummary => entry !== null);
  const resourcesInternal = [...(payload.employees ?? []), ...(payload.resources ?? [])]
    .map((row) => mapAppointmentResourceSummary(row, meta))
    .filter((entry): entry is EmployeeResourceSummary => entry !== null);
  const resources = options?.retainInternalMatchLabels
    ? resourcesInternal
    : resourcesInternal.map(toCustomerFacingEmployeeResourceSummary);
  const bookings = (payload.appointments ?? [])
    .map((row) => mapAppointmentBookingSummary(row, meta))
    .filter((entry): entry is BookingSummary => entry !== null);
  const reportedSlots = (payload.availability_rules ?? [])
    .map((row) => mapAppointmentAvailabilitySlot(row, meta))
    .filter((entry): entry is AvailabilitySlot => entry !== null);
  const absences = (payload.absences ?? [])
    .map((row) => mapAppointmentAbsenceSummary(row, meta))
    .filter((entry): entry is AbsenceSummary => entry !== null);
  const vacationModes = (payload.vacation_integration ?? [])
    .map((row) => mapAppointmentVacationSummary(row, meta))
    .filter((entry): entry is VacationModeSummary => entry !== null);

  const policy = extractBookingPolicyFromSettings(payload.settings, payload.services ?? []);
  const availability = evaluateAvailabilityFromSource({
    policy,
    existing_bookings: bookings,
    reported_slots: reportedSlots,
    vacation_blocked_resource_ids: vacationModes
      .filter((entry) => entry.return_at && Date.parse(entry.return_at) > Date.now())
      .map((entry) => entry.resource_id)
      .filter((entry): entry is string => Boolean(entry)),
  });

  return {
    services,
    resources,
    bookings,
    availability_slots: availability.slots,
    absences,
    vacation_modes: vacationModes,
    policy,
    limitations: [
      "Read bundle uses appointment center metadata — slot computation is partial until live booking engine write path is connected.",
      ...availability.limitations,
    ],
    source_exact: availability.source_exact,
  };
}

export function findAppointmentBookingById(
  payload: AppointmentCenterProxyPayload,
  bookingId: string,
): BookingSummary | null {
  const row = (payload.appointments ?? []).find(
    (entry) => resolveId(entry, ["appointment_key", "id"]) === bookingId,
  );
  if (!row) return null;
  return mapAppointmentBookingSummary(row, {
    source_reference: payload.source_reference,
    fetched_at: payload.fetched_at,
  });
}

export function findAppointmentServiceById(
  payload: AppointmentCenterProxyPayload,
  serviceId: string,
): ServiceSummary | null {
  const row = (payload.services ?? []).find(
    (entry) => resolveId(entry, ["service_key", "id"]) === serviceId,
  );
  if (!row) return null;
  return mapAppointmentServiceSummary(row, {
    source_reference: payload.source_reference,
    fetched_at: payload.fetched_at,
  });
}

export const APPOINTMENT_BOOKING_PROVIDER_CONTRACT = {
  provider_key: APPOINTMENT_BOOKING_READINESS.provider_key,
  business_pack_key: APPOINTMENT_BOOKING_READINESS.business_pack_key,
  readiness: APPOINTMENT_BOOKING_READINESS.readiness,
  industry_metadata: ["hairdresser", "salon", "beauty", "clinic", "spa", "consultant", "service_business"] as const,
  read_only: true,
  write_capabilities_blocked_until_rpc: ["booking.create", "booking.update", "booking.cancel"] as const,
};
