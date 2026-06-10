import { LearningReviewCenterPanel } from "@/components/app/learning/LearningReviewCenterPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppLearningPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "branding"]);
  const t = createTranslator(dict);

  return (
    <LearningReviewCenterPanel
      locale={locale}
      labels={{
        title: t("customerApp.learning.title"),
        subtitle: t("customerApp.learning.subtitle"),
        principle: t("customerApp.learning.principle"),
        loading: t("customerApp.learning.loading"),
        emptyLearnings: t("customerApp.learning.emptyLearnings"),
        emptySuggestions: t("customerApp.learning.emptySuggestions"),
        emptyHistory: t("customerApp.learning.emptyHistory"),
        pulseLabel: t("branding.pulseLabel"),
        sections: {
          mode: t("customerApp.learning.sections.mode"),
          recent: t("customerApp.learning.sections.recent"),
          suggestions: t("customerApp.learning.sections.suggestions"),
          history: t("customerApp.learning.sections.history"),
        },
        modes: {
          disabled: {
            title: t("customerApp.learning.modes.disabled.title"),
            description: t("customerApp.learning.modes.disabled.description"),
          },
          assisted: {
            title: t("customerApp.learning.modes.assisted.title"),
            description: t("customerApp.learning.modes.assisted.description"),
          },
          adaptive: {
            title: t("customerApp.learning.modes.adaptive.title"),
            description: t("customerApp.learning.modes.adaptive.description"),
          },
        },
        adaptiveConsent: t("customerApp.learning.adaptiveConsent"),
        adaptiveConsentHint: t("customerApp.learning.adaptiveConsentHint"),
        saveMode: t("customerApp.learning.saveMode"),
        saving: t("customerApp.learning.saving"),
        saved: t("customerApp.learning.saved"),
        removeLearning: t("customerApp.learning.removeLearning"),
        removing: t("customerApp.learning.removing"),
        confidence: t("customerApp.learning.confidence"),
        learnedAt: t("customerApp.learning.learnedAt"),
        patternType: t("customerApp.learning.patternType"),
        sourceType: t("customerApp.learning.sourceType"),
        viewRecommendations: t("customerApp.learning.viewRecommendations"),
        rolloutStage: t("customerApp.learning.rolloutStage"),
        confidenceLabels: {
          low: t("customerApp.learning.confidenceLabels.low"),
          medium: t("customerApp.learning.confidenceLabels.medium"),
          high: (count: number) =>
            t("customerApp.learning.confidenceLabels.high").replace("{count}", String(count)),
        },
        confidenceBadges: {
          low: t("customerApp.learning.confidenceBadges.low"),
          medium: t("customerApp.learning.confidenceBadges.medium"),
          high: t("customerApp.learning.confidenceBadges.high"),
        },
      }}
    />
  );
}
