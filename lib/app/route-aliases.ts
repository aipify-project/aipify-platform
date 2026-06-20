/**
 * In-app route aliases — canonical /app paths only.
 * Legacy /dashboard/* URLs redirect via lib/app/legacy-dashboard-redirects.ts.
 */
export const APP_ROUTE_ALIASES: Record<string, string> = {
  "/app/pause-reflection-protocol": "/app/wisdom-intervention-protocol",
  "/app/settings/security": "/app/security",
  "/app/support": "/app/support/history",
};

export function resolveAppHref(canonicalHref: string): string {
  return APP_ROUTE_ALIASES[canonicalHref] ?? canonicalHref;
}

export function isAppLayerPath(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/");
}
