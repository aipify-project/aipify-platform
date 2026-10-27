import type { Metadata } from "next";
import KompisWebSalesPage from "@/components/marketing/kompis-web-sales/KompisWebSalesPage";
import { buildKompisWebSalesMetadata } from "@/lib/marketing/kompis-web-sales/sales-metadata";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";

/**
 * `/kompis-web` remains available in this limited placement correction.
 * Canonical/SEO cleanup of duplicates is queued separately.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { labels } = await loadKompisWebSalesRouteContext();
  return buildKompisWebSalesMetadata(labels, "/kompis-web");
}

export default async function KompisWebSalesRoutePage() {
  const { locale, labels, appName } = await loadKompisWebSalesRouteContext();

  return <KompisWebSalesPage labels={labels} locale={locale} appName={appName} />;
}
