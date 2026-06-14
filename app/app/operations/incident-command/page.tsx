import { IncidentCommandCenterPanel } from "@/components/app/incident-command-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IncidentCommandCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.incidentCommandCenter";

  return (
    <IncidentCommandCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        operationsLink: t(`${p}.operationsLink`),
        observabilityLink: t(`${p}.observabilityLink`),
        deploymentsLink: t(`${p}.deploymentsLink`),
        automationControlLink: t(`${p}.automationControlLink`),
        executiveLink: t(`${p}.executiveLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        incidentsTitle: t(`${p}.incidentsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        communicationsTitle: t(`${p}.communicationsTitle`),
        recoveryTitle: t(`${p}.recoveryTitle`),
        selfHealingTitle: t(`${p}.selfHealingTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        postReviewsTitle: t(`${p}.postReviewsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        advanceStatus: t(`${p}.advanceStatus`),
        completeAction: t(`${p}.completeAction`),
        sendCommunication: t(`${p}.sendCommunication`),
        completeReview: t(`${p}.completeReview`),
        closeIncident: t(`${p}.closeIncident`),
        generateReport: t(`${p}.generateReport`),
        generateSummary: t(`${p}.generateSummary`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        severityLevels: {
          sev1: t(`${p}.severityLevels.sev1`),
          sev2: t(`${p}.severityLevels.sev2`),
          sev3: t(`${p}.severityLevels.sev3`),
          sev4: t(`${p}.severityLevels.sev4`),
          sev5: t(`${p}.severityLevels.sev5`),
        },
        incidentCategories: {
          technical: t(`${p}.incidentCategories.technical`),
          customer: t(`${p}.incidentCategories.customer`),
          security: t(`${p}.incidentCategories.security`),
          operational: t(`${p}.incidentCategories.operational`),
          executive: t(`${p}.incidentCategories.executive`),
        },
        incidentStatuses: {
          investigating: t(`${p}.incidentStatuses.investigating`),
          identified: t(`${p}.incidentStatuses.identified`),
          mitigating: t(`${p}.incidentStatuses.mitigating`),
          monitoring: t(`${p}.incidentStatuses.monitoring`),
          resolved: t(`${p}.incidentStatuses.resolved`),
          closed: t(`${p}.incidentStatuses.closed`),
        },
        communicationAudiences: {
          internal: t(`${p}.communicationAudiences.internal`),
          executive: t(`${p}.communicationAudiences.executive`),
          customer: t(`${p}.communicationAudiences.customer`),
          team: t(`${p}.communicationAudiences.team`),
        },
        healingOutcomes: {
          success: t(`${p}.healingOutcomes.success`),
          failed: t(`${p}.healingOutcomes.failed`),
          escalated: t(`${p}.healingOutcomes.escalated`),
        },
        metrics: {
          active: t(`${p}.metrics.active`),
          major: t(`${p}.metrics.major`),
          mttr: t(`${p}.metrics.mttr`),
          recoveryProgress: t(`${p}.metrics.recoveryProgress`),
          selfHealing: t(`${p}.metrics.selfHealing`),
          detection: t(`${p}.metrics.detection`),
          acknowledgment: t(`${p}.metrics.acknowledgment`),
          resilience: t(`${p}.metrics.resilience`),
        },
        executiveFields: {
          major: t(`${p}.executiveFields.major`),
          impact: t(`${p}.executiveFields.impact`),
          confidence: t(`${p}.executiveFields.confidence`),
          strategy: t(`${p}.executiveFields.strategy`),
        },
        reviewFields: {
          what: t(`${p}.reviewFields.what`),
          causes: t(`${p}.reviewFields.causes`),
          recovery: t(`${p}.reviewFields.recovery`),
          lessons: t(`${p}.reviewFields.lessons`),
          improvements: t(`${p}.reviewFields.improvements`),
        },
      }}
    />
  );
}
