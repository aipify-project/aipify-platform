import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listProactiveProviderManifests } from "@/lib/integration-intelligence/proactive/registry";
import type { ProactiveProviderImplementationStatus } from "@/lib/integration-intelligence/proactive/types";
import { isProactiveBusinessPackActive } from "@/lib/integration-intelligence/proactive/types";
import type { CompanionCommunityContext } from "./companion-community-context";
import type { CompanionFinanceContext } from "./companion-finance-context";
import type { CompanionHrContext } from "./companion-hr-context";
import type { CompanionOperationalContext } from "./companion-operational-context";
import type { CompanionSalesContext } from "./companion-sales-context";
import type { CompanionSecurityContext } from "./companion-security-context";
import type { CompanionWarehouseContext } from "./companion-warehouse-context";
import {
  buildProactiveCapabilityRuntimeRef,
  countProactiveSignalsByType,
  createEmptyCompanionProactiveContext,
  type CompanionProactiveContext,
  type ProactiveProviderRuntimeStatus,
} from "./companion-proactive-context";
import {
  collectDomainProactiveSignals,
  collectOperationalProactiveSignals,
  extractInsightProactiveSignals,
  extractProactiveCenterSignals,
  extractRecommendationProactiveSignals,
  filterProactiveSignalsForPermission,
  prioritizeProactiveSignals,
} from "./normalize-proactive-signals";

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

function canReadInsights(permissions: readonly string[]): boolean {
  return permissions.includes("insights.view") || permissions.includes("executive.view");
}

function canReadRecommendations(permissions: readonly string[]): boolean {
  return (
    permissions.includes("recommendations.view") ||
    permissions.includes("executive.view") ||
    permissions.includes("advanced_insights.view")
  );
}

function canReadProactiveCenter(permissions: readonly string[]): boolean {
  return permissions.includes("executive.view") || permissions.includes("activity_history.view");
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: ProactiveProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): ProactiveProviderRuntimeStatus {
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
    proactive_insights_enabled: input.engineEnabled,
    recommendation_engine_enabled: input.engineEnabled,
    proactive_organization_enabled: input.engineEnabled,
    command_brief_operational_enabled: input.engineEnabled,
    domain_signal_bus_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    insights: boolean;
    recommendations: boolean;
    organization: boolean;
    commandBrief: boolean;
    domainBus: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "proactive_insights_engine":
      return flags.insights;
    case "companion_recommendation_engine":
      return flags.recommendations;
    case "proactive_organization_center":
      return flags.organization;
    case "command_brief_operational":
      return flags.commandBrief;
    case "domain_signal_bus":
      return flags.domainBus;
    case "proactive_pack_adapter":
      return false;
    default:
      return false;
  }
}

export type LoadCompanionProactiveDomainContexts = {
  hrContext: CompanionHrContext;
  warehouseContext: CompanionWarehouseContext;
  financeContext: CompanionFinanceContext;
  salesContext: CompanionSalesContext;
  securityContext: CompanionSecurityContext;
  communityContext: CompanionCommunityContext;
  operationalContext: CompanionOperationalContext;
};

