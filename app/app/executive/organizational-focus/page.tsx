import { OrganizationalFocusCenterPanel } from "@/components/app/organizational-focus-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalFocusCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalFocusCenter";

  return (
    <OrganizationalFocusCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalEnergyLink: t(`${p}.organizationalEnergyLink`),
        organizationalClarityLink: t(`${p}.organizationalClarityLink`),
        organizationalSimplicityLink: t(`${p}.organizationalSimplicityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        priorityTitle: t(`${p}.priorityTitle`),
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
        focusScore: t(`${p}.focusScore`),
        priorityAlignment: t(`${p}.priorityAlignment`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          leadership: t(`${p}.domains.leadership`),
          team: t(`${p}.domains.team`),
          customer: t(`${p}.domains.customer`),
          operational: t(`${p}.domains.operational`),
          organizational: t(`${p}.domains.organizational`),
        },
        signalTypes: {
          competing_priorities: t(`${p}.signalTypes.competing_priorities`),
          attention_fragmentation: t(`${p}.signalTypes.attention_fragmentation`),
          initiative_overload: t(`${p}.signalTypes.initiative_overload`),
          concentration_opportunities: t(`${p}.signalTypes.concentration_opportunities`),
          execution_distractions: t(`${p}.signalTypes.execution_distractions`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        priorityTypes: {
          what_matters_most: t(`${p}.priorityTypes.what_matters_most`),
          initiatives_deserve_attention: t(`${p}.priorityTypes.initiatives_deserve_attention`),
          what_to_stop: t(`${p}.priorityTypes.what_to_stop`),
          attention_diluted: t(`${p}.priorityTypes.attention_diluted`),
          simplify_execution: t(`${p}.priorityTypes.simplify_execution`),
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
          focus_reinforcement_recommended: t(`${p}.healthLabels.focus_reinforcement_recommended`),
        },
        timelineTypes: {
          strategic_priorities_established: t(`${p}.timelineTypes.strategic_priorities_established`),
          initiative_consolidation: t(`${p}.timelineTypes.initiative_consolidation`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          execution_breakthrough: t(`${p}.timelineTypes.execution_breakthrough`),
          organizational_simplification: t(`${p}.timelineTypes.organizational_simplification`),
        },
        reviewTypes: {
          monthly_focus: t(`${p}.reviewTypes.monthly_focus`),
          quarterly_prioritization: t(`${p}.reviewTypes.quarterly_prioritization`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          annual_strategic_assessment: t(`${p}.reviewTypes.annual_strategic_assessment`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          prioritization_session: t(`${p}.sessionTypes.prioritization_session`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
        },
        metrics: {
          priorityAlignment: t(`${p}.metrics.priorityAlignment`),
          initiativeConcentration: t(`${p}.metrics.initiativeConcentration`),
          executionClarity: t(`${p}.metrics.executionClarity`),
          priorityClarity: t(`${p}.metrics.priorityClarity`),
          initiativeOverloadRisk: t(`${p}.metrics.initiativeOverloadRisk`),
          leadershipConsistency: t(`${p}.metrics.leadershipConsistency`),
          resourceConcentration: t(`${p}.metrics.resourceConcentration`),
          strategicDiscipline: t(`${p}.metrics.strategicDiscipline`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          priorityAlignment: t(`${p}.executiveFields.priorityAlignment`),
          strategicConcentration: t(`${p}.executiveFields.strategicConcentration`),
          leadershipReinforcement: t(`${p}.executiveFields.leadershipReinforcement`),
          focusOpportunities: t(`${p}.executiveFields.focusOpportunities`),
        },
      }}
    />
  );
}
