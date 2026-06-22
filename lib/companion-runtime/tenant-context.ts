import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseCustomerLicenseCenter } from "@/lib/companion-platform-knowledge/pricing-bridge";
import {
  coerceToCustomerActiveLocale,
  type CustomerActiveLocale,
} from "@/lib/i18n/customer-active-locale-registry";
import { parseIdentityPermissionsDashboard } from "@/lib/aipify/identity-permissions/parse";
import { resolveAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import {
  buildPlatformSearchContextFromTenant,
  createEmptyCompanionTenantContext,
  deriveEnabledPortalFeatures,
  parseInstalledPackKeys,
  parseLicenseSubscriptionPackKeys,
  resolveCompanionIntegrationContext,
  type CompanionTenantContext,
} from "./companion-tenant-context";
import { loadCompanionDiscoveryContext } from "./load-companion-discovery-context";
import { loadCompanionBusinessPackContext } from "./load-companion-business-pack-context";
import { loadCompanionSchemaContext } from "./load-companion-schema-context";
import { loadCompanionToolRegistry } from "./load-companion-tool-registry";
import { loadCompanionOperationalContext } from "./load-companion-operational-context";
import { loadCompanionIdentityContext } from "./load-companion-identity-context";
import { loadCompanionMemoryContext } from "./load-companion-memory-context";
import { loadCompanionActionContext } from "./load-companion-action-context";
import { loadCompanionCreativeContext } from "./load-companion-creative-context";
import { loadCompanionMediaContext } from "./load-companion-media-context";
import { loadCompanionWorkspaceContext } from "./load-companion-workspace-context";
import { loadCompanionCommerceContext } from "./load-companion-commerce-context";
import { loadCompanionServicesContext } from "./load-companion-services-context";
import { loadCompanionSupportContext } from "./load-companion-support-context";
import { loadCompanionIndustryPackContext } from "./load-companion-industry-pack-context";
import { loadCompanionHostsContext } from "./load-companion-hosts-context";
import { loadCompanionHrContext } from "./load-companion-hr-context";
import { loadCompanionWarehouseContext } from "./load-companion-warehouse-context";
import { loadCompanionFinanceContext } from "./load-companion-finance-context";
import { loadCompanionSalesContext } from "./load-companion-sales-context";
import { loadCompanionSecurityContext } from "./load-companion-security-context";
import { loadCompanionCommunityContext } from "./load-companion-community-context";
import {
  mergeCreativeCapabilities,
  mergeCreativeSchemaCollection,
  mergeCreativeToolRegistry,
} from "./merge-creative-runtime";
import {
  mergeMediaCapabilities,
  mergeMediaSchemaCollection,
  mergeMediaToolRegistry,
} from "./merge-media-runtime";
import {
  mergeWorkspaceCapabilities,
  mergeWorkspaceSchemaCollection,
  mergeWorkspaceToolRegistry,
} from "./merge-workspace-runtime";
import {
  mergeCommerceCapabilities,
  mergeCommerceSchemaCollection,
  mergeCommerceToolRegistry,
} from "./merge-commerce-runtime";
import {
  mergeServicesCapabilities,
  mergeServicesSchemaCollection,
  mergeServicesToolRegistry,
} from "./merge-services-runtime";
import {
  mergeSupportCapabilities,
  mergeSupportSchemaCollection,
  mergeSupportToolRegistry,
} from "./merge-support-runtime";
import {
  mergeIndustryPackCapabilities,
  mergeIndustryPackSchemaCollection,
  mergeIndustryPackToolRegistry,
} from "./merge-industry-pack-runtime";
import {
  mergeHostsCapabilities,
  mergeHostsSchemaCollection,
  mergeHostsToolRegistry,
} from "./merge-hosts-runtime";
import {
  mergeHrCapabilities,
  mergeHrSchemaCollection,
  mergeHrToolRegistry,
} from "./merge-hr-runtime";
import {
  mergeWarehouseCapabilities,
  mergeWarehouseSchemaCollection,
  mergeWarehouseToolRegistry,
} from "./merge-warehouse-runtime";
import {
  mergeFinanceCapabilities,
  mergeFinanceSchemaCollection,
  mergeFinanceToolRegistry,
} from "./merge-finance-runtime";
import {
  mergeSalesCapabilities,
  mergeSalesSchemaCollection,
  mergeSalesToolRegistry,
} from "./merge-sales-runtime";
import {
  mergeSecurityCapabilities,
  mergeSecuritySchemaCollection,
  mergeSecurityToolRegistry,
} from "./merge-security-runtime";
import {
  mergeCommunityCapabilities,
  mergeCommunitySchemaCollection,
  mergeCommunityToolRegistry,
} from "./merge-community-runtime";
import { loadCompanionProactiveContext } from "./load-companion-proactive-context";
import {
  mergeProactiveCapabilities,
  mergeProactiveSchemaCollection,
  mergeProactiveToolRegistry,
} from "./merge-proactive-runtime";
import { mergeProactiveSignalsIntoOperationalContext } from "./normalize-proactive-signals";
import { loadCompanionAnalyticsContext } from "./load-companion-analytics-context";
import {
  mergeAnalyticsCapabilities,
  mergeAnalyticsSchemaCollection,
  mergeAnalyticsToolRegistry,
} from "./merge-analytics-runtime";

export type { CompanionTenantContext } from "./companion-tenant-context";
export {
  buildPlatformSearchContextFromTenant,
  createEmptyCompanionTenantContext,
  deriveEnabledPortalFeatures,
  parseInstalledPackKeys,
  parseLicenseSubscriptionPackKeys,
  resolveCompanionIntegrationContext,
} from "./companion-tenant-context";

type HubConnection = {
  provider_key?: string;
  canonical_status?: string;
  status?: string;
  last_test_success_at?: string | null;
};

function isVerifiedConnection(connection: HubConnection): boolean {
  const canonical = String(connection.canonical_status ?? "").toLowerCase();
  if (canonical === "verified" || canonical === "active") return true;
  if (connection.last_test_success_at) return true;
  const status = String(connection.status ?? "").toLowerCase();
  return status === "connected" || status === "verified";
}

function normalizePlanKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  return normalized || null;
}

