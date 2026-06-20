import type { AccessRequiredRule } from "@/lib/system-notice/access-rules";
import type { AppOrganizationContextState } from "./resolve-app-organization-context";

type AppPortalAccessLabels = {
  accessDenied: string;
  organizationMissing: string;
  subscriptionRequired: string;
  permissionMissing: string;
  entitlementMissing: string;
};

export function resolveAppPortalAccessMessage(
  state: AppOrganizationContextState | string | undefined,
  labels: AppPortalAccessLabels
): string {
  switch (state) {
    case "organization_missing":
    case "user_not_provisioned":
    case "membership_missing":
      return labels.organizationMissing;
    case "subscription_inactive":
    case "license_inactive":
      return labels.subscriptionRequired;
    case "entitlement_missing":
      return labels.entitlementMissing;
    case "permission_missing":
    case "access_denied":
      return labels.permissionMissing;
    default:
      return labels.accessDenied;
  }
}

export function resolveAppPortalAccessRule(
  state: AppOrganizationContextState | string | undefined
): AccessRequiredRule {
  switch (state) {
    case "entitlement_missing":
      return "business_pack";
    case "subscription_inactive":
    case "license_inactive":
      return "professional_plan";
    case "permission_missing":
    case "access_denied":
    case "membership_missing":
    case "organization_missing":
    case "user_not_provisioned":
      return "role_restricted";
    default:
      return "role_restricted";
  }
}
