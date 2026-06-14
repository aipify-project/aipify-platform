import { OrganizationalCourageCenterPanel } from "@/components/app/organizational-courage-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalCourageCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalCourageCenter";

  return (
    <OrganizationalCourageCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalCuriosityLink: t(`${p}.organizationalCuriosityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        conversationTitle: t(`${p}.conversationTitle`),
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
        coordinateDiscussion: t(`${p}.coordinateDiscussion`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        courageScore: t(`${p}.courageScore`),
        valuesAlignedDecisions: t(`${p}.valuesAlignedDecisions`),
        domains: {
          leadership: t(`${p}.domains.leadership`),
          ethical: t(`${p}.domains.ethical`),
          strategic: t(`${p}.domains.strategic`),
          workforce: t(`${p}.domains.workforce`),
          customer: t(`${p}.domains.customer`),
          innovation: t(`${p}.domains.innovation`),
        },
        signalTypes: {
          values_based_leadership: t(`${p}.signalTypes.values_based_leadership`),
          healthy_challenge: t(`${p}.signalTypes.healthy_challenge`),
          responsible_innovation: t(`${p}.signalTypes.responsible_innovation`),
          ethical_consistency: t(`${p}.signalTypes.ethical_consistency`),
          learning_from_setbacks: t(`${p}.signalTypes.learning_from_setbacks`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        conversationTypes: {
          avoiding_conversation: t(`${p}.conversationTypes.avoiding_conversation`),
          values_guidance: t(`${p}.conversationTypes.values_guidance`),
          truth_communication: t(`${p}.conversationTypes.truth_communication`),
          thoughtful_risks: t(`${p}.conversationTypes.thoughtful_risks`),
          honesty_compassion: t(`${p}.conversationTypes.honesty_compassion`),
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
          courage_development_recommended: t(`${p}.healthLabels.courage_development_recommended`),
        },
        timelineTypes: {
          leadership_decision: t(`${p}.timelineTypes.leadership_decision`),
          ethical_milestone: t(`${p}.timelineTypes.ethical_milestone`),
          innovation_breakthrough: t(`${p}.timelineTypes.innovation_breakthrough`),
          reflection_development: t(`${p}.timelineTypes.reflection_development`),
          organizational_learning: t(`${p}.timelineTypes.organizational_learning`),
        },
        reviewTypes: {
          quarterly_courage: t(`${p}.reviewTypes.quarterly_courage`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          ethical_decision_discussion: t(`${p}.reviewTypes.ethical_decision_discussion`),
          annual_organizational_assessment: t(`${p}.reviewTypes.annual_organizational_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          ethical_decision_discussion: t(`${p}.sessionTypes.ethical_decision_discussion`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          leadershipTransparency: t(`${p}.metrics.leadershipTransparency`),
          reflectionParticipation: t(`${p}.metrics.reflectionParticipation`),
          ethicalConsistencyMetric: t(`${p}.metrics.ethicalConsistencyMetric`),
          learningIntegration: t(`${p}.metrics.learningIntegration`),
          responsibleInnovation: t(`${p}.metrics.responsibleInnovation`),
          leadershipReflection: t(`${p}.metrics.leadershipReflection`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipIntegrity: t(`${p}.executiveFields.leadershipIntegrity`),
          innovationConfidence: t(`${p}.executiveFields.innovationConfidence`),
          ethicalConsistency: t(`${p}.executiveFields.ethicalConsistency`),
          valuesBasedDecisions: t(`${p}.executiveFields.valuesBasedDecisions`),
        },
      }}
    />
  );
}
