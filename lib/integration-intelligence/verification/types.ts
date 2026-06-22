import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { DirectoryRelationshipType } from "@/lib/integration-intelligence/directory/relationship-types";

export type VerificationCapabilityKey =
  | "verification_queue.read"
  | "verification_case.read"
  | "verification_status.read"
  | "verification.request"
  | "verification_review.create";

export type VerificationCapabilityOperation = "read" | "write";

export type NormalizedVerificationStatus =
  | "pending"
  | "in_review"
  | "needs_information"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelled";

export type VerificationReadiness =
  | "production_ready"
  | "production_ready_candidate"
  | "connected"
  | "connected_but_partial"
  | "source_missing"
  | "adapter_missing"
  | "disabled"
  | "blocked_by_governance";

export type VerificationFreshness = "fresh" | "stale" | "unknown";
export type VerificationCompleteness = "complete" | "partial" | "empty";

export type VerificationSourceReference = {
  source_provider: string;
  source_reference: string;
  fetched_at: string | null;
};

export type VerificationQueueSummary = {
  total_pending: number;
  needs_information: number;
  in_review: number;
  high_priority: number;
  oldest_pending_at: string | null;
  generated_at: string;
  source_reference: string;
  freshness: VerificationFreshness;
  completeness: VerificationCompleteness;
  permission_scope: VerificationPermissionScope;
};

export type VerificationCaseSummary = {
  case_id: string;
  subject_reference: string;
  relationship_type: DirectoryRelationshipType;
  status: NormalizedVerificationStatus;
  priority: "low" | "normal" | "high" | null;
  created_at: string | null;
  updated_at: string | null;
  assigned_role: string | null;
  missing_requirements: readonly string[];
  source_reference: string;
  freshness: VerificationFreshness;
  completeness: VerificationCompleteness;
  permission_scope: VerificationPermissionScope;
};

export type VerificationReadOutcome =
  | "exact_match"
  | "multiple_matches"
  | "no_match"
  | "permission_denied"
  | "provider_missing"
  | "source_missing"
  | "activation_pending"
  | "partial_result"
  | "empty_queue";

export type VerificationPermissionScope = "queue" | "case" | "sensitive";

export type VerificationQueueReadResult = {
  outcome: VerificationReadOutcome;
  queue: VerificationQueueSummary | null;
  cases: readonly VerificationCaseSummary[];
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
};

export type VerificationCaseReadResult = {
  outcome: VerificationReadOutcome;
  case_summary: VerificationCaseSummary | null;
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
};

export type VerificationCapabilityManifest = {
  capability_key: VerificationCapabilityKey;
  operation: VerificationCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3 | 4;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
  semantic?: {
    domain: "verification";
    entity: string;
    metrics?: readonly string[];
    operations?: readonly ("count" | "list" | "status" | "inspect" | "read")[];
    time_scopes?: readonly ("current" | "historical")[];
    entity_aliases?: Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;
    search_field_aliases?: Partial<Record<string, readonly string[]>>;
  };
};

export type VerificationProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: string;
  implementation_status: "connected" | "partial" | "specification_only" | "placeholder";
  business_pack_key: string | null;
  capabilities: readonly VerificationCapabilityManifest[];
};

export const VERIFICATION_BLOCKED_CAPABILITY_KEYS = [
  "verification.auto_approve",
  "verification.auto_reject",
  "verification_review.create",
] as const;

export type VerificationBlockedCapabilityKey = (typeof VERIFICATION_BLOCKED_CAPABILITY_KEYS)[number];

export function isVerificationCapabilityBlocked(capabilityKey: string): boolean {
  return (VERIFICATION_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

export function buildVerificationCapabilityId(
  providerKey: string,
  capabilityKey: VerificationCapabilityKey,
  operation: VerificationCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}
