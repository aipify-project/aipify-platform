import { PlatformAosCorePanel } from "@/components/platform/platform-aos-core";
import { buildPlatformAosCoreLabels } from "@/lib/platform-aos-core";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformAosCoreFeaturesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformAosCoreLabels(t);

  return (
    <PlatformAosCorePanel
      backHref="/platform/aos-core"
      initialTab="feature_flags"
      visibleTabs={["overview", "feature_flags", "governance", "executive"]}
      titleOverride={labels.featuresPage.title}
      subtitleOverride={labels.featuresPage.subtitle}
      labels={labels}
    />
  );
}