export async function loadCompanionProactiveContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
    domainContexts: LoadCompanionProactiveDomainContexts;
  },
): Promise<CompanionProactiveContext> {
  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);
  const businessPackActive = isProactiveBusinessPackActive(input.activeBusinessPacks);

  if (appEntitlementBlocked) {
    return createEmptyCompanionProactiveContext({
      app_entitlement_blocked: true,
      permission_denied: false,
      empty_signal_basis: true,
    });
  }

  const insightsPermitted = canReadInsights(input.effectivePermissions);
  const recommendationsPermitted = canReadRecommendations(input.effectivePermissions);
  const proactiveCenterPermitted = canReadProactiveCenter(input.effectivePermissions);
  const commandBriefPermitted = input.effectivePermissions.includes("executive.view");

  if (!insightsPermitted && !recommendationsPermitted && !proactiveCenterPermitted && !commandBriefPermitted) {
    return createEmptyCompanionProactiveContext({
      permission_denied: true,
      empty_signal_basis: true,
    });
  }

  const requests: Array<Promise<{ kind: string; data: unknown; error: string | null }>> = [];

  if (insightsPermitted) {
    requests.push(
      (async () => {
        const { data, error } = await supabase.rpc("get_companion_proactive_insights_dashboard", {
          p_status: "new",
        });
        return { kind: "insights", data, error: error?.message ?? null };
      })(),
    );
  }

  if (recommendationsPermitted) {
    requests.push(
      (async () => {
        const { data, error } = await supabase.rpc("get_companion_recommendations_dashboard", {
          p_status: "active",
        });
        return { kind: "recommendations", data, error: error?.message ?? null };
      })(),
    );
  }

  if (proactiveCenterPermitted) {
    requests.push(
      (async () => {
        const { data, error } = await supabase.rpc("get_organization_companion_proactive_center", {
          p_section: "overview",
        });
        return { kind: "proactive_center", data, error: error?.message ?? null };
      })(),
    );
  }

  const results = await Promise.all(requests);
  let permissionDenied = false;
  let insightsRaw: unknown = null;
  let recommendationsRaw: unknown = null;
  let proactiveCenterRaw: unknown = null;

  for (const result of results) {
    if (result.error && isPermissionDeniedMessage(result.error)) {
      permissionDenied = true;
      continue;
    }
    if (result.kind === "insights") insightsRaw = result.data;
    if (result.kind === "recommendations") recommendationsRaw = result.data;
    if (result.kind === "proactive_center") proactiveCenterRaw = result.data;
  }

  const insightsEnabled = insightsPermitted && rpcEnabled(insightsRaw);
  const recommendationsEnabled = recommendationsPermitted && rpcEnabled(recommendationsRaw);
  const proactiveOrganizationEnabled = proactiveCenterPermitted && rpcEnabled(proactiveCenterRaw);
  const commandBriefOperationalEnabled =
    commandBriefPermitted && input.domainContexts.operationalContext.completeness !== "missing";
  const domainBusEnabled =
    input.domainContexts.hrContext.command_brief_events_linked ||
    input.domainContexts.warehouseContext.command_brief_events_linked ||
    input.domainContexts.financeContext.command_brief_events_linked ||
    input.domainContexts.salesContext.command_brief_events_linked ||
    input.domainContexts.securityContext.command_brief_events_linked ||
    input.domainContexts.communityContext.command_brief_events_linked;

  const domainSignals = collectDomainProactiveSignals([
    {
      source_module: "hr",
      signals: input.domainContexts.hrContext.command_brief_signals,
      required_permission: "hr.view",
    },
    {
      source_module: "warehouse",
      signals: input.domainContexts.warehouseContext.command_brief_signals,
      required_permission: "warehouse.view",
    },
    {
      source_module: "finance",
      signals: input.domainContexts.financeContext.command_brief_signals,
      required_permission: "billing.view",
    },
    {
      source_module: "sales",
      signals: input.domainContexts.salesContext.command_brief_signals,
      required_permission: "sales.view",
    },
    {
      source_module: "security",
      signals: input.domainContexts.securityContext.command_brief_signals,
      required_permission: "security.view",
    },
    {
      source_module: "community",
      signals: input.domainContexts.communityContext.command_brief_signals,
      required_permission: "customer_community.view",
    },
  ]);

  const operationalSignals = commandBriefOperationalEnabled
    ? collectOperationalProactiveSignals(input.domainContexts.operationalContext)
    : [];

  const rawSignals = [
    ...domainSignals,
    ...operationalSignals,
    ...(insightsEnabled ? extractInsightProactiveSignals(insightsRaw) : []),
    ...(recommendationsEnabled ? extractRecommendationProactiveSignals(recommendationsRaw) : []),
    ...(proactiveOrganizationEnabled ? extractProactiveCenterSignals(proactiveCenterRaw) : []),
  ];

  const permittedSignals = filterProactiveSignalsForPermission(
    rawSignals,
    input.effectivePermissions,
  );
  const prioritizedSignals = prioritizeProactiveSignals(permittedSignals);

  const manifests = listProactiveProviderManifests();
  const engineFlags = {
    insights: insightsEnabled,
    recommendations: recommendationsEnabled,
    organization: proactiveOrganizationEnabled,
    commandBrief: commandBriefOperationalEnabled,
    domainBus: domainBusEnabled,
  };

  const providers = manifests.map((manifest) =>
    resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: isEngineEnabledForManifest(manifest.provider_key, engineFlags),
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive: manifest.business_pack_key ? businessPackActive : true,
    }),
  );

  const capabilities = manifests.flatMap((manifest) => {
    const provider = providers.find((entry) => entry.provider_key === manifest.provider_key);
    const engineEnabled = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    return manifest.capabilities.map((capability) =>
      buildProactiveCapabilityRuntimeRef({
        manifest,
        capability,
        enabled:
          engineEnabled &&
          (!capability.required_permission ||
            input.effectivePermissions.includes(capability.required_permission)) &&
          manifest.implementation_status !== "placeholder" &&
          manifest.implementation_status !== "specification_only",
      }),
    );
  });

  return createEmptyCompanionProactiveContext({
    proactive_insights_enabled: insightsEnabled,
    recommendation_engine_enabled: recommendationsEnabled,
    proactive_organization_enabled: proactiveOrganizationEnabled,
    command_brief_operational_enabled: commandBriefOperationalEnabled,
    domain_signal_bus_enabled: domainBusEnabled,
    recommendation_auto_execute_blocked: true,
    alert_auto_dismiss_blocked: true,
    role_based_access_active: true,
    sensitive_data_sanitized: true,
    signals: permittedSignals,
    prioritized_signals: prioritizedSignals,
    command_brief_attention_count: countProactiveSignalsByType(prioritizedSignals, "attention") +
      countProactiveSignalsByType(prioritizedSignals, "alert") +
      countProactiveSignalsByType(prioritizedSignals, "risk"),
    command_brief_opportunity_count: countProactiveSignalsByType(prioritizedSignals, "opportunity"),
    command_brief_risk_count: countProactiveSignalsByType(prioritizedSignals, "risk"),
    command_brief_anomaly_count: countProactiveSignalsByType(prioritizedSignals, "anomaly"),
    command_brief_events_linked: prioritizedSignals.length > 0,
    providers,
    capabilities,
    permission_denied: permissionDenied,
    app_entitlement_blocked: appEntitlementBlocked,
    empty_signal_basis: prioritizedSignals.length === 0,
  });
}
