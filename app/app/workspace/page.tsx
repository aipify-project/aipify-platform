import { WorkspaceProductivityHubPanel } from "@/components/app/workspace-productivity-hub";
import {
  FOCUS_TRENDS,
  NOTE_TYPES,
  REMINDER_TYPES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/workspace-productivity-hub";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WorkspaceProductivityHubPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.workspaceProductivityHub";

  const mapKeys = <K extends string>(keys: readonly K[], suffix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`${p}.${suffix}.${k}`)])) as Record<K, string>;

  return (
    <WorkspaceProductivityHubPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        principle: t(`${p}.principle`),
        overview: {
          myTasks: t(`${p}.overview.myTasks`),
          todayPriorities: t(`${p}.overview.todayPriorities`),
          upcomingReminders: t(`${p}.overview.upcomingReminders`),
          pendingApprovals: t(`${p}.overview.pendingApprovals`),
          suggestedActions: t(`${p}.overview.suggestedActions`),
          completedThisWeek: t(`${p}.overview.completedThisWeek`),
        },
        sections: {
          overview: t(`${p}.sections.overview`),
          myDay: t(`${p}.sections.myDay`),
          todayTasks: t(`${p}.sections.todayTasks`),
          meetings: t(`${p}.sections.meetings`),
          focusAreas: t(`${p}.sections.focusAreas`),
          reminders: t(`${p}.sections.reminders`),
          insights: t(`${p}.sections.insights`),
          avgCompletion: t(`${p}.sections.avgCompletion`),
          overdueItems: t(`${p}.sections.overdueItems`),
          focusTrend: t(`${p}.sections.focusTrend`),
          quickActions: t(`${p}.sections.quickActions`),
          tasks: t(`${p}.sections.tasks`),
          notes: t(`${p}.sections.notes`),
          audit: t(`${p}.sections.audit`),
          suggestions: t(`${p}.sections.suggestions`),
          searchFilters: t(`${p}.sections.searchFilters`),
        },
        quickActions: {
          createTask: t(`${p}.quickActions.createTask`),
          addReminder: t(`${p}.quickActions.addReminder`),
          completeTask: t(`${p}.quickActions.completeTask`),
          delegateTask: t(`${p}.quickActions.delegateTask`),
          addNote: t(`${p}.quickActions.addNote`),
          dismissReminder: t(`${p}.quickActions.dismissReminder`),
        },
        priorities: mapKeys(TASK_PRIORITIES, "priorities"),
        statuses: mapKeys(TASK_STATUSES, "statuses"),
        reminderTypes: mapKeys(REMINDER_TYPES, "reminderTypes"),
        noteTypes: mapKeys(NOTE_TYPES, "noteTypes"),
        focusTrends: mapKeys(FOCUS_TRENDS, "focusTrends"),
        suggestions: {
          overdue_tasks: t(`${p}.suggestions.overdueTasks`),
          pending_approval: t(`${p}.suggestions.pendingApproval`),
          onboarding_checklist: t(`${p}.suggestions.onboardingChecklist`),
        },
        filters: {
          allStatuses: t(`${p}.filters.allStatuses`),
          allPriorities: t(`${p}.filters.allPriorities`),
          category: t(`${p}.filters.category`),
        },
        empty: t(`${p}.empty`),
        searchPlaceholder: t(`${p}.searchPlaceholder`),
        applyFilters: t(`${p}.applyFilters`),
        clearFilters: t(`${p}.clearFilters`),
        viewApprovals: t(`${p}.viewApprovals`),
        youDecide: t(`${p}.youDecide`),
      }}
    />
  );
}
