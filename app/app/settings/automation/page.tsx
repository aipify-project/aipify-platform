import { AutomationSettingsPanel } from "@/components/app/settings/AutomationSettingsPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutomationSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);

  return (
    <AutomationSettingsPanel
      labels={{
        title: t("customerApp.settings.automation.title"),
        description: t("customerApp.settings.automation.description"),
        privacy: t("customerApp.settings.automation.privacy"),
        loading: t("customerApp.settings.automation.loading"),
        back: t("customerApp.settings.automation.back"),
        save: t("customerApp.settings.automation.save"),
        saved: t("customerApp.settings.automation.saved"),
        upgradeTitle: t("customerApp.settings.automation.upgrade.title"),
        upgradeBody: t("customerApp.settings.automation.upgrade.body"),
        upgradeCta: t("customerApp.settings.automation.upgrade.cta"),
        fields: {
          enable: t("customerApp.settings.automation.enable"),
          discovery: t("customerApp.settings.automation.discovery"),
          aiDrafts: t("customerApp.settings.automation.aiDrafts"),
          lowRiskExecution: t("customerApp.settings.automation.lowRiskExecution"),
          mediumApproval: t("customerApp.settings.automation.mediumApproval"),
          highApproval: t("customerApp.settings.automation.highApproval"),
          valueEstimation: t("customerApp.settings.automation.valueEstimation"),
          maxDaily: t("customerApp.settings.automation.maxDaily"),
          maxMessages: t("customerApp.settings.automation.maxMessages"),
        },
        centerLink: t("customerApp.settings.automation.centerLink"),
      }}
    />
  );
}
