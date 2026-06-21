import { isCustomerPortalHost, isMarketingApexHost, normalizeHost } from "@/lib/portals/hosts";

const PRODUCTION_AUTH_COOKIE_DOMAIN = ".aipify.ai";

export function isAipifyAuthCookieHost(host: string | null | undefined): boolean {
  const normalized = normalizeHost(host);
  if (!normalized) return false;
  return isMarketingApexHost(host) || isCustomerPortalHost(host);
}

/** Share Supabase auth cookies across aipify.ai and app.aipify.ai in production. */
export function mergeAuthCookieOptions(
  options?: Record<string, unknown>,
  host?: string | null
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...(options ?? {}) };

  if (!merged.path) merged.path = "/";
  if (!merged.sameSite) merged.sameSite = "lax";

  if (process.env.NODE_ENV === "production") {
    if (merged.secure === undefined) merged.secure = true;
    if (isAipifyAuthCookieHost(host)) {
      merged.domain = PRODUCTION_AUTH_COOKIE_DOMAIN;
    }
  }

  return merged;
}

export function getBrowserAuthCookieOptions(): {
  domain?: string;
  path: string;
  sameSite: "lax";
  secure?: boolean;
} {
  if (process.env.NODE_ENV !== "production") {
    return { path: "/", sameSite: "lax" };
  }

  return {
    domain: PRODUCTION_AUTH_COOKIE_DOMAIN,
    path: "/",
    sameSite: "lax",
    secure: true,
  };
}
