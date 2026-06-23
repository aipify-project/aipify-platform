import type { SupabaseClient } from "@supabase/supabase-js";
import { AUTH_REDIRECT_PATHS } from "@/lib/auth/auth-redirect-urls";

export type RecoverySessionCheck = {
  ready: boolean;
  userId?: string;
};

/** Server-side recovery readiness — session established via callback exchange. */
export async function checkRecoverySessionReady(
  supabase: SupabaseClient,
): Promise<RecoverySessionCheck> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ready: false };
  }

  return { ready: true, userId: user.id };
}

export function buildRecoveryCallbackRedirectUrl(code: string): string {
  const params = new URLSearchParams({
    code,
    next: AUTH_REDIRECT_PATHS.updatePassword,
    type: "recovery",
  });
  return `${AUTH_REDIRECT_PATHS.callback}?${params.toString()}`;
}
