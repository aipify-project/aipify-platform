export type SupportProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type SupportCapabilityOperation = "read" | "write";

export type SupportCapabilityKey =
  | "support_queue.read"
  | "support_case.read"
  | "support_case_status.read"
  | "support_assignment.read"
  | "support_sla.read"
  | "support_escalation.read"
  | "support_metrics.read"
  | "support_response.draft"
  | "support_task.create"
  | "support_case.assign"
  | "support_case.escalate"
  | "support_case.search"
  | "support_case.create"
  | "support_case.update"
  | "conversation.read"
  | "response.draft"
  | "escalation.create"
  | "sla.read"
  | "customer_context.read"
  | "support_insight.read";

/** Blocked in Companion runtime — never expose as enabled capabilities. */
export const SUPPORT_BLOCKED_CAPABILITY_KEYS = [
  "response.send",
  "support_response.send",
  "support_case.close",
  "support_case.delete",
  "account.change",
  "customer_data.export",
] as const;

export type SupportBlockedCapabilityKey = (typeof SUPPORT_BLOCKED_CAPABILITY_KEYS)[number];

export type NormalizedSupportStatus =
  | "new"
  | "open"
  | "assigned"
  | "in_progress"
  | "waiting_for_customer"
  | "waiting_for_support"
  | "escalated"
  | "resolved"
  | "closed"
  | "reopened"
  | "cancelled";

export type NormalizedSlaStatus =
  | "on_track"
  | "warning"
  | "at_risk"
  | "breached"
  | "unavailable";

export type SupportFreshness = "fresh" | "stale" | "unknown";
export type SupportCompleteness = "complete" | "partial" | "empty";

export type SupportReadiness =
  | "production_ready_candidate"
  | "connected"
  | "connected_but_partial"
  | "source_missing"
  | "adapter_missing"
  | "specification_only"
  | "disabled"
  | "blocked_by_governance";

export type SupportQueueSummary = {
  total_open: number;
  unassigned: number;
  urgent: number;
  overdue: number;
  sla_at_risk: number;
  waiting_for_customer: number;
  waiting_for_support: number;
  oldest_open_at: string | null;
  generated_at: string;
  source_reference: string;
  freshness: SupportFreshness;
  completeness: SupportCompleteness;
};

export type SupportCaseSummary = {
  case_id: string;
  subject: string;
  category: string | null;
  priority: "low" | "normal" | "high" | "urgent" | null;
  status: NormalizedSupportStatus;
  customer_reference: string;
  assigned_role: string | null;
  assigned_user_reference: string | null;
  created_at: string | null;
  updated_at: string | null;
  first_response_due_at: string | null;
  resolution_due_at: string | null;
  sla_status: NormalizedSlaStatus;
  escalation_status: "none" | "required" | "escalated";
  source_reference: string;
  freshness: SupportFreshness;
  completeness: SupportCompleteness;
  warnings: readonly string[];
};

export type SupportCaseDetail = {
  case_summary: SupportCaseSummary;
  latest_public_message_summary: string | null;
  internal_status_summary: string | null;
  related_customer_reference: string | null;
  related_organization_reference: string | null;
  suggested_knowledge_sources: readonly string[];
  available_actions: readonly string[];
};

export type SupportReadOutcome =
  | "exact_match"
  | "multiple_matches"
  | "no_match"
  | "permission_denied"
  | "provider_missing"
  | "source_missing"
  | "activation_pending"
  | "partial_result"
  | "empty_queue";

export type SupportWriteOutcome =
  | "draft_created"
  | "confirmation_required"
  | "execution_source_missing"
  | "approval_required"
  | "executed"
  | "failed"
  | "blocked_by_policy"
  | "permission_denied"
  | "provider_missing"
  | "activation_pending";

export type SupportQueueReadResult = {
  outcome: SupportReadOutcome;
  queue: SupportQueueSummary | null;
  cases: readonly SupportCaseSummary[];
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
};

export type SupportCaseReadResult = {
  outcome: SupportReadOutcome;
  case_detail: SupportCaseDetail | null;
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
};

export type SupportWriteProposal = {
  proposal_id: string;
  capability_key: Extract<
    SupportCapabilityKey,
    "support_response.draft" | "support_case.assign" | "support_case.escalate"
  >;
  case_id: string;
  draft_text: string | null;
  assignee_reference: string | null;
  escalation_reason: string | null;
  requires_confirmation: true;
  requires_approval: boolean;
  grounded_sources: readonly string[];
  limitations: readonly string[];
};

export type SupportWriteResult = {
  outcome: SupportWriteOutcome;
  proposal: SupportWriteProposal | null;
  case_id: string | null;
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
};

export type SupportCapabilityManifest = {
  capability_key: SupportCapabilityKey;
  operation: SupportCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type SupportProviderSourceEngine =
  | "support_ai_engine"
  | "autonomous_support_operations"
  | "self_support_engine"
  | "app_portal_support"
  | "proactive_organization_support"
  | "business_dna_knowledge"
  | "support_adapter";

export type SupportProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: SupportProviderSourceEngine;
  implementation_status: SupportProviderImplementationStatus;
  capabilities: readonly SupportCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export function buildSupportCapabilityId(
  providerKey: string,
  capabilityKey: SupportCapabilityKey,
  operation: SupportCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isSupportCapabilityBlocked(capabilityKey: string): boolean {
  return (SUPPORT_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

export function isSupportWriteCapabilityBlocked(capabilityKey: string): boolean {
  return isSupportCapabilityBlocked(capabilityKey);
}
