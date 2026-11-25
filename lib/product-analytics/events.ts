/**
 * Central Aipify product analytics event taxonomy (GA4).
 * Prefer Google recommended events where they fit; custom events are snake_case.
 */

export const GA4_STANDARD_EVENTS = [
  "page_view",
  "sign_up",
  "login",
  "begin_checkout",
  "purchase",
] as const;

export const AIPIFY_CUSTOM_EVENTS = [
  "module_view",
  "module_activate",
  "trial_start",
  "subscription_upgrade",
  "partner_referral_visit",
  "partner_application_submit",
  "academy_started",
  "academy_exam_completed",
] as const;

export const PRODUCT_ANALYTICS_EVENTS = [
  ...GA4_STANDARD_EVENTS,
  ...AIPIFY_CUSTOM_EVENTS,
] as const;

export type ProductAnalyticsEventName = (typeof PRODUCT_ANALYTICS_EVENTS)[number];

export type ProductAnalyticsParams = Record<string, string | number | boolean | undefined | null>;

const FORBIDDEN_PARAM_KEYS = new Set([
  "email",
  "e_mail",
  "user_email",
  "name",
  "full_name",
  "fullname",
  "first_name",
  "last_name",
  "phone",
  "address",
  "message",
  "chat",
  "conversation",
  "password",
  "token",
  "access_token",
  "refresh_token",
  "authorization",
  "card",
  "iban",
  "account_number",
  "ssn",
  "national_id",
]);

const SENSITIVE_QUERY_KEYS = /^(email|token|code|password|access_token|refresh_token|auth|session|key)$/i;

export function isProductAnalyticsEventName(value: unknown): value is ProductAnalyticsEventName {
  return (
    typeof value === "string" &&
    (PRODUCT_ANALYTICS_EVENTS as readonly string[]).includes(value)
  );
}

/** Strip PII / secret-like keys and truncate string values. Never throws. */
export function sanitizeProductAnalyticsParams(
  params: ProductAnalyticsParams = {},
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [rawKey, rawValue] of Object.entries(params)) {
    if (rawValue == null) continue;
    const key = rawKey.trim().toLowerCase();
    if (!key || FORBIDDEN_PARAM_KEYS.has(key)) continue;
    if (key.includes("email") || key.includes("password") || key.includes("token")) continue;
    if (typeof rawValue === "boolean" || typeof rawValue === "number") {
      if (typeof rawValue === "number" && !Number.isFinite(rawValue)) continue;
      out[key] = rawValue;
      continue;
    }
    if (typeof rawValue === "string") {
      const trimmed = rawValue.trim();
      if (!trimmed) continue;
      if (trimmed.includes("@") && trimmed.includes(".")) continue;
      out[key] = trimmed.slice(0, 120);
    }
  }
  return out;
}

/** Path for page_view — drops sensitive query params; never includes hash. */
export function sanitizeAnalyticsPagePath(pathname: string, search = ""): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!search || search === "?") return path;
  const qs = search.startsWith("?") ? search.slice(1) : search;
  const kept: string[] = [];
  for (const part of qs.split("&")) {
    if (!part) continue;
    const eq = part.indexOf("=");
    const key = decodeURIComponent((eq >= 0 ? part.slice(0, eq) : part).replace(/\+/g, " "));
    if (SENSITIVE_QUERY_KEYS.test(key)) continue;
    if (/email|token|password|auth/i.test(key)) continue;
    kept.push(part);
  }
  return kept.length ? `${path}?${kept.join("&")}` : path;
}

/**
 * Commercial events that must only fire after Core confirms the outcome.
 * Callers pass `coreValidated: true` when the server response proves success.
 */
export const CORE_VALIDATED_EVENTS = new Set<ProductAnalyticsEventName>([
  "begin_checkout",
  "purchase",
  "subscription_upgrade",
  "trial_start",
  "module_activate",
]);
