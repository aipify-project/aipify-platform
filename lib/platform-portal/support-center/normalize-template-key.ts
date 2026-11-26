/**
 * Canonical template_key / category validation.
 * Rejects over-length keys — never truncates into a different identity.
 */

export const SUPPORT_TEMPLATE_KEY_MAX = 80 as const;
export const SUPPORT_TEMPLATE_KEY_RE = /^[a-z0-9][a-z0-9_-]{0,79}$/;

export type NormalizeSupportKeyResult =
  | { ok: true; value: string }
  | { ok: false; error: "required" | "too_long" | "format" };

export function normalizeSupportTemplateKey(
  raw: string | null | undefined,
  field: "template_key" | "category" = "template_key",
): NormalizeSupportKeyResult {
  const value = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!value) return { ok: false, error: "required" };
  if (value.length > SUPPORT_TEMPLATE_KEY_MAX) {
    return { ok: false, error: "too_long" };
  }
  if (!SUPPORT_TEMPLATE_KEY_RE.test(value)) {
    return { ok: false, error: "format" };
  }
  // Defensive: regex already enforces max length; keep field name for callers.
  void field;
  return { ok: true, value };
}

/** Derive a stable template_key from a display name (create path). */
export function deriveSupportTemplateKeyFromName(name: string): NormalizeSupportKeyResult {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
  if (!slug) return { ok: false, error: "required" };
  if (slug.length > SUPPORT_TEMPLATE_KEY_MAX) {
    return { ok: false, error: "too_long" };
  }
  return normalizeSupportTemplateKey(slug);
}

export const SUPPORT_TEMPLATE_LOCALES = [
  "en",
  "no",
  "sv",
  "da",
  "pl",
  "uk",
  "es",
] as const;

export type SupportTemplateLocale = (typeof SUPPORT_TEMPLATE_LOCALES)[number];

export function normalizeSupportTemplateLocale(
  raw: string | null | undefined,
): SupportTemplateLocale | null {
  const value = String(raw ?? "no").trim().toLowerCase();
  return (SUPPORT_TEMPLATE_LOCALES as readonly string[]).includes(value)
    ? (value as SupportTemplateLocale)
    : null;
}
