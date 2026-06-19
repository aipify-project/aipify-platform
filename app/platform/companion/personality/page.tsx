import { PlatformCompanionPersonalityPanel } from "@/components/platform/platform-companion-personality";
import { buildPlatformCompanionPersonalityLabels } from "@/lib/platform-companion-personality";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCompanionPersonalityPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  return (
    <PlatformCompanionPersonalityPanel
      backHref="/platform"
      labels={buildPlatformCompanionPersonalityLabels(createTranslator(dict))}
    />
  );
}
