import { createHash } from "node:crypto";
import {
  buildBookingApprovalCanonicalPayload,
  computeBookingApprovalPayloadHash,
} from "@/lib/companion-runtime/booking-approval-bridge";
import type { BookingSemanticIntent } from "@/lib/companion-runtime/booking-semantic-intent";
import type {
  AvailabilitySlot,
  BookingSummary,
  BookingWriteRequest,
  EmployeeResourceSummary,
  ServiceSummary,
} from "@/lib/integration-intelligence/booking/types";

const WRITE_CAPABILITIES = ["booking.create", "booking.update", "booking.cancel"] as const;

type WriteCapabilityKey = (typeof WRITE_CAPABILITIES)[number];

const BOOKING_WRITE_REQUESTED_ACTION: Record<WriteCapabilityKey, "create" | "update" | "cancel"> = {
  "booking.create": "create",
  "booking.update": "update",
  "booking.cancel": "cancel",
};

function sortDomainHashInput(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((entry) => sortDomainHashInput(entry));

  const record = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort()) {
    sorted[key] = sortDomainHashInput(record[key]);
  }
  return sorted;
}

export function buildBookingWriteIdempotencyKey(
  capabilityKey: WriteCapabilityKey,
  payloadHash: string,
): string {
  const domainInput = {
    domain: "booking_write",
    schema_version: "booking_write_v1",
    capability_key: capabilityKey,
    requested_action: BOOKING_WRITE_REQUESTED_ACTION[capabilityKey],
    payload_hash: payloadHash,
  };
  const domainHash = createHash("sha256")
    .update(JSON.stringify(sortDomainHashInput(domainInput)))
    .digest("hex");
  return `booking:${domainHash}`;
}

export type BookingWriteClarificationReason =
  | "service_missing"
  | "service_ambiguous"
  | "employee_missing"
  | "employee_ambiguous"
  | "slot_missing"
  | "slot_ambiguous"
  | "booking_id_missing"
  | "no_update_changes";

export type BookingWriteRequestAssemblerInput = {
  intent: BookingSemanticIntent;
  confirmed: boolean;
  services: readonly ServiceSummary[];
  resources: readonly EmployeeResourceSummary[];
  availability_slots: readonly AvailabilitySlot[];
  existing_booking?: BookingSummary | null;
  customer_reference?: string | null;
  service_id?: string | null;
  resource_id?: string | null;
  slot_start_at?: string | null;
};

export type BookingWriteRequestAssemblyResult =
  | {
      status: "assembled";
      request: BookingWriteRequest;
      payload_hash: string;
      idempotency_key: string;
    }
  | { status: "needs_clarification"; reasons: readonly BookingWriteClarificationReason[] }
  | { status: "unsupported" };

type ResolveFail = { ok: false; reason: BookingWriteClarificationReason };
type ResolveOk<T> = { ok: true; value: T };

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function needsClarification(
  reasons: BookingWriteClarificationReason[],
): BookingWriteRequestAssemblyResult {
  return { status: "needs_clarification", reasons: [...new Set(reasons)] };
}

function resolveByStableKey<T extends { service_id?: string; resource_id?: string }>(
  items: readonly T[],
  key: string | null | undefined,
  keyField: "service_id" | "resource_id",
  missing: BookingWriteClarificationReason,
): ResolveOk<string> | ResolveFail {
  const trimmed = key?.trim();
  if (!trimmed) return { ok: false, reason: missing };

  const matches = items.filter((item) => item[keyField] === trimmed);
  if (matches.length === 1) return { ok: true, value: trimmed };
  return { ok: false, reason: missing };
}

function resolveByExactLabel<T>(
  items: readonly T[],
  label: string | null | undefined,
  getKey: (item: T) => string,
  getLabel: (item: T) => string | null | undefined,
  missing: BookingWriteClarificationReason,
  ambiguous: BookingWriteClarificationReason,
): ResolveOk<string> | ResolveFail {
  const trimmed = label?.trim();
  if (!trimmed) return { ok: false, reason: missing };

  const normalized = normalizeToken(trimmed);
  const matches = items.filter((item) => {
    const candidate = getLabel(item)?.trim();
    return candidate ? normalizeToken(candidate) === normalized : false;
  });

  if (matches.length === 1) return { ok: true, value: getKey(matches[0]!) };
  if (matches.length === 0) return { ok: false, reason: missing };
  return { ok: false, reason: ambiguous };
}

