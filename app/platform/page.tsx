import PlatformOverviewPanel from "@/components/platform/PlatformOverviewPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformOverviewPanel
      labels={{
        title: t("platform.overview.title"),
        subtitle: t("platform.overview.subtitle"),
        note: t("platform.overview.note"),
        loading: t("platform.overview.loading"),
        pulseLabel: t("branding.pulseLabel"),
        priorityLabels: {
          critical: t("platform.overview.priorityLabels.critical"),
          important: t("platform.overview.priorityLabels.important"),
          informational: t("platform.overview.priorityLabels.informational"),
        },
        briefing: {
          title: t("platform.overview.briefing.title"),
          greetingMorning: t("platform.overview.briefing.greetingMorning"),
          greetingAfternoon: t("platform.overview.briefing.greetingAfternoon"),
          greetingEvening: t("platform.overview.briefing.greetingEvening"),
          sinceVisit: t("platform.overview.briefing.sinceVisit"),
          newCustomers: t("platform.overview.briefing.newCustomers"),
          trialsEnding: t("platform.overview.briefing.trialsEnding"),
          supportResolved: t("platform.overview.briefing.supportResolved"),
          escalated: t("platform.overview.briefing.escalated"),
          failedAutomations: t("platform.overview.briefing.failedAutomations"),
          systemWarnings: t("platform.overview.briefing.systemWarnings"),
          newRecommendations: t("platform.overview.briefing.newRecommendations"),
          followUp: t("platform.overview.briefing.followUp"),
          noIncidents: t("platform.overview.briefing.noIncidents"),
          incidents: t("platform.overview.briefing.incidents"),
        },
        recommendedActions: {
          title: t("platform.overview.recommendedActions.title"),
          suggestedAction: t("platform.overview.recommendedActions.suggestedAction"),
          empty: t("platform.overview.recommendedActions.empty"),
          trialsExpiring: {
            title: t("platform.overview.recommendedActions.trialsExpiring.title"),
            reason: t("platform.overview.recommendedActions.trialsExpiring.reason"),
            action: t("platform.overview.recommendedActions.trialsExpiring.action"),
          },
          healthDropped: {
            title: t("platform.overview.recommendedActions.healthDropped.title"),
            reason: t("platform.overview.recommendedActions.healthDropped.reason"),
            action: t("platform.overview.recommendedActions.healthDropped.action"),
          },
          escalationWaiting: {
            title: t("platform.overview.recommendedActions.escalationWaiting.title"),
            reason: t("platform.overview.recommendedActions.escalationWaiting.reason"),
            action: t("platform.overview.recommendedActions.escalationWaiting.action"),
          },
          revenueOpportunity: {
            title: t("platform.overview.recommendedActions.revenueOpportunity.title"),
            reason: t("platform.overview.recommendedActions.revenueOpportunity.reason"),
            action: t("platform.overview.recommendedActions.revenueOpportunity.action"),
          },
          failedAutomation: {
            title: t("platform.overview.recommendedActions.failedAutomation.title"),
            reason: t("platform.overview.recommendedActions.failedAutomation.reason"),
            action: t("platform.overview.recommendedActions.failedAutomation.action"),
          },
        },
        sinceLogin: {
          title: t("platform.overview.sinceLogin.title"),
          markRead: t("platform.overview.sinceLogin.markRead"),
          markedRead: t("platform.overview.sinceLogin.markedRead"),
          expand: t("platform.overview.sinceLogin.expand"),
          openModule: t("platform.overview.sinceLogin.openModule"),
          newCustomers: t("platform.overview.sinceLogin.newCustomers"),
          supportResolved: t("platform.overview.sinceLogin.supportResolved"),
          escalated: t("platform.overview.sinceLogin.escalated"),
          installationsCompleted: t("platform.overview.sinceLogin.installationsCompleted"),
          automationsTriggered: t("platform.overview.sinceLogin.automationsTriggered"),
          aiRecommendations: t("platform.overview.sinceLogin.aiRecommendations"),
          systemIncidents: t("platform.overview.sinceLogin.systemIncidents"),
          revenueEvents: t("platform.overview.sinceLogin.revenueEvents"),
          recommendationHint: t("platform.overview.sinceLogin.recommendationHint"),
          empty: t("platform.overview.sinceLogin.empty"),
        },
        brain: {
          title: t("platform.overview.brain.title"),
          viewBrain: t("platform.overview.brain.viewBrain"),
          loading: t("platform.overview.brain.loading"),
          approvedPatterns: t("platform.overview.brain.approvedPatterns"),
          awaitingReview: t("platform.overview.brain.awaitingReview"),
          healingSuccessRate: t("platform.overview.brain.healingSuccessRate"),
          learningConfidence: t("platform.overview.brain.learningConfidence"),
          automationCoverage: t("platform.overview.brain.automationCoverage"),
        },
        intelligenceRecommendations: {
          title: t("platform.overview.intelligenceRecommendations.title"),
          subtitle: t("platform.overview.intelligenceRecommendations.subtitle"),
          loading: t("platform.overview.intelligenceRecommendations.loading"),
          empty: t("platform.overview.intelligenceRecommendations.empty"),
          confidence: t("platform.overview.intelligenceRecommendations.confidence"),
          viewQueue: t("platform.overview.intelligenceRecommendations.viewQueue"),
        },
        learning: {
          title: t("platform.overview.learning.title"),
          subtitle: t("platform.overview.learning.subtitle"),
          loading: t("platform.overview.learning.loading"),
          pulseLabel: t("branding.pulseLabel"),
          totals: {
            patterns: t("platform.overview.learning.totals.patterns"),
            approvedPatterns: t("platform.overview.learning.totals.approvedPatterns"),
            learningEvents: t("platform.overview.learning.totals.learningEvents"),
            healingExecutions: t("platform.overview.learning.totals.healingExecutions"),
          },
          patterns: {
            title: t("platform.overview.learning.patterns.title"),
            empty: t("platform.overview.learning.patterns.empty"),
            approved: t("platform.overview.learning.patterns.approved"),
          },
          environments: {
            title: t("platform.overview.learning.environments.title"),
            internal: t("platform.overview.learning.environments.internal"),
            pilot: t("platform.overview.learning.environments.pilot"),
            customer: t("platform.overview.learning.environments.customer"),
            enterprise: t("platform.overview.learning.environments.enterprise"),
          },
          privacyNote: t("platform.overview.learning.privacyNote"),
        },
      }}
    />
  );
}
