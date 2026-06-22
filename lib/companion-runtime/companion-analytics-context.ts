import type {
  AnalyticsProviderImplementationStatus,
  AnalyticsProviderManifest,
} from "@/lib/integration-intelligence/analytics/types";
import {
  buildAnalyticsCapabilityId,
  isAnalyticsCapabilityBlocked,
} from "@/lib/integration-intelligence/analytics/types";

export type CompanionAnalyticsFreshness = "fresh" | "stale" | "unknown";

export type CompanionAnalyticsTrend = "up" | "down" | "flat" | "unknown" | null;

export type CompanionAnalyticsConfidence = "high" | "moderate" | "low" | null;

export type CompanionAnalyticsCompleteness = "complete" | "partial" | "unknown";

/** Normalized analytics metric — only metrics with verified source data are exposed. */
export type CompanionAnalyticsMetric = {
  metric_id: string;
  metric_label: string;
  value: string | number | null;
  unit: string;
  period: string;
  comparison_period: string | null;
  change: string | number | null;
  trend: CompanionAnalyticsTrend;
  source_module: string;
  source_reference: string;
  generated_at: string | null;
  freshness: CompanionAnalyticsFreshness;
  completeness: CompanionAnalyticsCompleteness;
  confidence: CompanionAnalyticsConfidence;
  warnings: string[];
  required_permission: string | null;
  inference: boolean;
};

export type CompanionCrossModuleAnalyticsView = {
  view_id: string;
  period: string;
  unit: string;
  metric_ids: string[];
  source_modules: string[];
  fact_summary: string;
  inference: false;
};

export type AnalyticsProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: AnalyticsProviderImplementationStatus;
  analytics_center_enabled: boolean;
  executive_insights_enabled: boolean;
  companion_analytics_enabled: boolean;
  executive_layer_enabled: boolean;
  command_brief_analytics_enabled: boolean;
  cross_module_bus_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type AnalyticsCapabilityRuntimeRef = {
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
  runtime_status: AnalyticsProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CompanionAnalyticsContext = {
  analytics_center_enabled: boolean;
  executive_insights_enabled: boolean;
  companion_analytics_enabled: boolean;
  executive_layer_enabled: boolean;
  command_brief_analytics_enabled: boolean;
  cross_module_bus_enabled: boolean;
  insight_auto_apply_blocked: boolean;
  report_auto_generate_blocked: boolean;
  correlation_inferred_blocked: boolean;
  role_based_access_active: boolean;
  sensitive_metrics_filtered: boolean;
  metrics: CompanionAnalyticsMetric[];
  prioritized_metrics: CompanionAnalyticsMetric[];
  cross_module_views: CompanionCrossModuleAnalyticsView[];
  providers: AnalyticsProviderRuntimeStatus[];
  capabilities: AnalyticsCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  empty_metric_basis: boolean;
  cross_link_analytics: string;
  cross_link_executive_insights: string;
  cross_link_command_brief: string;
};

export function createEmptyCompanionAnalyticsContext(
  overrides?: Partial<CompanionAnalyticsContext>,
): CompanionAnalyticsContext {
  return {
    analytics_center_enabled: false,
    executive_insights_enabled: false,
    companion_analytics_enabled: false,
    executive_layer_enabled: false,
    command_brief_analytics_enabled: false,
    cross_module_bus_enabled: false,
    insight_auto_apply_blocked: true,
    report_auto_generate_blocked: true,
    correlation_inferred_blocked: true,
    role_based_access_active: true,
    sensitive_metrics_filtered: true,
    metrics: [],
    prioritized_metrics: [],
    cross_module_views: [],
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    empty_metric_basis: true,
    cross_link_analytics: "/app/analytics",
    cross_link_executive_insights: "/app/insights",
    cross_link_command_brief: "/app/command-center",
    ...overrides,
  };
}

export function buildAnalyticsCapabilityRuntimeRef(input: {
  manifest: AnalyticsProviderManifest;
  capability: AnalyticsProviderManifest["capabilities"][number];
  enabled: boolean;
}): AnalyticsCapabilityRuntimeRef {
  return {
    capability_id: buildAnalyticsCapabilityId(
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
    enabled: input.enabled && !isAnalyticsCapabilityBlocked(input.capability.capability_key),
  };
}

export function filterAnalyticsCapabilitiesForPrivacy(
  context: CompanionAnalyticsContext,
): AnalyticsCapabilityRuntimeRef[] {
  return context.capabilities.filter(
    (capability) =>
      capability.enabled &&
      (!capability.privacy_sensitive || context.role_based_access_active),
  );
}

export function listEnabledAnalyticsCapabilities(
  context: CompanionAnalyticsContext,
): AnalyticsCapabilityRuntimeRef[] {
  return filterAnalyticsCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function countAnalyticsMetricsByUnit(
  metrics: readonly CompanionAnalyticsMetric[],
  unit: string,
): number {
  return metrics.filter((metric) => metric.unit === unit).length;
}
