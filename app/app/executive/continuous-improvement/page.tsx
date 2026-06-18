import { ContinuousImprovementCenterPanel } from "@/components/app/continuous-improvement-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ContinuousImprovementCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const p = "customerApp.continuousImprovementCenter";

  return (
    <ContinuousImprovementCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        decisionSupportLink: t(`${p}.decisionSupportLink`),
        strategicIntelligenceLink: t(`${p}.strategicIntelligenceLink`),
        ciEngineLink: t(`${p}.ciEngineLink`),
        enterpriseImprovementLink: t(`${p}.enterpriseImprovementLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        opportunitiesTitle: t(`${p}.opportunitiesTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        lessonsTitle: t(`${p}.lessonsTitle`),
        workflowTitle: t(`${p}.workflowTitle`),
        emptySection: t(`${p}.emptySection`),
        domain: t(`${p}.domain`),
        impact: t(`${p}.impact`),
        effort: t(`${p}.effort`),
        frequency: t(`${p}.frequency`),
        priorityMatrix: t(`${p}.priorityMatrix`),
        owner: t(`${p}.owner`),
        teams: t(`${p}.teams`),
        status: t(`${p}.status`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        approve: t(`${p}.approve`),
        complete: t(`${p}.complete`),
        archive: t(`${p}.archive`),
        submitOpportunity: t(`${p}.submitOpportunity`),
        opportunityTitle: t(`${p}.opportunityTitle`),
        opportunitySummary: t(`${p}.opportunitySummary`),
        captureLesson: t(`${p}.captureLesson`),
        lessonTitle: t(`${p}.lessonTitle`),
        lessonContent: t(`${p}.lessonContent`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        domains: {
          operational: t(`${p}.domains.operational`),
          customer_experience: t(`${p}.domains.customer_experience`),
          workforce: t(`${p}.domains.workforce`),
          automation: t(`${p}.domains.automation`),
          executive: t(`${p}.domains.executive`),
        },
        priorityMatrixLabels: {
          quick_wins: t(`${p}.priorityMatrixLabels.quick_wins`),
          strategic_improvements: t(`${p}.priorityMatrixLabels.strategic_improvements`),
          monitor: t(`${p}.priorityMatrixLabels.monitor`),
          future_consideration: t(`${p}.priorityMatrixLabels.future_consideration`),
        },
        statuses: {
          proposed: t(`${p}.statuses.proposed`),
          under_review: t(`${p}.statuses.under_review`),
          approved: t(`${p}.statuses.approved`),
          in_progress: t(`${p}.statuses.in_progress`),
          completed: t(`${p}.statuses.completed`),
          archived: t(`${p}.statuses.archived`),
        },
        outcomeTypes: {
          improved: t(`${p}.outcomeTypes.improved`),
          failed: t(`${p}.outcomeTypes.failed`),
          unexpected: t(`${p}.outcomeTypes.unexpected`),
        },
        metrics: {
          opportunities: t(`${p}.metrics.opportunities`),
          implemented: t(`${p}.metrics.implemented`),
          impactHours: t(`${p}.metrics.impactHours`),
          participation: t(`${p}.metrics.participation`),
          activeInitiatives: t(`${p}.metrics.activeInitiatives`),
          recommendations: t(`${p}.metrics.recommendations`),
          satisfaction: t(`${p}.metrics.satisfaction`),
          trust: t(`${p}.metrics.trust`),
        },
      }}
    />
  );
}
