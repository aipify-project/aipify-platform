import { CustomerSkillOSPanel } from "@/components/app/skills";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppSkillsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard", "branding"]);
  const t = createTranslator(dict);

  return (
    <CustomerSkillOSPanel
      labels={{
        title: t("dashboard.skills.title"),
        subtitle: t("dashboard.skills.subtitle"),
        loading: t("dashboard.skills.loading"),
        empty: t("dashboard.skills.empty"),
        pulseLabel: t("branding.pulseLabel"),
        principle: t("dashboard.skills.principle"),
        installed: {
          title: t("dashboard.skills.installed.title"),
          none: t("dashboard.skills.installed.none"),
        },
        available: {
          title: t("dashboard.skills.available.title"),
          none: t("dashboard.skills.available.none"),
        },
        columns: {
          name: t("dashboard.skills.columns.name"),
          category: t("dashboard.skills.columns.category"),
          status: t("dashboard.skills.columns.status"),
          learning: t("dashboard.skills.columns.learning"),
          health: t("dashboard.skills.columns.health"),
          success: t("dashboard.skills.columns.success"),
        },
      }}
    />
  );
}
