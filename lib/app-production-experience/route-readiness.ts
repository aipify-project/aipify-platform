import type { AppPortalNavId } from "@/lib/app-portal/nav-config";

/**
 * Production readiness for APP portal nav items.
 * - production: visible when license/permission gates pass
 * - hidden: never shown in customer nav until finished
 * - redirect: nav points at a finished surface (href override)
 *
 * Maps to canonical NavReadiness:
 * production/redirect → operational
 * hidden → foundation (or disabled when permanently withheld)
 */
export type AppRouteReleaseStatus = "production" | "hidden" | "redirect";

export type AppRouteReadiness = {
  status: AppRouteReleaseStatus;
  /** When status is redirect, use this href instead of the nav item href. */
  redirectHref?: string;
  reason: string;
};

/**
 * Central readiness registry — ordinary customers only see production-ready routes.
 * Placeholder foundation pages are hidden or redirected to authoritative surfaces.
 * Canonical nav source: APP_PORTAL_NAV_GROUPS (lib/app-portal/nav-config.ts).
 */
export const APP_ROUTE_READINESS: Partial<Record<AppPortalNavId, AppRouteReadiness>> = {
  // Billing foundation shells → real commercial surfaces
  subscription: {
    status: "redirect",
    redirectHref: "/app/settings/billing",
    reason: "Portal billing shell is placeholder; settings billing is authoritative.",
  },
  paymentHistory: {
    status: "redirect",
    redirectHref: "/app/settings/billing",
    reason: "Payment history shell is placeholder; billing center is authoritative.",
  },
  invoices: {
    status: "redirect",
    redirectHref: "/app/settings/billing",
    reason: "Invoices shell is placeholder; Platform invoices are not this shell. Billing center is the safe surface.",
  },
  upgradeOptions: {
    status: "hidden",
    reason: "Upgrade upsell must not appear as a half-finished portal shell.",
  },
  // Explicit foundation shells (renderAppPortalFoundationPage)
  appTasks: {
    status: "hidden",
    reason: "Tasks is a foundation placeholder — catalog/operations until operational.",
  },
  workflows: {
    status: "hidden",
    reason: "Workflows foundation page is not operational in customer nav.",
  },
  rolesPermissions: {
    status: "hidden",
    reason: "Roles foundation page is not operational in customer nav.",
  },
  contactSupport: {
    status: "hidden",
    reason: "Contact support foundation page is not operational in customer nav.",
  },
  accountSecurity: {
    status: "hidden",
    reason: "Account security foundation page is not operational; use settings security when ready.",
  },
  activityOverview: {
    status: "hidden",
    reason: "Organization activity foundation page is not operational in customer nav.",
  },
  apiAccess: {
    status: "hidden",
    reason: "API access foundation page is not operational in customer nav.",
  },
  // Account placeholders
  profile: {
    status: "hidden",
    reason: "Profile is coming-soon placeholder — hide until real profile ships.",
  },
  // Read-only software catalog foundation (operational presentation)
  softwareCatalog: {
    status: "production",
    reason: "Read-only software catalog over authoritative package/module/pack sources.",
  },
  // Intelligence surfaces that require explicit grants — keep gated via permissions;
  // readiness stays production so permitted roles can open them with localized lock states.
  scenarioPlanning: {
    status: "production",
    reason: "Visible only when scenario_planning permission is granted.",
  },
};

export function resolveAppRouteReadiness(navId: AppPortalNavId): AppRouteReadiness {
  return (
    APP_ROUTE_READINESS[navId] ?? {
      status: "production",
      reason: "Default production visibility subject to license and permission gates.",
    }
  );
}

export function isAppRouteNavVisible(navId: AppPortalNavId): boolean {
  const readiness = resolveAppRouteReadiness(navId);
  return readiness.status !== "hidden";
}

export function resolveAppRouteHref(navId: AppPortalNavId, fallbackHref: string): string {
  const readiness = resolveAppRouteReadiness(navId);
  if (readiness.status === "redirect" && readiness.redirectHref) {
    return readiness.redirectHref;
  }
  return fallbackHref;
}

/** Customer-safe readiness classification for canonical nav contract. */
export function toCanonicalNavReadiness(
  navId: AppPortalNavId
): "operational" | "preview" | "foundation" | "disabled" {
  const status = resolveAppRouteReadiness(navId).status;
  if (status === "hidden") {
    if (navId === "upgradeOptions" || navId === "profile") return "disabled";
    return "foundation";
  }
  return "operational";
}
