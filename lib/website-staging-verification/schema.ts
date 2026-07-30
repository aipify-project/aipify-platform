/**
 * Pure, dependency-free validation helpers mirroring the SQL-side checks in
 * `20261935700000_platform_website_staging_verification_v2.sql`
 * (`_website_staging_fixture_key_ok`, `_website_staging_locale_ok`,
 * `_website_staging_key_ok`). These never gate a write decision on their
 * own — the RPC is always the authoritative validator.
 */

export type WebsiteStagingValidationResult =
  | { ok: true }
  | { ok: false; errorCode: string; detail: string };

const FIXTURE_KEY_PATTERN = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;
const LOCALE_PATTERN = /^[a-z]{2}(-[a-z]{2})?$/;

export function validateWebsiteStagingFixtureKey(value: unknown): WebsiteStagingValidationResult {
  if (typeof value !== "string") {
    return { ok: false, errorCode: "invalid_fixture_key", detail: "Fixture key is required." };
  }
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length < 3 || trimmed.length > 64 || !FIXTURE_KEY_PATTERN.test(trimmed)) {
    return {
      ok: false,
      errorCode: "invalid_fixture_key",
      detail: "Fixture key must be 3-64 lowercase letters, numbers, or hyphens.",
    };
  }
  return { ok: true };
}

export function validateWebsiteStagingLocale(value: unknown): WebsiteStagingValidationResult {
  if (typeof value !== "string") {
    return { ok: false, errorCode: "invalid_locale", detail: "Locale is required." };
  }
  const trimmed = value.trim().toLowerCase();
  if (!LOCALE_PATTERN.test(trimmed)) {
    return { ok: false, errorCode: "invalid_locale", detail: "Locale must look like 'en' or 'en-us'." };
  }
  return { ok: true };
}

export function validateWebsiteStagingIdempotencyKey(value: unknown): WebsiteStagingValidationResult {
  if (typeof value !== "string" || value.length < 8 || value.length > 128) {
    return {
      ok: false,
      errorCode: "invalid_idempotency_key",
      detail: "Idempotency key must be 8-128 characters.",
    };
  }
  return { ok: true };
}

export function validateWebsiteStagingInternalReason(value: unknown): WebsiteStagingValidationResult {
  if (typeof value !== "string" || !value.trim()) {
    return { ok: false, errorCode: "invalid_internal_reason", detail: "An internal reason is required." };
  }
  if (value.trim().length < 8) {
    return {
      ok: false,
      errorCode: "invalid_internal_reason",
      detail: "Internal reason must be at least 8 characters.",
    };
  }
  return { ok: true };
}

/** Deterministic client-side idempotency key builder (still validated server-side). */
export function buildWebsiteStagingIdempotencyKey(scope: string, seed: string): string {
  const cleanedScope = scope.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cleanedSeed = seed.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const key = `wsv-${cleanedScope}-${cleanedSeed}`;
  return key.length > 128 ? key.slice(0, 128) : key;
}
