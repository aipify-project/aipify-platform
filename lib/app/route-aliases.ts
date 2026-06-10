/**
 * Maps canonical /app routes to legacy /dashboard routes during Layer 2 migration.
 * Remove entries as pages move from app/dashboard/ to app/app/.
 */
export const APP_ROUTE_ALIASES: Record<string, string> = {
  "/app": "/dashboard",
  "/app/presence": "/dashboard",
  "/app/assistant": "/dashboard/assistant",
  "/app/support": "/dashboard/support",
  "/app/actions": "/dashboard",
  "/app/recommendations": "/dashboard",
  "/app/installations": "/dashboard/installs",
  "/app/domains": "/dashboard/installs",
  "/app/team": "/dashboard/team",
  "/app/billing": "/dashboard/billing",
  "/app/settings": "/dashboard/settings",
  "/app/analytics": "/dashboard/analytics",
  "/app/commerce": "/dashboard/commerce",
  "/app/notifications": "/dashboard/notifications",
};

export function resolveAppHref(canonicalHref: string): string {
  return APP_ROUTE_ALIASES[canonicalHref] ?? canonicalHref;
}

export function isAppLayerPath(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/");
}
