import { OrganizationalSteadfastnessCenterPanel } from "@/components/app/organizational-steadfastness-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalSteadfastnessCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalSteadfastnessCenter";

  return (
    <OrganizationalSteadfastnessCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalCompoundingLink: t(`${p}.organizationalCompoundingLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        persistenceTitle: t(`${p}.persistenceTitle`),
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
        steadfastnessScore: t(`${p}.steadfastnessScore`),
        resilienceIndicators: t(`${p}.resilienceIndicators`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          leadership: t(`${p}.domains.leadership`),
          workforce: t(`${p}.domains.workforce`),
          customer: t(`${p}.domains.customer`),
          operational: t(`${p}.domains.operational`),
          cultural: t(`${p}.domains.cultural`),
        },
        signalTypes: {
          consistent_pressure_behavior: t(`${p}.signalTypes.consistent_pressure_behavior`),
          positive_recovery: t(`${p}.signalTypes.positive_recovery`),
          leadership_reliability: t(`${p}.signalTypes.leadership_reliability`),
          cultural_resilience: t(`${p}.signalTypes.cultural_resilience`),
          commitment_fulfillment: t(`${p}.signalTypes.commitment_fulfillment`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        persistenceTypes: {
          essential_commitment: t(`${p}.persistenceTypes.essential_commitment`),
          adaptation_point: t(`${p}.persistenceTypes.adaptation_point`),
          unchanged_values: t(`${p}.persistenceTypes.unchanged_values`),
          renewed_priority: t(`${p}.persistenceTypes.renewed_priority`),
          responsible_resilience: t(`${p}.persistenceTypes.responsible_resilience`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          stable: t(`${p}.healthLabels.stable`),
          developing: t(`${p}.healthLabels.developing`),
          support_recommended: t(`${p}.healthLabels.support_recommended`),
        },
        timelineTypes: {
          recovery_milestone: t(`${p}.timelineTypes.recovery_milestone`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          cultural_reaffirmation: t(`${p}.timelineTypes.cultural_reaffirmation`),
          strategic_perseverance: t(`${p}.timelineTypes.strategic_perseverance`),
          customer_trust_achievement: t(`${p}.timelineTypes.customer_trust_achievement`),
        },
        reviewTypes: {
          quarterly_resilience: t(`${p}.reviewTypes.quarterly_resilience`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          strategic_commitment: t(`${p}.reviewTypes.strategic_commitment`),
          annual_stewardship: t(`${p}.reviewTypes.annual_stewardship`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
          stewardship_assessment: t(`${p}.sessionTypes.stewardship_assessment`),
        },
        metrics: {
          values: t(`${p}.metrics.values`),
          leadershipReliability: t(`${p}.metrics.leadershipReliability`),
          recovery: t(`${p}.metrics.recovery`),
          strategic: t(`${p}.metrics.strategic`),
          resilience: t(`${p}.metrics.resilience`),
          commitment: t(`${p}.metrics.commitment`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          leadershipConsistency: t(`${p}.executiveFields.leadershipConsistency`),
          strategicResilience: t(`${p}.executiveFields.strategicResilience`),
          valuesContinuity: t(`${p}.executiveFields.valuesContinuity`),
          confidence: t(`${p}.executiveFields.confidence`),
        },
      }}
    />
  );
}
