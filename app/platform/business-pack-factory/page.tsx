import { PlatformBusinessPackFactoryPanel } from "@/components/platform/platform-business-pack-factory";
import { buildPlatformBusinessPackFactoryLabels } from "@/lib/platform-business-pack-factory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBusinessPackFactoryPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformBusinessPackFactoryPanel
      backHref="/platform"
      labels={buildPlatformBusinessPackFactoryLabels(t)}
    />
  );
}
