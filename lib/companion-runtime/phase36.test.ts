import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_BOOKING_AUTO_CREATE,
  COMPANION_BOOKING_CONFIRMATION,
  COMPANION_BOOKING_CORE,
  COMPANION_BOOKING_PII_DEFAULT,
  COMPANION_BOOKING_READ_ONLY,
  companionBookingPolicyMetadata,
} from "@/lib/companion-runtime/companion-booking-policy";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  listBookingAuditEvents,
  resetBookingAuditLogForTests,
} from "@/lib/companion-runtime/booking-audit";
import {
  buildBookingCommandBriefSignals,
  executeBookingRead,
  type BookingProviderReader,
} from "@/lib/companion-runtime/booking-read-orchestrator";
import { executeBookingWrite } from "@/lib/companion-runtime/booking-write-orchestrator";
import {
  collectBookingDescriptorsFromManifests,
  resolveBookingSemanticIntent,
} from "@/lib/companion-runtime/booking-semantic-intent";
import {
  evaluateAvailabilityFromSource,
  defaultBookingAvailabilityPolicy,
} from "@/lib/integration-intelligence/booking/availability-policy";
import {
  BOOKING_READ_OUTCOME_I18N_KEYS,
  BOOKING_WRITE_OUTCOME_I18N_KEYS,
} from "@/lib/integration-intelligence/booking/outcomes";
import {
  maskBookingCustomerReference,
  stripForbiddenBookingFields,
} from "@/lib/integration-intelligence/booking/masking";
import { normalizeBookingStatus } from "@/lib/integration-intelligence/booking/status-normalization";
import { isBookingCapabilityBlocked } from "@/lib/integration-intelligence/booking/types";
import {
  APPOINTMENT_BOOKING_PROVIDER_CONTRACT,
  buildAppointmentBookingReadBundle,
  findAppointmentBookingById,
  mapAppointmentAvailabilitySlot,
  mapAppointmentBookingSummary,
  type AppointmentCenterProxyPayload,
} from "@/lib/integration-intelligence/providers/appointment-booking/appointment-booking-contract";
import { APPOINTMENT_BOOKING_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/providers/appointment-booking/booking-manifest";
import { APPOINTMENT_BOOKING_SOURCE_MAP } from "@/lib/integration-intelligence/providers/appointment-booking/booking-source-map";
import { isBookingIndustryMetadata } from "@/lib/integration-intelligence/booking/industry-metadata";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG_A = "org-booking-a";
const ORG_B = "org-booking-b";
const fetchedAt = new Date().toISOString();
const sourceReference = "rpc:get_organization_appointment_center:overview";

const proxyPayload: AppointmentCenterProxyPayload = {
  organization_id: ORG_A,
  source_reference: sourceReference,
  fetched_at: fetchedAt,
  settings: {
    prevent_double_booking: true,
    slot_hold_minutes: 15,
    vacation_revenue_mode_enabled: true,
    timezone: "Europe/Oslo",
  },
  services: [
    {
      service_key: "svc_cut_color",
      name: "Cut & Color",
      duration_minutes: 90,
      prep_minutes: 10,
      cleanup_minutes: 10,
      buffer_minutes: 15,
      price_label: "from 890 NOK",
      resource_type: "employee",
      location_label: "Salon 1",
    },
  ],
  employees: [
    { employee_key: "emp_kari", label: "Kari Nordmann", location_label: "Salon 1" },
  ],
  appointments: [
    {
      appointment_key: "apt_1001",
      service_key: "svc_cut_color",
      employee_key: "emp_kari",
      customer_label: "Ola Customer",
      start_at: "2026-06-23T09:00:00.000Z",
      end_at: "2026-06-23T10:30:00.000Z",
      status_key: "confirmed",
    },
  ],
  availability_rules: [
    {
      employee_key: "emp_kari",
      service_key: "svc_cut_color",
      start_at: "2026-06-24T09:00:00.000Z",
      end_at: "2026-06-24T10:30:00.000Z",
      availability_status: "available",
      timezone: "Europe/Oslo",
    },
    {
      employee_key: "emp_kari",
      service_key: "svc_cut_color",
      start_at: "2026-06-23T09:00:00.000Z",
      end_at: "2026-06-23T10:30:00.000Z",
      availability_status: "available",
      timezone: "Europe/Oslo",
    },
  ],
  vacation_integration: [
    {
      vacation_key: "vac_1",
      employee_key: "emp_other",
      scope: "employee",
      start_at: "2026-06-20T00:00:00.000Z",
      end_at: "2026-06-28T00:00:00.000Z",
      return_at: "2026-06-29T00:00:00.000Z",
      post_vacation_available_from: "2026-06-29T08:00:00.000Z",
    },
  ],
};

const readBundle = buildAppointmentBookingReadBundle(proxyPayload);

const testProvider: BookingProviderReader = {
  provider_key: "appointment_booking",
  active: true,
  read_bundle: async () => ({
    ...readBundle,
    limitations: [
      "Read bundle uses appointment center metadata — partial proxy until live write adapter is connected.",
    ],
  }),
  read_booking: async (bookingId) => ({
    booking: findAppointmentBookingById(proxyPayload, bookingId),
    limitations: ["Case lookup uses metadata-only proxy records."],
  }),
};

assert.equal(companionBookingPolicyMetadata().read_only_default, COMPANION_BOOKING_READ_ONLY);
assert.equal(COMPANION_BOOKING_CORE, "provider_agnostic");
assert.equal(COMPANION_BOOKING_PII_DEFAULT, "masked");
assert.equal(COMPANION_BOOKING_AUTO_CREATE, "forbidden");
assert.equal(COMPANION_BOOKING_CONFIRMATION, "required");
assert.equal(isBookingCapabilityBlocked("booking.auto_create"), true);
assert.equal(isBookingIndustryMetadata("salon"), true);
assert.equal(normalizeBookingStatus("confirmed"), "confirmed");

assert.equal(maskBookingCustomerReference("Ola Customer").includes("*"), true);
const stripped = stripForbiddenBookingFields({
  service_key: "svc_1",
  email: "secret@example.com",
  phone: "+4712345678",
});
assert.equal("email" in stripped, false);
assert.equal("phone" in stripped, false);

const policy = defaultBookingAvailabilityPolicy({ prevent_double_booking: true });
const rawSlots = (proxyPayload.availability_rules ?? [])
  .map((row) =>
    mapAppointmentAvailabilitySlot(row, {
      source_reference: sourceReference,
      fetched_at: fetchedAt,
    }),
  )
  .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
const rawBookings = (proxyPayload.appointments ?? [])
  .map((row) =>
    mapAppointmentBookingSummary(row, {
      source_reference: sourceReference,
      fetched_at: fetchedAt,
    }),
  )
  .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
const availabilityEval = evaluateAvailabilityFromSource({
  policy,
  existing_bookings: rawBookings,
  reported_slots: rawSlots,
});
assert.ok(availabilityEval.conflicts.length > 0, "double-book conflict detected");
assert.ok(availabilityEval.slots.length >= 1, "non-conflicting slot remains");

const descriptors = collectBookingDescriptorsFromManifests(APPOINTMENT_BOOKING_PROVIDER_MANIFESTS);
assert.ok(descriptors.some((entry) => entry.capability_key === "availability.read"));

const nextSlotIntent = resolveBookingSemanticIntent({
  query: "Når er neste ledige time?",
  locale: "no",
  descriptors,
});
assert.equal(nextSlotIntent.capability_key, "availability.read");
assert.equal(nextSlotIntent.metric, "next_available");

const employeeIntent = resolveBookingSemanticIntent({
  query: "Har Kari noe ledig på fredag?",
  locale: "no",
  descriptors,
});
assert.equal(employeeIntent.capability_key, "availability.read");
assert.ok(employeeIntent.resource_name);

const durationIntent = resolveBookingSemanticIntent({
  query: "Hvor lenge varer behandlingen?",
  locale: "no",
  descriptors,
});
assert.equal(durationIntent.metric, "duration");

const createIntent = resolveBookingSemanticIntent({
  query: "Bestill klipp og farge neste uke",
  locale: "no",
  descriptors,
});
assert.equal(createIntent.capability_key, "booking.create");
assert.equal(createIntent.confirmed, false);

const postVacationIntent = resolveBookingSemanticIntent({
  query: "Har vi ledige timer etter ferien?",
  locale: "no",
  descriptors,
});
assert.equal(postVacationIntent.metric, "post_vacation_availability");

const bookingIdIntent = resolveBookingSemanticIntent({
  query: "Vis booking apt_1001",
  locale: "en",
  descriptors,
});
assert.equal(bookingIdIntent.booking_id, "apt_1001");

const bookingListIntent = resolveBookingSemanticIntent({
  query: "Vis meg bookinger",
  locale: "no",
  descriptors,
});
assert.equal(bookingListIntent.capability_key, "booking.read");
assert.equal(bookingListIntent.operation, "list");

resetBookingAuditLogForTests();

async function runPhase36AsyncTests() {
  const permissionCtx = {
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  app_suspended: false,
  provider_active: true,
  can_read_services: true,
  can_read_bookings: true,
  can_read_availability: true,
  can_write_booking: true,
  rate_limit_ok: true,
};

const serviceRead = await executeBookingRead({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  capability_key: "service.read",
  permission: permissionCtx,
  providers: [testProvider],
});
assert.equal(serviceRead.services.length, 1);
assert.equal(serviceRead.services[0]?.duration_minutes, 90);
assert.ok(["partial_result", "exact_match"].includes(serviceRead.outcome));
assert.ok(serviceRead.audit_id);

const availabilityRead = await executeBookingRead({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  capability_key: "availability.read",
  permission: permissionCtx,
  providers: [testProvider],
});
assert.ok(availabilityRead.availability_slots.length >= 1);

const bookingListRead = await executeBookingRead({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  capability_key: "booking.read",
  permission: permissionCtx,
  providers: [testProvider],
});
assert.equal(bookingListRead.bookings.length, 1);
assert.ok(["partial_result", "exact_match"].includes(bookingListRead.outcome));

const bookingLookup = await executeBookingRead({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  capability_key: "booking.read",
  permission: permissionCtx,
  providers: [testProvider],
  booking_id: "apt_1001",
});
assert.equal(bookingLookup.outcome, "exact_match");
assert.equal(bookingLookup.bookings[0]?.booking_id, "apt_1001");
assert.ok(bookingLookup.bookings[0]?.customer_reference.includes("*"));

const deniedRead = await executeBookingRead({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "staff",
  capability_key: "booking.read",
  permission: { ...permissionCtx, can_read_bookings: false },
  providers: [testProvider],
});
assert.equal(deniedRead.outcome, "permission_denied");

const tenantIsolation = await executeBookingRead({
  organization_id: ORG_B,
  tenant_id: "tenant-a",
  user_role: "admin",
  capability_key: "booking.read",
  permission: permissionCtx,
  providers: [testProvider],
});
assert.equal(tenantIsolation.outcome, "permission_denied");

const suspendedRead = await executeBookingRead({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  capability_key: "booking.read",
  permission: { ...permissionCtx, app_suspended: true },
  providers: [testProvider],
});
assert.equal(suspendedRead.outcome, "activation_pending");

const disabledProviderRead = await executeBookingRead({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  capability_key: "booking.read",
  permission: permissionCtx,
  providers: [{ ...testProvider, active: false }],
});
assert.equal(disabledProviderRead.outcome, "provider_missing");

const writeUnconfirmed = await executeBookingWrite({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  permission: permissionCtx,
  provider_key: "appointment_booking",
  provider_write: {
    write_source_available: false,
    requires_approval_before_execution: true,
  },
  request: {
    capability_key: "booking.create",
    service_id: "svc_cut_color",
    resource_id: "emp_kari",
    customer_reference: "masked-customer",
    booking_id: null,
    start_at: "2026-06-24T09:00:00.000Z",
    end_at: "2026-06-24T10:30:00.000Z",
    confirmed: false,
    idempotency_key: "idem-1",
  },
});
assert.equal(writeUnconfirmed.outcome, "confirmation_required");
assert.ok(writeUnconfirmed.proposal);

const writeConfirmed = await executeBookingWrite({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  permission: permissionCtx,
  provider_key: "appointment_booking",
  provider_write: {
    write_source_available: false,
    requires_approval_before_execution: true,
  },
  request: {
    capability_key: "booking.create",
    service_id: "svc_cut_color",
    resource_id: "emp_kari",
    customer_reference: "masked-customer",
    booking_id: null,
    start_at: "2026-06-24T09:00:00.000Z",
    end_at: "2026-06-24T10:30:00.000Z",
    confirmed: true,
    idempotency_key: "idem-1",
  },
});
assert.equal(writeConfirmed.outcome, "execution_source_missing");
assert.equal(writeConfirmed.booking, null);
assert.equal(writeConfirmed.proposal?.requires_approval, false);

const writeRetry = await executeBookingWrite({
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  permission: permissionCtx,
  provider_key: "appointment_booking",
  provider_write: {
    write_source_available: false,
    requires_approval_before_execution: true,
  },
  request: {
    capability_key: "booking.create",
    service_id: "svc_cut_color",
    resource_id: "emp_kari",
    customer_reference: "masked-customer",
    booking_id: null,
    start_at: "2026-06-24T09:00:00.000Z",
    end_at: "2026-06-24T10:30:00.000Z",
    confirmed: true,
    idempotency_key: "idem-1",
  },
});
assert.equal(writeRetry.outcome, "execution_source_missing");

assert.ok(listBookingAuditEvents(ORG_A).length >= 3);

const briefPartial = buildBookingCommandBriefSignals([
  { signal_key: "upcoming_bookings", count: 3, source_exact: false },
]);
assert.equal(briefPartial.length, 0);

const briefExact = buildBookingCommandBriefSignals([
  { signal_key: "upcoming_bookings", count: 3, source_exact: true },
  { signal_key: "booking_conflict", count: 1, source_exact: true },
]);
assert.equal(briefExact.length, 2);

const coverage = buildCompanionFoundationCoverageRegistry();
assert.ok(coverage.some((entry) => entry.module_id === "service.appointment_booking"));
assert.ok(coverage.some((entry) => entry.module_id === "service.booking_write"));
assert.equal(
  coverage.find((entry) => entry.module_id === "service.appointment_booking")?.readiness,
  "connected_but_partial",
);
assert.notEqual(APPOINTMENT_BOOKING_PROVIDER_CONTRACT.readiness, "production_ready");
assert.ok(APPOINTMENT_BOOKING_SOURCE_MAP.some((entry) => entry.capability_key === "booking.read"));
assert.ok(
  APPOINTMENT_BOOKING_SOURCE_MAP.every((entry) => entry.source_id !== "get_organization_appointment_booking_center"),
);

for (const file of [
  "lib/companion-runtime/booking-read-orchestrator.ts",
  "lib/companion-runtime/booking-semantic-intent.ts",
  "lib/integration-intelligence/booking/types.ts",
]) {
  const source = fs.readFileSync(path.join(repoRoot, file), "utf8");
  assert.equal(/frisør|salon-specific|hairdresser_logic/i.test(source), false, file);
  assert.equal(/organization_apt610|get_organization_appointment_center/i.test(source), false, file);
}

const sourceMap = fs.readFileSync(
  path.join(repoRoot, "lib/integration-intelligence/providers/appointment-booking/booking-source-map.ts"),
  "utf8",
);
assert.ok(/get_organization_appointment_center/i.test(sourceMap));
assert.ok(!/get_organization_appointment_booking_center/i.test(sourceMap));

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`), "utf8"),
  );
  const booking = dict.companionPlatformKnowledge.booking;
  assert.ok(booking?.outcomes?.exactMatch, `${locale} booking outcomes`);
  assert.ok(booking?.status?.confirmed, `${locale} booking status`);
  assert.ok(booking?.warnings?.partialSource ?? booking?.warnings?.noReportedSlots, `${locale} booking warnings`);
}

for (const key of Object.values(BOOKING_READ_OUTCOME_I18N_KEYS)) {
  assert.ok(key.startsWith("customerApp.companionPlatformKnowledge.booking."), key);
}
for (const key of Object.values(BOOKING_WRITE_OUTCOME_I18N_KEYS)) {
  assert.ok(key.startsWith("customerApp.companionPlatformKnowledge.booking."), key);
}

  console.log("phase36.test.ts: all assertions passed");
}

runPhase36AsyncTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
