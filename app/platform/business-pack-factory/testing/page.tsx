import { PlatformBusinessPackFactoryPanel } from "@/components/platform/platform-business-pack-factory";
import { buildPlatformBusinessPackFactoryLabels } from "@/lib/platform-business-pack-factory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBusinessPackFactoryTestingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformBusinessPackFactoryLabels(t);

  return (
    <PlatformBusinessPackFactoryPanel
      backHref="/platform/business-pack-factory"
      initialTab="testing"
      visibleTabs={["overview", "testing", "certification", "marketplace", "reports"]}
      titleOverride={labels.testingPage.title}
      subtitleOverride={labels.testingPage.subtitle}
      labels={labels}
    />
  );
}
