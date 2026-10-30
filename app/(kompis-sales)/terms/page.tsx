import type { Metadata } from "next";
import KompisWebLegalPage from "@/components/marketing/kompis-web-sales/KompisWebLegalPage";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, recordValues } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ termsTitle?: string }>(marketing, "meta");
  return {
    title: meta.termsTitle ?? "Terms of Service — Aipify",
    description: "Aipify Terms of Service",
    alternates: { canonical: "https://aipify.ai/terms" },
  };
}

export default async function KompisWebTermsPage() {
  const { labels, appName } = await loadKompisWebSalesRouteContext();
  const { marketing } = await getMarketingContext();
  const termsPage = getSection<{
    title?: string;
    updated?: string;
    sections?: Record<string, { title: string; body: string }>;
  }>(marketing, "termsPage");
  const sections = recordValues(termsPage.sections);

  return (
    <KompisWebLegalPage
      appName={appName}
      title={termsPage.title ?? labels.footer.terms}
      updated={termsPage.updated}
      sections={sections}
      backLabel={labels.footer.home}
      privacyLabel={labels.footer.privacy}
      termsLabel={labels.footer.terms}
      homeHref={labels.hrefs.home}
      privacyHref={labels.hrefs.privacy}
      termsHref={labels.hrefs.terms}
      active="terms"
    />
  );
}
