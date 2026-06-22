import type { DirectorySearchOutcome } from "./types";

export const DIRECTORY_OUTCOME_I18N_KEYS: Record<DirectorySearchOutcome, string> = {
  exact_match: "customerApp.companionPlatformKnowledge.directory.outcomes.exactMatch",
  multiple_matches: "customerApp.companionPlatformKnowledge.directory.outcomes.multipleMatches",
  no_match: "customerApp.companionPlatformKnowledge.directory.outcomes.noMatch",
  permission_denied: "customerApp.companionPlatformKnowledge.directory.outcomes.permissionDenied",
  provider_missing: "customerApp.companionPlatformKnowledge.directory.outcomes.providerMissing",
  unsupported_search_field: "customerApp.companionPlatformKnowledge.directory.outcomes.unsupportedSearchField",
  activation_pending: "customerApp.companionPlatformKnowledge.directory.outcomes.activationPending",
  partial_result: "customerApp.companionPlatformKnowledge.directory.outcomes.partialResult",
  ambiguous_query: "customerApp.companionPlatformKnowledge.directory.outcomes.ambiguousQuery",
};

export function directoryOutcomeKey(outcome: DirectorySearchOutcome): string {
  return DIRECTORY_OUTCOME_I18N_KEYS[outcome];
}

export function isHonestDirectoryOutcome(outcome: DirectorySearchOutcome): boolean {
  return outcome in DIRECTORY_OUTCOME_I18N_KEYS;
}
