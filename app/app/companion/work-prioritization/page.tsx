import { CompanionWorkPrioritizationDashboardPanel } from "@/components/app/companion-work-prioritization";
import type { CompanionWorkPrioritizationLabels } from "@/lib/aipify/companion-work-prioritization";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

function buildLabels(t: Translator): CompanionWorkPrioritizationLabels {
  const p = "customerApp.companionWorkPrioritization";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    emptyCta: t(`${p}.emptyCta`),
    accessDenied: t(`${p}.accessDenied`),
    filters: {
      search: t(`${p}.filters.search`),
      priority: t(`${p}.filters.priority`),
      department: t(`${p}.filters.department`),
      status: t(`${p}.filters.status`),
      project: t(`${p}.filters.project`),
      owner: t(`${p}.filters.owner`),
      all: t(`${p}.filters.all`),
    },
    sections: {
      criticalItems: t(`${p}.sections.criticalItems`),
      todaysFocus: t(`${p}.sections.todaysFocus`),
      upcomingDeadlines: t(`${p}.sections.upcomingDeadlines`),
      delegationOpportunities: t(`${p}.sections.delegationOpportunities`),
      recommendedActions: t(`${p}.sections.recommendedActions`),
      workloadBalance: t(`${p}.sections.workloadBalance`),
      dependencies: t(`${p}.sections.dependencies`),
      focusMode: t(`${p}.sections.focusMode`),
      timeline: t(`${p}.sections.timeline`),
      usageExamples: t(`${p}.sections.usageExamples`),
      allPriorities: t(`${p}.sections.allPriorities`),
    },
    dashboard: {
      workPriorityScore: t(`${p}.dashboard.workPriorityScore`),
      criticalItems: t(`${p}.dashboard.criticalItems`),
      todaysFocus: t(`${p}.dashboard.todaysFocus`),
      upcomingDeadlines: t(`${p}.dashboard.upcomingDeadlines`),
      delegationOpportunities: t(`${p}.dashboard.delegationOpportunities`),
      recommendedActions: t(`${p}.dashboard.recommendedActions`),
    },
    card: {
      reason: t(`${p}.card.reason`),
      recommendedAction: t(`${p}.card.recommendedAction`),
      owner: t(`${p}.card.owner`),
      dueDate: t(`${p}.card.dueDate`),
      priority: t(`${p}.card.priority`),
      status: t(`${p}.card.status`),
      source: t(`${p}.card.source`),
      project: t(`${p}.card.project`),
    },
    actions: {
      recalculate: t(`${p}.actions.recalculate`),
      viewDetails: t(`${p}.actions.viewDetails`),
      reviewTasks: t(`${p}.actions.reviewTasks`),
    },
    priorities: {
      critical: t(`${p}.priorities.critical`),
      high: t(`${p}.priorities.high`),
      medium: t(`${p}.priorities.medium`),
      low: t(`${p}.priorities.low`),
      optional: t(`${p}.priorities.optional`),
    },
    statuses: {
      pending: t(`${p}.statuses.pending`),
      in_progress: t(`${p}.statuses.inProgress`),
      blocked: t(`${p}.statuses.blocked`),
      completed: t(`${p}.statuses.completed`),
      archived: t(`${p}.statuses.archived`),
      postponed: t(`${p}.statuses.postponed`),
    },
    sources: {
      tasks: t(`${p}.sources.tasks`),
      calendar: t(`${p}.sources.calendar`),
      approvals: t(`${p}.sources.approvals`),
      projects: t(`${p}.sources.projects`),
      recommendations: t(`${p}.sources.recommendations`),
      proactive_insights: t(`${p}.sources.proactiveInsights`),
      notifications: t(`${p}.sources.notifications`),
      business_packs: t(`${p}.sources.businessPacks`),
      organizational_goals: t(`${p}.sources.organizationalGoals`),
      executive_priorities: t(`${p}.sources.executivePriorities`),
    },
    recommendedActions: {
      complete_immediately: t(`${p}.recommendedActions.completeImmediately`),
      review_today: t(`${p}.recommendedActions.reviewToday`),
      schedule_this_week: t(`${p}.recommendedActions.scheduleThisWeek`),
      delegate: t(`${p}.recommendedActions.delegate`),
      monitor: t(`${p}.recommendedActions.monitor`),
      archive: t(`${p}.recommendedActions.archive`),
    },
    workload: {
      current: t(`${p}.workload.current`),
      upcoming: t(`${p}.workload.upcoming`),
      overloadRisk: t(`${p}.workload.overloadRisk`),
      capacity: t(`${p}.workload.capacity`),
      delegationSuggestion: t(`${p}.workload.delegationSuggestion`),
    },
    dependencies: {
      blocked: t(`${p}.dependencies.blocked`),
      blocking: t(`${p}.dependencies.blocking`),
      dependent_team: t(`${p}.dependencies.dependentTeam`),
      pending_approval: t(`${p}.dependencies.pendingApproval`),
    },
    focusMode: {
      topPriority: t(`${p}.focusMode.topPriority`),
      nextPriority: t(`${p}.focusMode.nextPriority`),
      suggestedSequence: t(`${p}.focusMode.suggestedSequence`),
      estimatedEffort: t(`${p}.focusMode.estimatedEffort`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      canDecide: t(`${p}.faq.canDecide`),
      canDecideAnswer: t(`${p}.faq.canDecideAnswer`),
      howCalculated: t(`${p}.faq.howCalculated`),
      howCalculatedAnswer: t(`${p}.faq.howCalculatedAnswer`),
    },
  };
}

export default async function CompanionWorkPrioritizationPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionWorkPrioritizationDashboardPanel labels={labels} />
    </div>
  );
}
