import { CompanionProactiveInsightsEngineDashboardPanel } from "@/components/app/companion-proactive-insights-engine";
import type { CompanionProactiveInsightsEngineLabels } from "@/lib/aipify/companion-proactive-insights-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

function buildLabels(t: Translator): CompanionProactiveInsightsEngineLabels {
  const p = "customerApp.companionProactiveInsightsEngine";
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
      category: t(`${p}.filters.category`),
      priority: t(`${p}.filters.priority`),
      confidence: t(`${p}.filters.confidence`),
      impact: t(`${p}.filters.impact`),
      department: t(`${p}.filters.department`),
      status: t(`${p}.filters.status`),
      dateFrom: t(`${p}.filters.dateFrom`),
      all: t(`${p}.filters.all`),
    },
    dashboard: {
      healthScore: t(`${p}.dashboard.healthScore`),
      activeInsights: t(`${p}.dashboard.activeInsights`),
      highPriority: t(`${p}.dashboard.highPriority`),
      newInsights: t(`${p}.dashboard.newInsights`),
      reviewed: t(`${p}.dashboard.reviewed`),
      impactScore: t(`${p}.dashboard.impactScore`),
      timeline: t(`${p}.dashboard.timeline`),
      usageExamples: t(`${p}.dashboard.usageExamples`),
      whyGenerated: t(`${p}.dashboard.whyGenerated`),
      whyMatters: t(`${p}.dashboard.whyMatters`),
      dataSources: t(`${p}.dashboard.dataSources`),
      patternDetection: t(`${p}.dashboard.patternDetection`),
    },
    card: {
      observation: t(`${p}.card.observation`),
      confidence: t(`${p}.card.confidence`),
      impact: t(`${p}.card.impact`),
      suggestedReview: t(`${p}.card.suggestedReview`),
      createdDate: t(`${p}.card.createdDate`),
      status: t(`${p}.card.status`),
      source: t(`${p}.card.source`),
      priority: t(`${p}.card.priority`),
    },
    actions: {
      review: t(`${p}.actions.review`),
      dismiss: t(`${p}.actions.dismiss`),
      archive: t(`${p}.actions.archive`),
      escalate: t(`${p}.actions.escalate`),
    },
    feedback: {
      title: t(`${p}.feedback.title`),
      helpful: t(`${p}.feedback.helpful`),
      notHelpful: t(`${p}.feedback.notHelpful`),
      interesting: t(`${p}.feedback.interesting`),
      alreadyKnown: t(`${p}.feedback.alreadyKnown`),
      notRelevant: t(`${p}.feedback.notRelevant`),
    },
    categories: {
      productivity: t(`${p}.categories.productivity`),
      operations: t(`${p}.categories.operations`),
      support: t(`${p}.categories.support`),
      customers: t(`${p}.categories.customers`),
      workforce: t(`${p}.categories.workforce`),
      training: t(`${p}.categories.training`),
      growth: t(`${p}.categories.growth`),
      security: t(`${p}.categories.security`),
      compliance: t(`${p}.categories.compliance`),
      leadership: t(`${p}.categories.leadership`),
      communication: t(`${p}.categories.communication`),
      strategic_planning: t(`${p}.categories.strategicPlanning`),
    },
    sources: {
      context_engine: t(`${p}.sources.contextEngine`),
      memory_engine: t(`${p}.sources.memoryEngine`),
      recommendation_engine: t(`${p}.sources.recommendationEngine`),
      calendar: t(`${p}.sources.calendar`),
      tasks: t(`${p}.sources.tasks`),
      notifications: t(`${p}.sources.notifications`),
      business_packs: t(`${p}.sources.businessPacks`),
      intelligence_layer: t(`${p}.sources.intelligenceLayer`),
      support_activity: t(`${p}.sources.supportActivity`),
      organizational_activity: t(`${p}.sources.organizationalActivity`),
      connected_systems: t(`${p}.sources.connectedSystems`),
      companion_activity: t(`${p}.sources.companionActivity`),
    },
    priorities: {
      critical: t(`${p}.priorities.critical`),
      high: t(`${p}.priorities.high`),
      medium: t(`${p}.priorities.medium`),
      low: t(`${p}.priorities.low`),
      informational: t(`${p}.priorities.informational`),
    },
    confidenceLevels: {
      very_high: t(`${p}.confidenceLevels.veryHigh`),
      high: t(`${p}.confidenceLevels.high`),
      medium: t(`${p}.confidenceLevels.medium`),
      low: t(`${p}.confidenceLevels.low`),
      experimental: t(`${p}.confidenceLevels.experimental`),
    },
    impactLevels: {
      major: t(`${p}.impactLevels.major`),
      moderate: t(`${p}.impactLevels.moderate`),
      minor: t(`${p}.impactLevels.minor`),
      informational: t(`${p}.impactLevels.informational`),
    },
    statuses: {
      new: t(`${p}.statuses.new`),
      reviewed: t(`${p}.statuses.reviewed`),
      dismissed: t(`${p}.statuses.dismissed`),
      escalated: t(`${p}.statuses.escalated`),
      archived: t(`${p}.statuses.archived`),
    },
    patterns: {
      repeated_issues: t(`${p}.patterns.repeatedIssues`),
      repeated_delays: t(`${p}.patterns.repeatedDelays`),
      repeated_requests: t(`${p}.patterns.repeatedRequests`),
      workflow_bottlenecks: t(`${p}.patterns.workflowBottlenecks`),
      performance_trends: t(`${p}.patterns.performanceTrends`),
      behavioral_patterns: t(`${p}.patterns.behavioralPatterns`),
      communication_patterns: t(`${p}.patterns.communicationPatterns`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatAre: t(`${p}.faq.whatAre`),
      whatAreAnswer: t(`${p}.faq.whatAreAnswer`),
      autoAction: t(`${p}.faq.autoAction`),
      autoActionAnswer: t(`${p}.faq.autoActionAnswer`),
      howGenerated: t(`${p}.faq.howGenerated`),
      howGeneratedAnswer: t(`${p}.faq.howGeneratedAnswer`),
    },
  };
}

export default async function CompanionProactiveInsightsEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionProactiveInsightsEngine");
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionProactiveInsightsEngineDashboardPanel labels={labels} />
    </div>
  );
}
