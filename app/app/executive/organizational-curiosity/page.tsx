import { OrganizationalCuriosityCenterPanel } from "@/components/app/organizational-curiosity-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalCuriosityCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalCuriosityCenter";

  return (
    <OrganizationalCuriosityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalHarmonyLink: t(`${p}.organizationalHarmonyLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        questionTitle: t(`${p}.questionTitle`),
        discoveryTitle: t(`${p}.discoveryTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        sessionsTitle: t(`${p}.sessionsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        completeSession: t(`${p}.completeSession`),
        scheduleReflection: t(`${p}.scheduleReflection`),
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateReview: t(`${p}.coordinateReview`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        curiosityScore: t(`${p}.curiosityScore`),
        learningEngagement: t(`${p}.learningEngagement`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          customer: t(`${p}.domains.customer`),
          leadership: t(`${p}.domains.leadership`),
          operational: t(`${p}.domains.operational`),
          workforce: t(`${p}.domains.workforce`),
          innovation: t(`${p}.domains.innovation`),
        },
        signalTypes: {
          valuable_question: t(`${p}.signalTypes.valuable_question`),
          learning_breakthrough: t(`${p}.signalTypes.learning_breakthrough`),
          unexpected_opportunity: t(`${p}.signalTypes.unexpected_opportunity`),
          cross_functional_insight: t(`${p}.signalTypes.cross_functional_insight`),
          innovation_theme: t(`${p}.signalTypes.innovation_theme`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        questionTypes: {
          assumptions_check: t(`${p}.questionTypes.assumptions_check`),
          overlooked_factors: t(`${p}.questionTypes.overlooked_factors`),
          learn_from_others: t(`${p}.questionTypes.learn_from_others`),
          unexplored_opportunities: t(`${p}.questionTypes.unexplored_opportunities`),
          improvement_paths: t(`${p}.questionTypes.improvement_paths`),
        },
        discoveryTypes: {
          valuable_question: t(`${p}.discoveryTypes.valuable_question`),
          learning_breakthrough: t(`${p}.discoveryTypes.learning_breakthrough`),
          unexpected_opportunity: t(`${p}.discoveryTypes.unexpected_opportunity`),
          cross_functional_insight: t(`${p}.discoveryTypes.cross_functional_insight`),
          innovation_theme: t(`${p}.discoveryTypes.innovation_theme`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          healthy: t(`${p}.healthLabels.healthy`),
          developing: t(`${p}.healthLabels.developing`),
          curiosity_encouraged: t(`${p}.healthLabels.curiosity_encouraged`),
        },
        timelineTypes: {
          learning_milestone: t(`${p}.timelineTypes.learning_milestone`),
          reflection_development: t(`${p}.timelineTypes.reflection_development`),
          innovation_discovery: t(`${p}.timelineTypes.innovation_discovery`),
          cross_functional_insight: t(`${p}.timelineTypes.cross_functional_insight`),
          strategic_exploration: t(`${p}.timelineTypes.strategic_exploration`),
        },
        reviewTypes: {
          quarterly_learning: t(`${p}.reviewTypes.quarterly_learning`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          innovation_discussion: t(`${p}.reviewTypes.innovation_discussion`),
          annual_exploration_assessment: t(`${p}.reviewTypes.annual_exploration_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          innovation_discussion: t(`${p}.sessionTypes.innovation_discussion`),
          exploration_workshop: t(`${p}.sessionTypes.exploration_workshop`),
        },
        metrics: {
          learningParticipation: t(`${p}.metrics.learningParticipation`),
          reflectionEngagement: t(`${p}.metrics.reflectionEngagement`),
          crossFunctionalExploration: t(`${p}.metrics.crossFunctionalExploration`),
          knowledgeSharing: t(`${p}.metrics.knowledgeSharing`),
          innovationDiscipline: t(`${p}.metrics.innovationDiscipline`),
          explorationInitiatives: t(`${p}.metrics.explorationInitiatives`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipLearning: t(`${p}.executiveFields.leadershipLearning`),
          explorationTrends: t(`${p}.executiveFields.explorationTrends`),
          innovationOpportunities: t(`${p}.executiveFields.innovationOpportunities`),
          organizationalInquiry: t(`${p}.executiveFields.organizationalInquiry`),
        },
      }}
    />
  );
}
