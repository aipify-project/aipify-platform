/**
 * Maps canonical /app routes to legacy /dashboard routes during Layer 2 migration.
 * Remove entries as pages move from app/dashboard/ to app/app/.
 */
export const APP_ROUTE_ALIASES: Record<string, string> = {
  "/app/pause-reflection-protocol": "/app/wisdom-intervention-protocol",
  "/app/support": "/dashboard/support",
  "/app/billing": "/dashboard/billing",
  "/app/analytics": "/dashboard/analytics",
  "/app/settings/security": "/app/security",
};

export function resolveAppHref(canonicalHref: string): string {
  return APP_ROUTE_ALIASES[canonicalHref] ?? canonicalHref;
}

export function isAppLayerPath(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/");
}
