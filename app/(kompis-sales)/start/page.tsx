import { Suspense } from "react";
import type { Metadata } from "next";
import KompisWebStartPage from "@/components/marketing/kompis-web-sales/KompisWebStartPage";
import { buildKompisWebStartMetadata } from "@/lib/marketing/kompis-web-sales/sales-metadata";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";

export async function generateMetadata(): Promise<Metadata> {
  const { labels } = await loadKompisWebSalesRouteContext();
  return buildKompisWebStartMetadata(labels);
}

export default async function KompisWebStartRoutePage() {
  const { labels, locale, appName } = await loadKompisWebSalesRouteContext();
  return (
    <Suspense fallback={<div className="kompis-web-sales" />}>
      <KompisWebStartPage labels={labels} locale={locale} appName={appName} />
    </Suspense>
  );
}
