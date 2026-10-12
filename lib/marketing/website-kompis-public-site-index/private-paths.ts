/** Shared public/private pathname classification for Website Kompis (locale-aware). */

/**
 * Full crawl/index deny list (includes public auth entry paths that must not be indexed).
 * Surface/capture failsafe uses {@link isPrivateWebsiteKompisSurfacePathname} instead.
 */
export const WEBSITE_KOMPIS_PRIVATE_PATH_PREFIXES = [
  "/admin",
  "/member",
  "/members",
  "/profile",
  "/account",
  "/auth",
  "/onboarding",
  "/checkout",
  "/payment",
  "/messages",
  "/billing",
  "/settings",
  "/login",
  "/logout",
  "/signin",
  "/signup",
  "/register",
  "/app",
  "/api",
  "/chat",
  "/discover",
  "/wishlist",
  "/marketplace",
] as const;

/**
 * Visitor-reachable auth entry paths — not a surface failsafe hide trigger.
 * Host access class still decides; indexing may still treat these as private.
 */
export const WEBSITE_KOMPIS_PUBLIC_AUTH_ENTRY_PATH_PREFIXES = [
  "/login",
  "/register",
  "/signin",
  "/signup",
] as const;

/**
 * Surface/capture/server pageContext deny prefixes (index list minus public auth entries).
 * Keep in sync with `public/embed/website-kompis.js` PRIVATE_PATH_PREFIXES.
 */
export const WEBSITE_KOMPIS_SURFACE_PRIVATE_PATH_PREFIXES =
  WEBSITE_KOMPIS_PRIVATE_PATH_PREFIXES.filter(
    (prefix) =>
      !(WEBSITE_KOMPIS_PUBLIC_AUTH_ENTRY_PATH_PREFIXES as readonly string[]).includes(prefix),
  );

const LOCALE_SEGMENT = /^(en|no|nb|nn|sv|da|pl|uk|es|de|fr)$/i;

/** Strip a leading locale segment: `/no/member` → `/member`. */
export function stripWebsiteKompisLocalePrefix(pathname: string): string {
  const normalized = pathname.trim();
  if (!normalized.startsWith("/")) return normalized;
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (!LOCALE_SEGMENT.test(parts[0])) {
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }
  const rest = parts.slice(1);
  return rest.length === 0 ? "/" : `/${rest.join("/")}`;
}

function matchesPrefixList(pathname: string, prefixes: readonly string[]): boolean {
  for (const prefix of prefixes) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return true;
    }
  }
  return false;
}

function matchesPrivatePrefix(pathname: string): boolean {
  return matchesPrefixList(pathname, WEBSITE_KOMPIS_PRIVATE_PATH_PREFIXES);
}

function matchesSurfacePrivatePrefix(pathname: string): boolean {
  return matchesPrefixList(pathname, WEBSITE_KOMPIS_SURFACE_PRIVATE_PATH_PREFIXES);
}

function matchesPublicAuthEntryPrefix(pathname: string): boolean {
  return matchesPrefixList(pathname, WEBSITE_KOMPIS_PUBLIC_AUTH_ENTRY_PATH_PREFIXES);
}

/** Index/crawl: known non-public content paths (includes auth entry URLs). */
export function isPrivateWebsiteKompisPathnameNormalized(
  pathname: string | undefined,
): boolean {
  if (!pathname) return false;
  const raw = pathname.trim().toLowerCase();
  if (!raw.startsWith("/")) return true;
  if (matchesPrivatePrefix(raw)) return true;
  return matchesPrivatePrefix(stripWebsiteKompisLocalePrefix(raw).toLowerCase());
}

/** Visitor auth entry (`/login`, `/register`, …) — surface may stay public when host says so. */
export function isWebsiteKompisPublicAuthEntryPathname(
  pathname: string | undefined,
): boolean {
  if (!pathname) return false;
  const raw = pathname.trim().toLowerCase();
  if (!raw.startsWith("/")) return false;
  if (matchesPublicAuthEntryPrefix(raw)) return true;
  return matchesPublicAuthEntryPrefix(stripWebsiteKompisLocalePrefix(raw).toLowerCase());
}

/**
 * Surface/capture/server pageContext failsafe.
 * Path policy is a restriction — not complete detection of every customer private page.
 * Host `data-aipify-kompis-access` remains required for unknown protected routes.
 */
export function isPrivateWebsiteKompisSurfacePathname(
  pathname: string | undefined,
): boolean {
  if (!pathname) return false;
  const raw = pathname.trim().toLowerCase();
  if (!raw.startsWith("/")) return true;
  if (isWebsiteKompisPublicAuthEntryPathname(raw)) return false;
  if (matchesSurfacePrivatePrefix(raw)) return true;
  const stripped = stripWebsiteKompisLocalePrefix(raw).toLowerCase();
  if (isWebsiteKompisPublicAuthEntryPathname(stripped)) return false;
  return matchesSurfacePrivatePrefix(stripped);
}
