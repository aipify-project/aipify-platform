import { UnifiedTaskFollowUpEngineDashboardPanel } from "@/components/app/unified-task-follow-up-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function UnifiedTaskFollowUpEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.unifiedTaskFollowUpEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <UnifiedTaskFollowUpEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          myTasks: t(`${p}.myTasks`),
          teamTasks: t(`${p}.teamTasks`),
          overdueTasksSection: t(`${p}.overdueTasksSection`),
          upcomingDeadlinesSection: t(`${p}.upcomingDeadlinesSection`),
          criticalTasksSection: t(`${p}.criticalTasksSection`),
          completedTasksSection: t(`${p}.completedTasksSection`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          myOpenTasks: t(`${p}.myOpenTasks`),
          overdueTasks: t(`${p}.overdueTasks`),
          criticalTasks: t(`${p}.criticalTasks`),
          upcomingDeadlines: t(`${p}.upcomingDeadlines`),
          completedTasks30d: t(`${p}.completedTasks30d`),
          teamOpenTasks: t(`${p}.teamOpenTasks`),
          createTask: t(`${p}.createTask`),
          creating: t(`${p}.creating`),
          createFailed: t(`${p}.createFailed`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          completeTask: t(`${p}.completeTask`),
          scheduleReminder: t(`${p}.scheduleReminder`),
          escalateTask: t(`${p}.escalateTask`),
          actionFailed: t(`${p}.actionFailed`),
          noTasks: t(`${p}.noTasks`),
          defaultTaskTitle: t(`${p}.defaultTaskTitle`),
          defaultTaskDescription: t(`${p}.defaultTaskDescription`),
          defaultEscalationReason: t(`${p}.defaultEscalationReason`),
        }} />
    </div>
  );
}
