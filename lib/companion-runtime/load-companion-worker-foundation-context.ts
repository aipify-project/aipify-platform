import "server-only";

import { parseIdentityPermissionsDashboard } from "@/lib/aipify/identity-permissions/parse";
import { parseCustomerLicenseCenter } from "@/lib/companion-platform-knowledge/pricing-bridge";
import {
  coerceToCustomerActiveLocale,
  type CustomerActiveLocale,
} from "@/lib/i18n/customer-active-locale-registry";
import type { CompanionWorkerRuntimeBootstrap } from "./companion-worker-runtime-scope";
import {
  createEmptyCompanionIdentityContext,
  normalizeCompanionIdentityContext,
  parseIdentityRpcPayloads,
} from "./companion-identity-context";
import {
  createEmptyCompanionTenantContext,
  deriveEnabledPortalFeatures,
  parseInstalledPackKeys,
  parseLicenseSubscriptionPackKeys,
  type CompanionTenantContext,
} from "./companion-tenant-context";

function normalizePlanKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  return normalized || null;
}

function readOrganizationDefaultLocale(
  bootstrap: CompanionWorkerRuntimeBootstrap,
): CustomerActiveLocale {
  const orgRaw = bootstrap.organization_context;
  const defaultLanguage =
    typeof orgRaw.default_language === "string" ? orgRaw.default_language : null;
  return coerceToCustomerActiveLocale(defaultLanguage);
}

function readActiveBusinessPacks(bootstrap: CompanionWorkerRuntimeBootstrap): string[] {
  const fromMarketplace = parseInstalledPackKeys(bootstrap.marketplace_summary);
  if (fromMarketplace.length > 0) return fromMarketplace;
  return parseLicenseSubscriptionPackKeys(bootstrap.license_subscription_center);
}

/** Worker fast path — foundation queries only need bootstrap identity and org scope. */
export function loadCompanionTenantContextFromWorkerBootstrap(
  bootstrap: CompanionWorkerRuntimeBootstrap,
  locale: CustomerActiveLocale,
): CompanionTenantContext {
  const subscription = parseCustomerLicenseCenter(bootstrap.customer_license_center);
  const permissionsDashboard = parseIdentityPermissionsDashboard(bootstrap.identity_permissions);
  const effectivePermissions = permissionsDashboard?.user_permissions ?? [];
  const planKey =
    normalizePlanKey(subscription?.planKey) ??
    normalizePlanKey(
      typeof bootstrap.organization_context.plan_name === "string"
        ? bootstrap.organization_context.plan_name.replace(/\s+/g, "_")
        : null,
    );
  const subscriptionStatus =
    subscription?.status ??
    (typeof bootstrap.organization_context.license_status === "string"
      ? bootstrap.organization_context.license_status
      : null);
  const organizationDefaultLocale = readOrganizationDefaultLocale(bootstrap);
  const activeBusinessPacks = readActiveBusinessPacks(bootstrap);
  const organizationName =
    typeof bootstrap.organization_context.organization_name === "string"
      ? bootstrap.organization_context.organization_name
      : null;

  const identityParsed = parseIdentityRpcPayloads({
    identityCenterRaw: bootstrap.identity_center,
    assistantIdentityRaw: bootstrap.assistant_identity,
    personalityRaw: bootstrap.personality_card,
    companionRelationshipRaw: bootstrap.companion_identity_relationship,
  });

  const identityContext =
    identityParsed.identityCenter?.has_customer ||
    identityParsed.assistantIdentity?.has_customer ||
    identityParsed.personality?.has_customer ||
    identityParsed.companionRelationship?.settings
      ? normalizeCompanionIdentityContext({
          locale,
          identityCenter: identityParsed.identityCenter,
          assistantIdentity: identityParsed.assistantIdentity,
          personality: identityParsed.personality,
          companionRelationship: identityParsed.companionRelationship,
        })
      : createEmptyCompanionIdentityContext({ language: locale });

  return createEmptyCompanionTenantContext({
    organizationId: bootstrap.scope.organizationId,
    companyId: bootstrap.scope.companyId,
    organizationName,
    organizationRole: bootstrap.scope.organizationRole,
    planKey,
    subscriptionStatus,
    activeBusinessPacks,
    enabledFeatures: deriveEnabledPortalFeatures(planKey),
    effectivePermissions,
    locale,
    organizationDefaultLocale,
    identityContext,
  });
}
