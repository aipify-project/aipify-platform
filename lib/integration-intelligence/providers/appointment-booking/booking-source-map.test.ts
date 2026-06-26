import assert from "node:assert/strict";
import type { BookingCapabilityKey } from "@/lib/integration-intelligence/booking/types";
import {
  APPOINTMENT_BOOKING_READINESS,
  evaluateBookingWriteSourceConnected,
  getAppointmentBookingSource,
  isBookingWriteSourceConnected,
  type AppointmentBookingSourceDefinition,
} from "@/lib/integration-intelligence/providers/appointment-booking/booking-source-map";

function writeDefinition(
  overrides: Partial<AppointmentBookingSourceDefinition> &
    Pick<AppointmentBookingSourceDefinition, "capability_key">,
): AppointmentBookingSourceDefinition {
  return {
    source_kind: "tenant_rpc",
    source_id: "execute_apt610_companion_booking_write",
    auth_model: "supabase_session_rls_company_id",
    tenant_filter: "_presence_tenant_for_auth() / company_id",
    available_fields: [],
    required_permission: "appointments.manage",
    status: "live",
    read_only: false,
    limitations: [],
    ...overrides,
  };
}

{
  const createDefinition = getAppointmentBookingSource("booking.create");
  assert.equal(createDefinition?.status, "live");
  assert.equal(createDefinition?.source_id, "execute_apt610_companion_booking_write");
  assert.equal(isBookingWriteSourceConnected("booking.create"), true);
}

for (const capabilityKey of ["booking.update", "booking.cancel"] as const) {
  const definition = getAppointmentBookingSource(capabilityKey);
  assert.equal(definition?.status, "missing");
  assert.equal(definition?.source_id, "none");
  assert.equal(isBookingWriteSourceConnected(capabilityKey), false);
}

assert.equal(APPOINTMENT_BOOKING_READINESS.write_ready, true);

for (const capabilityKey of [
  "service.read",
  "employee.read",
  "availability.read",
  "schedule.read",
  "booking.read",
  "absence.read",
  "vacation_mode.read",
  "post_vacation_availability.read",
] as const) {
  assert.equal(isBookingWriteSourceConnected(capabilityKey), false);
}

assert.equal(
  evaluateBookingWriteSourceConnected({
    capabilityKey: "booking.create",
    definition: null,
    writeReady: true,
  }),
  false,
);

assert.equal(
  evaluateBookingWriteSourceConnected({
    capabilityKey: "booking.create",
    definition: writeDefinition({ capability_key: "booking.create", status: "missing" }),
    writeReady: true,
  }),
  false,
);

assert.equal(
  evaluateBookingWriteSourceConnected({
    capabilityKey: "booking.create",
    definition: writeDefinition({ capability_key: "booking.create", source_id: "none" }),
    writeReady: true,
  }),
  false,
);

assert.equal(
  evaluateBookingWriteSourceConnected({
    capabilityKey: "booking.create",
    definition: writeDefinition({ capability_key: "booking.create", read_only: true }),
    writeReady: true,
  }),
  false,
);

assert.equal(
  evaluateBookingWriteSourceConnected({
    capabilityKey: "booking.create",
    definition: writeDefinition({ capability_key: "booking.create" }),
    writeReady: false,
  }),
  false,
);

assert.equal(
  evaluateBookingWriteSourceConnected({
    capabilityKey: "booking.create",
    definition: writeDefinition({ capability_key: "booking.create" }),
    writeReady: true,
  }),
  true,
);

assert.equal(
  evaluateBookingWriteSourceConnected({
    capabilityKey: "service.read" as BookingCapabilityKey,
    definition: writeDefinition({ capability_key: "service.read" }),
    writeReady: true,
  }),
  false,
);

console.log("booking-source-map.test.ts: all assertions passed");
