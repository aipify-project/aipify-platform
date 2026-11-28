import type { Metadata } from "next";
import KompisWebSalesJsonLd from "@/components/marketing/kompis-web-sales/KompisWebSalesJsonLd";
import KompisWebSalesPage from "@/components/marketing/kompis-web-sales/KompisWebSalesPage";
import { buildKompisWebSalesMetadata } from "@/lib/marketing/kompis-web-sales/sales-metadata";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";

/**
 * Public root `/` — owner correction: serve the approved Kompis Web sales page.
 * Same component and locale policy as `/kompis-web` (no duplicate sales UI).
 */
export async function generateMetadata(): Promise<Metadata> {
  const { labels, locale } = await loadKompisWebSalesRouteContext();
  return buildKompisWebSalesMetadata(labels, "/", locale);
}

export default async function RootKompisWebSalesPage() {
  const { locale, labels, appName } = await loadKompisWebSalesRouteContext();

  return (
    <>
      <KompisWebSalesJsonLd />
      <KompisWebSalesPage labels={labels} locale={locale} appName={appName} />
    </>
  );
}
