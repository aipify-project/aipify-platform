import { OrganizationalIntentionalityCenterPanel } from "@/components/app/organizational-intentionality-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalIntentionalityCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalIntentionalityCenter";

  return (
    <OrganizationalIntentionalityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalClarityLink: t(`${p}.organizationalClarityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        purposeTitle: t(`${p}.purposeTitle`),
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
        intentionalityScore: t(`${p}.intentionalityScore`),
        priorityAlignment: t(`${p}.priorityAlignment`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          leadership: t(`${p}.domains.leadership`),
          operational: t(`${p}.domains.operational`),
          customer: t(`${p}.domains.customer`),
          cultural: t(`${p}.domains.cultural`),
          innovation: t(`${p}.domains.innovation`),
        },
        signalTypes: {
          misaligned_initiative: t(`${p}.signalTypes.misaligned_initiative`),
          reactive_decision: t(`${p}.signalTypes.reactive_decision`),
          resource_fragmentation: t(`${p}.signalTypes.resource_fragmentation`),
          opportunity_dilution: t(`${p}.signalTypes.opportunity_dilution`),
          priority_inconsistency: t(`${p}.signalTypes.priority_inconsistency`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        purposeTypes: {
          why_initiative: t(`${p}.purposeTypes.why_initiative`),
          mission_alignment: t(`${p}.purposeTypes.mission_alignment`),
          investment_priority: t(`${p}.purposeTypes.investment_priority`),
          trade_off_acceptance: t(`${p}.purposeTypes.trade_off_acceptance`),
          intentional_vs_reactive: t(`${p}.purposeTypes.intentional_vs_reactive`),
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
          reactive: t(`${p}.healthLabels.reactive`),
        },
        timelineTypes: {
          strategic_decision: t(`${p}.timelineTypes.strategic_decision`),
          reflection_milestone: t(`${p}.timelineTypes.reflection_milestone`),
          priority_shift: t(`${p}.timelineTypes.priority_shift`),
          resource_allocation_change: t(`${p}.timelineTypes.resource_allocation_change`),
          leadership_initiative: t(`${p}.timelineTypes.leadership_initiative`),
        },
        reviewTypes: {
          quarterly_intentionality: t(`${p}.reviewTypes.quarterly_intentionality`),
          annual_strategic_reflection: t(`${p}.reviewTypes.annual_strategic_reflection`),
          leadership_stewardship: t(`${p}.reviewTypes.leadership_stewardship`),
          resource_allocation_assessment: t(`${p}.reviewTypes.resource_allocation_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
          stewardship_assessment: t(`${p}.sessionTypes.stewardship_assessment`),
        },
        metrics: {
          strategicConsistency: t(`${p}.metrics.strategicConsistency`),
          valuesAlignment: t(`${p}.metrics.valuesAlignment`),
          leadershipReflection: t(`${p}.metrics.leadershipReflection`),
          resourceAllocation: t(`${p}.metrics.resourceAllocation`),
          purposeIntegration: t(`${p}.metrics.purposeIntegration`),
          strategicDiscipline: t(`${p}.metrics.strategicDiscipline`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          strategicDiscipline: t(`${p}.executiveFields.strategicDiscipline`),
          purposeAlignment: t(`${p}.executiveFields.purposeAlignment`),
          leadershipReflection: t(`${p}.executiveFields.leadershipReflection`),
          opportunityPrioritization: t(`${p}.executiveFields.opportunityPrioritization`),
        },
      }}
    />
  );
}
