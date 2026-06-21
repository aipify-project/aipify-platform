import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import { isCustomerPortalHost, isSuperAdminHost } from "./hosts";
import {
  CUSTOMER_PORTAL_ROUTE,
  isPathAllowedOnPortal,
  isPortalAuthPath,
  PLATFORM_ADMIN_ROUTE,
  SUPER_ADMIN_ROUTE,
} from "./routes";
import type { PlatformAccessProfile, PortalRouteDecision } from "./types";

export async function getPlatformAccessProfile(
  supabase: SupabaseClient
): Promise<PlatformAccessProfile> {
  const { data } = await supabase.from("platform_admins").select("role").maybeSingle();

  return {
    isPlatformAdmin: Boolean(data),
    isSuperAdmin: data?.role === "super_admin",
    role: data?.role ?? null,
  };
}

export function resolvePortalRouteDecision(
  pathname: string,
  host: string | null | undefined,
  access: PlatformAccessProfile
): PortalRouteDecision {
  if (isPortalAuthPath(pathname)) {
    return { action: "continue" };
  }

  if (isSuperAdminHost(host) && (pathname === "/" || pathname === "")) {
    return { action: "rewrite", pathname: SUPER_ADMIN_ROUTE };
  }

  if (isCustomerPortalHost(host)) {
    if (pathname.startsWith(SUPER_ADMIN_ROUTE) || pathname.startsWith(PLATFORM_ADMIN_ROUTE)) {
      return { action: "redirect", pathname: CUSTOMER_PORTAL_ROUTE };
    }
  }

  if (isSuperAdminHost(host) && !isPathAllowedOnPortal(pathname, "superAdmin")) {
    return { action: "redirect", pathname: SUPER_ADMIN_ROUTE };
  }

  if (pathname.startsWith(SUPER_ADMIN_ROUTE) && !access.isSuperAdmin) {
    return {
      action: "redirect",
      pathname: access.isPlatformAdmin ? PLATFORM_ADMIN_ROUTE : CUSTOMER_PORTAL_ROUTE,
    };
  }

  if (pathname.startsWith(PLATFORM_ADMIN_ROUTE) && !access.isPlatformAdmin) {
    return { action: "redirect", pathname: CUSTOMER_PORTAL_ROUTE };
  }

  return { action: "continue" };
}

export function resolvePostLoginPath(
  host: string | null | undefined,
  platformRole: string | null | undefined,
  nextPath?: string | null
): string {
  const safeNext = sanitizeNextPath(nextPath);
  if (safeNext) {
    return safeNext;
  }

  if (platformRole === "super_admin" && isSuperAdminHost(host)) {
    return SUPER_ADMIN_ROUTE;
  }
  if (platformRole) {
    return PLATFORM_ADMIN_ROUTE;
  }
  return "/app/command-center";
}
