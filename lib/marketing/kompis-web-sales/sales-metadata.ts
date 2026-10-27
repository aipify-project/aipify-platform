import type { Metadata } from "next";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";

export type KompisWebSalesRoutePath = "/" | "/kompis-web";

/** Canonical home for the shared sales experience — both routes stay live; only one indexes. */
export const KOMPIS_WEB_SALES_CANONICAL_URL = "https://aipify.ai/";

/**
 * Metadata for `/` and `/kompis-web` (same labels, shared UI).
 * Alias `/kompis-web` keeps working without redirect; canonical + OG/Twitter point at `/`
 * so search engines prefer one URL (sitemap already omits `/kompis-web`).
 */
export function buildKompisWebSalesMetadata(
  labels: KompisWebSalesLabels,
  _path: KompisWebSalesRoutePath,
): Metadata {
  const title = labels.meta.title;
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
      // Preserve established brand SEO phrase; page-specific product title stays in <title>/OG.
      title: "Aipify works for you",
      description,
    },
  };
}
