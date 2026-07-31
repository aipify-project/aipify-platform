import type { AppPortalNavId } from "@/lib/app-portal/nav-config";

/**
 * Production readiness for APP portal nav items.
 * - production: visible when license/permission gates pass
 * - hidden: never shown in customer nav until finished
 * - redirect: nav points at a finished surface (href override)
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
    reason: "Invoices shell is placeholder; billing center is authoritative.",
  },
  upgradeOptions: {
    status: "hidden",
    reason: "Upgrade upsell must not appear as a half-finished portal shell.",
  },
  // Account placeholders
  profile: {
    status: "hidden",
    reason: "Profile is coming-soon placeholder — hide until real profile ships.",
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
