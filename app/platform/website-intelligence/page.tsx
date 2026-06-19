import { WebsiteIntelligencePanel } from "@/components/platform/website-intelligence";
import { buildWebsiteIntelligenceLabels } from "@/lib/marketing/website-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = {
  searchParams: Promise<{ section?: string }>;
};

export default async function PlatformWebsiteIntelligencePage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const { section } = await searchParams;

  return (
    <WebsiteIntelligencePanel
      labels={buildWebsiteIntelligenceLabels(t)}
      initialSection={
        section === "traffic" ||
        section === "conversions" ||
        section === "funnels" ||
        section === "content" ||
        section === "partners" ||
        section === "campaigns" ||
        section === "reports"
          ? section
          : "overview"
      }
    />
  );
}
