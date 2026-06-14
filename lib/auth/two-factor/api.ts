import type { SupabaseClient } from "@supabase/supabase-js";
import {
  deriveSessionFingerprint,
  type TwoFactorStatus,
} from "@/lib/auth/two-factor";

export async function getTwoFactorStatusForSession(
  supabase: SupabaseClient
): Promise<TwoFactorStatus | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const fingerprint = deriveSessionFingerprint(session.access_token);
  const { data, error } = await supabase.rpc("get_two_factor_status", {
    p_session_fingerprint: fingerprint,
  });

  if (error) throw new Error(error.message);
  return data as TwoFactorStatus;
}

export async function requireAuthenticatedUser(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return user;
}

export function mapTwoFactorError(code: string): string {
  const map: Record<string, string> = {
    unauthorized: "unauthorized",
    no_pending_enrollment: "noPendingEnrollment",
    not_enabled: "notEnabled",
    required_by_policy: "requiredByPolicy",
    challenge_locked_or_expired: "challengeLocked",
    challenge_not_found: "challengeNotFound",
    totp_verify_app_layer: "invalidCode",
    complete_failed: "generic",
    invalid_code: "invalidCode",
    passwordRequired: "passwordRequired",
    invalid_password: "invalidPassword",
    encryption_unavailable: "configError",
  };
  return map[code] ?? "generic";
}
