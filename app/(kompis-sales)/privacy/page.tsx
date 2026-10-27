import type { Metadata } from "next";
import KompisWebLegalPage from "@/components/marketing/kompis-web-sales/KompisWebLegalPage";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, recordValues } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ privacyTitle?: string; privacyDescription?: string }>(marketing, "meta");
  return {
    title: meta.privacyTitle ?? "Privacy Policy — Aipify",
    description: meta.privacyDescription,
    alternates: { canonical: "https://aipify.ai/privacy" },
  };
}

export default async function KompisWebPrivacyPage() {
  const { labels, appName } = await loadKompisWebSalesRouteContext();
  const { marketing } = await getMarketingContext();
  const privacyPage = getSection<{
    title?: string;
    updated?: string;
    sections?: Record<string, { title: string; body: string }>;
  }>(marketing, "privacyPage");
  const sections = recordValues(privacyPage.sections);

  return (
    <KompisWebLegalPage
      appName={appName}
      title={privacyPage.title ?? labels.footer.privacy}
      updated={privacyPage.updated}
      sections={sections}
      backLabel={labels.footer.home}
      privacyLabel={labels.footer.privacy}
      termsLabel={labels.footer.terms}
      homeHref={labels.hrefs.home}
      privacyHref={labels.hrefs.privacy}
      termsHref={labels.hrefs.terms}
      active="privacy"
    />
  );
}
