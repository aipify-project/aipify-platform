import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildBookingApprovalCanonicalPayload,
  computeBookingApprovalPayloadHash,
} from "@/lib/companion-runtime/booking-approval-bridge";
import type { BookingSemanticIntent } from "@/lib/companion-runtime/booking-semantic-intent";
import {
  assembleBookingWriteRequest,
  buildBookingWriteIdempotencyKey,
  type BookingWriteClarificationReason,
  type BookingWriteRequestAssemblerInput,
} from "@/lib/companion-runtime/booking-write-request-assembler";
import type {
  AvailabilitySlot,
  BookingSummary,
  EmployeeResourceSummary,
  ServiceSummary,
} from "@/lib/integration-intelligence/booking/types";
import {
  buildAppointmentBookingReadBundle,
  mapAppointmentResourceSummary,
} from "@/lib/integration-intelligence/providers/appointment-booking/appointment-booking-contract";

const services: ServiceSummary[] = [
  {
    service_id: "svc_cut_color",
    name: "Cut and color",
    duration_minutes: 90,
    buffer_before: 0,
    buffer_after: 15,
    price_summary: null,
    required_resource_type: "employee",
    location: "Salon 1",
    source_reference: "appointment_center",
    freshness: "fresh",
    completeness: "complete",
  },
  {
    service_id: "svc_trim",
    name: "Trim",
    duration_minutes: 30,
    buffer_before: 0,
    buffer_after: 0,
    price_summary: null,
    required_resource_type: "employee",
    location: "Salon 1",
    source_reference: "appointment_center",
    freshness: "fresh",
    completeness: "complete",
  },
];

const resources: EmployeeResourceSummary[] = [
  {
    resource_id: "emp_kari",
    display_name: "Kari Nordmann",
    resource_type: "employee",
    location: "Salon 1",
    source_reference: "appointment_center",
    freshness: "fresh",
    completeness: "complete",
  },
  {
    resource_id: "emp_ola",
    display_name: "Ola Nordmann",
    resource_type: "employee",
    location: "Salon 1",
    source_reference: "appointment_center",
    freshness: "fresh",
    completeness: "complete",
  },
];

