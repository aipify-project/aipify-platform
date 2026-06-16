import { AipifyHostsCleaningCenterDashboardPanel } from "@/components/app/aipify-hosts-cleaning-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsCleaningPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.cleaning";
  const c = "hosts.common";

  const sectionKeys = ["todays_cleaning", "upcoming_cleaning", "active_cleaning_tasks", "cleaning_teams", "cleaning_history"] as const;
  const categoryKeys = ["standard_turnover", "deep_cleaning", "emergency_cleaning", "seasonal_cleaning", "inspection_cleaning"] as const;
  const cleaningStatusKeys = ["scheduled", "assigned", "in_progress", "awaiting_review", "completed", "requires_attention"] as const;
  const cleanerStatusKeys = ["active", "unavailable", "suspended"] as const;
  const issueCategoryKeys = ["damage_detected", "missing_inventory", "maintenance_required", "supplies_missing", "other"] as const;
  const timelineKeys = ["cleaning_scheduled", "cleaner_assigned", "cleaning_started", "cleaning_completed", "issues_reported"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    viewKnowledge: t(`${p}.viewKnowledge`),
    governanceNote: t(`${p}.governanceNote`),
    cleaningsToday: t(`${p}.cleaningsToday`),
    overdueCleanings: t(`${p}.overdueCleanings`),
    awaitingCleaning: t(`${p}.awaitingCleaning`),
    issuesAttention: t(`${p}.issuesAttention`),
    needsAttention: t(`${p}.needsAttention`),
    filterStatus: t(`${p}.filterStatus`),
    allStatuses: t(`${p}.allStatuses`),
    property: t(`${p}.property`),
    category: t(`${p}.category`),
    departureDate: t(`${p}.departureDate`),
    arrivalDate: t(`${p}.arrivalDate`),
    assignedCleaner: t(`${p}.assignedCleaner`),
    dueTime: t(`${p}.dueTime`),
    status: t(`${p}.status`),
    checklist: t(`${p}.checklist`),
    checklistComplete: t(`${p}.checklistComplete`),
    actions: t(`${p}.actions`),
    overdue: t(`${p}.overdue`),
    assignCleaner: t(`${p}.assignCleaner`),
    reassignCleaner: t(`${p}.reassignCleaner`),
    startCleaning: t(`${p}.startCleaning`),
    markComplete: t(`${p}.markComplete`),
    reportIssue: t(`${p}.reportIssue`),
    scheduleDeepCleaning: t(`${p}.scheduleDeepCleaning`),
    cleanerName: t(`${p}.cleanerName`),
    contact: t(`${p}.contact`),
    assignedProperties: t(`${p}.assignedProperties`),
    activeTasks: t(`${p}.activeTasks`),
    cleaningTimeline: t(`${p}.cleaningTimeline`),
    emptyTasksTitle: t(`${p}.emptyTasksTitle`),
    emptyTasksMessage: t(`${p}.emptyTasksMessage`),
    emptyTeamsTitle: t(`${p}.emptyTeamsTitle`),
    emptyTeamsMessage: t(`${p}.emptyTeamsMessage`),
    completedNote: t(`${p}.completedNote`),
    issueReportNote: t(`${p}.issueReportNote`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of categoryKeys) labels[`category_${key}`] = t(`${p}.categories.${key}`);
  for (const key of cleaningStatusKeys) labels[`cleaningStatus_${key}`] = t(`${p}.cleaningStatuses.${key}`);
  for (const key of cleanerStatusKeys) labels[`cleanerStatus_${key}`] = t(`${p}.cleanerStatuses.${key}`);
  for (const key of issueCategoryKeys) labels[`issueCategory_${key}`] = t(`${p}.issueCategories.${key}`);
  for (const key of timelineKeys) labels[`timelineEvent_${key}`] = t(`${p}.timelineEvents.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsCleaningCenterDashboardPanel labels={labels} />
    </div>
  );
}
