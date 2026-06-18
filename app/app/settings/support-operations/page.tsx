import { SupportOperationsAdminPanel } from "@/components/app/settings/SupportOperationsAdminPanel";
import { AUTONOMY_LEVELS } from "@/lib/autonomous-support-operations";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SupportOperationsSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);

  const autonomyLabels = Object.fromEntries(
    AUTONOMY_LEVELS.map((level) => [
      String(level),
      t(`customerApp.supportOperations.autonomyLevels.${level}`),
    ])
  );

  return (
    <SupportOperationsAdminPanel
      labels={{
        title: t("customerApp.supportOperations.title"),
        subtitle: t("customerApp.supportOperations.subtitle"),
        loading: t("customerApp.supportOperations.loading"),
        back: t("customerApp.supportOperations.back"),
        save: t("customerApp.supportOperations.save"),
        saved: t("customerApp.supportOperations.saved"),
        privacy: t("customerApp.supportOperations.privacy"),
        viewBusinessDna: t("customerApp.supportOperations.viewBusinessDna"),
        runProactive: t("customerApp.supportOperations.runProactive"),
        youControl: t("customerApp.supportOperations.youControl"),
        empty: t("customerApp.supportOperations.empty"),
        sections: {
          health: t("customerApp.supportOperations.sections.health"),
          autonomy: t("customerApp.supportOperations.sections.autonomy"),
          performance: t("customerApp.supportOperations.sections.performance"),
          cases: t("customerApp.supportOperations.sections.cases"),
          approval: t("customerApp.supportOperations.sections.approval"),
          gaps: t("customerApp.supportOperations.sections.gaps"),
          alerts: t("customerApp.supportOperations.sections.alerts"),
          highRisk: t("customerApp.supportOperations.sections.highRisk"),
          triage: t("customerApp.supportOperations.sections.triage"),
          audit: t("customerApp.supportOperations.sections.audit"),
          ethics: t("customerApp.supportOperations.sections.ethics"),
          settings: t("customerApp.supportOperations.sections.settings"),
        },
        settings: {
          proactive: t("customerApp.supportOperations.settings.proactive"),
          gapDetection: t("customerApp.supportOperations.settings.gapDetection"),
          selfHealing: t("customerApp.supportOperations.settings.selfHealing"),
          collaboration: t("customerApp.supportOperations.settings.collaboration"),
          autoThreshold: t("customerApp.supportOperations.settings.autoThreshold"),
          draftThreshold: t("customerApp.supportOperations.settings.draftThreshold"),
        },
        triage: {
          subject: t("customerApp.supportOperations.triage.subject"),
          body: t("customerApp.supportOperations.triage.body"),
          run: t("customerApp.supportOperations.triage.run"),
          result: t("customerApp.supportOperations.triage.result"),
        },
        autonomyLevels: autonomyLabels,
      }}
    />
  );
}
