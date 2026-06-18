import { DeploymentGovernanceCenterPanel } from "@/components/app/deployment-governance-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DeploymentGovernanceCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const p = "customerApp.deploymentGovernanceCenter";

  return (
    <DeploymentGovernanceCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        operationsLink: t(`${p}.operationsLink`),
        databaseGovernanceLink: t(`${p}.databaseGovernanceLink`),
        automationControlLink: t(`${p}.automationControlLink`),
        updatesLink: t(`${p}.updatesLink`),
        executiveLink: t(`${p}.executiveLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        deploymentsTitle: t(`${p}.deploymentsTitle`),
        checklistTitle: t(`${p}.checklistTitle`),
        postValidationTitle: t(`${p}.postValidationTitle`),
        rollbackTitle: t(`${p}.rollbackTitle`),
        approvalsTitle: t(`${p}.approvalsTitle`),
        releaseNotesTitle: t(`${p}.releaseNotesTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        healthScore: t(`${p}.healthScore`),
        productionVersion: t(`${p}.productionVersion`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        approve: t(`${p}.approve`),
        advance: t(`${p}.advance`),
        passCheck: t(`${p}.passCheck`),
        validate: t(`${p}.validate`),
        completeReview: t(`${p}.completeReview`),
        generateReport: t(`${p}.generateReport`),
        rollbackReview: t(`${p}.rollbackReview`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        deploymentTypes: {
          development: t(`${p}.deploymentTypes.development`),
          staging: t(`${p}.deploymentTypes.staging`),
          production: t(`${p}.deploymentTypes.production`),
          hotfix: t(`${p}.deploymentTypes.hotfix`),
        },
        deploymentStatuses: {
          pending: t(`${p}.deploymentStatuses.pending`),
          validating: t(`${p}.deploymentStatuses.validating`),
          staging: t(`${p}.deploymentStatuses.staging`),
          awaiting_approval: t(`${p}.deploymentStatuses.awaiting_approval`),
          deploying: t(`${p}.deploymentStatuses.deploying`),
          deployed: t(`${p}.deploymentStatuses.deployed`),
          failed: t(`${p}.deploymentStatuses.failed`),
          rolled_back: t(`${p}.deploymentStatuses.rolled_back`),
          archived: t(`${p}.deploymentStatuses.archived`),
        },
        pipelineStages: {
          development_complete: t(`${p}.pipelineStages.development_complete`),
          automated_validation: t(`${p}.pipelineStages.automated_validation`),
          migration_verification: t(`${p}.pipelineStages.migration_verification`),
          staging_deployment: t(`${p}.pipelineStages.staging_deployment`),
          qa_approval: t(`${p}.pipelineStages.qa_approval`),
          production_approval: t(`${p}.pipelineStages.production_approval`),
          production_deployment: t(`${p}.pipelineStages.production_deployment`),
          post_validation: t(`${p}.pipelineStages.post_validation`),
          archived: t(`${p}.pipelineStages.archived`),
        },
        healthBands: {
          excellent: t(`${p}.healthBands.excellent`),
          healthy: t(`${p}.healthBands.healthy`),
          needs_attention: t(`${p}.healthBands.needs_attention`),
          critical: t(`${p}.healthBands.critical`),
        },
        approvalLevels: {
          "1": t(`${p}.approvalLevels.level1`),
          "2": t(`${p}.approvalLevels.level2`),
          "3": t(`${p}.approvalLevels.level3`),
          "4": t(`${p}.approvalLevels.level4`),
        },
        metrics: {
          pending: t(`${p}.metrics.pending`),
          failed: t(`${p}.metrics.failed`),
          releases: t(`${p}.metrics.releases`),
          rollbackReady: t(`${p}.metrics.rollbackReady`),
          successRate: t(`${p}.metrics.successRate`),
          validationRate: t(`${p}.metrics.validationRate`),
          mttr: t(`${p}.metrics.mttr`),
          confidence: t(`${p}.metrics.confidence`),
        },
      }}
    />
  );
}
