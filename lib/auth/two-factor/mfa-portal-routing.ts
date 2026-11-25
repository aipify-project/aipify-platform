import { sanitizeNextPath } from "@/lib/auth/safe-next-path";

const PLATFORM_ADMIN_ROUTE = "/platform";
const SUPER_ADMIN_ROUTE = "/super";
const PARTNERS_HOME_ROUTE = "/partners";
const CUSTOMER_HOME_ROUTE = "/app/command-center";

export const NEUTRAL_MFA_BASE_ROUTE = "/auth/two-factor";
export const NEUTRAL_MFA_ENROLL_ROUTE = "/auth/two-factor/enroll";
export const NEUTRAL_MFA_VERIFY_ROUTE = "/auth/two-factor/verify";

export type MfaPortalKind = "platform" | "customer" | "partner";

export function isPlatformPortalDestination(path: string | null | undefined): boolean {
  if (!path) return false;
  return (
    path === PLATFORM_ADMIN_ROUTE ||
    path.startsWith(`${PLATFORM_ADMIN_ROUTE}/`) ||
    path === SUPER_ADMIN_ROUTE ||
    path.startsWith(`${SUPER_ADMIN_ROUTE}/`)
  );
}

/** Certified Sales Partner workspace — must not force customer APP org bootstrap. */
export function isPartnerPortalDestination(path: string | null | undefined): boolean {
  if (!path) return false;
  const pathname = path.split("?")[0] ?? path;
  return pathname === PARTNERS_HOME_ROUTE || pathname.startsWith(`${PARTNERS_HOME_ROUTE}/`);
}

export function resolveMfaPortalKind(nextPath?: string | null): MfaPortalKind {
  const safe = sanitizeNextPath(nextPath);
  if (isPlatformPortalDestination(safe)) return "platform";
  if (isPartnerPortalDestination(safe)) return "partner";
  return "customer";
}

export function resolveMfaSuccessDestination(
  nextPath?: string | null,
  portalKind: MfaPortalKind | "auto" = "auto",
): string {
  const safe = sanitizeNextPath(nextPath);
  if (safe) return safe;

  const kind = portalKind === "auto" ? resolveMfaPortalKind(nextPath) : portalKind;
  return defaultDestinationForKind(kind);
}

function defaultDestinationForKind(kind: MfaPortalKind): string {
  if (kind === "platform") return PLATFORM_ADMIN_ROUTE;
  if (kind === "partner") return PARTNERS_HOME_ROUTE;
  return CUSTOMER_HOME_ROUTE;
}

/**
 * Partner and platform enrollment use the neutral auth shell so CSP sellers are never
 * forced through `/app/settings/two-factor` (customer org context).
 */
export function buildMfaEnrollPath(
  nextPath?: string | null,
  portalKind: MfaPortalKind | "auto" = "auto",
): string {
  const kind = portalKind === "auto" ? resolveMfaPortalKind(nextPath) : portalKind;
  const safe = sanitizeNextPath(nextPath);

  if (kind === "platform" || kind === "partner") {
    const destination = safe ?? defaultDestinationForKind(kind);
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

  if (kind === "platform" || kind === "partner") {
    const destination = safe ?? defaultDestinationForKind(kind);
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
