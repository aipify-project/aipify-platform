/**
 * Kompis / Buddy display-name contract (user-facing only).
 *
 * Nordic locales (no, sv, da): Kompis · Kompis Web · Kompis Bedrift · Website Kompis
 * All other locales: Buddy · Buddy Web · Buddy Business · Website Buddy
 *
 * Technical IDs, routes, SKUs, RPC names, and JSON keys stay unchanged.
 */

export const NORDIC_KOMPIS_LOCALES = ["no", "sv", "da"] as const;

export type NordicKompisLocale = (typeof NORDIC_KOMPIS_LOCALES)[number];

export type KompisBuddyFamilyName = "Kompis" | "Buddy";

export type KompisBuddyProductKey =
  | "kompis_web"
  | "kompis_bedrift"
  | "website_kompis"
  | "family";

export function isNordicKompisLocale(locale: string | null | undefined): boolean {
  const code = (locale ?? "").trim().toLowerCase().slice(0, 2);
  return (NORDIC_KOMPIS_LOCALES as readonly string[]).includes(code);
}

/** Family helper name used in chat/demo copy and short labels. */
export function kompisFamilyName(locale: string | null | undefined): KompisBuddyFamilyName {
  return isNordicKompisLocale(locale) ? "Kompis" : "Buddy";
}

/**
 * Locale-aware product display names.
 * Internal product keys (`kompis_web`, `website_kompis`, …) never change.
 */
export function kompisProductDisplayName(
  product: KompisBuddyProductKey,
  locale: string | null | undefined,
): string {
  const nordic = isNordicKompisLocale(locale);
  switch (product) {
    case "family":
      return nordic ? "Kompis" : "Buddy";
    case "kompis_web":
      return nordic ? "Kompis Web" : "Buddy Web";
    case "kompis_bedrift":
      return nordic ? "Kompis Bedrift" : "Buddy Business";
    case "website_kompis":
      return nordic ? "Website Kompis" : "Website Buddy";
    default: {
      const _exhaustive: never = product;
      return _exhaustive;
    }
  }
}

/**
 * Rewrite legacy user-facing copy that still says Kompis* into the locale-correct
 * Buddy* form. Safe for display strings only — never run on technical IDs or keys.
 */
export function localizeKompisBuddyCopy(
  text: string,
  locale: string | null | undefined,
): string {
  if (!text || isNordicKompisLocale(locale)) return text;
  return text
    .replaceAll("Website Kompis", "Website Buddy")
    .replaceAll("Kompis Web", "Buddy Web")
    .replaceAll("Kompis Bedrift", "Buddy Business")
    .replaceAll("Aipify Kompis", "Aipify Buddy")
    .replace(/\bKompis\b/g, "Buddy");
}

/** Browser / Open Graph title fragment after the brand phrase. */
export function kompisWebSalesBrowserProductTitle(
  locale: string | null | undefined,
): string {
  return kompisProductDisplayName("kompis_web", locale);
}

export function kompisWebSalesBrowserTitle(locale: string | null | undefined): string {
  return `Aipify works for you | ${kompisWebSalesBrowserProductTitle(locale)}`;
}
