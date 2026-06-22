export type SupportProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type SupportCapabilityOperation = "read" | "write";

export type SupportCapabilityKey =
  | "support_case.read"
  | "support_case.search"
  | "support_case.create"
  | "support_case.assign"
  | "support_case.update"
  | "conversation.read"
  | "response.draft"
  | "escalation.create"
  | "sla.read"
  | "customer_context.read"
  | "support_insight.read";

/** Blocked in Companion runtime Phase 18 — never expose as enabled capabilities. */
export const SUPPORT_BLOCKED_CAPABILITY_KEYS = [
  "response.send",
  "support_case.close",
  "support_case.delete",
  "account.change",
] as const;

export type SupportBlockedCapabilityKey = (typeof SUPPORT_BLOCKED_CAPABILITY_KEYS)[number];

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
