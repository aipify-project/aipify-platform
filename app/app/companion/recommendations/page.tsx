import { CompanionRecommendationEngineDashboardPanel } from "@/components/app/companion-recommendation-engine";
import type { CompanionRecommendationEngineLabels } from "@/lib/aipify/companion-recommendation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

function buildLabels(t: Translator): CompanionRecommendationEngineLabels {
  const p = "customerApp.companionRecommendationEngine";
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
      department: t(`${p}.filters.department`),
      status: t(`${p}.filters.status`),
      dateFrom: t(`${p}.filters.dateFrom`),
      all: t(`${p}.filters.all`),
    },
    dashboard: {
      healthScore: t(`${p}.dashboard.healthScore`),
      activeRecommendations: t(`${p}.dashboard.activeRecommendations`),
      highPriority: t(`${p}.dashboard.highPriority`),
      accepted: t(`${p}.dashboard.accepted`),
      dismissed: t(`${p}.dashboard.dismissed`),
      accuracyScore: t(`${p}.dashboard.accuracyScore`),
      timeline: t(`${p}.dashboard.timeline`),
      usageExamples: t(`${p}.dashboard.usageExamples`),
      whySeeing: t(`${p}.dashboard.whySeeing`),
    },
    card: {
      reason: t(`${p}.card.reason`),
      priority: t(`${p}.card.priority`),
      confidence: t(`${p}.card.confidence`),
      suggestedAction: t(`${p}.card.suggestedAction`),
      createdDate: t(`${p}.card.createdDate`),
      status: t(`${p}.card.status`),
      source: t(`${p}.card.source`),
    },
    actions: {
      accept: t(`${p}.actions.accept`),
      dismiss: t(`${p}.actions.dismiss`),
      saveForLater: t(`${p}.actions.saveForLater`),
      review: t(`${p}.actions.review`),
    },
    feedback: {
      title: t(`${p}.feedback.title`),
      helpful: t(`${p}.feedback.helpful`),
      notHelpful: t(`${p}.feedback.notHelpful`),
      alreadyCompleted: t(`${p}.feedback.alreadyCompleted`),
      notRelevant: t(`${p}.feedback.notRelevant`),
    },
    categories: {
      productivity: t(`${p}.categories.productivity`),
      operations: t(`${p}.categories.operations`),
      support: t(`${p}.categories.support`),
      customer_success: t(`${p}.categories.customerSuccess`),
      team_management: t(`${p}.categories.teamManagement`),
      training: t(`${p}.categories.training`),
      security: t(`${p}.categories.security`),
      compliance: t(`${p}.categories.compliance`),
      business_growth: t(`${p}.categories.businessGrowth`),
      communication: t(`${p}.categories.communication`),
      workflow_optimization: t(`${p}.categories.workflowOptimization`),
      strategic_planning: t(`${p}.categories.strategicPlanning`),
    },
    sources: {
      context_engine: t(`${p}.sources.contextEngine`),
      memory_engine: t(`${p}.sources.memoryEngine`),
      calendar: t(`${p}.sources.calendar`),
      tasks: t(`${p}.sources.tasks`),
      notifications: t(`${p}.sources.notifications`),
      companion_activity: t(`${p}.sources.companionActivity`),
      business_packs: t(`${p}.sources.businessPacks`),
      organizational_activity: t(`${p}.sources.organizationalActivity`),
      intelligence_layer: t(`${p}.sources.intelligenceLayer`),
      connected_systems: t(`${p}.sources.connectedSystems`),
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
    statuses: {
      active: t(`${p}.statuses.active`),
      accepted: t(`${p}.statuses.accepted`),
      dismissed: t(`${p}.statuses.dismissed`),
      saved: t(`${p}.statuses.saved`),
      completed: t(`${p}.statuses.completed`),
      archived: t(`${p}.statuses.archived`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      decisions: t(`${p}.faq.decisions`),
      decisionsAnswer: t(`${p}.faq.decisionsAnswer`),
      explanations: t(`${p}.faq.explanations`),
      explanationsAnswer: t(`${p}.faq.explanationsAnswer`),
    },
  };
}

export default async function CompanionRecommendationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionRecommendationEngineDashboardPanel labels={labels} />
    </div>
  );
}
