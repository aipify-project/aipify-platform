import type { NextRequest } from "next/server";
import { sanitizeNextPath, isCustomerPortalPath } from "@/lib/auth/safe-next-path";
import {
  CUSTOMER_PORTAL_DOMAIN,
  isCustomerPortalHost,
  isMarketingApexHost,
} from "@/lib/portals/hosts";

export { CUSTOMER_PORTAL_DOMAIN };

function resolveCustomerPortalOrigin(request: NextRequest): string {
  const host = request.headers.get("host") ?? "";
  const portMatch = host.match(/:(\d+)$/);
  const port = portMatch?.[1];

  if (process.env.NODE_ENV !== "production") {
    return port ? `http://app.localhost:${port}` : "http://app.localhost";
  }

  return `https://${CUSTOMER_PORTAL_DOMAIN}`;
}

export function buildCustomerPortalUrl(
  request: NextRequest,
  pathname: string,
  search = ""
): URL {
  const url = new URL(pathname, resolveCustomerPortalOrigin(request));
  url.search = search;
  return url;
}

export function shouldCanonicalizeToCustomerPortal(
  host: string | null | undefined,
  pathname: string
): boolean {
  if (!isCustomerPortalPath(pathname)) return false;
  if (isCustomerPortalHost(host)) return false;
  return isMarketingApexHost(host);
}

export function resolveCustomerPortalLoginUrl(
  request: NextRequest,
  pathname: string
): URL {
  const loginUrl = buildCustomerPortalUrl(request, "/login");
  loginUrl.searchParams.set("next", sanitizeNextPath(pathname) ?? pathname);
  return loginUrl;
}

export function resolveLoginPageCanonicalRedirect(
  request: NextRequest,
  host: string | null | undefined,
  nextParam: string | null
): URL | null {
  if (!isMarketingApexHost(host)) return null;

  const nextPath = sanitizeNextPath(nextParam);
  if (!nextPath || !isCustomerPortalPath(nextPath)) return null;

  const loginUrl = buildCustomerPortalUrl(request, "/login");
  loginUrl.searchParams.set("next", nextPath);
  return loginUrl;
}

export function resolvePostLoginRedirectUrl(
  destination: string,
  host: string | null | undefined,
  protocol: "http:" | "https:" = "https:"
): string {
  const safeDestination = sanitizeNextPath(destination) ?? destination;
  if (!isCustomerPortalPath(safeDestination)) return safeDestination;
  if (isCustomerPortalHost(host)) return safeDestination;

  if (process.env.NODE_ENV !== "production") {
    return safeDestination;
  }

  return `${protocol}//${CUSTOMER_PORTAL_DOMAIN}${safeDestination}`;
}
