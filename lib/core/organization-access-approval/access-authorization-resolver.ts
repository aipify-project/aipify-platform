import type { SupabaseClient } from "@supabase/supabase-js";
import {
  resolveMissingScopePermissionKeys,
  resolveOrganizationAccessConsentType,
  resolveProviderAccessManifest,
} from "./provider-scope-registry";

/** Read-only organization scopes eligible for business-pack entitlement authorization. */
const BUSINESS_PACK_ENTITLEMENT_MAX_RISK_LEVEL = 1 as const;

/** Three-state organization access gate — order is fixed and intentional. */
export type OrganizationAccessAuthorizationState =
  | "provider_not_connected"
  | "user_role_denied"
  | "organization_scope_required"
  | "authorized";

export type OrganizationAccessAuthorizationInput = {
  provider_key: string;
  scope_keys: readonly string[];
  /** Provider adapter/readiness — false when no configured live source exists. */
  provider_ready: boolean;
  effective_permissions: readonly string[];
  /** Active approved organization provider scopes (not user role elevation). */
  organization_has_active_scope: boolean;
};

export type OrganizationAccessAuthorizationResolution = {
  state: OrganizationAccessAuthorizationState;
  provider_ready: boolean;
  user_has_required_role: boolean;
  organization_has_active_scope: boolean;
  required_permission_keys: string[];
  missing_permission_keys: string[];
  scope_keys: readonly string[];
  provider_key: string;
};

export function resolveRequiredPermissionsForScopes(scopeKeys: readonly string[]): string[] {
  return resolveMissingScopePermissionKeys(scopeKeys);
}

export function userHasPermissionsForScopes(
  effectivePermissions: readonly string[],
  scopeKeys: readonly string[],
): { granted: boolean; missing: string[] } {
  const required = resolveRequiredPermissionsForScopes(scopeKeys);
  const missing = required.filter((key) => !effectivePermissions.includes(key));
  return { granted: missing.length === 0, missing };
}

/**
 * Internal Business Pack read scopes may authorize without a separate organization grant
 * when provider readiness, user permissions, and manifest scope metadata already gate access.
 */
export function resolvesBusinessPackEntitlementWithoutOrganizationGrant(input: {
  provider_key: string;
  scope_keys: readonly string[];
  provider_ready: boolean;
  effective_permissions: readonly string[];
}): boolean {
  if (!input.provider_ready || input.scope_keys.length === 0) {
    return false;
  }

  const manifest = resolveProviderAccessManifest(input.provider_key);
  if (!manifest || resolveOrganizationAccessConsentType(input.provider_key) !== "business_pack_entitlement") {
    return false;
  }

  const permissionCheck = userHasPermissionsForScopes(
    input.effective_permissions,
    input.scope_keys,
  );
  if (!permissionCheck.granted) {
    return false;
  }

  for (const scopeKey of input.scope_keys) {
    const scopeDefinition = manifest.required_scopes.find((scope) => scope.scope_key === scopeKey);
    if (!scopeDefinition) {
      return false;
    }
    if (scopeDefinition.risk_level > BUSINESS_PACK_ENTITLEMENT_MAX_RISK_LEVEL) {
      return false;
    }
  }

  return true;
}

/**
 * Central authorization resolver — separates provider readiness, user role permissions,
 * and organization provider consent. Organization approval never elevates user roles.
 */
export function resolveOrganizationAccessAuthorization(
  input: OrganizationAccessAuthorizationInput,
): OrganizationAccessAuthorizationResolution {
  const requiredPermissionKeys = resolveRequiredPermissionsForScopes(input.scope_keys);
  const permissionCheck = userHasPermissionsForScopes(
    input.effective_permissions,
    input.scope_keys,
  );

  let state: OrganizationAccessAuthorizationState;

  if (!input.provider_ready) {
    state = "provider_not_connected";
  } else if (!permissionCheck.granted) {
    state = "user_role_denied";
  } else if (!input.organization_has_active_scope) {
    state = "organization_scope_required";
  } else {
    state = "authorized";
  }

  return {
    state,
    provider_ready: input.provider_ready,
    user_has_required_role: permissionCheck.granted,
    organization_has_active_scope: input.organization_has_active_scope,
    required_permission_keys: requiredPermissionKeys,
    missing_permission_keys: permissionCheck.missing,
    scope_keys: input.scope_keys,
    provider_key: input.provider_key,
  };
}

export async function checkOrganizationProviderScopesActive(input: {
  supabase: SupabaseClient;
  provider_key: string;
  scope_keys: readonly string[];
}): Promise<boolean> {
  if (input.scope_keys.length === 0) return false;

  const { data, error } = await input.supabase.rpc("has_active_organization_provider_scopes", {
    p_provider_key: input.provider_key,
    p_scope_keys: input.scope_keys,
  });

  if (error) {
    return false;
  }

  return Boolean(data);
}

export async function resolveOrganizationAccessAuthorizationWithCore(input: {
  supabase: SupabaseClient;
  provider_key: string;
  scope_keys: readonly string[];
  provider_ready: boolean;
  effective_permissions: readonly string[];
}): Promise<OrganizationAccessAuthorizationResolution> {
  const organizationGrantActive = await checkOrganizationProviderScopesActive({
    supabase: input.supabase,
    provider_key: input.provider_key,
    scope_keys: input.scope_keys,
  });

  const businessPackEntitlementActive =
    !organizationGrantActive &&
    resolvesBusinessPackEntitlementWithoutOrganizationGrant({
      provider_key: input.provider_key,
      scope_keys: input.scope_keys,
      provider_ready: input.provider_ready,
      effective_permissions: input.effective_permissions,
    });

  return resolveOrganizationAccessAuthorization({
    provider_key: input.provider_key,
    scope_keys: input.scope_keys,
    provider_ready: input.provider_ready,
    effective_permissions: input.effective_permissions,
    organization_has_active_scope: organizationGrantActive || businessPackEntitlementActive,
  });
}

/** Retry is allowed only when both org provider scope and user role permit the outcome. */
export function canRetryOrganizationCapabilityAfterApproval(
  resolution: OrganizationAccessAuthorizationResolution,
): boolean {
  return (
    resolution.state === "authorized" &&
    resolution.provider_ready &&
    resolution.user_has_required_role &&
    resolution.organization_has_active_scope
  );
}
