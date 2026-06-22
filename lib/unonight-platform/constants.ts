/** Unonight platform — Aipify read-only connection token foundation. */

export const UNONIGHT_AIPIFY_TOKEN_PREFIX = "uno_aipify_";

export const UNONIGHT_AIPIFY_DEFAULT_SCOPES = [
  "metadata.read",
  "organization.read",
  "integration.status.read",
  "platform.metadata.read",
] as const;

export type UnonightAipifyScope = (typeof UNONIGHT_AIPIFY_DEFAULT_SCOPES)[number];

export const UNONIGHT_AIPIFY_API_VERSION = "v1";

export const UNONIGHT_AIPIFY_PROVIDER = "unonight";

export const UNONIGHT_AIPIFY_CONNECTION_PATH = "/api/aipify/v1/connection";

export function isUnonightAipifyTokenFormat(token: string): boolean {
  const trimmed = token.trim();
  return trimmed.startsWith(UNONIGHT_AIPIFY_TOKEN_PREFIX) && trimmed.length >= 20;
}

export function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authorizationHeader.trim());
  return match?.[1]?.trim() ?? null;
}
