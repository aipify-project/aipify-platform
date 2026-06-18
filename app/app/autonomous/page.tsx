import { AutonomousEnterpriseOperationsDashboardPanel } from "@/components/app/autonomous-enterprise-operations-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutonomousEnterpriseOperationsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "autonomousEnterpriseOperationsEngine");
  const t = createTranslator(dict);
  const p = "customerApp.autonomousEnterpriseOperationsEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    opportunitiesTitle: t(`${p}.opportunitiesTitle`),
    risksTitle: t(`${p}.risksTitle`),
    plansTitle: t(`${p}.plansTitle`),
    recommendationsTitle: t(`${p}.recommendationsTitle`),
    workflowsTitle: t(`${p}.workflowsTitle`),
    proactiveTitle: t(`${p}.proactiveTitle`),
    approvalQueueTitle: t(`${p}.approvalQueueTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    improvementsTitle: t(`${p}.improvementsTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    analyticsTitle: t(`${p}.analyticsTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricOpportunities: t(`${p}.metricOpportunities`),
    metricRisks: t(`${p}.metricRisks`),
    metricRecommendations: t(`${p}.metricRecommendations`),
    metricPendingApprovals: t(`${p}.metricPendingApprovals`),
    metricAutonomousActivity: t(`${p}.metricAutonomousActivity`),
    metricHealth: t(`${p}.metricHealth`),
    metricAutonomyLevel: t(`${p}.metricAutonomyLevel`),
    metricAutomationCoverage: t(`${p}.metricAutomationCoverage`),
    noOpportunities: t(`${p}.noOpportunities`),
    noRisks: t(`${p}.noRisks`),
    noPlans: t(`${p}.noPlans`),
    noRecommendations: t(`${p}.noRecommendations`),
    noWorkflows: t(`${p}.noWorkflows`),
    noProactive: t(`${p}.noProactive`),
    noApprovalQueue: t(`${p}.noApprovalQueue`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noImprovements: t(`${p}.noImprovements`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    mitigation: t(`${p}.mitigation`),
    openApprovals: t(`${p}.openApprovals`),
    openActions: t(`${p}.openActions`),
    openCommandCenter: t(`${p}.openCommandCenter`),
    generatePlan: t(`${p}.generatePlan`),
    createProactiveTask: t(`${p}.createProactiveTask`),
    coordinateWorkflow: t(`${p}.coordinateWorkflow`),
    requestApproval: t(`${p}.requestApproval`),
    recordImprovement: t(`${p}.recordImprovement`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    acting: t(`${p}.acting`),
    autonomyLevelLabel: t(`${p}.autonomyLevelLabel`),
    governanceHumanOversight: t(`${p}.governanceHumanOversight`),
    governanceHumanOverride: t(`${p}.governanceHumanOverride`),
    governanceApprovalBoundaries: t(`${p}.governanceApprovalBoundaries`),
    governanceAudit: t(`${p}.governanceAudit`),
    governanceNoExecutionBeyondPolicy: t(`${p}.governanceNoExecutionBeyondPolicy`),
    executiveSummary: t(`${p}.executiveSummary`),
    activityLabel: t(`${p}.activityLabel`),
    opportunitiesCapturedLabel: t(`${p}.opportunitiesCapturedLabel`),
    risksPreventedLabel: t(`${p}.risksPreventedLabel`),
    improvementsLabel: t(`${p}.improvementsLabel`),
    coverageLabel: t(`${p}.coverageLabel`),
    impactLabel: t(`${p}.impactLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AutonomousEnterpriseOperationsDashboardPanel labels={labels} />
    </div>
  );
}
