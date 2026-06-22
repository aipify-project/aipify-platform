import type {
  NormalizedSlaStatus,
  NormalizedSupportStatus,
  SupportReadOutcome,
  SupportWriteOutcome,
} from "./types";

export const SUPPORT_READ_OUTCOME_I18N_KEYS: Record<SupportReadOutcome, string> = {
  exact_match: "customerApp.companionPlatformKnowledge.support.outcomes.exactMatch",
  multiple_matches: "customerApp.companionPlatformKnowledge.support.outcomes.multipleMatches",
  no_match: "customerApp.companionPlatformKnowledge.support.outcomes.noMatch",
  permission_denied: "customerApp.companionPlatformKnowledge.support.outcomes.permissionDenied",
  provider_missing: "customerApp.companionPlatformKnowledge.support.outcomes.providerMissing",
  source_missing: "customerApp.companionPlatformKnowledge.support.outcomes.sourceMissing",
  activation_pending: "customerApp.companionPlatformKnowledge.support.outcomes.activationPending",
  partial_result: "customerApp.companionPlatformKnowledge.support.outcomes.partialResult",
  empty_queue: "customerApp.companionPlatformKnowledge.support.outcomes.emptyQueue",
};

export const SUPPORT_WRITE_OUTCOME_I18N_KEYS: Record<SupportWriteOutcome, string> = {
  draft_created: "customerApp.companionPlatformKnowledge.support.outcomes.draftCreated",
  confirmation_required: "customerApp.companionPlatformKnowledge.support.outcomes.confirmationRequired",
  execution_source_missing: "customerApp.companionPlatformKnowledge.support.outcomes.executionSourceMissing",
  approval_required: "customerApp.companionPlatformKnowledge.support.outcomes.approvalRequired",
  executed: "customerApp.companionPlatformKnowledge.support.outcomes.executed",
  failed: "customerApp.companionPlatformKnowledge.support.outcomes.failed",
  blocked_by_policy: "customerApp.companionPlatformKnowledge.support.outcomes.blockedByPolicy",
  permission_denied: "customerApp.companionPlatformKnowledge.support.outcomes.permissionDenied",
  provider_missing: "customerApp.companionPlatformKnowledge.support.outcomes.providerMissing",
  activation_pending: "customerApp.companionPlatformKnowledge.support.outcomes.activationPending",
};

export const SUPPORT_STATUS_I18N_KEYS: Record<NormalizedSupportStatus, string> = {
  new: "customerApp.companionPlatformKnowledge.support.status.new",
  open: "customerApp.companionPlatformKnowledge.support.status.open",
  assigned: "customerApp.companionPlatformKnowledge.support.status.assigned",
  in_progress: "customerApp.companionPlatformKnowledge.support.status.inProgress",
  waiting_for_customer: "customerApp.companionPlatformKnowledge.support.status.waitingForCustomer",
  waiting_for_support: "customerApp.companionPlatformKnowledge.support.status.waitingForSupport",
  escalated: "customerApp.companionPlatformKnowledge.support.status.escalated",
  resolved: "customerApp.companionPlatformKnowledge.support.status.resolved",
  closed: "customerApp.companionPlatformKnowledge.support.status.closed",
  reopened: "customerApp.companionPlatformKnowledge.support.status.reopened",
  cancelled: "customerApp.companionPlatformKnowledge.support.status.cancelled",
};

export const SUPPORT_SLA_STATUS_I18N_KEYS: Record<NormalizedSlaStatus, string> = {
  on_track: "customerApp.companionPlatformKnowledge.support.sla.onTrack",
  warning: "customerApp.companionPlatformKnowledge.support.sla.warning",
  at_risk: "customerApp.companionPlatformKnowledge.support.sla.atRisk",
  breached: "customerApp.companionPlatformKnowledge.support.sla.breached",
  unavailable: "customerApp.companionPlatformKnowledge.support.sla.unavailable",
};

export function supportReadOutcomeKey(outcome: SupportReadOutcome): string {
  return SUPPORT_READ_OUTCOME_I18N_KEYS[outcome];
}

export function supportWriteOutcomeKey(outcome: SupportWriteOutcome): string {
  return SUPPORT_WRITE_OUTCOME_I18N_KEYS[outcome];
}
