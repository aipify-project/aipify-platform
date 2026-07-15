import type { PortalDefinition } from "./types";
import { isNeutralMfaPath } from "@/lib/auth/two-factor/mfa-portal-routing";

export const CUSTOMER_PORTAL_ROUTE = "/app";
export const PLATFORM_ADMIN_ROUTE = "/platform";
export const SUPER_ADMIN_ROUTE = "/super";

export const PORTALS: Record<PortalDefinition["id"], PortalDefinition> = {
  customer: {
    id: "customer",
    routePrefix: CUSTOMER_PORTAL_ROUTE,
    domain: "app.aipify.ai",
    purpose: "Customer-facing Business Panel for paying organizations.",
  },
  platform: {
    id: "platform",
    routePrefix: PLATFORM_ADMIN_ROUTE,
    domain: "shared host",
    purpose: "Internal platform administration without full Super Admin access.",
  },
  superAdmin: {
    id: "superAdmin",
    routePrefix: SUPER_ADMIN_ROUTE,
    domain: "super.aipify.ai",
    purpose: "Aipify Group global control center — multi-tenant impact.",
  },
};

export function resolvePortalFromPath(pathname: string): PortalDefinition["id"] | null {
  if (pathname.startsWith(SUPER_ADMIN_ROUTE)) return "superAdmin";
  if (pathname.startsWith(PLATFORM_ADMIN_ROUTE)) return "platform";
  if (pathname.startsWith(CUSTOMER_PORTAL_ROUTE) || pathname.startsWith("/dashboard")) {
    return "customer";
  }
  return null;
}

export function isPortalAuthPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/update-password") ||
    pathname.startsWith("/verify-2fa") ||
    pathname.startsWith("/app/settings/two-factor") ||
    isNeutralMfaPath(pathname)
  );
}

export function isPathAllowedOnPortal(pathname: string, portalId: PortalDefinition["id"]): boolean {
  if (isPortalAuthPath(pathname)) return true;

  switch (portalId) {
    case "customer":
      return (
        pathname.startsWith(CUSTOMER_PORTAL_ROUTE) ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/api/")
      );
    case "platform":
      return pathname.startsWith(PLATFORM_ADMIN_ROUTE) || pathname.startsWith("/api/");
    case "superAdmin":
      return pathname.startsWith(SUPER_ADMIN_ROUTE) || pathname.startsWith("/api/");
    default:
      return false;
  }
}
