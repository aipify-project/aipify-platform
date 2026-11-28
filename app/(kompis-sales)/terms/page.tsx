import type { Metadata } from "next";
import KompisWebLegalShell from "@/components/marketing/kompis-web-sales/KompisWebLegalShell";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";
import { getSection, recordValues } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing"]);
  const marketing = dict.marketing as Record<string, unknown>;
  const meta = getSection<{ termsTitle?: string }>(marketing, "meta");
  const termsPage = getSection<{ title?: string; updated?: string }>(marketing, "termsPage");
  return {
    title: meta.termsTitle ?? termsPage.title,
    description: termsPage.updated ?? meta.termsTitle ?? termsPage.title,
    robots: { index: true, follow: true },
    alternates: { canonical: "https://aipify.ai/terms" },
  };
}

export default async function TermsPage() {
  const { labels, appName, locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing"]);
  const marketing = dict.marketing as Record<string, unknown>;
  const termsPage = getSection<{
    title?: string;
    updated?: string;
    sections?: Record<string, { title: string; body: string }>;
  }>(marketing, "termsPage");

  const sections = recordValues(termsPage.sections);

  return (
    <KompisWebLegalShell
      labels={labels}
      appName={appName}
      locale={locale}
      title={termsPage.title ?? labels.footer.terms}
      subtitle={termsPage.updated}
    >
      <div className="space-y-8">
        {sections.map((section) => (
          <article key={section.title}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 650, margin: 0 }}>{section.title}</h2>
            <p className="kompis-web-sales-hint" style={{ marginTop: 10, lineHeight: 1.65 }}>
              {section.body}
            </p>
          </article>
        ))}
      </div>
    </KompisWebLegalShell>
  );
}
