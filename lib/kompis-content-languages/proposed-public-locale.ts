import {
  canonicalFaqContentLanguage,
  FAQ_CONTENT_LANGUAGE_CODES,
  type FaqContentLanguageCode,
} from "@/lib/website-kompis-faq/content-languages";

/**
 * Target contract for the public visitor path.
 * The frozen embed, ask, install-config, and answer-policy files do not call this.
 * `wired` stays false until those files are explicitly authorized.
 */
export const KOMPIS_PUBLIC_FAQ_LANGUAGE_REGISTRY_VERSION = "kompis-faq-content-languages-v1" as const;

export const KOMPIS_PUBLIC_30_LANGUAGE_RUNTIME_WIRED = false as const;

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

/**
 * Explicit message, then page, then site default. An empty choice uses the
 * caller's existing omitted default (`no` for the embed, `en` for ask).
 * A non-empty unsupported value, including pt-BR and zh-Hans, becomes English.
 * Norwegian aliases map to `no` only for this request. Stored FAQ rows are not rewritten.
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
  const selected = ranked.find((entry) => entry[1]?.trim());
  if (!selected) return finish(input.omittedFallback, "omitted", "omitted_to_caller_default");
  const [source, raw] = selected;
  const canonical = canonicalFaqContentLanguage(raw ?? "");
  if (!canonical) return finish("en", source, "unsupported_explicit_to_english");
  return finish(canonical, source, "none");
}
