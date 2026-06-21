import { sanitizeNextPath } from "@/lib/auth/safe-next-path";

export type TwoFactorStatus = {
  authenticated: boolean;
  enabled: boolean;
  required: boolean;
  confirmed_at: string | null;
  last_verified_at: string | null;
  session_verified: boolean;
  recovery_codes_remaining: number;
  needs_enrollment: boolean;
  needs_verification: boolean;
};

export function sessionNeedsTwoFactorGate(status: TwoFactorStatus): boolean {
  if (!status.authenticated) return false;
  if (status.needs_enrollment) return true;
  if (status.needs_verification) return true;
  return false;
}

export function twoFactorRedirectPath(
  status: TwoFactorStatus,
  nextPath?: string | null
): string | null {
  if (!sessionNeedsTwoFactorGate(status)) return null;

  const safeNext = sanitizeNextPath(nextPath);
  const next = safeNext ? `?next=${encodeURIComponent(safeNext)}` : "";

  if (status.needs_enrollment) {
    const q = safeNext ? `?required=1&next=${encodeURIComponent(safeNext)}` : "?required=1";
    return `/app/settings/two-factor${q}`;
  }

  return `/verify-2fa${next}`;
}
