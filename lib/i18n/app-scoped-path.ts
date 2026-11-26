/**
 * Paths that resolve UI language through the signed-in (APP-scope) locale registry.
 * The partners seller portal is an authenticated workspace, so it shares the same
 * core locale registry as the Customer APP — public certificate verification stays public.
 */
export function isPartnersAppScopedPath(pathname: string): boolean {
  if (pathname === "/partners/academy/verify" || pathname.startsWith("/partners/academy/verify/")) {
    return false;
  }
  return pathname === "/partners" || pathname.startsWith("/partners/");
}

export function isAppScopedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/app") ||
    pathname.startsWith("/dashboard") ||
    isPartnersAppScopedPath(pathname)
  );
}
