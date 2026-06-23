import { CUSTOMER_PORTAL_DOMAIN } from "@/lib/portals/hosts";

/** Canonical auth paths — must stay aligned with Supabase redirect allow list. */
export const AUTH_REDIRECT_PATHS = {
  callback: "/auth/callback",
  resetPassword: "/auth/reset-password",
  updatePassword: "/auth/update-password",
  login: "/login",
} as const;

const DEV_DEFAULT_APP_ORIGIN = "http://localhost:3001";

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, "");
}

/**
 * Server-side auth origin for reset, invite, and callback URLs.
 * Production always uses the customer portal — never localhost.
 */
export function getAuthAppOrigin(): string {
  if (process.env.NODE_ENV === "development") {
    const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
    return normalizeOrigin(fromEnv || DEV_DEFAULT_APP_ORIGIN);
  }

  return `https://${CUSTOMER_PORTAL_DOMAIN}`;
}

/** Build absolute auth URL on the resolved app origin. */
export function buildAuthRedirectUrl(pathname: string, search = ""): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const query = search.startsWith("?") ? search : search ? `?${search}` : "";
  return `${getAuthAppOrigin()}${path}${query}`;
}

/** Password reset emails land on callback, then continue to update-password. */
export function buildPasswordResetRedirectUrl(): string {
  const next = encodeURIComponent(AUTH_REDIRECT_PATHS.updatePassword);
  return buildAuthRedirectUrl(AUTH_REDIRECT_PATHS.callback, `next=${next}&type=recovery`);
}

/** Sign-up, invite, and magic-link confirmation callbacks. */
export function buildAuthCallbackRedirectUrl(nextPath = AUTH_REDIRECT_PATHS.login): string {
  const next = encodeURIComponent(nextPath);
  return buildAuthRedirectUrl(AUTH_REDIRECT_PATHS.callback, `next=${next}`);
}

/**
 * Client-side auth origin — mirrors server rules at build time.
 * Production bundles always emit https://app.aipify.ai (not window.location.origin).
 */
export function getClientAuthAppOrigin(): string {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    return normalizeOrigin(window.location.origin);
  }

  return `https://${CUSTOMER_PORTAL_DOMAIN}`;
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
