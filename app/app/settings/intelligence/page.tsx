import { IntelligenceSettingsPanel } from "@/components/app/settings/IntelligenceSettingsPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);

  return (
    <IntelligenceSettingsPanel
      labels={{
        title: t("customerApp.settings.intelligence.title"),
        description: t("customerApp.settings.intelligence.description"),
        privacy: t("customerApp.settings.intelligence.privacy"),
        loading: t("customerApp.settings.intelligence.loading"),
        back: t("customerApp.settings.intelligence.back"),
        save: t("customerApp.settings.intelligence.save"),
        saved: t("customerApp.settings.intelligence.saved"),
        upgradeTitle: t("customerApp.settings.intelligence.upgrade.title"),
        upgradeBody: t("customerApp.settings.intelligence.upgrade.body"),
        upgradeCta: t("customerApp.settings.intelligence.upgrade.cta"),
        fields: {
          enable: t("customerApp.settings.intelligence.enable"),
          email: t("customerApp.settings.intelligence.email"),
          calendar: t("customerApp.settings.intelligence.calendar"),
          support: t("customerApp.settings.intelligence.support"),
          customerMemory: t("customerApp.settings.intelligence.customerMemory"),
          staffWorkload: t("customerApp.settings.intelligence.staffWorkload"),
          crossDepartment: t("customerApp.settings.intelligence.crossDepartment"),
          approval: t("customerApp.settings.intelligence.approval"),
          retention: t("customerApp.settings.intelligence.retention"),
        },
      }}
    />
  );
}
