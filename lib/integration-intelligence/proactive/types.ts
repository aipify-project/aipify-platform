export type ProactiveProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type ProactiveCapabilityOperation = "read";

export type ProactiveCapabilityKey =
  | "signal.read"
  | "alert.read"
  | "anomaly.read"
  | "recommendation.read"
  | "risk_signal.read"
  | "opportunity.read"
  | "health_score.read"
  | "forecast_warning.read"
  | "follow_up.read"
  | "attention_item.read";

/** Blocked in Companion runtime Phase 27 — recommendations never auto-execute. */
export const PROACTIVE_BLOCKED_CAPABILITY_KEYS = [
  "recommendation.execute",
  "alert.auto_dismiss",
  "signal.auto_resolve",
  "monitoring.auto_act",
  "recommendation.auto_apply",
] as const;

export type ProactiveBlockedCapabilityKey = (typeof PROACTIVE_BLOCKED_CAPABILITY_KEYS)[number];

export type ProactiveCapabilityManifest = {
  capability_key: ProactiveCapabilityKey;
  operation: ProactiveCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type ProactiveProviderSourceEngine =
  | "proactive_insights_engine"
  | "companion_recommendation_engine"
  | "proactive_organization_center"
  | "command_brief_operational"
  | "domain_signal_bus"
  | "proactive_pack_adapter";

export type ProactiveProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: ProactiveProviderSourceEngine;
  implementation_status: ProactiveProviderImplementationStatus;
  capabilities: readonly ProactiveCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const PROACTIVE_BUSINESS_PACK_KEYS = [
  "proactive_pack",
  "insights_pack",
  "recommendations_pack",
  "command_center",
] as const;

export function isProactiveBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (PROACTIVE_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildProactiveCapabilityId(
  providerKey: string,
  capabilityKey: ProactiveCapabilityKey,
  operation: ProactiveCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isProactiveCapabilityBlocked(capabilityKey: string): boolean {
  return (PROACTIVE_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}
