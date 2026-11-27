import {
  isPublicFooterEnabledLocale,
  type PublicFooterEnabledLocale,
} from "@/lib/i18n/public-locales";

/**
 * Public sales-page language.
 * Explicit supported URL selection, then the saved site language, then Accept-Language, then English.
 * Does not use IP or geolocation, and does not change the homepage locale policy.
 */
const LANGUAGE_ALIASES: Record<string, PublicFooterEnabledLocale> = {
  en: "en",
  no: "no",
  nb: "no",
  nn: "no",
  sv: "sv",
  da: "da",
  pl: "pl",
  uk: "uk",
  es: "es",
};

export function matchPublicSalesLocale(value: string | null | undefined): PublicFooterEnabledLocale | null {
  const tag = String(value ?? "").trim().toLowerCase().replace(/_/g, "-");
  if (!tag) return null;
  if (LANGUAGE_ALIASES[tag]) return LANGUAGE_ALIASES[tag];
  const base = tag.split("-")[0] ?? "";
  return LANGUAGE_ALIASES[base] ?? null;
}

export function negotiateAcceptLanguage(header: string | null | undefined): PublicFooterEnabledLocale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((item) => item.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tag?.trim() ?? "", q: Number.isFinite(q) ? q : 0 };
    })
    .filter((part) => part.tag && part.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const part of ranked) {
    const match = matchPublicSalesLocale(part.tag);
    if (match) return match;
  }
  return null;
}

export function resolvePersonalSalesLocale(input: {
  queryLang?: string | null;
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): PublicFooterEnabledLocale {
  const query = matchPublicSalesLocale(input.queryLang);
  if (query) return query;
  const cookie = input.cookieLocale?.trim();
  if (cookie && isPublicFooterEnabledLocale(cookie)) return cookie;
  return negotiateAcceptLanguage(input.acceptLanguage) ?? "en";
}

export function personalSalesLocalePath(code: string, locale: PublicFooterEnabledLocale): string {
  return `/s/${encodeURIComponent(code.trim().toLowerCase())}?lang=${encodeURIComponent(locale)}`;
}
