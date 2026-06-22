import { bookingReadOutcomeKey } from "@/lib/integration-intelligence/booking/outcomes";
import {
  assertBookingReadAllowed,
  assertBookingTenantScope,
  canReadBookingAvailability,
  canReadBookingServices,
  canReadBookings,
  type BookingPermissionContext,
} from "@/lib/integration-intelligence/booking/permissions";
import type {
  AbsenceSummary,
  AvailabilitySlot,
  BookingReadOutcome,
  BookingReadResult,
  BookingSummary,
  EmployeeResourceSummary,
  ServiceSummary,
  VacationModeSummary,
} from "@/lib/integration-intelligence/booking/types";
import { createBookingAuditEvent } from "./booking-audit";

export type BookingProviderReader = {
  provider_key: string;
  active: boolean;
  read_bundle: () => Promise<{
    services: readonly ServiceSummary[];
    resources: readonly EmployeeResourceSummary[];
    availability_slots: readonly AvailabilitySlot[];
    bookings: readonly BookingSummary[];
    absences: readonly AbsenceSummary[];
    vacation_modes: readonly VacationModeSummary[];
    limitations: readonly string[];
    source_exact: boolean;
  }>;
  read_booking: (bookingId: string) => Promise<{
    booking: BookingSummary | null;
    limitations: readonly string[];
  }>;
};

function emptyReadResult(
  outcome: BookingReadOutcome,
  limitations: readonly string[] = [],
): BookingReadResult {
  return {
    outcome,
    services: [],
    resources: [],
    availability_slots: [],
    bookings: [],
    absences: [],
    vacation_modes: [],
    outcome_key: bookingReadOutcomeKey(outcome),
    audit_id: null,
    limitations,
  };
}

export async function executeBookingRead(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  capability_key: "service.read" | "availability.read" | "booking.read" | "schedule.read" | "employee.read" | "vacation_mode.read" | "post_vacation_availability.read" | "absence.read";
  permission: BookingPermissionContext;
  providers: readonly BookingProviderReader[];
  booking_id?: string | null;
}): Promise<BookingReadResult> {
  if (
    !assertBookingTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyReadResult("permission_denied", ["Cross-tenant booking reads are forbidden."]);
  }

  const block = assertBookingReadAllowed(input.permission);
  if (block) return emptyReadResult(block);

  const permissionOk =
    input.capability_key === "service.read"
      ? canReadBookingServices(input.permission)
      : input.capability_key === "availability.read" ||
          input.capability_key === "post_vacation_availability.read"
        ? canReadBookingAvailability(input.permission)
        : input.capability_key === "booking.read" || input.capability_key === "schedule.read"
          ? canReadBookings(input.permission)
          : canReadBookingServices(input.permission);

  if (!permissionOk) return emptyReadResult("permission_denied");

  const activeProviders = input.providers.filter((provider) => provider.active);
  if (activeProviders.length === 0) return emptyReadResult("provider_missing");

  if (input.booking_id) {
    const provider = activeProviders[0]!;
    const payload = await provider.read_booking(input.booking_id);
    const outcome: BookingReadOutcome = payload.booking ? "exact_match" : "no_match";
    const audit = createBookingAuditEvent({
      organization_id: input.organization_id,
      tenant_id: input.tenant_id,
      user_role: input.user_role,
      capability_key: input.capability_key,
      outcome,
      booking_id: input.booking_id,
      provider_key: provider.provider_key,
      booking: payload.booking,
    });
    return {
      outcome,
      services: [],
      resources: [],
      availability_slots: [],
      bookings: payload.booking ? [payload.booking] : [],
      absences: [],
      vacation_modes: [],
      outcome_key: bookingReadOutcomeKey(outcome),
      audit_id: audit.audit_id,
      limitations: payload.limitations,
    };
  }

  const limitations: string[] = [];
  let bundle = {
    services: [] as ServiceSummary[],
    resources: [] as EmployeeResourceSummary[],
    availability_slots: [] as AvailabilitySlot[],
    bookings: [] as BookingSummary[],
    absences: [] as AbsenceSummary[],
    vacation_modes: [] as VacationModeSummary[],
    source_exact: false,
  };
  let providerKey = activeProviders[0]!.provider_key;

  for (const provider of activeProviders) {
    providerKey = provider.provider_key;
    const payload = await provider.read_bundle();
    limitations.push(...payload.limitations);
    bundle = {
      services: [...bundle.services, ...payload.services],
      resources: [...bundle.resources, ...payload.resources],
      availability_slots: [...bundle.availability_slots, ...payload.availability_slots],
      bookings: [...bundle.bookings, ...payload.bookings],
      absences: [...bundle.absences, ...payload.absences],
      vacation_modes: [...bundle.vacation_modes, ...payload.vacation_modes],
      source_exact: bundle.source_exact || payload.source_exact,
    };
  }

  let outcome: BookingReadOutcome = "partial_result";
  if (input.capability_key === "availability.read" && bundle.availability_slots.length === 0) {
    outcome = "no_availability";
  } else if (bundle.bookings.length === 0 && input.capability_key === "booking.read") {
    outcome = "no_match";
  } else if (bundle.source_exact) {
    outcome = "exact_match";
  }

  const audit = createBookingAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: input.capability_key,
    outcome,
    provider_key: providerKey,
    metadata: {
      service_count: bundle.services.length,
      availability_count: bundle.availability_slots.length,
      booking_count: bundle.bookings.length,
    },
  });

  return {
    outcome,
    services: bundle.services,
    resources: bundle.resources,
    availability_slots: bundle.availability_slots,
    bookings: bundle.bookings,
    absences: bundle.absences,
    vacation_modes: bundle.vacation_modes,
    outcome_key: bookingReadOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}

export type BookingCommandBriefSignalCandidate = {
  signal_key: string;
  count: number | null;
  source_exact: boolean;
};

export function buildBookingCommandBriefSignals(
  candidates: readonly BookingCommandBriefSignalCandidate[],
): Array<{ signal_key: string; count: number | null }> {
  return candidates
    .filter(
      (candidate) =>
        candidate.source_exact && candidate.count !== null && candidate.count > 0,
    )
    .map(({ signal_key, count }) => ({ signal_key, count }));
}
