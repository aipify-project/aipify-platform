/** Unonight read-only connection foundation — scopes and endpoint contract. */

export const UNONIGHT_PROVIDER_KEY = "unonight";

export const UNONIGHT_ORGANIZATION_SLUG = "unonight";

export const UNONIGHT_DEFAULT_SCOPES = [
  "metadata.read",
  "organization.read",
  "integration.status.read",
] as const;

export type UnonightConnectionScope = (typeof UNONIGHT_DEFAULT_SCOPES)[number];

export const UNONIGHT_CONNECTION_PATH = "/api/aipify/v1/connection";

export const UNONIGHT_CONNECTION_TIMEOUT_MS = 12_000;

/** Blocked in production — dev/test fixtures only. */
export const UNONIGHT_PLACEHOLDER_TOKENS = [
  "unonight-pilot-token",
  "unonight-pilot-secret-placeholder",
] as const;

export {
  UNONIGHT_CANONICAL_BASE_URL,
  getUnonightBaseUrlValidationMessageKey,
  isUnonightEmailLike,
  normalizeUnonightBaseUrlHost,
  resolveUnonightApiBaseUrl,
  resolveUnonightBaseUrlForForm,
  sanitizePersistedUnonightBaseUrl,
  validateUnonightBaseUrlInput,
} from "./base-url";
export type {
  UnonightBaseUrlValidationCode,
  UnonightBaseUrlValidationResult,
} from "./base-url";

export function buildUnonightConnectionUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${UNONIGHT_CONNECTION_PATH}`;
}
