import { OrganizationalCompoundingCenterPanel } from "@/components/app/organizational-compounding-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalCompoundingCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalCompoundingCenter";

  return (
    <OrganizationalCompoundingCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalTransformationLink: t(`${p}.organizationalTransformationLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        leverageTitle: t(`${p}.leverageTitle`),
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
        compoundingScore: t(`${p}.compoundingScore`),
        positiveMomentum: t(`${p}.positiveMomentum`),
        domains: {
          learning: t(`${p}.domains.learning`),
          trust: t(`${p}.domains.trust`),
          execution: t(`${p}.domains.execution`),
          leadership: t(`${p}.domains.leadership`),
          customer: t(`${p}.domains.customer`),
          organizational: t(`${p}.domains.organizational`),
        },
        signalTypes: {
          repeated_positive_behavior: t(`${p}.signalTypes.repeated_positive_behavior`),
          improvement_trajectory: t(`${p}.signalTypes.improvement_trajectory`),
          sustainable_progress: t(`${p}.signalTypes.sustainable_progress`),
          high_leverage_activity: t(`${p}.signalTypes.high_leverage_activity`),
          long_term_value: t(`${p}.signalTypes.long_term_value`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        leverageTypes: {
          disproportionate_value: t(`${p}.leverageTypes.disproportionate_value`),
          resilience_habit: t(`${p}.leverageTypes.resilience_habit`),
          continuing_benefit: t(`${p}.leverageTypes.continuing_benefit`),
          relationship_investment: t(`${p}.leverageTypes.relationship_investment`),
          practice_reinforcement: t(`${p}.leverageTypes.practice_reinforcement`),
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
          interrupted: t(`${p}.healthLabels.interrupted`),
        },
        timelineTypes: {
          improvement_milestone: t(`${p}.timelineTypes.improvement_milestone`),
          trust_development: t(`${p}.timelineTypes.trust_development`),
          learning_integration: t(`${p}.timelineTypes.learning_integration`),
          capability_breakthrough: t(`${p}.timelineTypes.capability_breakthrough`),
          strategic_achievement: t(`${p}.timelineTypes.strategic_achievement`),
        },
        reviewTypes: {
          quarterly_compounding: t(`${p}.reviewTypes.quarterly_compounding`),
          annual_reflection: t(`${p}.reviewTypes.annual_reflection`),
          leadership_discussion: t(`${p}.reviewTypes.leadership_discussion`),
          long_term_planning: t(`${p}.reviewTypes.long_term_planning`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          leadership_review: t(`${p}.sessionTypes.leadership_review`),
          planning_workshop: t(`${p}.sessionTypes.planning_workshop`),
        },
        metrics: {
          consistency: t(`${p}.metrics.consistency`),
          learning: t(`${p}.metrics.learning`),
          leadership: t(`${p}.metrics.leadership`),
          relationships: t(`${p}.metrics.relationships`),
          sustainability: t(`${p}.metrics.sustainability`),
          improvement: t(`${p}.metrics.improvement`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          value: t(`${p}.executiveFields.value`),
          consistency: t(`${p}.executiveFields.consistency`),
          growth: t(`${p}.executiveFields.growth`),
          patience: t(`${p}.executiveFields.patience`),
        },
      }}
    />
  );
}
