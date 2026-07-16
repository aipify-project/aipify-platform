import type { AppOrganizationContextState } from "@/lib/tenant/resolve-app-organization-context";

export type AppPortalAccessMessageKey =
  | "pageLoadError"
  | "entitlementLocked"
  | "permissionMissing"
  | "subscriptionRequired"
  | "organizationMissing"
  | "noDataYet"
  | "accessDenied";

const ACCESS_STATE_TO_KEY: Partial<Record<AppOrganizationContextState, AppPortalAccessMessageKey>> = {
  unauthenticated: "accessDenied",
  user_not_provisioned: "organizationMissing",
  organization_missing: "organizationMissing",
  membership_missing: "organizationMissing",
  selection_required: "organizationMissing",
  subscription_inactive: "subscriptionRequired",
  license_inactive: "subscriptionRequired",
  entitlement_missing: "entitlementLocked",
  permission_missing: "permissionMissing",
  access_denied: "permissionMissing",
  database_execution_error: "pageLoadError",
};

const STABLE_CODE_TO_KEY: Record<string, AppPortalAccessMessageKey> = {
  load_error: "pageLoadError",
  permission_missing: "permissionMissing",
  entitlement_missing: "entitlementLocked",
  subscription_inactive: "subscriptionRequired",
  organization_context_required: "organizationMissing",
  access_denied: "accessDenied",
};

export function resolveAppPortalAccessMessageKey(
  accessState?: AppOrganizationContextState | null,
  stableCode?: string | null
): AppPortalAccessMessageKey {
  if (stableCode && STABLE_CODE_TO_KEY[stableCode]) {
    return STABLE_CODE_TO_KEY[stableCode];
  }
  if (accessState && ACCESS_STATE_TO_KEY[accessState]) {
    return ACCESS_STATE_TO_KEY[accessState];
  }
  return "accessDenied";
}
