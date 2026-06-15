import { createHash } from "crypto";

function decodeJwtPayload(accessToken: string): Record<string, unknown> | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Stable across Supabase access-token refreshes within the same auth session.
 * Falls back to hashing the full token when session_id is unavailable.
 */
export function deriveSessionFingerprint(accessToken: string): string {
  const payload = decodeJwtPayload(accessToken);
  const sessionId = payload?.session_id;

  if (typeof sessionId === "string" && sessionId.length > 0) {
    return createHash("sha256").update(`session:${sessionId}`).digest("hex");
  }

  return createHash("sha256").update(accessToken).digest("hex");
}
