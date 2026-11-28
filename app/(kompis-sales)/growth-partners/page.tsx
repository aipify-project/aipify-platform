import type { Metadata } from "next";
import GrowthPartnersPageContent from "@/components/marketing/GrowthPartnersPageContent";
import type { GrowthPartnersPageLabels } from "@/components/marketing/growth-partners/types";
import KompisWebSalesChrome from "@/components/marketing/kompis-web-sales/KompisWebSalesChrome";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";
import { getSection } from "@/lib/marketing/parse-marketing";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing"]);
  const marketing = (dict.marketing ?? {}) as Record<string, unknown>;
  const redesign = getSection<{ meta?: { title?: string; description?: string } }>(
    marketing,
    "growthPartnersPageRedesign",
  );
  const legacy = getSection<{ meta?: { title?: string; description?: string } }>(
    marketing,
    "growthPartners",
  );
  const meta = redesign.meta ?? legacy.meta;
  return {
    title: meta?.title,
    description: meta?.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: "https://aipify.ai/growth-partners",
      languages: {
        en: "https://aipify.ai/growth-partners",
        no: "https://aipify.ai/growth-partners",
        sv: "https://aipify.ai/growth-partners",
        da: "https://aipify.ai/growth-partners",
        pl: "https://aipify.ai/growth-partners",
        uk: "https://aipify.ai/growth-partners",
        es: "https://aipify.ai/growth-partners",
        "x-default": "https://aipify.ai/growth-partners",
      },
    },
  };
}

/**
 * Growth Partners public info + application — same Kompis Web sales chrome as `/`.
 * Free approved seller program (not the paid Sales Partner product module).
 */
export default async function GrowthPartnersPage() {
  const { labels: salesLabels, appName, locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing", "common"]);
  const t = createTranslator(dict);
  const marketing = (dict.marketing ?? {}) as Record<string, unknown>;
  const section = getSection<GrowthPartnersPageLabels>(marketing, "growthPartnersPageRedesign");

  return (
    <KompisWebSalesChrome
      labels={salesLabels}
      appName={appName}
      locale={locale}
      showTitle={false}
      contentMaxWidth={1120}
      mainClassName="kompis-web-sales-shell w-full max-w-[1120px] px-4 pb-16 pt-8 sm:px-6"
    >
      <GrowthPartnersPageContent
        labels={section}
        verificationLabels={buildHumanVerificationLabels(t)}
      />
    </KompisWebSalesChrome>
  );
}
