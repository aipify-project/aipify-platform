import { OrganizationalSimplicityCenterPanel } from "@/components/app/organizational-simplicity-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalSimplicityCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalSimplicityCenter";

  return (
    <OrganizationalSimplicityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalFocusLink: t(`${p}.organizationalFocusLink`),
        organizationalEnergyLink: t(`${p}.organizationalEnergyLink`),
        organizationalClarityLink: t(`${p}.organizationalClarityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        frictionTitle: t(`${p}.frictionTitle`),
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
        scheduleWorkshop: t(`${p}.scheduleWorkshop`),
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
        simplicityScore: t(`${p}.simplicityScore`),
        complexityReduction: t(`${p}.complexityReduction`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          operational: t(`${p}.domains.operational`),
          technical: t(`${p}.domains.technical`),
          leadership: t(`${p}.domains.leadership`),
          customer: t(`${p}.domains.customer`),
          organizational: t(`${p}.domains.organizational`),
        },
        signalTypes: {
          unnecessary_complexity: t(`${p}.signalTypes.unnecessary_complexity`),
          duplicate_workflows: t(`${p}.signalTypes.duplicate_workflows`),
          excessive_approval_layers: t(`${p}.signalTypes.excessive_approval_layers`),
          communication_overload: t(`${p}.signalTypes.communication_overload`),
          usability_barriers: t(`${p}.signalTypes.usability_barriers`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        frictionTypes: {
          what_complicates_work: t(`${p}.frictionTypes.what_complicates_work`),
          easier_to_understand: t(`${p}.frictionTypes.easier_to_understand`),
          approvals_little_value: t(`${p}.frictionTypes.approvals_little_value`),
          avoidable_frustration: t(`${p}.frictionTypes.avoidable_frustration`),
          improve_usability: t(`${p}.frictionTypes.improve_usability`),
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
          simplification_recommended: t(`${p}.healthLabels.simplification_recommended`),
        },
        timelineTypes: {
          workflow_improvement: t(`${p}.timelineTypes.workflow_improvement`),
          bureaucracy_reduction: t(`${p}.timelineTypes.bureaucracy_reduction`),
          communication_refinement: t(`${p}.timelineTypes.communication_refinement`),
          system_consolidation: t(`${p}.timelineTypes.system_consolidation`),
          organizational_breakthrough: t(`${p}.timelineTypes.organizational_breakthrough`),
        },
        reviewTypes: {
          quarterly_simplicity: t(`${p}.reviewTypes.quarterly_simplicity`),
          workflow_assessment: t(`${p}.reviewTypes.workflow_assessment`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          annual_evaluation: t(`${p}.reviewTypes.annual_evaluation`),
        },
        sessionTypes: {
          simplification_workshop: t(`${p}.sessionTypes.simplification_workshop`),
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
          workflow_session: t(`${p}.sessionTypes.workflow_session`),
        },
        metrics: {
          complexityReduction: t(`${p}.metrics.complexityReduction`),
          workflowEfficiency: t(`${p}.metrics.workflowEfficiency`),
          processClarity: t(`${p}.metrics.processClarity`),
          navigationSimplicity: t(`${p}.metrics.navigationSimplicity`),
          communicationEffectiveness: t(`${p}.metrics.communicationEffectiveness`),
          bureaucraticBurden: t(`${p}.metrics.bureaucraticBurden`),
          accessibility: t(`${p}.metrics.accessibility`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          complexityReduction: t(`${p}.executiveFields.complexityReduction`),
          workflowEfficiency: t(`${p}.executiveFields.workflowEfficiency`),
          leadershipCommunication: t(`${p}.executiveFields.leadershipCommunication`),
          simplificationOpportunities: t(`${p}.executiveFields.simplificationOpportunities`),
        },
      }}
    />
  );
}
