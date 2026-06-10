import { CustomerSkillsScaffold } from "@/components/app/skills";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppSkillsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <CustomerSkillsScaffold
      title={t("dashboard.skills.title")}
      subtitle={t("dashboard.skills.subtitle")}
      areas={[
        t("dashboard.skills.areas.installed"),
        t("dashboard.skills.areas.settings"),
        t("dashboard.skills.areas.activity"),
        t("dashboard.skills.areas.preferences"),
        t("dashboard.skills.areas.companion"),
      ]}
    />
  );
}