function resolveServiceId(input: BookingWriteRequestAssemblerInput): ResolveOk<string> | ResolveFail {
  const callerKey = resolveByStableKey(input.services, input.service_id, "service_id", "service_missing");
  if (callerKey.ok) return callerKey;

  const intentKey = resolveByStableKey(
    input.services,
    input.intent.service_id,
    "service_id",
    "service_missing",
  );
  if (intentKey.ok) return intentKey;

  const intentLabel = input.intent.service_id?.trim() || null;
  if (intentLabel) {
    return resolveByExactLabel(
      input.services,
      intentLabel,
      (service) => service.service_id,
      (service) => service.name,
      "service_missing",
      "service_ambiguous",
    );
  }

  return { ok: false, reason: "service_missing" };
}

function resolveResourceId(input: BookingWriteRequestAssemblerInput): ResolveOk<string> | ResolveFail {
  const callerKey = resolveByStableKey(
    input.resources,
    input.resource_id,
    "resource_id",
    "employee_missing",
  );
  if (callerKey.ok) return callerKey;

  return resolveByExactLabel(
    input.resources,
    input.intent.resource_name,
    (resource) => resource.resource_id,
    (resource) => resource.display_name,
    "employee_missing",
    "employee_ambiguous",
  );
}

function resolveSlot(
  slots: readonly AvailabilitySlot[],
  serviceId: string,
  resourceId: string,
  slotStartAt: string | null | undefined,
  rejectDateHintOnly: boolean,
): ResolveOk<AvailabilitySlot> | ResolveFail {
  if (rejectDateHintOnly) return { ok: false, reason: "slot_missing" };

  const startAt = slotStartAt?.trim();
  if (!startAt) return { ok: false, reason: "slot_missing" };

  const matches = slots.filter(
    (slot) =>
      slot.start_at === startAt &&
      slot.resource_id === resourceId &&
      slot.service_id === serviceId &&
      Boolean(slot.timezone?.trim()),
  );

  if (matches.length === 0) return { ok: false, reason: "slot_missing" };
  if (matches.length > 1) return { ok: false, reason: "slot_ambiguous" };
  return { ok: true, value: matches[0]! };
}

function resolveBookingId(input: BookingWriteRequestAssemblerInput): ResolveOk<string> | ResolveFail {
  const fromIntent = input.intent.booking_id?.trim() || null;
  const fromExisting = input.existing_booking?.booking_id?.trim() || null;

  if (fromIntent && fromExisting && fromIntent !== fromExisting) {
    return { ok: false, reason: "booking_id_missing" };
  }

  const bookingId = fromIntent ?? fromExisting;
  return bookingId ? { ok: true, value: bookingId } : { ok: false, reason: "booking_id_missing" };
}

function slotEndAt(serviceId: string, slot: AvailabilitySlot): string | null {
  return slot.service_id === serviceId ? slot.end_at?.trim() || null : null;
}

function assembleResult(
  partial: Omit<BookingWriteRequest, "idempotency_key">,
): Extract<BookingWriteRequestAssemblyResult, { status: "assembled" }> {
  const draft: BookingWriteRequest = { ...partial, idempotency_key: null };
  const payload = buildBookingApprovalCanonicalPayload(draft);
  const payload_hash = computeBookingApprovalPayloadHash(payload);
  const idempotency_key = buildBookingWriteIdempotencyKey(partial.capability_key, payload_hash);
  return {
    status: "assembled",
    request: { ...draft, idempotency_key },
    payload_hash,
    idempotency_key,
  };
}

