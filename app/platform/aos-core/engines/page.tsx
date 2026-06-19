import { PlatformAosCorePanel } from "@/components/platform/platform-aos-core";
import { buildPlatformAosCoreLabels } from "@/lib/platform-aos-core";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformAosCoreEnginesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformAosCoreLabels(t);

  return (
    <PlatformAosCorePanel
      backHref="/platform/aos-core"
      initialTab="engine_registry"
      visibleTabs={["overview", "engine_registry", "dependencies", "platform_health", "governance"]}
      titleOverride={labels.enginesPage.title}
      subtitleOverride={labels.enginesPage.subtitle}
      labels={labels}
    />
  );
}
