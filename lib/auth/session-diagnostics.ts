import type { Session, User } from "@supabase/supabase-js";

export type SafeSessionMetadata = {
  has_user: boolean;
  has_session: boolean;
  session_id_present: boolean;
  expires_at: number | null;
  expires_in_seconds: number | null;
  auth_event_hint: "active" | "expired_or_missing";
};

export function buildSafeSessionMetadata(input: {
  user: User | null;
  session: Session | null;
  nowMs?: number;
}): SafeSessionMetadata {
  const nowMs = input.nowMs ?? Date.now();
  const expiresAt = input.session?.expires_at ?? null;
  const expiresInSeconds =
    expiresAt != null ? Math.max(0, Math.round((expiresAt * 1000 - nowMs) / 1000)) : null;

  const sessionId =
    typeof input.session?.user?.id === "string" && input.session.access_token
      ? decodeJwtSessionId(input.session.access_token)
      : null;

  const active =
    Boolean(input.user) &&
    (expiresAt == null || expiresAt * 1000 > nowMs + 1_000);

  return {
    has_user: Boolean(input.user),
    has_session: Boolean(input.session),
    session_id_present: Boolean(sessionId),
    expires_at: expiresAt,
    expires_in_seconds: expiresInSeconds,
    auth_event_hint: active ? "active" : "expired_or_missing",
  };
}

function decodeJwtSessionId(accessToken: string): string | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as {
      session_id?: unknown;
    };
    return typeof payload.session_id === "string" ? payload.session_id : null;
  } catch {
    return null;
  }
}

export type PortalSessionResolution =
  | { status: "authenticated"; userId: string }
  | { status: "transient"; reason: "refresh_in_progress" | "network" }
  | { status: "unauthenticated"; reason: "missing_user" | "refresh_failed" };

export function resolvePortalSessionResolution(input: {
  user: User | null;
  refreshUser: User | null;
  refreshErrorMessage?: string | null;
  getUserErrorMessage?: string | null;
}): PortalSessionResolution {
  if (input.user?.id) {
    return { status: "authenticated", userId: input.user.id };
  }

  if (input.refreshUser?.id) {
    return { status: "authenticated", userId: input.refreshUser.id };
  }

  const combined = `${input.getUserErrorMessage ?? ""} ${input.refreshErrorMessage ?? ""}`.toLowerCase();
  if (
    combined.includes("fetch") ||
    combined.includes("network") ||
    combined.includes("timeout")
  ) {
    return { status: "transient", reason: "network" };
  }

  if (combined.includes("already used")) {
    return { status: "transient", reason: "refresh_in_progress" };
  }

  if (
    combined.includes("refresh token") ||
    combined.includes("session missing") ||
    combined.includes("invalid jwt")
  ) {
    return { status: "unauthenticated", reason: "refresh_failed" };
  }

  return { status: "unauthenticated", reason: "missing_user" };
}
