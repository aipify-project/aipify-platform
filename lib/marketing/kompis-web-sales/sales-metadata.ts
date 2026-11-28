import type { Metadata } from "next";
import { kompisWebSalesBrowserTitle } from "@/lib/brand/kompis-buddy-display";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";

export type KompisWebSalesRoutePath = "/" | "/kompis-web";

/** Canonical home for the shared sales experience. */
export const KOMPIS_WEB_SALES_CANONICAL_URL = "https://aipify.ai/";

/**
 * Cookie/UI locale sites share one indexable URL.
 * Reciprocal hreflang points each language tag + x-default at the same canonical.
 */
export const KOMPIS_WEB_SALES_HREFLANG: NonNullable<
  NonNullable<Metadata["alternates"]>["languages"]
> = {
  en: KOMPIS_WEB_SALES_CANONICAL_URL,
  no: KOMPIS_WEB_SALES_CANONICAL_URL,
  sv: KOMPIS_WEB_SALES_CANONICAL_URL,
  da: KOMPIS_WEB_SALES_CANONICAL_URL,
  pl: KOMPIS_WEB_SALES_CANONICAL_URL,
  uk: KOMPIS_WEB_SALES_CANONICAL_URL,
  es: KOMPIS_WEB_SALES_CANONICAL_URL,
  "x-default": KOMPIS_WEB_SALES_CANONICAL_URL,
};

/**
 * @deprecated Prefer `kompisWebSalesBrowserTitle(locale)`.
 * Kept as the English (Buddy Web) default for callers without a locale.
 */
export const KOMPIS_WEB_SALES_BROWSER_TITLE = kompisWebSalesBrowserTitle("en");

/**
 * Metadata for Buddy Web / Kompis Web sales.
 * Browser title uses locale-aware product naming; description stays localized.
 */
export function buildKompisWebSalesMetadata(
  labels: KompisWebSalesLabels,
  _path: KompisWebSalesRoutePath = "/",
  locale: string = "en",
): Metadata {
  const title = kompisWebSalesBrowserTitle(locale);
  const description = labels.meta.description;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: KOMPIS_WEB_SALES_CANONICAL_URL,
      languages: KOMPIS_WEB_SALES_HREFLANG,
    },
    openGraph: {
      title,
      description,
      url: KOMPIS_WEB_SALES_CANONICAL_URL,
      siteName: "Aipify",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildKompisWebStartMetadata(labels: KompisWebSalesLabels): Metadata {
  const start = labels.start;
  return {
    title: start.metaTitle,
    description: start.metaDescription,
    robots: { index: false, follow: true },
    alternates: { canonical: "https://aipify.ai/start" },
  };
}
