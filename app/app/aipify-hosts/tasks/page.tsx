import { AipifyHostsTasksCenterDashboardPanel } from "@/components/app/aipify-hosts-tasks-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsTasksPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyHostsTasksCenter");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsTasksCenter";

  const catKeys = ["cleaning", "maintenance", "inspection", "guest_preparation", "compliance", "team_administration"] as const;
  const statusKeys = ["not_started", "in_progress", "waiting", "completed", "cancelled"] as const;
  const priorityKeys = ["low", "medium", "high", "critical"] as const;
  const roleKeys = ["owner", "property_manager", "cleaner", "maintenance", "support"] as const;
  const recurrenceKeys = ["daily", "weekly", "monthly", "quarterly", "annually"] as const;
  const playbookKeys = ["arrival", "departure", "cleaning", "maintenance", "inspection", "incident"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${p}.retry`),
    backToHosts: t(`${p}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    taskTitle: t(`${p}.taskTitle`),
    property: t(`${p}.property`),
    category: t(`${p}.category`),
    priority: t(`${p}.priority`),
    status: t(`${p}.status`),
    dueDate: t(`${p}.dueDate`),
    assignee: t(`${p}.assignee`),
    actions: t(`${p}.actions`),
    markCompleted: t(`${p}.markCompleted`),
    emptyTasksTitle: t(`${p}.emptyTasksTitle`),
    emptyTasksMessage: t(`${p}.emptyTasksMessage`),
    createTask: t(`${p}.createTask`),
    taskTitlePlaceholder: t(`${p}.taskTitlePlaceholder`),
    addTask: t(`${p}.addTask`),
    playbookProperty: t(`${p}.playbookProperty`),
    allPropertiesOption: t(`${p}.allPropertiesOption`),
    initiatePlaybook: t(`${p}.initiatePlaybook`),
    activePlaybookRuns: t(`${p}.activePlaybookRuns`),
    emptyTemplatesTitle: t(`${p}.emptyTemplatesTitle`),
    emptyTemplatesMessage: t(`${p}.emptyTemplatesMessage`),
    useTemplate: t(`${p}.useTemplate`),
    actionRecorded: t(`${p}.actionRecorded`),
    actionFailed: t(`${p}.actionFailed`),
  };

  for (const key of catKeys) labels[`cat_${key}`] = t(`${p}.categories.${key}`);
  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.statuses.${key}`);
  for (const key of priorityKeys) labels[`priority_${key}`] = t(`${p}.priorities.${key}`);
  for (const key of roleKeys) labels[`role_${key}`] = t(`${p}.roles.${key}`);
  for (const key of recurrenceKeys) labels[`recurrence_${key}`] = t(`${p}.recurrence.${key}`);
  for (const key of playbookKeys) labels[`playbook_${key}`] = t(`${p}.playbooks.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsTasksCenterDashboardPanel labels={labels} />
    </div>
  );
}
