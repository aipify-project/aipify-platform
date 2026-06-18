import { BusinessPulsePanel } from "@/components/app/business-pulse/BusinessPulsePanel";
import { PULSE_AREAS, PULSE_STATUSES, PULSE_ALERT_SEVERITIES } from "@/lib/aipify/business-pulse";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPulseExecutiveReportPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  const statuses = Object.fromEntries(
    PULSE_STATUSES.map((s) => [s, t(`customerApp.businessPulse.statuses.${s}`)])
  );
  const areas = Object.fromEntries(
    PULSE_AREAS.map((a) => [a, t(`customerApp.businessPulse.areas.${a}`)])
  );
  const severities = Object.fromEntries(
    PULSE_ALERT_SEVERITIES.map((s) => [s, t(`customerApp.businessPulse.severities.${s}`)])
  );

  return (
    <BusinessPulsePanel
      executiveReport
      labels={{
        title: t("customerApp.businessPulse.title"),
        subtitle: t("customerApp.businessPulse.executiveSubtitle"),
        loading: t("customerApp.businessPulse.loading"),
        back: t("customerApp.businessPulse.backToPulse"),
        youControl: t("customerApp.businessPulse.youControl"),
        privacy: t("customerApp.businessPulse.privacy"),
        upgradeTitle: t("customerApp.businessPulse.upgrade.title"),
        upgradeBody: t("customerApp.businessPulse.upgrade.body"),
        upgradeCta: t("customerApp.businessPulse.upgrade.cta"),
        recalculate: t("customerApp.businessPulse.recalculate"),
        executiveReport: t("customerApp.businessPulse.executiveReport"),
        viewExecutiveReport: t("customerApp.businessPulse.viewExecutiveReport"),
        sections: {
          today: t("customerApp.businessPulse.sections.today"),
          changed: t("customerApp.businessPulse.sections.changed"),
          attention: t("customerApp.businessPulse.sections.attention"),
          normal: t("customerApp.businessPulse.sections.normal"),
          focus: t("customerApp.businessPulse.sections.focus"),
          alerts: t("customerApp.businessPulse.sections.alerts"),
          history: t("customerApp.businessPulse.sections.history"),
          sources: t("customerApp.businessPulse.sections.sources"),
        },
        statuses,
        areas,
        severities,
        actions: {
          acknowledge: t("customerApp.businessPulse.actions.acknowledge"),
          dismiss: t("customerApp.businessPulse.actions.dismiss"),
        },
        emptyAlerts: t("customerApp.businessPulse.emptyAlerts"),
        emptyHistory: t("customerApp.businessPulse.emptyHistory"),
      }}
    />
  );
}
