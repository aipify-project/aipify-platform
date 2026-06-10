import { LearningReviewCenterPanel } from "@/components/app/learning";
import type { ConfidenceLevel, LearningMode } from "@/lib/learning";
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
        empty: t("customerApp.learning.empty"),
        pulseLabel: t("branding.pulseLabel"),
        sections: {
          mode: t("customerApp.learning.sections.mode"),
          learnings: t("customerApp.learning.sections.learnings"),
          suggestions: t("customerApp.learning.sections.suggestions"),
          history: t("customerApp.learning.sections.history"),
          governance: t("customerApp.learning.sections.governance"),
        },
        modes: {
          disabled: t("customerApp.learning.modes.disabled"),
          assisted: t("customerApp.learning.modes.assisted"),
          adaptive: t("customerApp.learning.modes.adaptive"),
        } as Record<LearningMode, string>,
        modeDescriptions: {
          disabled: t("customerApp.learning.modeDescriptions.disabled"),
          assisted: t("customerApp.learning.modeDescriptions.assisted"),
          adaptive: t("customerApp.learning.modeDescriptions.adaptive"),
        } as Record<LearningMode, string>,
        confidence: {
          low: t("customerApp.learning.confidence.low"),
          medium: t("customerApp.learning.confidence.medium"),
          high: t("customerApp.learning.confidence.high"),
        } as Record<ConfidenceLevel, string>,
        adaptiveConsent: t("customerApp.learning.adaptiveConsent"),
        adaptiveRequired: t("customerApp.learning.adaptiveRequired"),
        save: t("customerApp.learning.save"),
        saved: t("customerApp.learning.saved"),
        remove: t("customerApp.learning.remove"),
        disable: t("customerApp.learning.disable"),
        noLearnings: t("customerApp.learning.noLearnings"),
        noSuggestions: t("customerApp.learning.noSuggestions"),
        noHistory: t("customerApp.learning.noHistory"),
        rollout: t("customerApp.learning.rollout"),
      }}
    />
  );
}
