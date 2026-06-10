/** Desktop Command Center security policy (Phase 27). */

export const DESKTOP_SECURITY_RULES = [
  "Store minimal local data — session token and cached feed only.",
  "Authentication uses short-lived secure session tokens from Aipify Core.",
  "Support remote logout and session expiration server-side.",
  "Never expose installation tokens or API secrets in the desktop client.",
  "Session tokens are hashed at rest in the database.",
] as const;

/** Default desktop session lifetime (hours). */
export const DESKTOP_SESSION_TTL_HOURS = 720; // 30 days

export const DESKTOP_SESSION_HEADER = "Authorization";

export function formatBearerToken(token: string): string {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}
