import { OrganizationalAwarenessCenterPanel } from "@/components/app/organizational-awareness-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalAwarenessCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalAwarenessCenter";

  return (
    <OrganizationalAwarenessCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalIntentionalityLink: t(`${p}.organizationalIntentionalityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        observationTitle: t(`${p}.observationTitle`),
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
        awarenessScore: t(`${p}.awarenessScore`),
        emergingThemes: t(`${p}.emergingThemes`),
        domains: {
          organizational: t(`${p}.domains.organizational`),
          strategic: t(`${p}.domains.strategic`),
          leadership: t(`${p}.domains.leadership`),
          customer: t(`${p}.domains.customer`),
          workforce: t(`${p}.domains.workforce`),
          risk: t(`${p}.domains.risk`),
        },
        signalTypes: {
          emerging_pattern: t(`${p}.signalTypes.emerging_pattern`),
          significant_observation: t(`${p}.signalTypes.significant_observation`),
          shifting_condition: t(`${p}.signalTypes.shifting_condition`),
          hidden_dependency: t(`${p}.signalTypes.hidden_dependency`),
          executive_attention: t(`${p}.signalTypes.executive_attention`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        observationTypes: {
          what_noticing: t(`${p}.observationTypes.what_noticing`),
          what_overlooking: t(`${p}.observationTypes.what_overlooking`),
          patterns_attention: t(`${p}.observationTypes.patterns_attention`),
          assumptions_revisit: t(`${p}.observationTypes.assumptions_revisit`),
          emerging_developments: t(`${p}.observationTypes.emerging_developments`),
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
          awareness_improvement_recommended: t(`${p}.healthLabels.awareness_improvement_recommended`),
        },
        timelineTypes: {
          emerging_theme: t(`${p}.timelineTypes.emerging_theme`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          strategic_observation: t(`${p}.timelineTypes.strategic_observation`),
          organizational_insight: t(`${p}.timelineTypes.organizational_insight`),
          learning_development: t(`${p}.timelineTypes.learning_development`),
        },
        reviewTypes: {
          monthly_awareness: t(`${p}.reviewTypes.monthly_awareness`),
          quarterly_strategic: t(`${p}.reviewTypes.quarterly_strategic`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          annual_organizational_assessment: t(`${p}.reviewTypes.annual_organizational_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          strategic_discussion: t(`${p}.sessionTypes.strategic_discussion`),
          organizational_assessment: t(`${p}.sessionTypes.organizational_assessment`),
        },
        metrics: {
          reflectionParticipation: t(`${p}.metrics.reflectionParticipation`),
          reviewDiscipline: t(`${p}.metrics.reviewDiscipline`),
          environmentalScanning: t(`${p}.metrics.environmentalScanning`),
          insightUtilization: t(`${p}.metrics.insightUtilization`),
          leadershipResponsiveness: t(`${p}.metrics.leadershipResponsiveness`),
          strategicObservations: t(`${p}.metrics.strategicObservations`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipAttentiveness: t(`${p}.executiveFields.leadershipAttentiveness`),
          strategicObservation: t(`${p}.executiveFields.strategicObservation`),
          environmentalAwareness: t(`${p}.executiveFields.environmentalAwareness`),
          insightOpportunities: t(`${p}.executiveFields.insightOpportunities`),
        },
      }}
    />
  );
}
