import { CompanionFollowUpDashboardPanel } from "@/components/app/companion-follow-up";
import type { CompanionFollowUpLabels } from "@/lib/aipify/companion-follow-up";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

function buildLabels(t: Translator): CompanionFollowUpLabels {
  const p = "customerApp.companionFollowUp";
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
      status: t(`${p}.filters.status`),
      priority: t(`${p}.filters.priority`),
      owner: t(`${p}.filters.owner`),
      department: t(`${p}.filters.department`),
      category: t(`${p}.filters.category`),
      all: t(`${p}.filters.all`),
    },
    sections: {
      openFollowUps: t(`${p}.sections.openFollowUps`),
      overdueFollowUps: t(`${p}.sections.overdueFollowUps`),
      upcomingFollowUps: t(`${p}.sections.upcomingFollowUps`),
      completedFollowUps: t(`${p}.sections.completedFollowUps`),
      waitingOnOthers: t(`${p}.sections.waitingOnOthers`),
      waitingForMe: t(`${p}.sections.waitingForMe`),
      timeline: t(`${p}.sections.timeline`),
      usageExamples: t(`${p}.sections.usageExamples`),
      allFollowUps: t(`${p}.sections.allFollowUps`),
    },
    dashboard: {
      healthScore: t(`${p}.dashboard.healthScore`),
      openFollowUps: t(`${p}.dashboard.openFollowUps`),
      overdueFollowUps: t(`${p}.dashboard.overdueFollowUps`),
      upcomingFollowUps: t(`${p}.dashboard.upcomingFollowUps`),
      completedFollowUps: t(`${p}.dashboard.completedFollowUps`),
      successRate: t(`${p}.dashboard.successRate`),
    },
    card: {
      explanation: t(`${p}.card.explanation`),
      assignedTo: t(`${p}.card.assignedTo`),
      recommendedAction: t(`${p}.card.recommendedAction`),
      dueDate: t(`${p}.card.dueDate`),
      priority: t(`${p}.card.priority`),
      status: t(`${p}.card.status`),
      category: t(`${p}.card.category`),
      source: t(`${p}.card.source`),
    },
    actions: {
      complete: t(`${p}.actions.complete`),
      postpone: t(`${p}.actions.postpone`),
      archive: t(`${p}.actions.archive`),
      createReminder: t(`${p}.actions.createReminder`),
      reviewActivities: t(`${p}.actions.reviewActivities`),
    },
    priorities: {
      critical: t(`${p}.priorities.critical`),
      high: t(`${p}.priorities.high`),
      medium: t(`${p}.priorities.medium`),
      low: t(`${p}.priorities.low`),
    },
    statuses: {
      open: t(`${p}.statuses.open`),
      pending: t(`${p}.statuses.pending`),
      waiting: t(`${p}.statuses.waiting`),
      overdue: t(`${p}.statuses.overdue`),
      completed: t(`${p}.statuses.completed`),
      archived: t(`${p}.statuses.archived`),
    },
    categories: {
      personal_tasks: t(`${p}.categories.personalTasks`),
      team_commitments: t(`${p}.categories.teamCommitments`),
      customer_follow_ups: t(`${p}.categories.customerFollowUps`),
      partner_follow_ups: t(`${p}.categories.partnerFollowUps`),
      executive_reviews: t(`${p}.categories.executiveReviews`),
      training_activities: t(`${p}.categories.trainingActivities`),
      meeting_actions: t(`${p}.categories.meetingActions`),
      opportunity_reviews: t(`${p}.categories.opportunityReviews`),
      support_escalations: t(`${p}.categories.supportEscalations`),
      approval_requests: t(`${p}.categories.approvalRequests`),
    },
    sources: {
      tasks: t(`${p}.sources.tasks`),
      meetings: t(`${p}.sources.meetings`),
      calendar_events: t(`${p}.sources.calendarEvents`),
      email_activity: t(`${p}.sources.emailActivity`),
      notes: t(`${p}.sources.notes`),
      companion_recommendations: t(`${p}.sources.companionRecommendations`),
      opportunities: t(`${p}.sources.opportunities`),
      projects: t(`${p}.sources.projects`),
      support_cases: t(`${p}.sources.supportCases`),
      business_packs: t(`${p}.sources.businessPacks`),
    },
    recommendedActions: {
      complete_immediately: t(`${p}.recommendedActions.completeImmediately`),
      review_today: t(`${p}.recommendedActions.reviewToday`),
      schedule_this_week: t(`${p}.recommendedActions.scheduleThisWeek`),
      delegate: t(`${p}.recommendedActions.delegate`),
      monitor: t(`${p}.recommendedActions.monitor`),
      archive: t(`${p}.recommendedActions.archive`),
    },
    waiting: {
      awaitingResponses: t(`${p}.waiting.awaitingResponses`),
      pendingApprovals: t(`${p}.waiting.pendingApprovals`),
      externalDependencies: t(`${p}.waiting.externalDependencies`),
      teamDependencies: t(`${p}.waiting.teamDependencies`),
      assignedRequests: t(`${p}.waiting.assignedRequests`),
      customerResponses: t(`${p}.waiting.customerResponses`),
      teamCommitments: t(`${p}.waiting.teamCommitments`),
      leadershipRequests: t(`${p}.waiting.leadershipRequests`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      reminders: t(`${p}.faq.reminders`),
      remindersAnswer: t(`${p}.faq.remindersAnswer`),
      whyImportant: t(`${p}.faq.whyImportant`),
      whyImportantAnswer: t(`${p}.faq.whyImportantAnswer`),
    },
  };
}

export default async function CompanionFollowUpPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionFollowUp");
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionFollowUpDashboardPanel labels={labels} />
    </div>
  );
}
