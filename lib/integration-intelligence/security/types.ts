export type SecurityProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type SecurityCapabilityOperation = "read" | "write";

export type SecurityCapabilityKey =
  | "verification.read"
  | "verification_status.read"
  | "access.read"
  | "role.read"
  | "permission.read"
  | "security_event.read"
  | "audit_log.read"
  | "compliance_status.read"
  | "policy_violation.read"
  | "risk_signal.read"
  | "access_review.read"
  | "incident.read"
  | "verification.request"
  | "access_review.create";

/** Blocked in Companion runtime Phase 25 — never expose as enabled capabilities. */
export const SECURITY_BLOCKED_CAPABILITY_KEYS = [
  "identity.auto_approve",
  "access.revoke.permanent",
  "audit_log.delete",
  "tfa.disable",
  "account.sensitive_change",
  "compliance.decision",
  "security.irreversible",
] as const;

export type SecurityBlockedCapabilityKey = (typeof SECURITY_BLOCKED_CAPABILITY_KEYS)[number];

export type SecurityCapabilityManifest = {
  capability_key: SecurityCapabilityKey;
  operation: SecurityCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type SecurityProviderSourceEngine =
  | "trust_center_verification"
  | "identity_access"
  | "security_compliance"
  | "audit_accountability"
  | "governance_management"
  | "security_pack_adapter";

export type SecurityProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: SecurityProviderSourceEngine;
  implementation_status: SecurityProviderImplementationStatus;
  capabilities: readonly SecurityCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const SECURITY_BUSINESS_PACK_KEYS = [
  "governance_pack",
  "security_pack",
  "compliance_pack",
  "trust_center",
] as const;

export function isSecurityBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (SECURITY_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildSecurityCapabilityId(
  providerKey: string,
  capabilityKey: SecurityCapabilityKey,
  operation: SecurityCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isSecurityCapabilityBlocked(capabilityKey: string): boolean {
  return (SECURITY_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}
