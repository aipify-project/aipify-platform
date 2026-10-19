import {
  canonicalFaqContentLanguage,
  FAQ_CONTENT_LANGUAGE_CODES,
  type FaqContentLanguageCode,
} from "@/lib/website-kompis-faq/content-languages";

/**
 * Public visitor content language.
 * The embed loader posts the raw page candidate. Ask, embed payload, and
 * install config call this registry. Widget chrome stays on the six embed locales.
 * There is no detection of language from the message text.
 */
export const KOMPIS_PUBLIC_FAQ_LANGUAGE_REGISTRY_VERSION = "kompis-faq-content-languages-v1" as const;

export const KOMPIS_PUBLIC_30_LANGUAGE_RUNTIME_WIRED = true as const;

export const KOMPIS_PUBLIC_FAQ_CONTENT_LANGUAGE_CODES = FAQ_CONTENT_LANGUAGE_CODES;

export type PublicContentLocaleSource = "message" | "page" | "site_default" | "omitted";

export type PublicContentLocaleFallback =
  | "none"
  | "unsupported_explicit_to_english"
  | "omitted_to_caller_default";

export type PublicContentLocalePlan = {
  registryVersion: typeof KOMPIS_PUBLIC_FAQ_LANGUAGE_REGISTRY_VERSION;
  wired: typeof KOMPIS_PUBLIC_30_LANGUAGE_RUNTIME_WIRED;
  source: PublicContentLocaleSource;
  contentLocale: FaqContentLanguageCode;
  responseLocale: FaqContentLanguageCode;
  retrievalLocales: readonly string[];
  fallback: PublicContentLocaleFallback;
  /** Existing SQL also returns published English FAQ rows beside the selected language. */
  englishKnowledgeAlsoEligible: boolean;
};

function finish(
  contentLocale: FaqContentLanguageCode,
  source: PublicContentLocaleSource,
  fallback: PublicContentLocaleFallback,
): PublicContentLocalePlan {
  return {
    registryVersion: KOMPIS_PUBLIC_FAQ_LANGUAGE_REGISTRY_VERSION,
    wired: KOMPIS_PUBLIC_30_LANGUAGE_RUNTIME_WIRED,
    source,
    contentLocale,
    responseLocale: contentLocale,
    retrievalLocales: contentLocale === "en" ? ["en"] : [contentLocale, "en"],
    fallback,
    englishKnowledgeAlsoEligible: contentLocale !== "en",
  };
}

function normalizedLocaleKey(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-");
}

/** A two- or three-letter page token that is not a content language. Path noise such as `id` falls through. */
function isBareUnknownPagePrimary(value: string): boolean {
  const key = normalizedLocaleKey(value);
  return /^[a-z]{2,3}$/.test(key) && canonicalFaqContentLanguage(key) == null;
}

/**
 * Explicit message, then page, then an explicitly configured site default.
 * An empty choice uses the caller's omitted default (`no` for the embed, `en` for ask).
 * A non-empty unsupported value, including pt-BR and zh-Hans, becomes English.
 * A bare unknown page primary falls through so it does not hide the site default.
 * Norwegian aliases map to `no` only for this request. Stored FAQ rows are not rewritten.
 * Message text is not inspected; there is no automatic message-language detector.
 */
export function proposePublicContentLocale(input: {
  messageLocale?: string | null;
  pageLocale?: string | null;
  siteDefaultLocale?: string | null;
  omittedFallback: "no" | "en";
}): PublicContentLocalePlan {
  const ranked: Array<[PublicContentLocaleSource, string | null | undefined]> = [
    ["message", input.messageLocale],
    ["page", input.pageLocale],
    ["site_default", input.siteDefaultLocale],
  ];
  for (const [source, raw] of ranked) {
    if (!raw?.trim()) continue;
    const canonical = canonicalFaqContentLanguage(raw);
    if (canonical) return finish(canonical, source, "none");
    if (source === "page" && isBareUnknownPagePrimary(raw)) continue;
    return finish("en", source, "unsupported_explicit_to_english");
  }
  return finish(input.omittedFallback, "omitted", "omitted_to_caller_default");
}
