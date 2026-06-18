import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { LearningEngineDashboardPanel } from "@/components/app/learning-engine";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppLearningPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <div className="space-y-4">
      <div className="px-6 pt-6">
        <AipifyCompanionBriefingBanner context="learning" labels={buildCompanionBriefingLabels(t)} />
      </div>
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
        engineTitle: t("customerApp.learningEngine.engineTitle"),
        blueprintPhase: t("customerApp.learningEngine.blueprintPhase"),
        engagementSummary: t("customerApp.learningEngine.engagementSummary"),
        eventsTotal: t("customerApp.learningEngine.eventsTotal"),
        eventsLast30d: t("customerApp.learningEngine.eventsLast30d"),
        feedbackTotal: t("customerApp.learningEngine.feedbackTotal"),
        scoresTotal: t("customerApp.learningEngine.scoresTotal"),
        activeMemory: t("customerApp.learningEngine.activeMemory"),
        activeRules: t("customerApp.learningEngine.activeRules"),
        learningObjectives: t("customerApp.learningEngine.learningObjectives"),
        learningSources: t("customerApp.learningEngine.learningSources"),
        adaptationPrinciples: t("customerApp.learningEngine.adaptationPrinciples"),
        adaptationShould: t("customerApp.learningEngine.adaptationShould"),
        adaptationShouldNot: t("customerApp.learningEngine.adaptationShouldNot"),
        companionExamples: t("customerApp.learningEngine.companionExamples"),
        successCriteria: t("customerApp.learningEngine.successCriteria"),
        selfLoveConnection: t("customerApp.learningEngine.selfLoveConnection"),
        openSelfLove: t("customerApp.learningEngine.openSelfLove"),
        trustConnection: t("customerApp.learningEngine.trustConnection"),
        dogfooding: t("customerApp.learningEngine.dogfooding"),
        aipifyGroup: t("customerApp.learningEngine.aipifyGroup"),
        unonightPilot: t("customerApp.learningEngine.unonightPilot"),
        visionPhrases: t("customerApp.learningEngine.visionPhrases"),
        adaptiveOrganizationalTitle: t("customerApp.learningEngine.adaptiveOrganizationalCapability.title"),
        adaptiveOrganizationalObjectives: t("customerApp.learningEngine.adaptiveOrganizationalCapability.objectives"),
        adaptiveOrganizationalLearningSignals: t("customerApp.learningEngine.adaptiveOrganizationalCapability.learningSignals"),
        adaptiveOrganizationalCapabilityQuestions: t("customerApp.learningEngine.adaptiveOrganizationalCapability.capabilityQuestions"),
        adaptiveOrganizationalAdaptivePathways: t("customerApp.learningEngine.adaptiveOrganizationalCapability.adaptivePathways"),
        adaptiveOrganizationalCompanionGuidance: t("customerApp.learningEngine.adaptiveOrganizationalCapability.companionGuidance"),
        adaptiveOrganizationalNotAiCoach: t("customerApp.learningEngine.adaptiveOrganizationalCapability.notAiCoach"),
        adaptiveOrganizationalKnowledgeReinforcement: t("customerApp.learningEngine.adaptiveOrganizationalCapability.knowledgeReinforcement"),
        adaptiveOrganizationalCommunityLearning: t("customerApp.learningEngine.adaptiveOrganizationalCapability.communityLearning"),
        adaptiveOrganizationalLeadershipInsights: t("customerApp.learningEngine.adaptiveOrganizationalCapability.leadershipInsights"),
        adaptiveOrganizationalPrivacy: t("customerApp.learningEngine.adaptiveOrganizationalCapability.privacy"),
        adaptiveOrganizationalSuccessCriteria: t("customerApp.learningEngine.adaptiveOrganizationalCapability.successCriteria"),
        adaptiveOrganizationalSelfLove: t("customerApp.learningEngine.adaptiveOrganizationalCapability.selfLove"),
        adaptiveOrganizationalTrust: t("customerApp.learningEngine.adaptiveOrganizationalCapability.trust"),
        adaptiveOrganizationalEngagement: t("customerApp.learningEngine.adaptiveOrganizationalCapability.engagement"),
        adaptiveOrganizationalLearningSignalsCount: t("customerApp.learningEngine.adaptiveOrganizationalCapability.learningSignalsCount"),
        adaptiveOrganizationalAdaptivePathwaysCount: t("customerApp.learningEngine.adaptiveOrganizationalCapability.adaptivePathwaysCount"),
        adaptiveOrganizationalCapabilityQuestionsCount: t("customerApp.learningEngine.adaptiveOrganizationalCapability.capabilityQuestionsCount"),
        adaptiveOrganizationalVisionPhrases: t("customerApp.learningEngine.adaptiveOrganizationalCapability.visionPhrases"),
      }}
    />
    </div>
  );
}
