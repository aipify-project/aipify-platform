import { OrganizationalSignalCenterPanel } from "@/components/app/organizational-signal-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalSignalCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalSignalCenter";

  return (
    <OrganizationalSignalCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalFocusLink: t(`${p}.organizationalFocusLink`),
        organizationalSimplicityLink: t(`${p}.organizationalSimplicityLink`),
        organizationalClarityLink: t(`${p}.organizationalClarityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        interpretationTitle: t(`${p}.interpretationTitle`),
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
        archiveMilestoneDefaultTitle: t(`${p}.archiveMilestoneDefaultTitle`),
        archiveMilestoneDefaultSummary: t(`${p}.archiveMilestoneDefaultSummary`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        signalScore: t(`${p}.signalScore`),
        emergingThemes: t(`${p}.emergingThemes`),
        domains: {
          customer: t(`${p}.domains.customer`),
          workforce: t(`${p}.domains.workforce`),
          leadership: t(`${p}.domains.leadership`),
          strategic: t(`${p}.domains.strategic`),
          operational: t(`${p}.domains.operational`),
          external: t(`${p}.domains.external`),
        },
        signalTypes: {
          weak_signals: t(`${p}.signalTypes.weak_signals`),
          emerging_trends: t(`${p}.signalTypes.emerging_trends`),
          repeating_patterns: t(`${p}.signalTypes.repeating_patterns`),
          discussion_areas: t(`${p}.signalTypes.discussion_areas`),
          proactive_opportunities: t(`${p}.signalTypes.proactive_opportunities`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        interpretationTypes: {
          what_patterns_emerging: t(`${p}.interpretationTypes.what_patterns_emerging`),
          observations_deserve_attention: t(`${p}.interpretationTypes.observations_deserve_attention`),
          additional_context_needed: t(`${p}.interpretationTypes.additional_context_needed`),
          signals_as_opportunities: t(`${p}.interpretationTypes.signals_as_opportunities`),
          responding_proportionately: t(`${p}.interpretationTypes.responding_proportionately`),
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
          signal_awareness_recommended: t(`${p}.healthLabels.signal_awareness_recommended`),
        },
        timelineTypes: {
          emerging_trend: t(`${p}.timelineTypes.emerging_trend`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          strategic_observation: t(`${p}.timelineTypes.strategic_observation`),
          organizational_response: t(`${p}.timelineTypes.organizational_response`),
          learning_development: t(`${p}.timelineTypes.learning_development`),
        },
        reviewTypes: {
          monthly_signal: t(`${p}.reviewTypes.monthly_signal`),
          quarterly_strategic: t(`${p}.reviewTypes.quarterly_strategic`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          annual_assessment: t(`${p}.reviewTypes.annual_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          strategic_discussion: t(`${p}.sessionTypes.strategic_discussion`),
          leadership_session: t(`${p}.sessionTypes.leadership_session`),
        },
        metrics: {
          significantTrends: t(`${p}.metrics.significantTrends`),
          executiveAttention: t(`${p}.metrics.executiveAttention`),
          observationEffectiveness: t(`${p}.metrics.observationEffectiveness`),
          reflectionParticipation: t(`${p}.metrics.reflectionParticipation`),
          responseReadiness: t(`${p}.metrics.responseReadiness`),
          patternAwareness: t(`${p}.metrics.patternAwareness`),
          learningIntegration: t(`${p}.metrics.learningIntegration`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          emergingThemes: t(`${p}.executiveFields.emergingThemes`),
          strategicObservation: t(`${p}.executiveFields.strategicObservation`),
          responseReadiness: t(`${p}.executiveFields.responseReadiness`),
          opportunityAwareness: t(`${p}.executiveFields.opportunityAwareness`),
        },
      }}
    />
  );
}
