import type { Metadata } from "next";
import KompisWebLegalShell from "@/components/marketing/kompis-web-sales/KompisWebLegalShell";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";
import { getSection, recordValues } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing"]);
  const marketing = dict.marketing as Record<string, unknown>;
  const meta = getSection<{ privacyTitle?: string; privacyDescription?: string }>(marketing, "meta");
  return { title: meta.privacyTitle, description: meta.privacyDescription };
}

export default async function PrivacyPage() {
  const { labels, appName, locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing"]);
  const marketing = dict.marketing as Record<string, unknown>;
  const privacyPage = getSection<{
    title?: string;
    updated?: string;
    sections?: Record<string, { title: string; body: string }>;
  }>(marketing, "privacyPage");

  const sections = recordValues(privacyPage.sections);

  return (
    <KompisWebLegalShell
      labels={labels}
      appName={appName}
      title={privacyPage.title ?? labels.footer.privacy}
      subtitle={privacyPage.updated}
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
