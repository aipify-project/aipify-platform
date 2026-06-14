import { OrganizationalConfidenceCenterPanel } from "@/components/app/organizational-confidence-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalConfidenceCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalConfidenceCenter";

  return (
    <OrganizationalConfidenceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalTrustLink: t(`${p}.organizationalTrustLink`),
        organizationalResilienceLink: t(`${p}.organizationalResilienceLink`),
        organizationalDecisionQualityLink: t(`${p}.organizationalDecisionQualityLink`),
        organizationalMomentumLink: t(`${p}.organizationalMomentumLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        factorsTitle: t(`${p}.factorsTitle`),
        uncertaintyTitle: t(`${p}.uncertaintyTitle`),
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
        confidenceScore: t(`${p}.confidenceScore`),
        confidenceTrend: t(`${p}.confidenceTrend`),
        domains: {
          leadership: t(`${p}.domains.leadership`),
          workforce: t(`${p}.domains.workforce`),
          operational: t(`${p}.domains.operational`),
          customer: t(`${p}.domains.customer`),
          strategic: t(`${p}.domains.strategic`),
        },
        factorTypes: {
          increased_confidence: t(`${p}.factorTypes.increased_confidence`),
          reduced_uncertainty: t(`${p}.factorTypes.reduced_uncertainty`),
          improved_resilience: t(`${p}.factorTypes.improved_resilience`),
          stronger_collaboration: t(`${p}.factorTypes.stronger_collaboration`),
          greater_preparedness: t(`${p}.factorTypes.greater_preparedness`),
        },
        factorTones: {
          positive: t(`${p}.factorTones.positive`),
          neutral: t(`${p}.factorTones.neutral`),
          attention: t(`${p}.factorTones.attention`),
        },
        uncertaintyTypes: {
          known_challenge: t(`${p}.uncertaintyTypes.known_challenge`),
          emerging_risk: t(`${p}.uncertaintyTypes.emerging_risk`),
          development_area: t(`${p}.uncertaintyTypes.development_area`),
          assumption_validation: t(`${p}.uncertaintyTypes.assumption_validation`),
          capacity_limitation: t(`${p}.uncertaintyTypes.capacity_limitation`),
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
          fragile: t(`${p}.healthLabels.fragile`),
        },
        timelineTypes: {
          major_achievement: t(`${p}.timelineTypes.major_achievement`),
          recovery_milestone: t(`${p}.timelineTypes.recovery_milestone`),
          capability_improvement: t(`${p}.timelineTypes.capability_improvement`),
          strategic_breakthrough: t(`${p}.timelineTypes.strategic_breakthrough`),
          learning_development: t(`${p}.timelineTypes.learning_development`),
        },
        reviewTypes: {
          quarterly_confidence: t(`${p}.reviewTypes.quarterly_confidence`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          workforce_preparedness: t(`${p}.reviewTypes.workforce_preparedness`),
          annual_assessment: t(`${p}.reviewTypes.annual_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          preparedness_review: t(`${p}.sessionTypes.preparedness_review`),
          workforce_discussion: t(`${p}.sessionTypes.workforce_discussion`),
        },
        metrics: {
          preparedness: t(`${p}.metrics.preparedness`),
          capability: t(`${p}.metrics.capability`),
          leadership: t(`${p}.metrics.leadership`),
          learning: t(`${p}.metrics.learning`),
          recovery: t(`${p}.metrics.recovery`),
          initiatives: t(`${p}.metrics.initiatives`),
          indicators: t(`${p}.metrics.indicators`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          leadership: t(`${p}.executiveFields.leadership`),
          preparedness: t(`${p}.executiveFields.preparedness`),
          resilience: t(`${p}.executiveFields.resilience`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
