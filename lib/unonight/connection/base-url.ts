/** Canonical production Unonight base URL for APP integration setup. */
export const UNONIGHT_CANONICAL_BASE_URL = "https://www.unonight.com";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UnonightBaseUrlValidationCode =
  | "empty"
  | "email_not_allowed"
  | "https_required"
  | "invalid_url";

export type UnonightBaseUrlValidationResult =
  | { ok: true; value: string }
  | { ok: false; code: UnonightBaseUrlValidationCode };

export function isUnonightEmailLike(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return EMAIL_PATTERN.test(trimmed);
}

export function validateUnonightBaseUrlInput(
  value: string | null | undefined
): UnonightBaseUrlValidationResult {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return { ok: false, code: "empty" };
  if (isUnonightEmailLike(trimmed)) return { ok: false, code: "email_not_allowed" };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, code: "invalid_url" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, code: "https_required" };
  }

  if (!parsed.hostname) {
    return { ok: false, code: "invalid_url" };
  }

  return { ok: true, value: normalizeUnonightBaseUrlHost(parsed) };
}

export function normalizeUnonightBaseUrlHost(url: URL | string): string {
  const parsed = typeof url === "string" ? new URL(url) : url;
  const host = parsed.hostname.toLowerCase();

  if (host === "unonight.com" || host.endsWith(".unonight.com")) {
    return UNONIGHT_CANONICAL_BASE_URL;
  }

  return `${parsed.protocol}//${parsed.host}`.replace(/\/+$/, "");
}

/** Resolve a persisted or submitted value; never accept email addresses. */
export function sanitizePersistedUnonightBaseUrl(
  value: string | null | undefined
): string | null {
  const validation = validateUnonightBaseUrlInput(value);
  return validation.ok ? validation.value : null;
}

/** Form default: valid stored URL or canonical production URL — never email. */
export function resolveUnonightBaseUrlForForm(stored?: string | null): string {
  return sanitizePersistedUnonightBaseUrl(stored) ?? UNONIGHT_CANONICAL_BASE_URL;
}

export function resolveUnonightApiBaseUrl(override?: string | null): string {
  const validation = validateUnonightBaseUrlInput(override);
  if (validation.ok) return validation.value;

  const fromEnv = process.env.UNONIGHT_API_BASE_URL?.trim();
  if (fromEnv) {
    const envValidation = validateUnonightBaseUrlInput(fromEnv);
    if (envValidation.ok) return envValidation.value;
  }

  return UNONIGHT_CANONICAL_BASE_URL;
}

export function getUnonightBaseUrlValidationMessageKey(
  code: UnonightBaseUrlValidationCode
): string {
  switch (code) {
    case "email_not_allowed":
      return "customerApp.portalStructure.integrations.unonightConnection.failures.invalidBaseUrlEmail";
    case "https_required":
      return "customerApp.portalStructure.integrations.unonightConnection.failures.invalidBaseUrlHttps";
    case "invalid_url":
      return "customerApp.portalStructure.integrations.unonightConnection.failures.invalidBaseUrl";
    case "empty":
    default:
      return "customerApp.portalStructure.integrations.unonightConnection.failures.invalidBaseUrl";
  }
}