function assembleCreate(input: BookingWriteRequestAssemblerInput): BookingWriteRequestAssemblyResult {
  const service = resolveServiceId(input);
  if (!service.ok) return needsClarification([service.reason]);

  const resource = resolveResourceId(input);
  if (!resource.ok) return needsClarification([resource.reason]);

  const slot = resolveSlot(
    input.availability_slots,
    service.value,
    resource.value,
    input.slot_start_at,
    Boolean(input.intent.date_hint?.trim()) && !input.slot_start_at?.trim(),
  );
  if (!slot.ok) return needsClarification([slot.reason]);

  return assembleResult({
    capability_key: "booking.create",
    service_id: service.value,
    resource_id: resource.value,
    customer_reference: input.customer_reference?.trim() || null,
    booking_id: null,
    start_at: slot.value.start_at,
    end_at: slotEndAt(service.value, slot.value),
    confirmed: input.confirmed,
    action_request_id: null,
  });
}

function assembleCancel(input: BookingWriteRequestAssemblerInput): BookingWriteRequestAssemblyResult {
  const booking = resolveBookingId(input);
  if (!booking.ok) return needsClarification([booking.reason]);

  return assembleResult({
    capability_key: "booking.cancel",
    service_id: null,
    resource_id: null,
    customer_reference: input.customer_reference?.trim() || null,
    booking_id: booking.value,
    start_at: null,
    end_at: null,
    confirmed: input.confirmed,
    action_request_id: null,
  });
}

function assembleUpdate(input: BookingWriteRequestAssemblerInput): BookingWriteRequestAssemblyResult {
  const booking = resolveBookingId(input);
  if (!booking.ok) return needsClarification([booking.reason]);

  const existing = input.existing_booking;
  if (!existing || existing.booking_id !== booking.value) {
    return needsClarification(["booking_id_missing"]);
  }

  const reasons: BookingWriteClarificationReason[] = [];
  let nextServiceId = existing.service_id;
  let nextResourceId = existing.resource_id;
  let nextStartAt = existing.start_at;
  let nextEndAt = existing.end_at;

  if (input.service_id?.trim() || input.intent.service_id?.trim()) {
    const service = resolveServiceId(input);
    if (!service.ok) reasons.push(service.reason);
    else nextServiceId = service.value;
  }

  if (input.resource_id?.trim() || input.intent.resource_name?.trim()) {
    const resource = resolveResourceId(input);
    if (!resource.ok) reasons.push(resource.reason);
    else nextResourceId = resource.value;
  }

  if (input.slot_start_at?.trim()) {
    if (!nextServiceId || !nextResourceId) {
      reasons.push("slot_missing");
    } else {
      const slot = resolveSlot(
        input.availability_slots,
        nextServiceId,
        nextResourceId,
        input.slot_start_at,
        false,
      );
      if (!slot.ok) reasons.push(slot.reason);
      else {
        nextStartAt = slot.value.start_at;
        nextEndAt = slotEndAt(nextServiceId, slot.value);
      }
    }
  }

  if (reasons.length > 0) return needsClarification(reasons);

  if (
    nextServiceId === existing.service_id &&
    nextResourceId === existing.resource_id &&
    nextStartAt === existing.start_at &&
    nextEndAt === existing.end_at
  ) {
    return needsClarification(["no_update_changes"]);
  }

  return assembleResult({
    capability_key: "booking.update",
    service_id: nextServiceId,
    resource_id: nextResourceId,
    customer_reference: input.customer_reference?.trim() || null,
    booking_id: booking.value,
    start_at: nextStartAt,
    end_at: nextEndAt,
    confirmed: input.confirmed,
    action_request_id: null,
  });
}

export function assembleBookingWriteRequest(
  input: BookingWriteRequestAssemblerInput,
): BookingWriteRequestAssemblyResult {
  const capability = input.intent.capability_key;
  if (!(WRITE_CAPABILITIES as readonly string[]).includes(capability)) {
    return { status: "unsupported" };
  }

  switch (capability as WriteCapabilityKey) {
    case "booking.create":
      return assembleCreate(input);
    case "booking.cancel":
      return assembleCancel(input);
    case "booking.update":
      return assembleUpdate(input);
    default:
      return { status: "unsupported" };
  }
}
