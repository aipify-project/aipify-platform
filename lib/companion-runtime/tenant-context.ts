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

  const entitledCapabilities = mergeServicesCapabilities(
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

  const operationalLoad = await loadCompanionOperationalContext(supabase, {
    effectivePermissions,
    subscriptionStatus,
    enabledModules: businessPackContext.enabledModules,
    activeBusinessPacks,
  });

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
    operationalContext: operationalLoad.operationalContext,
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
  });
}
