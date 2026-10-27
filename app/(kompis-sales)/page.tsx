import type { Metadata } from "next";
import KompisWebSalesPage from "@/components/marketing/kompis-web-sales/KompisWebSalesPage";
import { buildKompisWebSalesMetadata } from "@/lib/marketing/kompis-web-sales/sales-metadata";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";

/**
 * Public root `/` — owner correction: serve the approved Kompis Web sales page.
 * Same component and locale policy as `/kompis-web` (no duplicate sales UI).
 */
export async function generateMetadata(): Promise<Metadata> {
  const { labels } = await loadKompisWebSalesRouteContext();
  return buildKompisWebSalesMetadata(labels, "/");
}

export default async function RootKompisWebSalesPage() {
  const { locale, labels, appName } = await loadKompisWebSalesRouteContext();

  return <KompisWebSalesPage labels={labels} locale={locale} appName={appName} />;
}
