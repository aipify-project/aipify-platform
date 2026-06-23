import {
  CUSTOMER_PORTAL_DOMAIN,
  isCustomerPortalHost,
  isMarketingApexHost,
  normalizeHost,
} from "@/lib/portals/hosts";

/** Canonical auth paths — must stay aligned with Supabase redirect allow list. */
export const AUTH_REDIRECT_PATHS = {
  callback: "/auth/callback",
  resetPassword: "/auth/reset-password",
  updatePassword: "/auth/update-password",
  login: "/login",
} as const;

const DEV_DEFAULT_APP_ORIGIN = "http://localhost:3001";
const PRODUCTION_APP_ORIGIN = `https://${CUSTOMER_PORTAL_DOMAIN}`;

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, "");
}

function isLocalDevHost(host: string | null | undefined): boolean {
  const normalized = normalizeHost(host);
  if (!normalized) return true;
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized.endsWith(".localhost")
  );
}

function isDeployedRuntime(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production"
  );
}

export type ResolveAuthAppOriginOptions = {
  /** Incoming Host / x-forwarded-host from the active request. */
  requestHost?: string | null;
};

/**
 * Resolve the absolute app origin for auth emails and redirects.
 * Production and deployed runtimes never emit localhost — even if NEXT_PUBLIC_APP_URL is local.
 */
export function resolveAuthAppOrigin(options: ResolveAuthAppOriginOptions = {}): string {
  const requestHost = options.requestHost ?? null;
  const normalizedRequestHost = normalizeHost(requestHost);

  if (normalizedRequestHost && normalizedRequestHost !== "app.localhost") {
    if (isCustomerPortalHost(requestHost)) {
      return PRODUCTION_APP_ORIGIN;
    }
    if (isMarketingApexHost(requestHost) && !isLocalDevHost(requestHost)) {
      return PRODUCTION_APP_ORIGIN;
    }
  }

  const explicitOrigin = process.env.AUTH_APP_ORIGIN?.trim();
  if (explicitOrigin) {
    const normalized = normalizeOrigin(explicitOrigin);
    if (isDeployedRuntime() && normalized.includes("localhost")) {
      return PRODUCTION_APP_ORIGIN;
    }
    return normalized;
  }

  if (isDeployedRuntime()) {
    return PRODUCTION_APP_ORIGIN;
  }

  if (!isLocalDevHost(requestHost)) {
    if (requestHost) {
      const protocol = normalizedRequestHost.endsWith(".localhost") ? "http" : "https";
      return normalizeOrigin(`${protocol}://${requestHost}`);
    }
    return PRODUCTION_APP_ORIGIN;
  }

  if (process.env.NODE_ENV !== "development") {
    return PRODUCTION_APP_ORIGIN;
  }

  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return normalizeOrigin(fromEnv || DEV_DEFAULT_APP_ORIGIN);
}

/**
 * Server-side auth origin for reset, invite, and callback URLs.
 * Prefer {@link resolveAuthAppOrigin} with request host in Route Handlers.
 */
export function getAuthAppOrigin(): string {
  return resolveAuthAppOrigin();
}

/** Build absolute auth URL on the resolved app origin. */
export function buildAuthRedirectUrl(
  pathname: string,
  search = "",
  options: ResolveAuthAppOriginOptions = {},
): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const query = search.startsWith("?") ? search : search ? `?${search}` : "";
  return `${resolveAuthAppOrigin(options)}${path}${query}`;
}

/** Password reset emails land on callback, then continue to update-password. */
export function buildPasswordResetRedirectUrl(options: ResolveAuthAppOriginOptions = {}): string {
  const next = encodeURIComponent(AUTH_REDIRECT_PATHS.updatePassword);
  return buildAuthRedirectUrl(AUTH_REDIRECT_PATHS.callback, `next=${next}&type=recovery`, options);
}

/** Sign-up, invite, and magic-link confirmation callbacks. */
export function buildAuthCallbackRedirectUrl(
  nextPath = AUTH_REDIRECT_PATHS.login,
  options: ResolveAuthAppOriginOptions = {},
): string {
  const next = encodeURIComponent(nextPath);
  return buildAuthRedirectUrl(AUTH_REDIRECT_PATHS.callback, `next=${next}`, options);
}

export function readRequestHostFromHeaders(headerStore: Headers): string | null {
  return headerStore.get("x-forwarded-host") ?? headerStore.get("host");
}

/**
 * Client-side auth origin — mirrors server rules at build time.
 * Production bundles always emit https://app.aipify.ai (not window.location.origin).
 */
export function getClientAuthAppOrigin(): string {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    return normalizeOrigin(window.location.origin);
  }

  return PRODUCTION_APP_ORIGIN;
}

export function buildClientAuthRedirectUrl(pathname: string, search = ""): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const query = search.startsWith("?") ? search : search ? `?${search}` : "";
  return `${getClientAuthAppOrigin()}${path}${query}`;
}

export function buildClientAuthCallbackRedirectUrl(nextPath = AUTH_REDIRECT_PATHS.login): string {
  const next = encodeURIComponent(nextPath);
  return buildClientAuthRedirectUrl(AUTH_REDIRECT_PATHS.callback, `next=${next}`);
}
