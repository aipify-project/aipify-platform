import { ChangeManagementCenterPanel } from "@/components/app/change-management-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ChangeManagementCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.changeManagementCenter";

  return (
    <ChangeManagementCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalHealthLink: t(`${p}.organizationalHealthLink`),
        continuousImprovementLink: t(`${p}.continuousImprovementLink`),
        organizationalResilienceLink: t(`${p}.organizationalResilienceLink`),
        decisionSupportLink: t(`${p}.decisionSupportLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        stakeholdersTitle: t(`${p}.stakeholdersTitle`),
        communicationsTitle: t(`${p}.communicationsTitle`),
        trainingTitle: t(`${p}.trainingTitle`),
        adoptionTitle: t(`${p}.adoptionTitle`),
        feedbackTitle: t(`${p}.feedbackTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        advanceWorkflow: t(`${p}.advanceWorkflow`),
        sendCommunication: t(`${p}.sendCommunication`),
        completeTraining: t(`${p}.completeTraining`),
        reviewFeedback: t(`${p}.reviewFeedback`),
        completeReview: t(`${p}.completeReview`),
        generatePlan: t(`${p}.generatePlan`),
        generateReport: t(`${p}.generateReport`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        readinessBands: {
          ready: t(`${p}.readinessBands.ready`),
          mostly_ready: t(`${p}.readinessBands.mostly_ready`),
          attention_needed: t(`${p}.readinessBands.attention_needed`),
          not_ready: t(`${p}.readinessBands.not_ready`),
        },
        changeCategories: {
          technology: t(`${p}.changeCategories.technology`),
          process: t(`${p}.changeCategories.process`),
          organizational: t(`${p}.changeCategories.organizational`),
          cultural: t(`${p}.changeCategories.cultural`),
          strategic: t(`${p}.changeCategories.strategic`),
        },
        workflowStages: {
          identified: t(`${p}.workflowStages.identified`),
          business_case: t(`${p}.workflowStages.business_case`),
          stakeholders_mapped: t(`${p}.workflowStages.stakeholders_mapped`),
          communication_planned: t(`${p}.workflowStages.communication_planned`),
          training_coordinated: t(`${p}.workflowStages.training_coordinated`),
          implementation_executed: t(`${p}.workflowStages.implementation_executed`),
          adoption_measured: t(`${p}.workflowStages.adoption_measured`),
          lessons_captured: t(`${p}.workflowStages.lessons_captured`),
        },
        stakeholderRoles: {
          sponsor: t(`${p}.stakeholderRoles.sponsor`),
          leader: t(`${p}.stakeholderRoles.leader`),
          champion: t(`${p}.stakeholderRoles.champion`),
          impacted_employee: t(`${p}.stakeholderRoles.impacted_employee`),
          external: t(`${p}.stakeholderRoles.external`),
        },
        communicationAudiences: {
          executive: t(`${p}.communicationAudiences.executive`),
          team: t(`${p}.communicationAudiences.team`),
          faq: t(`${p}.communicationAudiences.faq`),
          progress: t(`${p}.communicationAudiences.progress`),
          reinforcement: t(`${p}.communicationAudiences.reinforcement`),
        },
        feedbackTypes: {
          concern: t(`${p}.feedbackTypes.concern`),
          suggestion: t(`${p}.feedbackTypes.suggestion`),
          barrier: t(`${p}.feedbackTypes.barrier`),
          positive: t(`${p}.feedbackTypes.positive`),
          lesson: t(`${p}.feedbackTypes.lesson`),
        },
        metrics: {
          active: t(`${p}.metrics.active`),
          adoption: t(`${p}.metrics.adoption`),
          readiness: t(`${p}.metrics.readiness`),
          training: t(`${p}.metrics.training`),
          communications: t(`${p}.metrics.communications`),
          engagement: t(`${p}.metrics.engagement`),
          confidence: t(`${p}.metrics.confidence`),
          success: t(`${p}.metrics.success`),
        },
        executiveFields: {
          adoption: t(`${p}.executiveFields.adoption`),
          sentiment: t(`${p}.executiveFields.sentiment`),
          actions: t(`${p}.executiveFields.actions`),
        },
      }}
    />
  );
}
