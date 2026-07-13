import { sanitizeNextPath } from "@/lib/auth/safe-next-path";

const PLATFORM_ADMIN_ROUTE = "/platform";
const SUPER_ADMIN_ROUTE = "/super";

export const NEUTRAL_MFA_BASE_ROUTE = "/auth/two-factor";
export const NEUTRAL_MFA_ENROLL_ROUTE = "/auth/two-factor/enroll";
export const NEUTRAL_MFA_VERIFY_ROUTE = "/auth/two-factor/verify";

export type MfaPortalKind = "platform" | "customer";

export function isPlatformPortalDestination(path: string | null | undefined): boolean {
  if (!path) return false;
  return (
    path === PLATFORM_ADMIN_ROUTE ||
    path.startsWith(`${PLATFORM_ADMIN_ROUTE}/`) ||
    path === SUPER_ADMIN_ROUTE ||
    path.startsWith(`${SUPER_ADMIN_ROUTE}/`)
  );
}

export function resolveMfaPortalKind(nextPath?: string | null): MfaPortalKind {
  const safe = sanitizeNextPath(nextPath);
  return isPlatformPortalDestination(safe) ? "platform" : "customer";
}

export function resolveMfaSuccessDestination(
  nextPath?: string | null,
  portalKind: MfaPortalKind | "auto" = "auto",
): string {
  const safe = sanitizeNextPath(nextPath);
  if (safe) return safe;

  const kind = portalKind === "auto" ? "customer" : portalKind;
  return kind === "platform" ? PLATFORM_ADMIN_ROUTE : "/app/command-center";
}

export function buildMfaEnrollPath(
  nextPath?: string | null,
  portalKind: MfaPortalKind | "auto" = "auto",
): string {
  const kind = portalKind === "auto" ? resolveMfaPortalKind(nextPath) : portalKind;
  const safe = sanitizeNextPath(nextPath);

  if (kind === "platform") {
    const destination = safe ?? PLATFORM_ADMIN_ROUTE;
    return `${NEUTRAL_MFA_ENROLL_ROUTE}?required=1&next=${encodeURIComponent(destination)}`;
  }

  const q = safe ? `?required=1&next=${encodeURIComponent(safe)}` : "?required=1";
  return `/app/settings/two-factor${q}`;
}

export function buildMfaVerifyPath(
  nextPath?: string | null,
  portalKind: MfaPortalKind | "auto" = "auto",
): string {
  const kind = portalKind === "auto" ? resolveMfaPortalKind(nextPath) : portalKind;
  const safe = sanitizeNextPath(nextPath);

  if (kind === "platform") {
    const destination = safe ?? PLATFORM_ADMIN_ROUTE;
    return `${NEUTRAL_MFA_VERIFY_ROUTE}?next=${encodeURIComponent(destination)}`;
  }

  const next = safe ? `?next=${encodeURIComponent(safe)}` : "";
  return `/verify-2fa${next}`;
}

export function isNeutralMfaPath(pathname: string): boolean {
  return (
    pathname === NEUTRAL_MFA_BASE_ROUTE ||
    pathname.startsWith(`${NEUTRAL_MFA_BASE_ROUTE}/`)
  );
}
