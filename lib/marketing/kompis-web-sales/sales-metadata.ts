import type { Metadata } from "next";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";

export type KompisWebSalesRoutePath = "/" | "/kompis-web";

/** Canonical home for the shared sales experience. */
export const KOMPIS_WEB_SALES_CANONICAL_URL = "https://aipify.ai/";

/** Established brand SEO title — never replaced by a localized translation or product suffix. */
export const KOMPIS_WEB_SALES_BROWSER_TITLE = "Aipify works for you";

/**
 * Metadata for Kompis Web sales.
 * Browser title keeps the established English brand phrase; description stays localized.
 */
export function buildKompisWebSalesMetadata(
  labels: KompisWebSalesLabels,
  _path: KompisWebSalesRoutePath = "/",
): Metadata {
  const title = KOMPIS_WEB_SALES_BROWSER_TITLE;
  const description = labels.meta.description;
  return {
    title,
    description,
    alternates: { canonical: KOMPIS_WEB_SALES_CANONICAL_URL },
    openGraph: {
      title,
      description,
      url: KOMPIS_WEB_SALES_CANONICAL_URL,
      siteName: "Aipify",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Aipify works for you",
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
