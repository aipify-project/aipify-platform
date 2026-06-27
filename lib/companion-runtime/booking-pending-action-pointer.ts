import type { CompanionChatMessage } from "@/lib/app/companion/types";
import type { BookingWriteClarificationReason } from "@/lib/companion-runtime/booking-write-request-assembler";

export const BOOKING_CLARIFICATION_TTL_MS = 30 * 60 * 1000;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

const CLARIFICATION_REASONS = new Set<BookingWriteClarificationReason>([
  "service_missing",
  "service_ambiguous",
  "employee_missing",
  "employee_ambiguous",
  "slot_missing",
  "slot_ambiguous",
  "booking_id_missing",
  "no_update_changes",
]);

export type PendingBookingClarificationState = {
  clarificationId: string;
  capabilityKey: "booking.create";
  organizationId: string;
  conversationId: string;
  customerReference?: string | null;
  serviceLabel?: string | null;
  resourceName?: string | null;
  dateHint?: string | null;
  slotStartAt?: string | null;
  missingFields: readonly BookingWriteClarificationReason[];
  expiresAt: string;
};

export type PendingBookingClarificationWire = {
  clarification_id: string;
  capability_key: "booking.create";
  organization_id: string;
  conversation_id: string;
  customer_reference?: string | null;
  service_label?: string | null;
  resource_name?: string | null;
  date_hint?: string | null;
  slot_start_at?: string | null;
  missing_fields: readonly BookingWriteClarificationReason[];
  expires_at: string;
};

function normalizeUuid(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }
  return trimmed;
}

function normalizeActionRequestId(value: unknown): string | null {
  return normalizeUuid(value);
}

function normalizeOptionalString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeMissingFields(value: unknown): BookingWriteClarificationReason[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is BookingWriteClarificationReason =>
      typeof entry === "string" && CLARIFICATION_REASONS.has(entry as BookingWriteClarificationReason),
  );
}

export function serializePendingBookingClarification(
  state: PendingBookingClarificationState,
): PendingBookingClarificationWire {
  return {
    clarification_id: state.clarificationId,
    capability_key: state.capabilityKey,
    organization_id: state.organizationId,
    conversation_id: state.conversationId,
    customer_reference: state.customerReference ?? null,
    service_label: state.serviceLabel ?? null,
    resource_name: state.resourceName ?? null,
    date_hint: state.dateHint ?? null,
    slot_start_at: state.slotStartAt ?? null,
    missing_fields: [...state.missingFields],
    expires_at: state.expiresAt,
  };
}

export function normalizePendingBookingClarification(
  value: unknown,
): PendingBookingClarificationState | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const row = value as Record<string, unknown>;
  const clarificationId = normalizeUuid(row.clarification_id);
  const organizationId = normalizeOptionalString(row.organization_id);
  const conversationId = normalizeOptionalString(row.conversation_id);
  const expiresAt = normalizeOptionalString(row.expires_at);
  const capabilityKey = row.capability_key;

  if (
    !clarificationId ||
    !organizationId ||
    !conversationId ||
    !expiresAt ||
    capabilityKey !== "booking.create"
  ) {
    return null;
  }

  return {
    clarificationId,
    capabilityKey: "booking.create",
    organizationId,
    conversationId,
    customerReference: normalizeOptionalString(row.customer_reference),
    serviceLabel: normalizeOptionalString(row.service_label),
    resourceName: normalizeOptionalString(row.resource_name),
    dateHint: normalizeOptionalString(row.date_hint),
    slotStartAt: normalizeOptionalString(row.slot_start_at),
    missingFields: normalizeMissingFields(row.missing_fields),
    expiresAt,
  };
}

/** Accepts wire (snake_case) or platform answer (camelCase) shapes; fail-closed on invalid input. */
export function coercePendingBookingClarification(
  value: unknown,
): PendingBookingClarificationState | null {
  const wire = normalizePendingBookingClarification(value);
  if (wire) {
    return wire;
  }
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const row = value as Record<string, unknown>;
  return normalizePendingBookingClarification({
    clarification_id: row.clarificationId,
    capability_key: row.capabilityKey,
    organization_id: row.organizationId,
    conversation_id: row.conversationId,
    customer_reference: row.customerReference,
    service_label: row.serviceLabel,
    resource_name: row.resourceName,
    date_hint: row.dateHint,
    slot_start_at: row.slotStartAt,
    missing_fields: row.missingFields,
    expires_at: row.expiresAt,
  });
}

/**
 * Resolves the pending booking write pointer from the current conversation.
 * Inspects only the newest assistant message — never older assistants or message text.
 */
export function resolvePendingBookingWritePointer(
  messages: readonly CompanionChatMessage[],
): { actionRequestId: string } | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "aipify") {
      continue;
    }

    const actionRequestId = normalizeActionRequestId(message.pendingBookingWrite?.actionRequestId);
    return actionRequestId ? { actionRequestId } : null;
  }

  return null;
}

/**
 * Resolves pending booking clarification from the newest assistant message only.
 */
export function resolvePendingBookingClarificationPointer(
  messages: readonly CompanionChatMessage[],
): PendingBookingClarificationState | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "aipify") {
      continue;
    }

    return message.pendingBookingClarification ?? null;
  }

  return null;
}

export function validatePendingBookingClarification(input: {
  state: PendingBookingClarificationState;
  conversationId: string;
  organizationId: string;
  now?: Date;
}): PendingBookingClarificationState | null {
  const nowMs = (input.now ?? new Date()).getTime();
  const expiresMs = Date.parse(input.state.expiresAt);
  if (!Number.isFinite(expiresMs) || expiresMs <= nowMs) {
    return null;
  }

  if (input.state.conversationId.trim() !== input.conversationId.trim()) {
    return null;
  }

  if (input.state.organizationId.trim() !== input.organizationId.trim()) {
    return null;
  }

  if (input.state.capabilityKey !== "booking.create") {
    return null;
  }

  return input.state;
}

export function isExpiredPendingBookingClarification(
  state: PendingBookingClarificationState,
  now: Date = new Date(),
): boolean {
  const expiresMs = Date.parse(state.expiresAt);
  return !Number.isFinite(expiresMs) || expiresMs <= now.getTime();
}

export function buildPendingBookingClarificationState(input: {
  organizationId: string;
  conversationId: string;
  customerReference?: string | null;
  serviceLabel?: string | null;
  resourceName?: string | null;
  dateHint?: string | null;
  slotStartAt?: string | null;
  missingFields: readonly BookingWriteClarificationReason[];
  now?: Date;
  clarificationId?: string;
}): PendingBookingClarificationState {
  const now = input.now ?? new Date();
  return {
    clarificationId: input.clarificationId ?? crypto.randomUUID(),
    capabilityKey: "booking.create",
    organizationId: input.organizationId.trim(),
    conversationId: input.conversationId.trim(),
    customerReference: input.customerReference?.trim() || null,
    serviceLabel: input.serviceLabel?.trim() || null,
    resourceName: input.resourceName?.trim() || null,
    dateHint: input.dateHint?.trim() || null,
    slotStartAt: input.slotStartAt?.trim() || null,
    missingFields: [...new Set(input.missingFields)],
    expiresAt: new Date(now.getTime() + BOOKING_CLARIFICATION_TTL_MS).toISOString(),
  };
}
