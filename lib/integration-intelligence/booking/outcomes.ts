import type { BookingReadOutcome, BookingWriteOutcome } from "./types";

export const BOOKING_READ_OUTCOME_I18N_KEYS: Record<BookingReadOutcome, string> = {
  exact_match: "customerApp.companionPlatformKnowledge.booking.outcomes.exactMatch",
  multiple_matches: "customerApp.companionPlatformKnowledge.booking.outcomes.multipleMatches",
  no_match: "customerApp.companionPlatformKnowledge.booking.outcomes.noMatch",
  permission_denied: "customerApp.companionPlatformKnowledge.booking.outcomes.permissionDenied",
  provider_missing: "customerApp.companionPlatformKnowledge.booking.outcomes.providerMissing",
  source_missing: "customerApp.companionPlatformKnowledge.booking.outcomes.sourceMissing",
  activation_pending: "customerApp.companionPlatformKnowledge.booking.outcomes.activationPending",
  partial_result: "customerApp.companionPlatformKnowledge.booking.outcomes.partialResult",
  no_availability: "customerApp.companionPlatformKnowledge.booking.outcomes.noAvailability",
  conflict_detected: "customerApp.companionPlatformKnowledge.booking.outcomes.conflictDetected",
  clarification_required: "customerApp.companionPlatformKnowledge.booking.outcomes.clarificationRequired",
};

export const BOOKING_WRITE_OUTCOME_I18N_KEYS: Record<BookingWriteOutcome, string> = {
  proposal_created: "customerApp.companionPlatformKnowledge.booking.outcomes.proposalCreated",
  confirmation_required: "customerApp.companionPlatformKnowledge.booking.outcomes.confirmationRequired",
  execution_source_missing: "customerApp.companionPlatformKnowledge.booking.outcomes.executionSourceMissing",
  approval_required: "customerApp.companionPlatformKnowledge.booking.outcomes.approvalRequired",
  executed: "customerApp.companionPlatformKnowledge.booking.outcomes.executed",
  failed: "customerApp.companionPlatformKnowledge.booking.outcomes.failed",
  blocked_by_policy: "customerApp.companionPlatformKnowledge.booking.outcomes.blockedByPolicy",
  permission_denied: "customerApp.companionPlatformKnowledge.booking.outcomes.permissionDenied",
  provider_missing: "customerApp.companionPlatformKnowledge.booking.outcomes.providerMissing",
  activation_pending: "customerApp.companionPlatformKnowledge.booking.outcomes.activationPending",
  conflict_detected: "customerApp.companionPlatformKnowledge.booking.outcomes.conflictDetected",
  availability_changed: "customerApp.companionPlatformKnowledge.booking.outcomes.availabilityChanged",
};

export function bookingReadOutcomeKey(outcome: BookingReadOutcome): string {
  return BOOKING_READ_OUTCOME_I18N_KEYS[outcome];
}

export function bookingWriteOutcomeKey(outcome: BookingWriteOutcome): string {
  return BOOKING_WRITE_OUTCOME_I18N_KEYS[outcome];
}
