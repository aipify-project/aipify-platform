import PlatformBrainDashboardPanel from "@/components/platform/PlatformBrainDashboardPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceBrainPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformBrainDashboardPanel
      labels={{
        title: t("platform.intelligence.brain.title"),
        subtitle: t("platform.intelligence.brain.subtitle"),
        loading: t("platform.intelligence.brain.loading"),
        pulseLabel: t("branding.pulseLabel"),
        metrics: {
          knowledgePatternsApproved: t(
            "platform.intelligence.brain.metrics.knowledgePatternsApproved"
          ),
          patternsAwaitingReview: t("platform.intelligence.brain.metrics.patternsAwaitingReview"),
          learningEvents30d: t("platform.intelligence.brain.metrics.learningEvents30d"),
          selfHealingSuccessRate: t("platform.intelligence.brain.metrics.selfHealingSuccessRate"),
          globalRecommendations: t("platform.intelligence.brain.metrics.globalRecommendations"),
          learningConfidence: t("platform.intelligence.brain.metrics.learningConfidence"),
          approvedAutomations: t("platform.intelligence.brain.metrics.approvedAutomations"),
          automationCoverage: t("platform.intelligence.brain.metrics.automationCoverage"),
        },
        recommendations: {
          title: t("platform.intelligence.brain.recommendations.title"),
          empty: t("platform.intelligence.brain.recommendations.empty"),
          confidence: t("platform.intelligence.brain.recommendations.confidence"),
        },
        privacyNote: t("platform.intelligence.privacyNote"),
      }}
    />
  );
}
