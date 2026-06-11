import { PredictionsPanel } from "@/components/app/predictive-intelligence/PredictionsPanel";
import { ALERT_SEVERITIES, ALERT_TYPES } from "@/lib/aipify/predictive-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PredictionsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const severities = Object.fromEntries(
    ALERT_SEVERITIES.map((s) => [s, t(`customerApp.predictions.severities.${s}`)])
  );
  const alertTypes = Object.fromEntries(
    ALERT_TYPES.map((type) => [type, t(`customerApp.predictions.types.${type}`)])
  );

  return (
    <PredictionsPanel
      labels={{
        title: t("customerApp.predictions.title"),
        subtitle: t("customerApp.predictions.subtitle"),
        loading: t("customerApp.predictions.loading"),
        back: t("customerApp.predictions.back"),
        privacy: t("customerApp.predictions.privacy"),
        upgradeTitle: t("customerApp.predictions.upgrade.title"),
        upgradeBody: t("customerApp.predictions.upgrade.body"),
        upgradeCta: t("customerApp.predictions.upgrade.cta"),
        refresh: t("customerApp.predictions.refresh"),
        notEnabledTitle: t("customerApp.predictions.notEnabled.title"),
        notEnabledBody: t("customerApp.predictions.notEnabled.body"),
        enableCta: t("customerApp.predictions.notEnabled.cta"),
        openAlerts: t("customerApp.predictions.openAlerts"),
        upcomingWeek: t("customerApp.predictions.upcomingWeek"),
        horizon: t("customerApp.predictions.horizon"),
        noAlerts: t("customerApp.predictions.noAlerts"),
        predictedDate: t("customerApp.predictions.predictedDate"),
        severities,
        alertTypes,
        actions: {
          acknowledge: t("customerApp.predictions.actions.acknowledge"),
          resolve: t("customerApp.predictions.actions.resolve"),
          dismiss: t("customerApp.predictions.actions.dismiss"),
          snooze: t("customerApp.predictions.actions.snooze"),
        },
        settingsLink: t("customerApp.predictions.settingsLink"),
      }}
    />
  );
}
