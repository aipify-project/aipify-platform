import { PlatformBusinessPackFactoryPanel } from "@/components/platform/platform-business-pack-factory";
import { buildPlatformBusinessPackFactoryLabels } from "@/lib/platform-business-pack-factory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBusinessPackFactoryBuilderPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformBusinessPackFactoryLabels(t);

  return (
    <PlatformBusinessPackFactoryPanel
      backHref="/platform/business-pack-factory"
      initialTab="pack_builder"
      visibleTabs={["overview", "pack_builder", "dependencies", "certification", "marketplace"]}
      titleOverride={labels.builderPage.title}
      subtitleOverride={labels.builderPage.subtitle}
      labels={labels}
    />
  );
}
