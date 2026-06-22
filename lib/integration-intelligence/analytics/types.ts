export type AnalyticsProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type AnalyticsCapabilityOperation = "read";

export type AnalyticsCapabilityKey =
  | "kpi.read"
  | "metric.read"
  | "trend.read"
  | "comparison.read"
  | "forecast.read"
  | "executive_insight.read"
  | "performance.read"
  | "anomaly.read"
  | "report.read"
  | "dashboard.read"
  | "cross_module.read";

/** Blocked in Companion runtime Phase 28 — analytics never auto-acts. */
export const ANALYTICS_BLOCKED_CAPABILITY_KEYS = [
  "report.auto_generate",
  "insight.auto_apply",
  "analytics.auto_export",
  "correlation.inferred",
  "recommendation.auto_execute",
] as const;

export type AnalyticsBlockedCapabilityKey = (typeof ANALYTICS_BLOCKED_CAPABILITY_KEYS)[number];

export type AnalyticsCapabilityManifest = {
  capability_key: AnalyticsCapabilityKey;
  operation: AnalyticsCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type AnalyticsProviderSourceEngine =
  | "analytics_center"
  | "executive_insights_center"
  | "companion_analytics_context"
  | "companion_executive_layer"
  | "command_brief_analytics"
  | "cross_module_insight_bus"
  | "analytics_pack_adapter";

export type AnalyticsProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: AnalyticsProviderSourceEngine;
  implementation_status: AnalyticsProviderImplementationStatus;
  capabilities: readonly AnalyticsCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const ANALYTICS_BUSINESS_PACK_KEYS = [
  "analytics",
  "executive_intelligence",
  "insights_pack",
  "command_center",
] as const;

export function isAnalyticsBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (ANALYTICS_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildAnalyticsCapabilityId(
  providerKey: string,
  capabilityKey: AnalyticsCapabilityKey,
  operation: AnalyticsCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isAnalyticsCapabilityBlocked(capabilityKey: string): boolean {
  return (ANALYTICS_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}
