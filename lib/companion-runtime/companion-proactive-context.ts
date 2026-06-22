import type {
  ProactiveProviderImplementationStatus,
  ProactiveProviderManifest,
} from "@/lib/integration-intelligence/proactive/types";
import {
  buildProactiveCapabilityId,
  isProactiveCapabilityBlocked,
} from "@/lib/integration-intelligence/proactive/types";

export type CompanionProactiveSignalType =
  | "alert"
  | "anomaly"
  | "recommendation"
  | "risk"
  | "opportunity"
  | "health_score"
  | "forecast_warning"
  | "follow_up"
  | "attention";

export type CompanionProactiveSignalSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "informational";

export type CompanionProactiveSignalFreshness = "fresh" | "stale" | "unknown";

export type CompanionProactiveSignalStatus =
  | "new"
  | "reviewed"
  | "active"
  | "resolved"
  | "unresolved";

export type CompanionProactiveConfidence = "high" | "moderate" | "low" | null;

export type CompanionProactiveBusinessImpact = "very_high" | "high" | "medium" | "low" | null;

/** Normalized proactive signal contract — only signals with actual source data are exposed. */
export type CompanionProactiveSignal = {
  signal_id: string;
  signal_type: CompanionProactiveSignalType;
  severity: CompanionProactiveSignalSeverity;
  source_module: string;
  source_reference: string;
  detected_at: string | null;
  freshness: CompanionProactiveSignalFreshness;
  title: string;
  summary: string;
  recommended_action: string | null;
  required_capability: string | null;
  required_permission: string | null;
  confidence: CompanionProactiveConfidence;
  status: CompanionProactiveSignalStatus;
  business_impact: CompanionProactiveBusinessImpact;
};

export type ProactiveProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: ProactiveProviderImplementationStatus;
  proactive_insights_enabled: boolean;
  recommendation_engine_enabled: boolean;
  proactive_organization_enabled: boolean;
  command_brief_operational_enabled: boolean;
  domain_signal_bus_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type ProactiveCapabilityRuntimeRef = {
  capability_id: string;
  provider_key: string;
  capability_key: string;
  operation: "read";
  entity: string;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: number;
  required_permission: string | null;
  runtime_status: ProactiveProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CompanionProactiveContext = {
  proactive_insights_enabled: boolean;
  recommendation_engine_enabled: boolean;
  proactive_organization_enabled: boolean;
  command_brief_operational_enabled: boolean;
  domain_signal_bus_enabled: boolean;
  recommendation_auto_execute_blocked: boolean;
  alert_auto_dismiss_blocked: boolean;
  role_based_access_active: boolean;
  sensitive_data_sanitized: boolean;
  signals: CompanionProactiveSignal[];
  prioritized_signals: CompanionProactiveSignal[];
  command_brief_attention_count: number;
  command_brief_opportunity_count: number;
  command_brief_risk_count: number;
  command_brief_anomaly_count: number;
  command_brief_events_linked: boolean;
  providers: ProactiveProviderRuntimeStatus[];
  capabilities: ProactiveCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  empty_signal_basis: boolean;
  cross_link_command_brief: string;
  cross_link_recommendations: string;
  cross_link_proactive_insights: string;
};

export function createEmptyCompanionProactiveContext(
  overrides?: Partial<CompanionProactiveContext>,
): CompanionProactiveContext {
  return {
    proactive_insights_enabled: false,
    recommendation_engine_enabled: false,
    proactive_organization_enabled: false,
    command_brief_operational_enabled: false,
    domain_signal_bus_enabled: false,
    recommendation_auto_execute_blocked: true,
    alert_auto_dismiss_blocked: true,
    role_based_access_active: true,
    sensitive_data_sanitized: true,
    signals: [],
    prioritized_signals: [],
    command_brief_attention_count: 0,
    command_brief_opportunity_count: 0,
    command_brief_risk_count: 0,
    command_brief_anomaly_count: 0,
    command_brief_events_linked: false,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    empty_signal_basis: true,
    cross_link_command_brief: "/app/command-center",
    cross_link_recommendations: "/app/recommendations",
    cross_link_proactive_insights: "/app/learning",
    ...overrides,
  };
}

export function buildProactiveCapabilityRuntimeRef(input: {
  manifest: ProactiveProviderManifest;
  capability: ProactiveProviderManifest["capabilities"][number];
  enabled: boolean;
}): ProactiveCapabilityRuntimeRef {
  return {
    capability_id: buildProactiveCapabilityId(
      input.manifest.provider_key,
      input.capability.capability_key,
      input.capability.operation,
    ),
    provider_key: input.manifest.provider_key,
    capability_key: input.capability.capability_key,
    operation: input.capability.operation,
    entity: input.capability.entity,
    adapter_available: input.capability.adapter_available,
    approval_required: input.capability.approval_required,
    reversible: input.capability.reversible,
    risk_level: input.capability.risk_level,
    required_permission: input.capability.required_permission,
    runtime_status: input.manifest.implementation_status,
    privacy_sensitive: input.capability.privacy_sensitive,
    enabled: input.enabled && !isProactiveCapabilityBlocked(input.capability.capability_key),
  };
}

export function filterProactiveCapabilitiesForPrivacy(
  context: CompanionProactiveContext,
): ProactiveCapabilityRuntimeRef[] {
  return context.capabilities.filter(
    (capability) => capability.enabled && (!capability.privacy_sensitive || context.role_based_access_active),
  );
}

export function listEnabledProactiveCapabilities(
  context: CompanionProactiveContext,
): ProactiveCapabilityRuntimeRef[] {
  return filterProactiveCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function countProactiveSignalsByType(
  signals: readonly CompanionProactiveSignal[],
  signalType: CompanionProactiveSignalType,
): number {
  return signals.filter((signal) => signal.signal_type === signalType).length;
}