async function loadOrganizationDefaultLocale(
  supabase: SupabaseClient,
  organizationId: string | null,
): Promise<CustomerActiveLocale> {
  if (!organizationId) return "en";
  const { data } = await supabase
    .from("organizations")
    .select("default_language")
    .eq("id", organizationId)
    .maybeSingle();
  return coerceToCustomerActiveLocale(
    typeof data?.default_language === "string" ? data.default_language : null,
  );
}

async function loadActiveBusinessPacks(supabase: SupabaseClient): Promise<string[]> {
  try {
    const { data, error } = await supabase.rpc("get_my_marketplace_summary");
    if (!error && data) {
      const packs = parseInstalledPackKeys(data);
      if (packs.length > 0) return packs;
    }
  } catch {
    // Permission or RPC unavailable — fall through.
  }

  try {
    const { data, error } = await supabase.rpc("get_license_subscription_center");
    if (!error && data && (data as Record<string, unknown>).found !== false) {
      return parseLicenseSubscriptionPackKeys(data);
    }
  } catch {
    // Permission or RPC unavailable.
  }

  return [];
}

function parseVerifiedProviders(hubRaw: unknown): {
  primaryVerifiedProvider: string | null;
  connectedProviders: string[];
} {
  if (!hubRaw || typeof hubRaw !== "object") {
    return { primaryVerifiedProvider: null, connectedProviders: [] };
  }

  const connections = (hubRaw as { connections?: HubConnection[] }).connections ?? [];
  const connectedProviders = connections
    .filter((entry) => entry.provider_key && isVerifiedConnection(entry))
    .map((entry) => String(entry.provider_key))
    .filter(Boolean);

  return {
    primaryVerifiedProvider: connectedProviders[0] ?? null,
    connectedProviders,
  };
}

