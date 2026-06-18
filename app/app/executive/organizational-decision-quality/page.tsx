import { OrganizationalDecisionQualityCenterPanel } from "@/components/app/organizational-decision-quality-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalDecisionQualityCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalDecisionQualityCenter";

  return (
    <OrganizationalDecisionQualityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalImpactLink: t(`${p}.organizationalImpactLink`),
        organizationalWisdomLink: t(`${p}.organizationalWisdomLink`),
        organizationalLearningLink: t(`${p}.organizationalLearningLink`),
        executiveDecisionSupportLink: t(`${p}.executiveDecisionSupportLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        reflectionsTitle: t(`${p}.reflectionsTitle`),
        decisionsTitle: t(`${p}.decisionsTitle`),
        workflowTitle: t(`${p}.workflowTitle`),
        biasTitle: t(`${p}.biasTitle`),
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
        markReflection: t(`${p}.markReflection`),
        advanceDecision: t(`${p}.advanceDecision`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateDiscussion: t(`${p}.coordinateDiscussion`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        decisionQualityScore: t(`${p}.decisionQualityScore`),
        reflectionParticipation: t(`${p}.reflectionParticipation`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          operational: t(`${p}.domains.operational`),
          customer: t(`${p}.domains.customer`),
          leadership: t(`${p}.domains.leadership`),
          innovation: t(`${p}.domains.innovation`),
        },
        workflowStatuses: {
          recorded: t(`${p}.workflowStatuses.recorded`),
          context_documented: t(`${p}.workflowStatuses.context_documented`),
          stakeholder_input: t(`${p}.workflowStatuses.stakeholder_input`),
          implemented: t(`${p}.workflowStatuses.implemented`),
          outcomes_observed: t(`${p}.workflowStatuses.outcomes_observed`),
          lessons_reflected: t(`${p}.workflowStatuses.lessons_reflected`),
          learning_integrated: t(`${p}.workflowStatuses.learning_integrated`),
        },
        biasTypes: {
          confirmation_bias: t(`${p}.biasTypes.confirmation_bias`),
          short_term_thinking: t(`${p}.biasTypes.short_term_thinking`),
          groupthink_risk: t(`${p}.biasTypes.groupthink_risk`),
          overconfidence: t(`${p}.biasTypes.overconfidence`),
          historical_assumptions: t(`${p}.biasTypes.historical_assumptions`),
        },
        reflectionStatuses: {
          open: t(`${p}.reflectionStatuses.open`),
          reflected: t(`${p}.reflectionStatuses.reflected`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          healthy: t(`${p}.healthLabels.healthy`),
          developing: t(`${p}.healthLabels.developing`),
          review_recommended: t(`${p}.healthLabels.review_recommended`),
        },
        timelineTypes: {
          significant_decision: t(`${p}.timelineTypes.significant_decision`),
          reflection_milestone: t(`${p}.timelineTypes.reflection_milestone`),
          learning_integration: t(`${p}.timelineTypes.learning_integration`),
          strategic_turning_point: t(`${p}.timelineTypes.strategic_turning_point`),
          governance_discussion: t(`${p}.timelineTypes.governance_discussion`),
        },
        reviewTypes: {
          decision_review: t(`${p}.reviewTypes.decision_review`),
          reflection_session: t(`${p}.reviewTypes.reflection_session`),
          governance_discussion: t(`${p}.reviewTypes.governance_discussion`),
          learning_integration: t(`${p}.reviewTypes.learning_integration`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          review_discussion: t(`${p}.sessionTypes.review_discussion`),
          learning_workshop: t(`${p}.sessionTypes.learning_workshop`),
        },
        metrics: {
          context: t(`${p}.metrics.context`),
          stakeholders: t(`${p}.metrics.stakeholders`),
          learning: t(`${p}.metrics.learning`),
          governance: t(`${p}.metrics.governance`),
          underReview: t(`${p}.metrics.underReview`),
          documented: t(`${p}.metrics.documented`),
          reviews: t(`${p}.metrics.reviews`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          strategic: t(`${p}.executiveFields.strategic`),
          reflection: t(`${p}.executiveFields.reflection`),
          learning: t(`${p}.executiveFields.learning`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
