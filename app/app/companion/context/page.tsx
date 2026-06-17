import { CompanionContextEngineDashboardPanel } from "@/components/app/companion-context-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";
import type { CompanionContextEngineLabels } from "@/lib/aipify/companion-context-engine";

function buildLabels(t: Translator): CompanionContextEngineLabels {
  const p = "customerApp.companionContextEngine";
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
      source: t(`${p}.filters.source`),
      department: t(`${p}.filters.department`),
      priority: t(`${p}.filters.priority`),
      dateFrom: t(`${p}.filters.dateFrom`),
      all: t(`${p}.filters.all`),
    },
    dashboard: {
      contextHealthScore: t(`${p}.dashboard.contextHealthScore`),
      companionReadinessScore: t(`${p}.dashboard.companionReadinessScore`),
      availableSignals: t(`${p}.dashboard.availableSignals`),
      contextCoverage: t(`${p}.dashboard.contextCoverage`),
      activeSources: t(`${p}.dashboard.activeSources`),
      recentlyUpdated: t(`${p}.dashboard.recentlyUpdated`),
      userContext: t(`${p}.dashboard.userContext`),
      organizationContext: t(`${p}.dashboard.organizationContext`),
      workContext: t(`${p}.dashboard.workContext`),
      companionView: t(`${p}.dashboard.companionView`),
      currentFocus: t(`${p}.dashboard.currentFocus`),
      recentActivity: t(`${p}.dashboard.recentActivity`),
      pendingActions: t(`${p}.dashboard.pendingActions`),
      upcomingEvents: t(`${p}.dashboard.upcomingEvents`),
      recommendedAttention: t(`${p}.dashboard.recommendedAttention`),
      contextConfidence: t(`${p}.dashboard.contextConfidence`),
      timeline: t(`${p}.dashboard.timeline`),
      recommendations: t(`${p}.dashboard.recommendations`),
      usageExamples: t(`${p}.dashboard.usageExamples`),
      connectSources: t(`${p}.dashboard.connectSources`),
    },
    source: {
      status: t(`${p}.source.status`),
      signals: t(`${p}.source.signals`),
      coverage: t(`${p}.source.coverage`),
      category: t(`${p}.source.category`),
    },
    recommendation: {
      effort: t(`${p}.recommendation.effort`),
      value: t(`${p}.recommendation.value`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      autoAccess: t(`${p}.faq.autoAccess`),
      autoAccessAnswer: t(`${p}.faq.autoAccessAnswer`),
      whyImportant: t(`${p}.faq.whyImportant`),
      whyImportantAnswer: t(`${p}.faq.whyImportantAnswer`),
    },
    sources: {
      user_profile: t(`${p}.sources.userProfile`),
      role_permissions: t(`${p}.sources.rolePermissions`),
      organization: t(`${p}.sources.organization`),
      business_packs: t(`${p}.sources.businessPacks`),
      connected_applications: t(`${p}.sources.connectedApplications`),
      notifications: t(`${p}.sources.notifications`),
      tasks: t(`${p}.sources.tasks`),
      calendar_events: t(`${p}.sources.calendarEvents`),
      recent_activity: t(`${p}.sources.recentActivity`),
      knowledge_center: t(`${p}.sources.knowledgeCenter`),
      companion_history: t(`${p}.sources.companionHistory`),
      support_activity: t(`${p}.sources.supportActivity`),
      operational_activity: t(`${p}.sources.operationalActivity`),
    },
    statuses: {
      connected: t(`${p}.statuses.connected`),
      disconnected: t(`${p}.statuses.disconnected`),
      pending: t(`${p}.statuses.pending`),
      restricted: t(`${p}.statuses.restricted`),
    },
    priorities: {
      low: t(`${p}.priorities.low`),
      moderate: t(`${p}.priorities.moderate`),
      high: t(`${p}.priorities.high`),
      critical: t(`${p}.priorities.critical`),
    },
    confidenceLevels: {
      low: t(`${p}.confidenceLevels.low`),
      moderate: t(`${p}.confidenceLevels.moderate`),
      high: t(`${p}.confidenceLevels.high`),
    },
  };
}

export default async function CompanionContextEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionContextEngineDashboardPanel labels={labels} />
    </div>
  );
}