export async function loadCompanionTenantContext(
  supabase: SupabaseClient,
  options?: { locale?: string },
): Promise<CompanionTenantContext> {
  const locale = coerceToCustomerActiveLocale(options?.locale);

  const [orgContext, hubResult, permissionsResult, licenseResult] = await Promise.all([
    resolveAppOrganizationContext(supabase),
    supabase.rpc("get_app_portal_integrations_hub"),
    supabase.rpc("get_identity_permissions_dashboard"),
    supabase.rpc("get_customer_license_center"),
  ]);

  const subscription = parseCustomerLicenseCenter(licenseResult.data);
  const planKey =
    normalizePlanKey(subscription?.planKey) ??
    normalizePlanKey(orgContext.plan_name?.replace(/\s+/g, "_"));
  const subscriptionStatus =
    subscription?.status ?? orgContext.license_status ?? null;

  const permissionsDashboard = permissionsResult.error
    ? null
    : parseIdentityPermissionsDashboard(permissionsResult.data);
  const effectivePermissions = permissionsDashboard?.user_permissions ?? [];

  const { primaryVerifiedProvider, connectedProviders } = parseVerifiedProviders(hubResult.data);
  const organizationId = orgContext.organization_id;

  const [organizationDefaultLocale, activeBusinessPacks, discovery, identityContext, memoryLoad] =
    await Promise.all([
      loadOrganizationDefaultLocale(supabase, organizationId),
      loadActiveBusinessPacks(supabase),
      loadCompanionDiscoveryContext(supabase, organizationId),
      loadCompanionIdentityContext(supabase, locale),
      loadCompanionMemoryContext(supabase, { locale }),
    ]);

  const businessPackContext = await loadCompanionBusinessPackContext(supabase, {
    activeBusinessPacks,
    subscriptionStatus,
    effectivePermissions,
  });

  const creativeContext = await loadCompanionCreativeContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
  });

  const mediaContext = await loadCompanionMediaContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
  });

  const workspaceContext = await loadCompanionWorkspaceContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
  });

  const commerceContext = await loadCompanionCommerceContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
  });

  const servicesContext = await loadCompanionServicesContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const supportContext = await loadCompanionSupportContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const industryPackContext = await loadCompanionIndustryPackContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const hostsContext = await loadCompanionHostsContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const hrContext = await loadCompanionHrContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const warehouseContext = await loadCompanionWarehouseContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const financeContext = await loadCompanionFinanceContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const salesContext = await loadCompanionSalesContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const securityContext = await loadCompanionSecurityContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
  });

  const communityContext = await loadCompanionCommunityContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
    organizationId,
  });

  const operationalLoad = await loadCompanionOperationalContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    enabledModules: businessPackContext.enabledModules,
    activeBusinessPacks,
  });

  const proactiveContext = await loadCompanionProactiveContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
    domainContexts: {
      hrContext,
      warehouseContext,
      financeContext,
      salesContext,
      securityContext,
      communityContext,
      operationalContext: operationalLoad.operationalContext,
    },
  });

  const operationalContext = mergeProactiveSignalsIntoOperationalContext(
    operationalLoad.operationalContext,
    proactiveContext.prioritized_signals,
  );

  const analyticsContext = await loadCompanionAnalyticsContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    connectedProviders,
    activeBusinessPacks,
    domainContexts: {
      operationalContext,
      proactiveContext,
    },
  });

  const entitledCapabilities = mergeAnalyticsCapabilities(
    mergeProactiveCapabilities(
    mergeCommunityCapabilities(
    mergeSecurityCapabilities(
    mergeSalesCapabilities(
    mergeFinanceCapabilities(
    mergeWarehouseCapabilities(
      mergeHrCapabilities(
        mergeHostsCapabilities(
          mergeIndustryPackCapabilities(
            mergeSupportCapabilities(
              mergeServicesCapabilities(
                mergeCommerceCapabilities(
                  mergeWorkspaceCapabilities(
                    mergeMediaCapabilities(
                      mergeCreativeCapabilities(businessPackContext.entitledCapabilities, creativeContext),
                      mediaContext,
                    ),
                    workspaceContext,
                  ),
                  commerceContext,
                ),
                servicesContext,
              ),
              supportContext,
            ),
            industryPackContext,
          ),
          hostsContext,
        ),
        hrContext,
      ),
      warehouseContext,
    ),
    financeContext,
    ),
    salesContext,
    ),
    securityContext,
    ),
    communityContext,
    ),
    proactiveContext,
    ),
    analyticsContext,
  );

  let schemaContext = loadCompanionSchemaContext({
    discovery,
    businessPackContext,
    connectedProviders,
    effectivePermissions,
  });
  schemaContext = mergeCreativeSchemaCollection(
    schemaContext,
    creativeContext,
    effectivePermissions,
  );
  schemaContext = mergeMediaSchemaCollection(schemaContext, mediaContext, effectivePermissions);
  schemaContext = mergeWorkspaceSchemaCollection(
    schemaContext,
    workspaceContext,
    effectivePermissions,
  );
  schemaContext = mergeCommerceSchemaCollection(
    schemaContext,
    commerceContext,
    effectivePermissions,
  );
  schemaContext = mergeServicesSchemaCollection(
    schemaContext,
    servicesContext,
    effectivePermissions,
  );
  schemaContext = mergeSupportSchemaCollection(
    schemaContext,
    supportContext,
    effectivePermissions,
  );
  schemaContext = mergeIndustryPackSchemaCollection(
    schemaContext,
    industryPackContext,
    effectivePermissions,
  );
  schemaContext = mergeHostsSchemaCollection(
    schemaContext,
    hostsContext,
    effectivePermissions,
  );
  schemaContext = mergeHrSchemaCollection(schemaContext, hrContext, effectivePermissions);
  schemaContext = mergeWarehouseSchemaCollection(
    schemaContext,
    warehouseContext,
    effectivePermissions,
  );
  schemaContext = mergeFinanceSchemaCollection(schemaContext, financeContext, effectivePermissions);
  schemaContext = mergeSalesSchemaCollection(schemaContext, salesContext, effectivePermissions);
  schemaContext = mergeSecuritySchemaCollection(schemaContext, securityContext, effectivePermissions);
  schemaContext = mergeCommunitySchemaCollection(schemaContext, communityContext, effectivePermissions);
  schemaContext = mergeProactiveSchemaCollection(schemaContext, proactiveContext, effectivePermissions);
  schemaContext = mergeAnalyticsSchemaCollection(schemaContext, analyticsContext, effectivePermissions);

  let toolRegistry = loadCompanionToolRegistry({
    discovery,
    businessPackContext,
    connectedProviders,
    entitledCapabilities,
    schemaContext,
    effectivePermissions,
  });
  toolRegistry = mergeCreativeToolRegistry(toolRegistry, creativeContext, effectivePermissions);
  toolRegistry = mergeMediaToolRegistry(toolRegistry, mediaContext, effectivePermissions);
  toolRegistry = mergeWorkspaceToolRegistry(toolRegistry, workspaceContext, effectivePermissions);
  toolRegistry = mergeCommerceToolRegistry(toolRegistry, commerceContext, effectivePermissions);
  toolRegistry = mergeServicesToolRegistry(toolRegistry, servicesContext, effectivePermissions);
  toolRegistry = mergeSupportToolRegistry(toolRegistry, supportContext, effectivePermissions);
  toolRegistry = mergeIndustryPackToolRegistry(
    toolRegistry,
    industryPackContext,
    effectivePermissions,
  );
  toolRegistry = mergeHostsToolRegistry(toolRegistry, hostsContext, effectivePermissions);
  toolRegistry = mergeHrToolRegistry(toolRegistry, hrContext, effectivePermissions);
  toolRegistry = mergeWarehouseToolRegistry(toolRegistry, warehouseContext, effectivePermissions);
  toolRegistry = mergeFinanceToolRegistry(toolRegistry, financeContext, effectivePermissions);
  toolRegistry = mergeSalesToolRegistry(toolRegistry, salesContext, effectivePermissions);
  toolRegistry = mergeSecurityToolRegistry(toolRegistry, securityContext, effectivePermissions);
  toolRegistry = mergeCommunityToolRegistry(toolRegistry, communityContext, effectivePermissions);
  toolRegistry = mergeProactiveToolRegistry(toolRegistry, proactiveContext, effectivePermissions);
  toolRegistry = mergeAnalyticsToolRegistry(toolRegistry, analyticsContext, effectivePermissions);

  const actionLoad = await loadCompanionActionContext(supabase, {
    schemaContext,
    businessPackContext: {
      ...businessPackContext,
      entitledCapabilities,
    },
    effectivePermissions,
    subscriptionStatus,
    creativeContext,
    mediaContext,
    workspaceContext,
    commerceContext,
    servicesContext,
    supportContext,
    industryPackContext,
    hostsContext,
    hrContext,
    warehouseContext,
    financeContext,
    salesContext,
    securityContext,
    communityContext,
  });

  return createEmptyCompanionTenantContext({
    organizationId,
    companyId: orgContext.company_id,
    organizationName: orgContext.workspace_name ?? orgContext.licensed_to,
    organizationRole: (orgContext.organization_role as CompanionTenantContext["organizationRole"]) ?? null,
    planKey,
    subscriptionStatus,
    activeBusinessPacks,
    verifiedIntegrations: connectedProviders,
    enabledFeatures: deriveEnabledPortalFeatures(planKey),
    effectivePermissions,
    locale,
    organizationDefaultLocale,
    primaryVerifiedProvider,
    connectedProviders,
    discovery,
    businessPackContext,
    entitledCapabilities,
    enabledModules: businessPackContext.enabledModules,
    schemaContext,
    availableEntities: schemaContext.availableEntities,
    availableOperations: schemaContext.availableOperations,
    toolRegistry,
    operationalContext,
    commandBriefAvailable: operationalLoad.commandBriefAvailable,
    sinceLastLoginAvailable: operationalLoad.sinceLastLoginAvailable,
    identityContext,
    memoryContext: memoryLoad.memoryContext,
    confirmedOrganizationKnowledgeAvailable: memoryLoad.confirmedOrganizationKnowledgeAvailable,
    actionContext: actionLoad.actionContext,
    writeActionsAvailable: actionLoad.writeActionsAvailable,
    creativeContext,
    mediaContext,
    workspaceContext,
    commerceContext,
    servicesContext,
    supportContext,
    industryPackContext,
    hostsContext,
    hrContext,
    warehouseContext,
    financeContext,
    salesContext,
    securityContext,
    communityContext,
    proactiveContext,
    analyticsContext,
  });
}
