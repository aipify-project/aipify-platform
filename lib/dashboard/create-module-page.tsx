import ModulePlaceholder from "@/components/dashboard/ModulePlaceholder";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function createModulePage(moduleKey: string) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <ModulePlaceholder
      title={t(`dashboard.modules.${moduleKey}.title`)}
      subtitle={t(`dashboard.modules.${moduleKey}.subtitle`)}
      comingSoon={t(`dashboard.modules.${moduleKey}.comingSoon`)}
    />
  );
}
