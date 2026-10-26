import type { Metadata } from "next";
import KompisWebSalesPage from "@/components/marketing/kompis-web-sales/KompisWebSalesPage";
import { resolvePublicFooterLocale } from "@/lib/i18n/public-locales";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseKompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const labels = parseKompisWebSalesLabels(marketing);
  return {
    title: labels.meta.title,
    description: labels.meta.description,
    alternates: { canonical: "/kompis-web" },
    openGraph: {
      title: labels.meta.title,
      description: labels.meta.description,
      url: "https://aipify.ai/kompis-web",
      siteName: "Aipify",
      type: "website",
    },
  };
}

export default async function KompisWebSalesRoutePage() {
  const { marketing, common, locale } = await getMarketingContext();
  const labels = parseKompisWebSalesLabels(marketing);

  return (
    <KompisWebSalesPage
      labels={labels}
      locale={resolvePublicFooterLocale(locale)}
      appName={typeof common.appName === "string" ? common.appName : "Aipify"}
    />
  );
}
