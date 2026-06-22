import type { AppOrganizationRole } from "@/lib/app-portal/nav-config";
import { resolvePortalFeatureEnabled } from "@/lib/app-portal/feature-entitlements";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { CompanionDiscoveryContext } from "./companion-discovery-context";
import { createEmptyCompanionDiscoveryContext } from "./companion-discovery-context";

const PORTAL_FEATURE_KEYS = [
  "team_management",
  "business_packs",
  "workflows",
  "advanced_insights",
  "billing",
] as const;

export type CompanionTenantContext = {
  organizationId: string | null;
  companyId: string | null;
  organizationName: string | null;
  organizationRole: AppOrganizationRole | null;
  planKey: string | null;
  subscriptionStatus: string | null;
  activeBusinessPacks: string[];
  verifiedIntegrations: string[];
  enabledFeatures: string[];
  effectivePermissions: string[];
  locale: CustomerActiveLocale;
  organizationDefaultLocale: CustomerActiveLocale;
  primaryVerifiedProvider: string | null;
  connectedProviders: string[];
  discovery: CompanionDiscoveryContext;
};

export function createEmptyCompanionTenantContext(
  overrides?: Partial<CompanionTenantContext>,
): CompanionTenantContext {
  return {
    organizationId: null,
    companyId: null,
    organizationName: null,
    organizationRole: null,
    planKey: null,
    subscriptionStatus: null,
    activeBusinessPacks: [],
    verifiedIntegrations: [],
    enabledFeatures: ["core"],
    effectivePermissions: [],
    locale: "en",
    organizationDefaultLocale: "en",
    primaryVerifiedProvider: null,
    connectedProviders: [],
    discovery: createEmptyCompanionDiscoveryContext(),
    ...overrides,
  };
}

export function deriveEnabledPortalFeatures(planKey: string | null): string[] {
  const enabled = new Set<string>(["core"]);
  for (const feature of PORTAL_FEATURE_KEYS) {
    if (resolvePortalFeatureEnabled(feature, planKey)) {
      enabled.add(feature);
    }
  }
  return [...enabled];
}

export function parseInstalledPackKeys(raw: unknown): string[] {
  if (!raw || typeof raw !== "object") return [];
  const record = raw as Record<string, unknown>;
  const installed = record.installed_packs;
  if (!Array.isArray(installed)) return [];

  const keys = new Set<string>();
  for (const entry of installed) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const status = String(row.license_status ?? row.status ?? "active").toLowerCase();
    if (!["active", "trial", "installed"].includes(status)) continue;
    const packKey = String(row.pack_key ?? "").trim();
    if (packKey) keys.add(packKey);
  }
  return [...keys];
}

export function parseLicenseSubscriptionPackKeys(raw: unknown): string[] {
  if (!raw || typeof raw !== "object") return [];
  const record = raw as Record<string, unknown>;
  const keys = new Set<string>();

  const tenantPacks = record.business_packs;
  if (Array.isArray(tenantPacks)) {
    for (const entry of tenantPacks) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const status = String(row.license_status ?? "active").toLowerCase();
      if (!["active", "trial"].includes(status)) continue;
      const packKey = String(row.pack_key ?? "").trim();
      if (packKey) keys.add(packKey);
    }
  }

  const domainPacks = record.domain_pack_installations;
  if (Array.isArray(domainPacks)) {
    for (const entry of domainPacks) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const status = String(row.license_status ?? "active").toLowerCase();
      if (!["active", "trial"].includes(status)) continue;
      const packKey = String(row.pack_key ?? "").trim();
      if (packKey) keys.add(packKey);
    }
  }

  return [...keys];
}

export function resolveCompanionIntegrationContext(
  requested: string | null | undefined,
  tenantContext: CompanionTenantContext,
): string | null {
  if (requested && tenantContext.connectedProviders.includes(requested)) {
    return requested;
  }
  return tenantContext.primaryVerifiedProvider;
}

export function buildPlatformSearchContextFromTenant(
  tenantContext: CompanionTenantContext,
  userRole: import("@/lib/tenant/types").UserRole,
): import("@/lib/companion-platform-knowledge/types").PlatformSearchContext {
  return {
    locale: tenantContext.locale,
    userRole,
    organizationRole: tenantContext.organizationRole ?? undefined,
    enabledFeatures: tenantContext.enabledFeatures,
    planKey: tenantContext.planKey ?? undefined,
  };
}
