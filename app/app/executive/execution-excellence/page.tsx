import { ExecutionExcellenceCenterPanel } from "@/components/app/execution-excellence-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutionExcellenceCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.executionExcellenceCenter";

  return (
    <ExecutionExcellenceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        capabilityMaturityLink: t(`${p}.capabilityMaturityLink`),
        changeManagementLink: t(`${p}.changeManagementLink`),
        organizationalHealthLink: t(`${p}.organizationalHealthLink`),
        continuousImprovementLink: t(`${p}.continuousImprovementLink`),
        goalsLink: t(`${p}.goalsLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        dependenciesTitle: t(`${p}.dependenciesTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        risksTitle: t(`${p}.risksTitle`),
        workflowTitle: t(`${p}.workflowTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        achieveMilestone: t(`${p}.achieveMilestone`),
        generateSummary: t(`${p}.generateSummary`),
        generateReport: t(`${p}.generateReport`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        owner: t(`${p}.owner`),
        sponsor: t(`${p}.sponsor`),
        progress: t(`${p}.progress`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          operational: t(`${p}.domains.operational`),
          customer: t(`${p}.domains.customer`),
          workforce: t(`${p}.domains.workforce`),
          governance: t(`${p}.domains.governance`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          stable: t(`${p}.healthLabels.stable`),
          needs_attention: t(`${p}.healthLabels.needs_attention`),
          critical: t(`${p}.healthLabels.critical`),
        },
        riskStatuses: {
          on_track: t(`${p}.riskStatuses.on_track`),
          stable: t(`${p}.riskStatuses.stable`),
          at_risk: t(`${p}.riskStatuses.at_risk`),
          stalled: t(`${p}.riskStatuses.stalled`),
          critical: t(`${p}.riskStatuses.critical`),
        },
        workflowStages: {
          objective_defined: t(`${p}.workflowStages.objective_defined`),
          ownership_assigned: t(`${p}.workflowStages.ownership_assigned`),
          dependencies_identified: t(`${p}.workflowStages.dependencies_identified`),
          progress_monitored: t(`${p}.workflowStages.progress_monitored`),
          risks_managed: t(`${p}.workflowStages.risks_managed`),
          milestones_achieved: t(`${p}.workflowStages.milestones_achieved`),
          outcomes_evaluated: t(`${p}.workflowStages.outcomes_evaluated`),
          lessons_captured: t(`${p}.workflowStages.lessons_captured`),
        },
        dependencyTypes: {
          cross_functional: t(`${p}.dependencyTypes.cross_functional`),
          resource: t(`${p}.dependencyTypes.resource`),
          approval: t(`${p}.dependencyTypes.approval`),
          external: t(`${p}.dependencyTypes.external`),
        },
        milestoneStatuses: {
          planned: t(`${p}.milestoneStatuses.planned`),
          achieved: t(`${p}.milestoneStatuses.achieved`),
          delayed: t(`${p}.milestoneStatuses.delayed`),
          escalated: t(`${p}.milestoneStatuses.escalated`),
        },
        riskTypes: {
          stalled_initiative: t(`${p}.riskTypes.stalled_initiative`),
          dependency_overload: t(`${p}.riskTypes.dependency_overload`),
          review_avoidance: t(`${p}.riskTypes.review_avoidance`),
          resource_shortage: t(`${p}.riskTypes.resource_shortage`),
          escalation_pattern: t(`${p}.riskTypes.escalation_pattern`),
        },
        reviewTypes: {
          weekly: t(`${p}.reviewTypes.weekly`),
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
        },
        metrics: {
          inProgress: t(`${p}.metrics.inProgress`),
          atRisk: t(`${p}.metrics.atRisk`),
          momentum: t(`${p}.metrics.momentum`),
          milestones: t(`${p}.metrics.milestones`),
          dependencies: t(`${p}.metrics.dependencies`),
          completion: t(`${p}.metrics.completion`),
          reviews: t(`${p}.metrics.reviews`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          capacity: t(`${p}.executiveFields.capacity`),
          progress: t(`${p}.executiveFields.progress`),
          confidence: t(`${p}.executiveFields.confidence`),
          focus: t(`${p}.executiveFields.focus`),
        },
      }}
    />
  );
}
