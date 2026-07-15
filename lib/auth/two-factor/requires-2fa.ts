import {
  buildMfaEnrollPath,
  buildMfaVerifyPath,
} from "@/lib/auth/two-factor/mfa-portal-routing";

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

  if (status.needs_enrollment) {
    return buildMfaEnrollPath(nextPath);
  }

  return buildMfaVerifyPath(nextPath);
}
