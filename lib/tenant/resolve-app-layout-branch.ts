import type { AppOrganizationContextState } from "@/lib/tenant/resolve-app-organization-context";

export type AppLayoutBranch = "shell" | "bootstrap" | "platform";

/**
 * Pure APP layout branch selector.
 * Only ready / subscription_inactive / license_inactive keep the APP shell.
 * Platform redirect applies only for membership_missing with Platform access.
 * Everything else falls back safely to bootstrap.
 */
export function resolveAppLayoutBranch(input: {
  state: AppOrganizationContextState;
  hasPlatformAccess: boolean;
}): AppLayoutBranch {
  const { state, hasPlatformAccess } = input;

  if (state === "membership_missing" && hasPlatformAccess) {
    return "platform";
  }

  if (state === "ready" || state === "subscription_inactive" || state === "license_inactive") {
    return "shell";
  }

  return "bootstrap";
}
