import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

/** Server-side clients must not refresh — proxy/middleware owns token rotation. */
export const SERVER_SUPABASE_AUTH_OPTIONS = {
  autoRefreshToken: false,
} as const;

const ACCESS_TOKEN_SKEW_SECONDS = 15;

export function isSessionAccessValid(
  session: Session | null | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (!session?.access_token || !session.user) return false;
  const expiresAt = session.expires_at ?? 0;
  return expiresAt * 1000 > nowMs + ACCESS_TOKEN_SKEW_SECONDS * 1000;
}

export function isAuthTransientError(message: string | null | undefined): boolean {
  const normalized = (message ?? "").toLowerCase();
  return (
    normalized.includes("fetch") ||
    normalized.includes("network") ||
    normalized.includes("timeout") ||
    normalized.includes("already used")
  );
}

/** Read authenticated user from cookie session without triggering refresh. */
export async function getAuthenticatedUserFromSession(
  supabase: SupabaseClient,
): Promise<User | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return isSessionAccessValid(session) ? (session?.user ?? null) : null;
}
