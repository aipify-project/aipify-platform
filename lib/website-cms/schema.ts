/** Allowed content block types and page-content validation for the Website CMS. */

export const WEBSITE_CMS_BLOCK_TYPES = [
  "heading",
  "paragraph",
  "image",
  "cta",
  "list",
  "quote",
  "divider",
  "faq",
] as const;

export type WebsiteCmsBlockType = (typeof WEBSITE_CMS_BLOCK_TYPES)[number];

export function isWebsiteCmsBlockType(value: string): value is WebsiteCmsBlockType {
  return (WEBSITE_CMS_BLOCK_TYPES as readonly string[]).includes(value);
}

const FORBIDDEN_MARKUP_PATTERN = /<\s*script|javascript:|on\w+\s*=|<\s*iframe/i;

export function containsForbiddenWebsiteMarkup(text: string): boolean {
  return FORBIDDEN_MARKUP_PATTERN.test(text);
}

export type WebsiteCmsValidationResult =
  | { ok: true }
  | { ok: false; errorCode: string; detail: string };

/**
 * Validates a page path used to identify a customer_website_pages row.
 * Mirrors the SQL-side validation in build_customer_website_candidate_from_drafts.
 */
export function validateWebsiteCmsPath(path: unknown): WebsiteCmsValidationResult {
  if (typeof path !== "string" || !path.trim()) {
    return { ok: false, errorCode: "invalid_path", detail: "Path is required." };
  }
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) {
    return { ok: false, errorCode: "invalid_path", detail: "Path must start with /." };
  }
  if (trimmed.includes("..") || trimmed.includes("<") || trimmed.includes("://")) {
    return { ok: false, errorCode: "invalid_path", detail: "Path contains disallowed characters." };
  }
  if (trimmed.length > 200) {
    return { ok: false, errorCode: "invalid_path", detail: "Path is too long." };
  }
  return { ok: true };
}

export function validateWebsiteCmsLocale(
  locale: unknown,
  activeLocales: readonly string[],
): WebsiteCmsValidationResult {
  if (typeof locale !== "string" || !locale.trim()) {
    return { ok: false, errorCode: "invalid_or_inactive_locale", detail: "Locale is required." };
  }
  if (!activeLocales.includes(locale.trim())) {
    return {
      ok: false,
      errorCode: "invalid_or_inactive_locale",
      detail: "Locale is not active for this website.",
    };
  }
  return { ok: true };
}

export type WebsiteCmsContentInput = {
  title?: unknown;
  text?: unknown;
  metaDescription?: unknown;
  canonicalUrl?: unknown;
  altText?: unknown;
};

/**
 * Scans candidate page/SEO text fields for forbidden markup (script/iframe/inline
 * event handlers). Used client-side before submission and mirrored server-side
 * in the candidate-build RPC as the authoritative gate.
 */
export function validateWebsiteCmsContentInput(input: WebsiteCmsContentInput): WebsiteCmsValidationResult {
  const scan = [input.title, input.text, input.metaDescription, input.canonicalUrl, input.altText]
    .filter((value): value is string => typeof value === "string")
    .join(" ");
  if (containsForbiddenWebsiteMarkup(scan)) {
    return { ok: false, errorCode: "forbidden_markup", detail: "Content contains disallowed markup." };
  }
  return { ok: true };
}

export function validateWebsiteCmsDraftIds(draftIds: unknown): WebsiteCmsValidationResult {
  if (!Array.isArray(draftIds) || draftIds.length < 1 || draftIds.length > 50) {
    return { ok: false, errorCode: "invalid_draft_ids", detail: "Provide between 1 and 50 draft ids." };
  }
  if (!draftIds.every((id) => typeof id === "string" && id.length > 0)) {
    return { ok: false, errorCode: "invalid_draft_ids", detail: "Draft ids must be non-empty strings." };
  }
  return { ok: true };
}
