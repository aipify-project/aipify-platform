/** Operational SUPER routes removed in Phase 257 — redirect to PLATFORM. */
export const SUPER_OPERATIONAL_REDIRECTS: Record<string, string> = {
  "/super/playbooks": "/platform/operations/playbooks",
  "/super/academy-studio": "/platform/academy",
  "/super/growth-partner-marketing": "/platform/pilot-operations",
  "/super/growth-partner-content-requests": "/platform/pilot-operations",
  "/super/growth-partner-forecasting": "/platform/pilot-operations",
  "/super/customer-health": "/platform/customers/success-operations",
  "/super/global-insights": "/super/executive-insights",
};

export function getSuperOperationalRedirect(pathname: string): string | null {
  if (SUPER_OPERATIONAL_REDIRECTS[pathname]) {
    return SUPER_OPERATIONAL_REDIRECTS[pathname];
  }
  if (pathname.startsWith("/super/playbooks/")) {
    return pathname.replace("/super/playbooks", "/platform/operations/playbooks");
  }
  return null;
}
