/** Shared public/private pathname classification for Website Kompis (locale-aware). */

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

function matchesPrivatePrefix(pathname: string): boolean {
  for (const prefix of WEBSITE_KOMPIS_PRIVATE_PATH_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return true;
    }
  }
  return false;
}

export function isPrivateWebsiteKompisPathnameNormalized(
  pathname: string | undefined,
): boolean {
  if (!pathname) return false;
  const raw = pathname.trim().toLowerCase();
  if (!raw.startsWith("/")) return true;
  if (matchesPrivatePrefix(raw)) return true;
  return matchesPrivatePrefix(stripWebsiteKompisLocalePrefix(raw).toLowerCase());
}