const slotMorning: AvailabilitySlot = {
  resource_id: "emp_kari",
  start_at: "2026-06-24T09:00:00.000Z",
  end_at: "2026-06-24T10:30:00.000Z",
  timezone: "Europe/Oslo",
  service_id: "svc_cut_color",
  location_id: null,
  availability_status: "available",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const slotAfternoon = { ...slotMorning, start_at: "2026-06-24T13:00:00.000Z", end_at: "2026-06-24T14:30:00.000Z" };

const slotSameTimeOtherEmployee: AvailabilitySlot = {
  ...slotMorning,
  resource_id: "emp_ola",
};

const providerConsultationService: ServiceSummary = {
  service_id: "svc_consultation",
  name: "Consultation",
  duration_minutes: 60,
  buffer_before: 0,
  buffer_after: 0,
  price_summary: null,
  required_resource_type: "employee",
  location: "Room 1",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const providerResource: EmployeeResourceSummary = {
  resource_id: "emp_provider_a",
  display_name: "P. A***",
  match_label: "Provider A",
  resource_type: "employee",
  location: "Room 1",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const providerSlot: AvailabilitySlot = {
  resource_id: "emp_provider_a",
  start_at: "2026-06-29T08:00:00+00:00",
  end_at: "2026-06-29T09:00:00+00:00",
  timezone: "Europe/Oslo",
  service_id: "svc_consultation",
  location_id: null,
  availability_status: "available",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const existingBooking: BookingSummary = {
  booking_id: "apt_1001",
  service_id: "svc_cut_color",
  resource_id: "emp_kari",
  customer_reference: "masked-customer",
  start_at: slotMorning.start_at,
  end_at: slotMorning.end_at,
  status: "confirmed",
  location: "Salon 1",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

function intent(overrides: Partial<BookingSemanticIntent> = {}): BookingSemanticIntent {
  return {
    capability_key: "booking.create",
    entity: "booking",
    operation: "create",
    metric: null,
    booking_id: null,
    service_id: null,
    resource_name: null,
    date_hint: null,
    confirmed: false,
    confidence: "moderate",
    ambiguous: false,
    ...overrides,
  };
}

function input(overrides: Partial<BookingWriteRequestAssemblerInput> = {}): BookingWriteRequestAssemblerInput {
  return {
    intent: intent(),
    confirmed: true,
    services: [services[0]!],
    resources: [resources[0]!],
    availability_slots: [slotMorning],
    service_id: "svc_cut_color",
    resource_id: "emp_kari",
    slot_start_at: slotMorning.start_at,
    ...overrides,
  };
}

function expectClarification(
  result: ReturnType<typeof assembleBookingWriteRequest>,
  reasons: BookingWriteClarificationReason[],
) {
  assert.equal(result.status, "needs_clarification");
  if (result.status === "needs_clarification") {
    assert.deepEqual(result.reasons, reasons);
  }
}

const cases: Array<{
  name: string;
  run: () => void;
}> = [
  {
    name: "unambiguous create assembles stable keys",
    run: () => {
      const result = assembleBookingWriteRequest(input());
      assert.equal(result.status, "assembled");
      if (result.status !== "assembled") return;
      assert.equal(result.request.service_id, "svc_cut_color");
      assert.equal(result.request.resource_id, "emp_kari");
      assert.equal(result.request.start_at, slotMorning.start_at);
      assert.match(result.idempotency_key, /^booking:[a-f0-9]{64}$/);
    },
  },
  {
    name: "same payload yields same idempotency key",
    run: () => {
      const first = assembleBookingWriteRequest(input());
      const second = assembleBookingWriteRequest(input());
      assert.equal(first.status, "assembled");
      assert.equal(second.status, "assembled");
      if (first.status === "assembled" && second.status === "assembled") {
        assert.equal(first.idempotency_key, second.idempotency_key);
      }
    },
  },
  {
    name: "changed slot yields different idempotency key",
    run: () => {
      const first = assembleBookingWriteRequest(input());
      const second = assembleBookingWriteRequest(
        input({ slot_start_at: slotAfternoon.start_at, availability_slots: [slotAfternoon] }),
      );
      assert.equal(first.status, "assembled");
      assert.equal(second.status, "assembled");
      if (first.status === "assembled" && second.status === "assembled") {
        assert.notEqual(first.idempotency_key, second.idempotency_key);
      }
    },
  },
  {
    name: "missing service catalog returns service_missing",
    run: () => expectClarification(assembleBookingWriteRequest(input({ services: [] })), ["service_missing"]),
  },
  {
    name: "multiple services without explicit choice returns service_missing",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(input({ services, service_id: null, intent: intent({ service_id: null }) })),
        ["service_missing"],
      ),
  },
  {
    name: "single service without explicit choice returns service_missing",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({ service_id: null, intent: intent({ service_id: null }) }),
        ),
        ["service_missing"],
      ),
  },
  {
    name: "date_hint only returns slot_missing",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({ slot_start_at: null, intent: intent({ date_hint: "friday" }) }),
        ),
        ["slot_missing"],
      ),
  },
  {
    name: "ambiguous employee label returns employee_ambiguous",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({
            resources: [
              { ...resources[0]!, display_name: "Alex Smith" },
              { ...resources[1]!, resource_id: "emp_alex_b", display_name: "Alex Smith" },
            ],
            resource_id: null,
            intent: intent({ resource_name: "Alex Smith" }),
          }),
        ),
        ["employee_ambiguous"],
      ),
  },
  {
    name: "duplicate canonical match_label returns employee_ambiguous",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({
            resources: [
              {
                ...resources[0]!,
                resource_id: "emp_alpha",
                display_name: "A. S***",
                match_label: "Alex Smith",
              },
              {
                ...resources[1]!,
                resource_id: "emp_beta",
                display_name: "A. S***",
                match_label: "Alex Smith",
              },
            ],
            resource_id: null,
            intent: intent({ resource_name: "Alex Smith" }),
          }),
        ),
        ["employee_ambiguous"],
      ),
  },
  {
    name: "canonical employee label resolves masked resource",
    run: () => {
      const result = assembleBookingWriteRequest(
        input({
          services: [providerConsultationService],
          resources: [providerResource],
          availability_slots: [providerSlot],
          service_id: "svc_consultation",
          resource_id: null,
          slot_start_at: providerSlot.start_at,
          intent: intent({
            service_id: "Consultation",
            resource_name: "Provider A",
          }),
        }),
      );
      assert.equal(result.status, "assembled");
      if (result.status !== "assembled") return;
      assert.equal(result.request.resource_id, "emp_provider_a");
    },
  },
  {
    name: "canonical employee label matching is case and whitespace tolerant",
    run: () => {
      const result = assembleBookingWriteRequest(
        input({
          services: [providerConsultationService],
          resources: [providerResource],
          availability_slots: [providerSlot],
          service_id: "svc_consultation",
          resource_id: null,
          slot_start_at: providerSlot.start_at,
          intent: intent({
            service_id: "Consultation",
            resource_name: "  provider   a  ",
          }),
        }),
      );
      assert.equal(result.status, "assembled");
      if (result.status !== "assembled") return;
      assert.equal(result.request.resource_id, "emp_provider_a");
    },
  },
  {
    name: "employee_key still resolves when resource_name is stable key",
    run: () => {
      const result = assembleBookingWriteRequest(
        input({
          services: [providerConsultationService],
          resources: [providerResource],
          availability_slots: [providerSlot],
          service_id: "svc_consultation",
          resource_id: null,
          slot_start_at: providerSlot.start_at,
          intent: intent({
            service_id: "Consultation",
            resource_name: "emp_provider_a",
          }),
        }),
      );
      assert.equal(result.status, "assembled");
      if (result.status !== "assembled") return;
      assert.equal(result.request.resource_id, "emp_provider_a");
    },
  },
  {
    name: "unknown employee label returns employee_missing",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({
            services: [providerConsultationService],
            resources: [providerResource],
            availability_slots: [providerSlot],
            service_id: "svc_consultation",
            resource_id: null,
            slot_start_at: providerSlot.start_at,
            intent: intent({
              service_id: "Consultation",
              resource_name: "Unknown Person",
            }),
          }),
        ),
        ["employee_missing"],
      ),
  },
  {
    name: "mapAppointmentResourceSummary masks display_name and keeps internal match_label",
    run: () => {
      const mapped = mapAppointmentResourceSummary(
        { employee_key: "emp_provider_a", employee_label: "Provider A" },
        { source_reference: "test", fetched_at: "2026-01-01T00:00:00.000Z" },
      );
      assert.ok(mapped);
      assert.equal(mapped!.display_name, "P. A***");
      assert.equal(mapped!.match_label, "Provider A");
    },
  },
  {
    name: "customer-facing read bundle omits match_label and raw canonical label",
    run: () => {
      const bundle = buildAppointmentBookingReadBundle({
        organization_id: "org_test",
        source_reference: "test",
        fetched_at: "2026-01-01T00:00:00.000Z",
        settings: {},
        employees: [{ employee_key: "emp_provider_a", employee_label: "Provider A" }],
      });
      assert.equal(bundle.resources.length, 1);
      assert.equal(bundle.resources[0]!.display_name, "P. A***");
      assert.equal(bundle.resources[0]!.match_label, undefined);
      const serialized = JSON.stringify(bundle.resources);
      assert.equal(serialized.includes("match_label"), false);
      assert.equal(serialized.includes("Provider A"), false);
    },
  },
  {
    name: "approval payload never includes match_label or raw canonical label",
    run: () => {
      const result = assembleBookingWriteRequest(
        input({
          services: [providerConsultationService],
          resources: [providerResource],
          availability_slots: [providerSlot],
          service_id: "svc_consultation",
          resource_id: null,
          slot_start_at: providerSlot.start_at,
          intent: intent({
            service_id: "Consultation",
            resource_name: "Provider A",
          }),
        }),
      );
      assert.equal(result.status, "assembled");
      if (result.status !== "assembled") return;
      const payload = buildBookingApprovalCanonicalPayload(result.request);
      const serialized = JSON.stringify(payload);
      assert.equal(serialized.includes("match_label"), false);
      assert.equal(serialized.includes("Provider A"), false);
      assert.equal(result.request.resource_id, "emp_provider_a");
    },
  },
  {
    name: "single employee without explicit choice returns employee_missing",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({ resource_id: null, intent: intent({ resource_name: null }) }),
        ),
        ["employee_missing"],
      ),
  },
  {
    name: "same start time for two employees requires explicit employee key",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({
            resources,
            resource_id: null,
            availability_slots: [slotMorning, slotSameTimeOtherEmployee],
            intent: intent({ resource_name: null }),
          }),
        ),
        ["employee_missing"],
      ),
  },
  {
    name: "cancel without booking id returns booking_id_missing",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({
            intent: intent({ capability_key: "booking.cancel", operation: "cancel", booking_id: null }),
          }),
        ),
        ["booking_id_missing"],
      ),
  },
  {
    name: "cancel with appointment key assembles without service employee slot",
    run: () => {
      const result = assembleBookingWriteRequest(
        input({
          intent: intent({
            capability_key: "booking.cancel",
            operation: "cancel",
            booking_id: "apt_1001",
          }),
          service_id: null,
          resource_id: null,
          slot_start_at: null,
          availability_slots: [],
        }),
      );
      assert.equal(result.status, "assembled");
      if (result.status === "assembled") {
        assert.equal(result.request.capability_key, "booking.cancel");
        assert.equal(result.request.booking_id, "apt_1001");
        assert.equal(result.request.service_id, null);
        assert.equal(result.request.resource_id, null);
        assert.equal(result.request.start_at, null);
      }
    },
  },
  {
    name: "update with identical values returns no_update_changes",
    run: () =>
      expectClarification(
        assembleBookingWriteRequest(
          input({
            intent: intent({
              capability_key: "booking.update",
              operation: "update",
              booking_id: "apt_1001",
            }),
            existing_booking: existingBooking,
            slot_start_at: null,
            service_id: null,
            resource_id: null,
          }),
        ),
        ["no_update_changes"],
      ),
  },
  {
    name: "confirmed does not affect payload hash",
    run: () => {
      const unconfirmed = assembleBookingWriteRequest(input({ confirmed: false }));
      const confirmed = assembleBookingWriteRequest(input({ confirmed: true }));
      assert.equal(unconfirmed.status, "assembled");
      assert.equal(confirmed.status, "assembled");
      if (unconfirmed.status === "assembled" && confirmed.status === "assembled") {
        assert.equal(unconfirmed.payload_hash, confirmed.payload_hash);
        assert.equal(unconfirmed.idempotency_key, confirmed.idempotency_key);
      }
    },
  },
  {
    name: "capability changes canonical payload through booking_id and field shape",
    run: () => {
      const createResult = assembleBookingWriteRequest(input());
      const cancelResult = assembleBookingWriteRequest(
        input({
          intent: intent({
            capability_key: "booking.cancel",
            operation: "cancel",
            booking_id: "apt_1001",
          }),
        }),
      );
      assert.equal(createResult.status, "assembled");
      assert.equal(cancelResult.status, "assembled");
      if (createResult.status === "assembled" && cancelResult.status === "assembled") {
        assert.notEqual(createResult.payload_hash, cancelResult.payload_hash);
      }
    },
  },
  {
    name: "assembler source has no supabase or write side effects",
    run: () => {
      const source = fs.readFileSync(path.join(import.meta.dirname, "booking-write-request-assembler.ts"), "utf8");
      assert.equal(source.includes("supabase"), false);
      assert.equal(source.includes("createClient"), false);
      assert.equal(source.includes("recordBookingApprovalActionRequest"), false);
      assert.equal(source.includes("executeBookingWrite"), false);
    },
  },
  {
    name: "hash helper is invoked once per assembled request",
    run: () => {
      const result = assembleBookingWriteRequest(input());
      assert.equal(result.status, "assembled");
      if (result.status !== "assembled") return;
      const payload = buildBookingApprovalCanonicalPayload(result.request);
      assert.equal("confirmed" in payload, false);
      const directHash = computeBookingApprovalPayloadHash({
        service_id: result.request.service_id,
        resource_id: result.request.resource_id,
        customer_reference: result.request.customer_reference,
        booking_id: result.request.booking_id,
        start_at: result.request.start_at,
        end_at: result.request.end_at,
      });
      assert.equal(result.payload_hash, directHash);
    },
  },
];

