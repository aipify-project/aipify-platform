import {
  isPublicFooterEnabledLocale,
  type PublicFooterEnabledLocale,
} from "@/lib/i18n/public-locales";

/**
 * Sales-page locale policy (owner gate):
 * - Explicit cookie preference wins.
 * - Anonymous visitors without a cookie default to English.
 * - Accept-Language / IP / geo are intentionally ignored on `/` and `/kompis-web`
 *   so Nordic browsers do not auto-force Norwegian on first international visit.
 */
export function resolveKompisWebSalesLocale(input: {
  cookieLocale?: string | null;
}): PublicFooterEnabledLocale {
  const cookie = input.cookieLocale?.trim();
  if (cookie && isPublicFooterEnabledLocale(cookie)) {
    return cookie;
  }
  return "en";
}

/** Nordic marketing locales keep "Kompis" in helper chat copy; others use "Buddy". */
export function kompisWebSalesHelperDisplayName(
  locale: PublicFooterEnabledLocale,
): "Kompis" | "Buddy" {
  if (locale === "no" || locale === "sv" || locale === "da") return "Kompis";
  return "Buddy";
}
