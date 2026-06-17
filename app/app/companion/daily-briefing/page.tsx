import { CompanionDailyBriefingDashboardPanel } from "@/components/app/companion-daily-briefing";
import type { CompanionDailyBriefingLabels } from "@/lib/aipify/companion-daily-briefing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

function buildLabels(t: Translator): CompanionDailyBriefingLabels {
  const p = "customerApp.companionDailyBriefing";
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
      category: t(`${p}.filters.category`),
      status: t(`${p}.filters.status`),
      all: t(`${p}.filters.all`),
    },
    header: {
      goodMorning: t(`${p}.header.goodMorning`),
      welcomeBack: t(`${p}.header.welcomeBack`),
      dailyBriefing: t(`${p}.header.dailyBriefing`),
      date: t(`${p}.header.date`),
      role: t(`${p}.header.role`),
      organization: t(`${p}.header.organization`),
    },
    sections: {
      sinceLastLogin: t(`${p}.sections.sinceLastLogin`),
      priorities: t(`${p}.sections.priorities`),
      calendar: t(`${p}.sections.calendar`),
      insightsRecommendations: t(`${p}.sections.insightsRecommendations`),
      executiveSummary: t(`${p}.sections.executiveSummary`),
      focusAreas: t(`${p}.sections.focusAreas`),
      timeline: t(`${p}.sections.timeline`),
      usageExamples: t(`${p}.sections.usageExamples`),
    },
    dashboard: {
      readinessScore: t(`${p}.dashboard.readinessScore`),
      focusAreas: t(`${p}.dashboard.focusAreas`),
      upcomingEvents: t(`${p}.dashboard.upcomingEvents`),
      outstandingTasks: t(`${p}.dashboard.outstandingTasks`),
      newInsights: t(`${p}.dashboard.newInsights`),
      newRecommendations: t(`${p}.dashboard.newRecommendations`),
      sinceLastLoginSummary: t(`${p}.dashboard.sinceLastLoginSummary`),
      todaysFocus: t(`${p}.dashboard.todaysFocus`),
      briefingMode: t(`${p}.dashboard.briefingMode`),
    },
    card: {
      recommendedAction: t(`${p}.card.recommendedAction`),
      owner: t(`${p}.card.owner`),
      dueDate: t(`${p}.card.dueDate`),
      priority: t(`${p}.card.priority`),
      status: t(`${p}.card.status`),
    },
    actions: { generate: t(`${p}.actions.generate`), viewDetails: t(`${p}.actions.viewDetails`), dismiss: t(`${p}.actions.dismiss`) },
    priorities: {
      critical: t(`${p}.priorities.critical`),
      high: t(`${p}.priorities.high`),
      medium: t(`${p}.priorities.medium`),
      low: t(`${p}.priorities.low`),
      informational: t(`${p}.priorities.informational`),
    },
    statuses: {
      critical: t(`${p}.statuses.critical`),
      attention_required: t(`${p}.statuses.attentionRequired`),
      upcoming: t(`${p}.statuses.upcoming`),
      on_track: t(`${p}.statuses.onTrack`),
      completed: t(`${p}.statuses.completed`),
    },
    briefingModes: {
      ultra_short: t(`${p}.briefingModes.ultraShort`),
      summary: t(`${p}.briefingModes.summary`),
      standard: t(`${p}.briefingModes.standard`),
      detailed: t(`${p}.briefingModes.detailed`),
      executive: t(`${p}.briefingModes.executive`),
    },
    focusAreas: {
      customer_success: t(`${p}.focusAreas.customerSuccess`),
      growth: t(`${p}.focusAreas.growth`),
      operations: t(`${p}.focusAreas.operations`),
      team_management: t(`${p}.focusAreas.teamManagement`),
      strategic_planning: t(`${p}.focusAreas.strategicPlanning`),
      support: t(`${p}.focusAreas.support`),
    },
    sinceLastLogin: {
      completedTasks: t(`${p}.sinceLastLogin.completedTasks`),
      newNotifications: t(`${p}.sinceLastLogin.newNotifications`),
      newSupportRequests: t(`${p}.sinceLastLogin.newSupportRequests`),
      newApprovals: t(`${p}.sinceLastLogin.newApprovals`),
      importantActivity: t(`${p}.sinceLastLogin.importantActivity`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      howGenerated: t(`${p}.faq.howGenerated`),
      howGeneratedAnswer: t(`${p}.faq.howGeneratedAnswer`),
      customize: t(`${p}.faq.customize`),
      customizeAnswer: t(`${p}.faq.customizeAnswer`),
    },
  };
}

export default async function CompanionDailyBriefingPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionDailyBriefingDashboardPanel labels={labels} />
    </div>
  );
}
