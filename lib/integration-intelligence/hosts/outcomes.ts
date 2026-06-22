import type {
  HostsReadOutcome,
  HostsWriteOutcome,
  NormalizedPropertyStatus,
  NormalizedReservationStatus,
} from "./types";

export const HOSTS_READ_OUTCOME_I18N_KEYS: Record<HostsReadOutcome, string> = {
  exact_match: "customerApp.companionPlatformKnowledge.hosts.outcomes.exactMatch",
  multiple_matches: "customerApp.companionPlatformKnowledge.hosts.outcomes.multipleMatches",
  no_match: "customerApp.companionPlatformKnowledge.hosts.outcomes.noMatch",
  permission_denied: "customerApp.companionPlatformKnowledge.hosts.outcomes.permissionDenied",
  provider_missing: "customerApp.companionPlatformKnowledge.hosts.outcomes.providerMissing",
  source_missing: "customerApp.companionPlatformKnowledge.hosts.outcomes.sourceMissing",
  activation_pending: "customerApp.companionPlatformKnowledge.hosts.outcomes.activationPending",
  partial_result: "customerApp.companionPlatformKnowledge.hosts.outcomes.partialResult",
  empty_portfolio: "customerApp.companionPlatformKnowledge.hosts.outcomes.emptyPortfolio",
};

export const HOSTS_WRITE_OUTCOME_I18N_KEYS: Record<HostsWriteOutcome, string> = {
  draft_created: "customerApp.companionPlatformKnowledge.hosts.outcomes.draftCreated",
  confirmation_required: "customerApp.companionPlatformKnowledge.hosts.outcomes.confirmationRequired",
  execution_source_missing: "customerApp.companionPlatformKnowledge.hosts.outcomes.executionSourceMissing",
  approval_required: "customerApp.companionPlatformKnowledge.hosts.outcomes.approvalRequired",
  executed: "customerApp.companionPlatformKnowledge.hosts.outcomes.executed",
  failed: "customerApp.companionPlatformKnowledge.hosts.outcomes.failed",
  blocked_by_policy: "customerApp.companionPlatformKnowledge.hosts.outcomes.blockedByPolicy",
  permission_denied: "customerApp.companionPlatformKnowledge.hosts.outcomes.permissionDenied",
  provider_missing: "customerApp.companionPlatformKnowledge.hosts.outcomes.providerMissing",
  activation_pending: "customerApp.companionPlatformKnowledge.hosts.outcomes.activationPending",
};

export const HOSTS_RESERVATION_STATUS_I18N_KEYS: Record<NormalizedReservationStatus, string> = {
  inquiry: "customerApp.companionPlatformKnowledge.hosts.reservationStatus.inquiry",
  pending: "customerApp.companionPlatformKnowledge.hosts.reservationStatus.pending",
  confirmed: "customerApp.companionPlatformKnowledge.hosts.reservationStatus.confirmed",
  checked_in: "customerApp.companionPlatformKnowledge.hosts.reservationStatus.checkedIn",
  checked_out: "customerApp.companionPlatformKnowledge.hosts.reservationStatus.checkedOut",
  cancelled: "customerApp.companionPlatformKnowledge.hosts.reservationStatus.cancelled",
};

export const HOSTS_PROPERTY_STATUS_I18N_KEYS: Record<NormalizedPropertyStatus, string> = {
  active: "customerApp.companionPlatformKnowledge.hosts.propertyStatus.active",
  inactive: "customerApp.companionPlatformKnowledge.hosts.propertyStatus.inactive",
  maintenance: "customerApp.companionPlatformKnowledge.hosts.propertyStatus.maintenance",
  archived: "customerApp.companionPlatformKnowledge.hosts.propertyStatus.archived",
};

export function hostsReadOutcomeKey(outcome: HostsReadOutcome): string {
  return HOSTS_READ_OUTCOME_I18N_KEYS[outcome];
}

export function hostsWriteOutcomeKey(outcome: HostsWriteOutcome): string {
  return HOSTS_WRITE_OUTCOME_I18N_KEYS[outcome];
}
