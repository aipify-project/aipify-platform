import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listAnalyticsProviderManifests } from "@/lib/integration-intelligence/analytics/registry";
import type { AnalyticsProviderImplementationStatus } from "@/lib/integration-intelligence/analytics/types";
import { isAnalyticsBusinessPackActive } from "@/lib/integration-intelligence/analytics/types";
import type { CompanionOperationalContext } from "./companion-operational-context";
import type { CompanionProactiveContext } from "./companion-proactive-context";
import {
  buildAnalyticsCapabilityRuntimeRef,
  createEmptyCompanionAnalyticsContext,
  type AnalyticsProviderRuntimeStatus,
  type CompanionAnalyticsContext,
} from "./companion-analytics-context";
import {
  buildCrossModuleAnalyticsViews,
  dedupeAnalyticsMetrics,
  extractAnalyticsCenterMetrics,
  extractCommandBriefAnalyticsMetrics,
  extractCompanionAnalyticsContextMetrics,
  extractExecutiveInsightsCenterMetrics,
  extractExecutiveLayerDashboardMetrics,
  filterAnalyticsMetricsForPermission,
  filterSensitiveAnalyticsMetrics,
  prioritizeAnalyticsMetrics,
} from "./normalize-analytics-metrics";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function rpcEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (record.found === false) return false;
  if (record.has_access === false) return false;
  return true;
}

function canReadAnalytics(permissions: readonly string[]): boolean {
  return permissions.includes("analytics.view") || permissions.includes("executive.view");
}

function canReadExecutiveInsights(permissions: readonly string[]): boolean {
  return (
    permissions.includes("analytics.view") ||
    permissions.includes("executive.view") ||
    permissions.includes("advanced_insights.view")
  );
}

function canReadExecutiveLayer(permissions: readonly string[]): boolean {
  return (
    permissions.includes("advanced_insights.view") ||
    permissions.includes("executive.view") ||
    permissions.includes("analytics.view")
  );
}

function canReadCommandBriefAnalytics(permissions: readonly string[]): boolean {
  return permissions.includes("executive.view");
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: AnalyticsProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): AnalyticsProviderRuntimeStatus {
  const verified = input.connectedProviders.includes(input.providerKey);
  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    analytics_center_enabled: input.engineEnabled,
    executive_insights_enabled: input.engineEnabled,
    companion_analytics_enabled: input.engineEnabled,
    executive_layer_enabled: input.engineEnabled,
    command_brief_analytics_enabled: input.engineEnabled,
    cross_module_bus_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    analytics: boolean;
    executiveInsights: boolean;
    executiveLayer: boolean;
    commandBrief: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "analytics_center":
    case "companion_analytics_context":
      return flags.analytics;
    case "executive_insights_center":
      return flags.executiveInsights;
    case "companion_executive_layer":
      return flags.executiveLayer;
    case "command_brief_analytics":
      return flags.commandBrief;
    case "cross_module_insight_bus":
      return flags.analytics || flags.executiveInsights || flags.commandBrief;
    default:
      return false;
  }
}

export type LoadCompanionAnalyticsDomainContexts = {
  operationalContext: CompanionOperationalContext;
  proactiveContext: CompanionProactiveContext;
};

export async function loadCompanionAnalyticsContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
    domainContexts: LoadCompanionAnalyticsDomainContexts;
  },
): Promise<CompanionAnalyticsContext> {
  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);
  const businessPackActive = isAnalyticsBusinessPackActive(input.activeBusinessPacks);

  if (appEntitlementBlocked) {
    return createEmptyCompanionAnalyticsContext({
      app_entitlement_blocked: true,
      empty_metric_basis: true,
    });
  }

  const analyticsPermitted = canReadAnalytics(input.effectivePermissions);
  const executiveInsightsPermitted = canReadExecutiveInsights(input.effectivePermissions);
  const executiveLayerPermitted = canReadExecutiveLayer(input.effectivePermissions);
  const commandBriefPermitted = canReadCommandBriefAnalytics(input.effectivePermissions);

  if (
    !analyticsPermitted &&
    !executiveInsightsPermitted &&
    !executiveLayerPermitted &&
    !commandBriefPermitted
  ) {
    return createEmptyCompanionAnalyticsContext({
      permission_denied: true,
      empty_metric_basis: true,
    });
  }

  const requests: Array<Promise<{ kind: string; data: unknown; error: string | null }>> = [];

  if (analyticsPermitted) {
    requests.push(
      (async () => {
        const { data, error } = await supabase.rpc("get_companion_analytics_context");
        return { kind: "companion_analytics", data, error: error?.message ?? null };
      })(),
      (async () => {
        const { data, error } = await supabase.rpc("get_analytics_center", {
          p_section: "executive",
        });
        return { kind: "analytics_center", data, error: error?.message ?? null };
      })(),
    );
  }

  if (executiveInsightsPermitted) {
    requests.push(
      (async () => {
        const { data, error } = await supabase.rpc("get_executive_insights_center");
        return { kind: "executive_insights", data, error: error?.message ?? null };
      })(),
    );
  }

  if (executiveLayerPermitted) {
    requests.push(
      (async () => {
        const { data, error } = await supabase.rpc("get_companion_executive_layer_dashboard", {
          p_workspace: "organization",
          p_search: null,
        });
        return { kind: "executive_layer", data, error: error?.message ?? null };
      })(),
    );
  }

  const results = await Promise.all(requests);
  let permissionDenied = false;
  let companionAnalyticsRaw: unknown = null;
  let analyticsCenterRaw: unknown = null;
  let executiveInsightsRaw: unknown = null;
  let executiveLayerRaw: unknown = null;

  for (const result of results) {
    if (result.error && isPermissionDeniedMessage(result.error)) {
      permissionDenied = true;
      continue;
    }
    if (result.kind === "companion_analytics") companionAnalyticsRaw = result.data;
    if (result.kind === "analytics_center") analyticsCenterRaw = result.data;
    if (result.kind === "executive_insights") executiveInsightsRaw = result.data;
    if (result.kind === "executive_layer") executiveLayerRaw = result.data;
  }

  if (permissionDenied) {
    return createEmptyCompanionAnalyticsContext({
      permission_denied: true,
      empty_metric_basis: true,
    });
  }

  const analyticsEnabled = rpcEnabled(analyticsCenterRaw) || rpcEnabled(companionAnalyticsRaw);
  const executiveInsightsEnabled = rpcEnabled(executiveInsightsRaw);
  const executiveLayerEnabled = rpcEnabled(executiveLayerRaw);
  const commandBriefEnabled = commandBriefPermitted;

  const rawMetrics = [
    ...extractCompanionAnalyticsContextMetrics(companionAnalyticsRaw),
    ...extractAnalyticsCenterMetrics(analyticsCenterRaw),
    ...extractExecutiveInsightsCenterMetrics(executiveInsightsRaw),
    ...extractExecutiveLayerDashboardMetrics(executiveLayerRaw),
    ...(commandBriefEnabled
      ? extractCommandBriefAnalyticsMetrics(input.domainContexts.operationalContext)
      : []),
  ];

  const filtered = filterSensitiveAnalyticsMetrics(
    filterAnalyticsMetricsForPermission(rawMetrics, input.effectivePermissions),
  );
  const metrics = dedupeAnalyticsMetrics(filtered);
  const prioritizedMetrics = prioritizeAnalyticsMetrics(metrics);
  const crossModuleViews = buildCrossModuleAnalyticsViews(
    prioritizedMetrics,
    input.effectivePermissions,
  );

  const manifests = listAnalyticsProviderManifests();
  const providers: AnalyticsProviderRuntimeStatus[] = manifests.map((manifest) =>
    resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: isEngineEnabledForManifest(manifest.provider_key, {
        analytics: analyticsEnabled,
        executiveInsights: executiveInsightsEnabled,
        executiveLayer: executiveLayerEnabled,
        commandBrief: commandBriefEnabled,
      }),
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive,
    }),
  );

  const capabilities = manifests.flatMap((manifest) => {
    if (manifest.implementation_status === "specification_only") return [];
    const provider = providers.find((entry) => entry.provider_key === manifest.provider_key);
    const engineEnabled = provider
      ? isEngineEnabledForManifest(manifest.provider_key, {
          analytics: analyticsEnabled,
          executiveInsights: executiveInsightsEnabled,
          executiveLayer: executiveLayerEnabled,
          commandBrief: commandBriefEnabled,
        })
      : false;

    return manifest.capabilities.map((capability) =>
      buildAnalyticsCapabilityRuntimeRef({
        manifest,
        capability,
        enabled:
          engineEnabled &&
          (!capability.required_permission ||
            input.effectivePermissions.includes(capability.required_permission)),
      }),
    );
  });

  return createEmptyCompanionAnalyticsContext({
    analytics_center_enabled: analyticsEnabled,
    executive_insights_enabled: executiveInsightsEnabled,
    companion_analytics_enabled: rpcEnabled(companionAnalyticsRaw),
    executive_layer_enabled: executiveLayerEnabled,
    command_brief_analytics_enabled: commandBriefEnabled,
    cross_module_bus_enabled: crossModuleViews.length > 0,
    metrics,
    prioritized_metrics: prioritizedMetrics,
    cross_module_views: crossModuleViews,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: false,
    empty_metric_basis: prioritizedMetrics.length === 0,
  });
}
