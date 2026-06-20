import type { AppOrganizationContextState } from "./resolve-app-organization-context";

type AppPortalAccessLabels = {
  accessDenied: string;
  organizationMissing: string;
  subscriptionRequired: string;
  permissionMissing: string;
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
      return labels.subscriptionRequired;
    case "access_denied":
      return labels.permissionMissing;
    default:
      return labels.accessDenied;
  }
}
