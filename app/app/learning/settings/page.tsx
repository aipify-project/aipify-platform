import { LearningEngineSettingsPanel } from "@/components/app/learning-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LearningSettingsPage() {
  const dict = await getCustomerAppDictionaryForSplits(await getLocale(), ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <LearningEngineSettingsPanel
      labels={{
        title: t("customerApp.learningEngine.settingsTitle"),
        subtitle: t("customerApp.learningEngine.settingsSubtitle"),
        loading: t("customerApp.learningEngine.loading"),
        back: t("customerApp.learningEngine.back"),
        save: t("customerApp.learningEngine.save"),
        reset: t("customerApp.learningEngine.reset"),
        resetConfirm: t("customerApp.learningEngine.resetConfirm"),
        settings: {
          enabled: t("customerApp.learningEngine.settings.enabled"),
          allow_support_learning: t("customerApp.learningEngine.settings.support"),
          allow_quality_learning: t("customerApp.learningEngine.settings.quality"),
          allow_automation_learning: t("customerApp.learningEngine.settings.automation"),
          allow_notification_learning: t("customerApp.learningEngine.settings.notifications"),
          allow_briefing_learning: t("customerApp.learningEngine.settings.briefing"),
          allow_action_learning: t("customerApp.learningEngine.settings.actions"),
          require_admin_review_rules: t("customerApp.learningEngine.settings.reviewRules"),
        },
      }}
    />
  );
}