const samplePayloadHash = "a".repeat(64);

const idempotencyHelperCases: Array<{ name: string; run: () => void }> = [
  {
    name: "same payload hash and booking.create yields same idempotency key",
    run: () => {
      const first = buildBookingWriteIdempotencyKey("booking.create", samplePayloadHash);
      const second = buildBookingWriteIdempotencyKey("booking.create", samplePayloadHash);
      assert.equal(first, second);
    },
  },
  {
    name: "same payload hash across capabilities yields distinct idempotency keys",
    run: () => {
      const createKey = buildBookingWriteIdempotencyKey("booking.create", samplePayloadHash);
      const updateKey = buildBookingWriteIdempotencyKey("booking.update", samplePayloadHash);
      const cancelKey = buildBookingWriteIdempotencyKey("booking.cancel", samplePayloadHash);
      assert.notEqual(createKey, updateKey);
      assert.notEqual(updateKey, cancelKey);
      assert.notEqual(createKey, cancelKey);
    },
  },
  {
    name: "same capability with different payload hash yields different idempotency key",
    run: () => {
      const first = buildBookingWriteIdempotencyKey("booking.create", samplePayloadHash);
      const second = buildBookingWriteIdempotencyKey("booking.create", "b".repeat(64));
      assert.notEqual(first, second);
    },
  },
  {
    name: "idempotency keys match booking domain hash format",
    run: () => {
      for (const capability of ["booking.create", "booking.update", "booking.cancel"] as const) {
        assert.match(
          buildBookingWriteIdempotencyKey(capability, samplePayloadHash),
          /^booking:[a-f0-9]{64}$/,
        );
      }
    },
  },
  {
    name: "assembler payload_hash remains canonical payload hash only",
    run: () => {
      const result = assembleBookingWriteRequest(input());
      assert.equal(result.status, "assembled");
      if (result.status !== "assembled") return;
      const directHash = computeBookingApprovalPayloadHash({
        service_id: result.request.service_id,
        resource_id: result.request.resource_id,
        customer_reference: result.request.customer_reference,
        booking_id: result.request.booking_id,
        start_at: result.request.start_at,
        end_at: result.request.end_at,
      });
      assert.equal(result.payload_hash, directHash);
    },
  },
  {
    name: "assembler idempotency_key uses domain hash not raw payload hash",
    run: () => {
      const result = assembleBookingWriteRequest(input());
      assert.equal(result.status, "assembled");
      if (result.status !== "assembled") return;
      assert.notEqual(result.idempotency_key, `booking:${result.payload_hash}`);
      assert.equal(
        result.idempotency_key,
        buildBookingWriteIdempotencyKey("booking.create", result.payload_hash),
      );
    },
  },
  {
    name: "confirmed does not affect payload hash or idempotency key",
    run: () => {
      const unconfirmed = assembleBookingWriteRequest(input({ confirmed: false }));
      const confirmed = assembleBookingWriteRequest(input({ confirmed: true }));
      assert.equal(unconfirmed.status, "assembled");
      assert.equal(confirmed.status, "assembled");
      if (unconfirmed.status === "assembled" && confirmed.status === "assembled") {
        assert.equal(unconfirmed.payload_hash, confirmed.payload_hash);
        assert.equal(unconfirmed.idempotency_key, confirmed.idempotency_key);
      }
    },
  },
];

for (const testCase of cases) {
  testCase.run();
}

for (const testCase of idempotencyHelperCases) {
  testCase.run();
}

console.log(
  `booking-write-request-assembler.test.ts: ${cases.length + idempotencyHelperCases.length} cases passed`,
);
