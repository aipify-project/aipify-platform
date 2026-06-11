import { LearningEngineDashboardPanel } from "@/components/app/learning-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppLearningPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <LearningEngineDashboardPanel
      locale={locale}
      labels={{
        title: t("customerApp.learningEngine.title"),
        subtitle: t("customerApp.learningEngine.subtitle"),
        principle: t("customerApp.learningEngine.principle"),
        loading: t("customerApp.learningEngine.loading"),
        empty: t("customerApp.learningEngine.empty"),
        reviewCenter: t("customerApp.learningEngine.reviewCenter"),
        feedback: t("customerApp.learningEngine.feedback"),
        rules: t("customerApp.learningEngine.rules"),
        settings: t("customerApp.learningEngine.settingsLink"),
        audit: t("customerApp.learningEngine.audit"),
        collect: t("customerApp.learningEngine.collect"),
        totalEvents: t("customerApp.learningEngine.totalEvents"),
        positiveFeedback: t("customerApp.learningEngine.positiveFeedback"),
        negativeFeedback: t("customerApp.learningEngine.negativeFeedback"),
        falsePositivesReduced: t("customerApp.learningEngine.falsePositivesReduced"),
        suggestionsImproved: t("customerApp.learningEngine.suggestionsImproved"),
        noisyReduced: t("customerApp.learningEngine.noisyReduced"),
        topPatterns: t("customerApp.learningEngine.topPatterns"),
        recentEvents: t("customerApp.learningEngine.recentEvents"),
        noPatterns: t("customerApp.learningEngine.noPatterns"),
        noEvents: t("customerApp.learningEngine.noEvents"),
        privacy: t("customerApp.learningEngine.privacy"),
      }}
    />
  );
}
