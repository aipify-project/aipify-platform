import { OrganizationalAdaptiveIntelligenceCenterPanel } from "@/components/app/organizational-adaptive-intelligence-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalAdaptiveIntelligenceCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalAdaptiveIntelligenceCenter";

  return (
    <OrganizationalAdaptiveIntelligenceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalWisdomTransferLink: t(`${p}.organizationalWisdomTransferLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        learningApplicationTitle: t(`${p}.learningApplicationTitle`),
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
        adaptiveIntelligenceScore: t(`${p}.adaptiveIntelligenceScore`),
        capabilityEvolutionMetric: t(`${p}.capabilityEvolutionMetric`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          leadership: t(`${p}.domains.leadership`),
          operational: t(`${p}.domains.operational`),
          customer: t(`${p}.domains.customer`),
          workforce: t(`${p}.domains.workforce`),
          organizational: t(`${p}.domains.organizational`),
        },
        signalTypes: {
          emerging_capabilities: t(`${p}.signalTypes.emerging_capabilities`),
          learning_applications: t(`${p}.signalTypes.learning_applications`),
          positive_adaptation: t(`${p}.signalTypes.positive_adaptation`),
          strategic_responsiveness: t(`${p}.signalTypes.strategic_responsiveness`),
          high_value_adjustments: t(`${p}.signalTypes.high_value_adjustments`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        learningApplicationTypes: {
          recent_learning: t(`${p}.learningApplicationTypes.recent_learning`),
          applying_lessons: t(`${p}.learningApplicationTypes.applying_lessons`),
          capability_development: t(`${p}.learningApplicationTypes.capability_development`),
          strengthening_adaptations: t(`${p}.learningApplicationTypes.strengthening_adaptations`),
          unchanged_practices: t(`${p}.learningApplicationTypes.unchanged_practices`),
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
          adaptation_opportunities_identified: t(`${p}.healthLabels.adaptation_opportunities_identified`),
        },
        timelineTypes: {
          learning_breakthrough: t(`${p}.timelineTypes.learning_breakthrough`),
          strategic_adaptation: t(`${p}.timelineTypes.strategic_adaptation`),
          capability_development: t(`${p}.timelineTypes.capability_development`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          organizational_milestone: t(`${p}.timelineTypes.organizational_milestone`),
        },
        reviewTypes: {
          quarterly_adaptive_intelligence: t(`${p}.reviewTypes.quarterly_adaptive_intelligence`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          strategic_learning_discussion: t(`${p}.reviewTypes.strategic_learning_discussion`),
          annual_organizational_assessment: t(`${p}.reviewTypes.annual_organizational_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          strategic_learning_discussion: t(`${p}.sessionTypes.strategic_learning_discussion`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          learningEffectiveness: t(`${p}.metrics.learningEffectiveness`),
          reflectionParticipation: t(`${p}.metrics.reflectionParticipation`),
          strategicResponsivenessMetric: t(`${p}.metrics.strategicResponsivenessMetric`),
          capabilityEvolutionMetric: t(`${p}.metrics.capabilityEvolutionMetric`),
          decisionAdaptability: t(`${p}.metrics.decisionAdaptability`),
          responsivenessTrends: t(`${p}.metrics.responsivenessTrends`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipLearning: t(`${p}.executiveFields.leadershipLearning`),
          strategicResponsiveness: t(`${p}.executiveFields.strategicResponsiveness`),
          capabilityEvolution: t(`${p}.executiveFields.capabilityEvolution`),
          futureReadiness: t(`${p}.executiveFields.futureReadiness`),
        },
      }}
    />
  );
}
