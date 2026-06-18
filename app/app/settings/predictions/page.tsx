import { PredictionSettingsPanel } from "@/components/app/settings/PredictionSettingsPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PredictionSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);

  return (
    <PredictionSettingsPanel
      labels={{
        title: t("customerApp.settings.predictions.title"),
        description: t("customerApp.settings.predictions.description"),
        privacy: t("customerApp.settings.predictions.privacy"),
        loading: t("customerApp.settings.predictions.loading"),
        back: t("customerApp.settings.predictions.back"),
        save: t("customerApp.settings.predictions.save"),
        saved: t("customerApp.settings.predictions.saved"),
        upgradeTitle: t("customerApp.settings.predictions.upgrade.title"),
        upgradeBody: t("customerApp.settings.predictions.upgrade.body"),
        upgradeCta: t("customerApp.settings.predictions.upgrade.cta"),
        modelsTitle: t("customerApp.settings.predictions.modelsTitle"),
        fields: {
          enable: t("customerApp.settings.predictions.enable"),
          bottlenecks: t("customerApp.settings.predictions.bottlenecks"),
          churn: t("customerApp.settings.predictions.churn"),
          workload: t("customerApp.settings.predictions.workload"),
          growth: t("customerApp.settings.predictions.growth"),
          followup: t("customerApp.settings.predictions.followup"),
          sla: t("customerApp.settings.predictions.sla"),
          approval: t("customerApp.settings.predictions.approval"),
          horizon: t("customerApp.settings.predictions.horizon"),
        },
        predictionsLink: t("customerApp.settings.predictions.predictionsLink"),
      }}
    />
  );
}
