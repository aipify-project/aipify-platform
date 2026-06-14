import { OrganizationalPurposefulExecutionCenterPanel } from "@/components/app/organizational-purposeful-execution-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalPurposefulExecutionCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalPurposefulExecutionCenter";

  return (
    <OrganizationalPurposefulExecutionCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalIdentityLink: t(`${p}.organizationalIdentityLink`),
        organizationalStewardshipLink: t(`${p}.organizationalStewardshipLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        alignmentTitle: t(`${p}.alignmentTitle`),
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
        executionScore: t(`${p}.executionScore`),
        strategicDelivery: t(`${p}.strategicDelivery`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          leadership: t(`${p}.domains.leadership`),
          team: t(`${p}.domains.team`),
          customer: t(`${p}.domains.customer`),
          operational: t(`${p}.domains.operational`),
          cultural: t(`${p}.domains.cultural`),
        },
        signalTypes: {
          strong_execution_practices: t(`${p}.signalTypes.strong_execution_practices`),
          delivery_bottlenecks: t(`${p}.signalTypes.delivery_bottlenecks`),
          accountability_strengths: t(`${p}.signalTypes.accountability_strengths`),
          alignment_opportunities: t(`${p}.signalTypes.alignment_opportunities`),
          sustainable_improvement_areas: t(`${p}.signalTypes.sustainable_improvement_areas`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        alignmentTypes: {
          executing_right_priorities: t(`${p}.alignmentTypes.executing_right_priorities`),
          teams_understand_why: t(`${p}.alignmentTypes.teams_understand_why`),
          responsibilities_defined: t(`${p}.alignmentTypes.responsibilities_defined`),
          delivering_sustainably: t(`${p}.alignmentTypes.delivering_sustainably`),
          execution_barriers: t(`${p}.alignmentTypes.execution_barriers`),
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
          execution_reinforcement_recommended: t(`${p}.healthLabels.execution_reinforcement_recommended`),
        },
        timelineTypes: {
          initiative_milestone: t(`${p}.timelineTypes.initiative_milestone`),
          delivery_achievement: t(`${p}.timelineTypes.delivery_achievement`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          accountability_improvement: t(`${p}.timelineTypes.accountability_improvement`),
          organizational_breakthrough: t(`${p}.timelineTypes.organizational_breakthrough`),
        },
        reviewTypes: {
          monthly_execution: t(`${p}.reviewTypes.monthly_execution`),
          quarterly_strategic: t(`${p}.reviewTypes.quarterly_strategic`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          annual_delivery: t(`${p}.reviewTypes.annual_delivery`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          stewardship_session: t(`${p}.sessionTypes.stewardship_session`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          initiativeProgression: t(`${p}.metrics.initiativeProgression`),
          strategicDelivery: t(`${p}.metrics.strategicDelivery`),
          accountabilityEffectiveness: t(`${p}.metrics.accountabilityEffectiveness`),
          sustainablePacing: t(`${p}.metrics.sustainablePacing`),
          deliveryConsistency: t(`${p}.metrics.deliveryConsistency`),
          strategicAlignment: t(`${p}.metrics.strategicAlignment`),
          leadershipParticipation: t(`${p}.metrics.leadershipParticipation`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          strategicDelivery: t(`${p}.executiveFields.strategicDelivery`),
          leadershipAccountability: t(`${p}.executiveFields.leadershipAccountability`),
          initiativeMomentum: t(`${p}.executiveFields.initiativeMomentum`),
          executionImprovementOpportunities: t(`${p}.executiveFields.executionImprovementOpportunities`),
        },
      }}
    />
  );
}
