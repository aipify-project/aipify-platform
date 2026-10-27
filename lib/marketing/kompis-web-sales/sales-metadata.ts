import type { Metadata } from "next";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";

export type KompisWebSalesRoutePath = "/" | "/kompis-web";

export function buildKompisWebSalesMetadata(
  labels: KompisWebSalesLabels,
  path: KompisWebSalesRoutePath,
): Metadata {
  const url = path === "/" ? "https://aipify.ai/" : "https://aipify.ai/kompis-web";
  return {
    title: labels.meta.title,
    description: labels.meta.description,
    alternates: { canonical: path },
    openGraph: {
      title: labels.meta.title,
      description: labels.meta.description,
      url,
      siteName: "Aipify",
      type: "website",
    },
  };
}
