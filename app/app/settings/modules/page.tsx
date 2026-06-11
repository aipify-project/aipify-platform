import { ModulesAdminPanel } from "@/components/app/settings/ModulesAdminPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ModulesSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <ModulesAdminPanel
      labels={{
        title: t("customerApp.commercialPackages.modules.title"),
        subtitle: t("customerApp.commercialPackages.modules.subtitle"),
        loading: t("customerApp.commercialPackages.modules.loading"),
        back: t("customerApp.commercialPackages.modules.back"),
        viewBilling: t("customerApp.commercialPackages.modules.viewBilling"),
        empty: t("customerApp.commercialPackages.modules.empty"),
        enable: t("customerApp.commercialPackages.modules.enable"),
        disable: t("customerApp.commercialPackages.modules.disable"),
        sections: {
          installed: t("customerApp.commercialPackages.modules.sections.installed"),
          available: t("customerApp.commercialPackages.modules.sections.available"),
          trials: t("customerApp.commercialPackages.modules.sections.trials"),
          recommendations: t("customerApp.commercialPackages.modules.sections.recommendations"),
          packages: t("customerApp.commercialPackages.modules.sections.packages"),
          flags: t("customerApp.commercialPackages.modules.sections.flags"),
        },
      }}
    />
  );
}
