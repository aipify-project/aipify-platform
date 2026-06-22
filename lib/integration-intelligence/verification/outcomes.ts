import type { VerificationReadOutcome } from "./types";

export const VERIFICATION_OUTCOME_I18N_KEYS: Record<VerificationReadOutcome, string> = {
  exact_match: "customerApp.companionPlatformKnowledge.verification.outcomes.exactMatch",
  multiple_matches: "customerApp.companionPlatformKnowledge.verification.outcomes.multipleMatches",
  no_match: "customerApp.companionPlatformKnowledge.verification.outcomes.noMatch",
  permission_denied: "customerApp.companionPlatformKnowledge.verification.outcomes.permissionDenied",
  provider_missing: "customerApp.companionPlatformKnowledge.verification.outcomes.providerMissing",
  source_missing: "customerApp.companionPlatformKnowledge.verification.outcomes.sourceMissing",
  activation_pending: "customerApp.companionPlatformKnowledge.verification.outcomes.activationPending",
  partial_result: "customerApp.companionPlatformKnowledge.verification.outcomes.partialResult",
  empty_queue: "customerApp.companionPlatformKnowledge.verification.outcomes.emptyQueue",
};

export function verificationOutcomeKey(outcome: VerificationReadOutcome): string {
  return VERIFICATION_OUTCOME_I18N_KEYS[outcome];
}
