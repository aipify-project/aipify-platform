import ModulePlaceholder from "@/components/dashboard/ModulePlaceholder";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function createPlatformPage(sectionKey: string) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <ModulePlaceholder
      title={t(`platform.sections.${sectionKey}.title`)}
      subtitle={t(`platform.sections.${sectionKey}.subtitle`)}
      comingSoon={t(`platform.sections.${sectionKey}.comingSoon`)}
    />
  );
}
