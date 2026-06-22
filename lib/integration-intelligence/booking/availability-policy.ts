import type { AvailabilitySlot, BookingSummary, NormalizedBookingStatus } from "./types";
import { normalizeBookingStatus } from "./status-normalization";

export type BookingAvailabilityPolicy = {
  prevent_double_booking: boolean;
  overbooking_allowed: boolean;
  slot_hold_minutes: number | null;
  default_buffer_minutes: number | null;
  vacation_mode_integration_enabled: boolean;
  timezone: string;
};

export type AvailabilityEvaluation = {
  slots: readonly AvailabilitySlot[];
  conflicts: readonly string[];
  limitations: readonly string[];
  source_exact: boolean;
};

function overlaps(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && startB < endA;
}

function parseTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Evaluate availability from provider-supplied metadata only — never invent slots. */
export function evaluateAvailabilityFromSource(input: {
  policy: BookingAvailabilityPolicy;
  existing_bookings: readonly BookingSummary[];
  reported_slots: readonly AvailabilitySlot[];
  absences_blocked_resource_ids?: readonly string[];
  vacation_blocked_resource_ids?: readonly string[];
}): AvailabilityEvaluation {
  const limitations: string[] = [];
  const conflicts: string[] = [];
  const absences = new Set(input.absences_blocked_resource_ids ?? []);
  const vacations = new Set(input.vacation_blocked_resource_ids ?? []);

  if (input.reported_slots.length === 0) {
    limitations.push(
      "customerApp.companionPlatformKnowledge.booking.warnings.noReportedSlots",
    );
  }

  const activeBookings = input.existing_bookings.filter((booking) => {
    const status = normalizeBookingStatus(booking.status);
    return !(["cancelled", "completed", "no_show"] as NormalizedBookingStatus[]).includes(status);
  });

  const slots = input.reported_slots.filter((slot) => {
    if (absences.has(slot.resource_id) || vacations.has(slot.resource_id)) {
      limitations.push(
        "customerApp.companionPlatformKnowledge.booking.warnings.resourceUnavailable",
      );
      return false;
    }

    const slotStart = parseTime(slot.start_at);
    const slotEnd = parseTime(slot.end_at);
    if (slotStart === null || slotEnd === null) {
      limitations.push(
        "customerApp.companionPlatformKnowledge.booking.warnings.invalidSlotTimestamp",
      );
      return false;
    }

    if (!input.policy.prevent_double_booking) {
      return slot.availability_status === "available";
    }

    for (const booking of activeBookings) {
      if (booking.resource_id && booking.resource_id !== slot.resource_id) continue;
      const bookingStart = parseTime(booking.start_at);
      const bookingEnd = parseTime(booking.end_at);
      if (bookingStart === null || bookingEnd === null) continue;
      if (overlaps(slotStart, slotEnd, bookingStart, bookingEnd)) {
        conflicts.push(booking.booking_id);
        return false;
      }
    }

    return slot.availability_status === "available";
  });

  if (input.policy.prevent_double_booking && conflicts.length > 0) {
    limitations.push(
      "customerApp.companionPlatformKnowledge.booking.warnings.doubleBookingPrevented",
    );
  }

  return {
    slots,
    conflicts,
    limitations,
    source_exact: input.reported_slots.length > 0 && slots.length > 0,
  };
}

export function defaultBookingAvailabilityPolicy(
  overrides?: Partial<BookingAvailabilityPolicy>,
): BookingAvailabilityPolicy {
  return {
    prevent_double_booking: true,
    overbooking_allowed: false,
    slot_hold_minutes: null,
    default_buffer_minutes: null,
    vacation_mode_integration_enabled: false,
    timezone: "UTC",
    ...overrides,
  };
}
