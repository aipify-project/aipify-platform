import { EnterpriseAiAgentOrchestrationEngineDashboardPanel } from "@/components/app/enterprise-ai-agent-orchestration-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrchestrationPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseAiAgentOrchestrationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseAiAgentOrchestrationEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    agentsTitle: t(`${p}.agentsTitle`),
    tasksTitle: t(`${p}.tasksTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricActiveAgents: t(`${p}.metricActiveAgents`),
    metricActiveTasks: t(`${p}.metricActiveTasks`),
    metricRunningWorkflows: t(`${p}.metricRunningWorkflows`),
    metricCompletedWorkflows: t(`${p}.metricCompletedWorkflows`),
    metricPendingApprovals: t(`${p}.metricPendingApprovals`),
    metricAutomationRate: t(`${p}.metricAutomationRate`),
    metricHealth: t(`${p}.metricHealth`),
    noAgents: t(`${p}.noAgents`),
    noTasks: t(`${p}.noTasks`),
    recommendation: t(`${p}.recommendation`),
    taskTitlePlaceholder: t(`${p}.taskTitlePlaceholder`),
    priorityLow: t(`${p}.priorityLow`),
    priorityNormal: t(`${p}.priorityNormal`),
    priorityHigh: t(`${p}.priorityHigh`),
    priorityCritical: t(`${p}.priorityCritical`),
    addTask: t(`${p}.addTask`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openAgents: t(`${p}.openAgents`),
    openTeams: t(`${p}.openTeams`),
    openRouting: t(`${p}.openRouting`),
    openWorkflows: t(`${p}.openWorkflows`),
    openApprovals: t(`${p}.openApprovals`),
    openIntelligence: t(`${p}.openIntelligence`),
    openGovernance: t(`${p}.openGovernance`),
    openEvents: t(`${p}.openEvents`),
    openFlows: t(`${p}.openFlows`),
    openRules: t(`${p}.openRules`),
    openSettings: t(`${p}.openSettings`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseAiAgentOrchestrationEngineDashboardPanel labels={labels} />
    </div>
  );
}
