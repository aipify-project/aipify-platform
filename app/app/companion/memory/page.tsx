import { CompanionMemoryEngineDashboardPanel } from "@/components/app/companion-memory-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";
import type { CompanionMemoryEngineLabels } from "@/lib/aipify/companion-memory-engine";

function buildLabels(t: Translator): CompanionMemoryEngineLabels {
  const p = "customerApp.companionMemoryEngine";
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
      memoryType: t(`${p}.filters.memoryType`),
      source: t(`${p}.filters.source`),
      department: t(`${p}.filters.department`),
      status: t(`${p}.filters.status`),
      confidence: t(`${p}.filters.confidence`),
      dateFrom: t(`${p}.filters.dateFrom`),
      all: t(`${p}.filters.all`),
    },
    dashboard: {
      memoryHealthScore: t(`${p}.dashboard.memoryHealthScore`),
      activeMemories: t(`${p}.dashboard.activeMemories`),
      approvedMemories: t(`${p}.dashboard.approvedMemories`),
      recentlyLearned: t(`${p}.dashboard.recentlyLearned`),
      memorySources: t(`${p}.dashboard.memorySources`),
      memoryConfidence: t(`${p}.dashboard.memoryConfidence`),
      userApproved: t(`${p}.dashboard.userApproved`),
      reviewCenter: t(`${p}.dashboard.reviewCenter`),
      timeline: t(`${p}.dashboard.timeline`),
      usageExamples: t(`${p}.dashboard.usageExamples`),
      temporaryMemory: t(`${p}.dashboard.temporaryMemory`),
      longTermMemory: t(`${p}.dashboard.longTermMemory`),
      organizationalMemory: t(`${p}.dashboard.organizationalMemory`),
      userMemory: t(`${p}.dashboard.userMemory`),
    },
    review: {
      suggestedMemory: t(`${p}.review.suggestedMemory`),
      source: t(`${p}.review.source`),
      reason: t(`${p}.review.reason`),
      confidence: t(`${p}.review.confidence`),
      approvalStatus: t(`${p}.review.approvalStatus`),
      dateLearned: t(`${p}.review.dateLearned`),
      approve: t(`${p}.review.approve`),
      reject: t(`${p}.review.reject`),
      edit: t(`${p}.review.edit`),
      archive: t(`${p}.review.archive`),
      delete: t(`${p}.review.delete`),
    },
    memoryTypes: {
      temporary: t(`${p}.memoryTypes.temporary`),
      long_term: t(`${p}.memoryTypes.longTerm`),
    },
    memoryScopes: {
      personal: t(`${p}.memoryScopes.personal`),
      team: t(`${p}.memoryScopes.team`),
      department: t(`${p}.memoryScopes.department`),
      organization: t(`${p}.memoryScopes.organization`),
      global: t(`${p}.memoryScopes.global`),
    },
    categories: {
      user_preferences: t(`${p}.categories.userPreferences`),
      team_preferences: t(`${p}.categories.teamPreferences`),
      organizational_preferences: t(`${p}.categories.organizationalPreferences`),
      companion_preferences: t(`${p}.categories.companionPreferences`),
      communication_style: t(`${p}.categories.communicationStyle`),
      operational_workflows: t(`${p}.categories.operationalWorkflows`),
      approved_processes: t(`${p}.categories.approvedProcesses`),
      recurring_tasks: t(`${p}.categories.recurringTasks`),
      important_dates: t(`${p}.categories.importantDates`),
      business_context: t(`${p}.categories.businessContext`),
      relationship_context: t(`${p}.categories.relationshipContext`),
      knowledge_references: t(`${p}.categories.knowledgeReferences`),
    },
    sources: {
      user_interaction: t(`${p}.sources.userInteraction`),
      workflow_observation: t(`${p}.sources.workflowObservation`),
      organization_profile: t(`${p}.sources.organizationProfile`),
      companion_learning: t(`${p}.sources.companionLearning`),
    },
    statuses: {
      suggested: t(`${p}.statuses.suggested`),
      approved: t(`${p}.statuses.approved`),
      rejected: t(`${p}.statuses.rejected`),
      archived: t(`${p}.statuses.archived`),
    },
    confidenceLevels: {
      high: t(`${p}.confidenceLevels.high`),
      medium: t(`${p}.confidenceLevels.medium`),
      low: t(`${p}.confidenceLevels.low`),
      unverified: t(`${p}.confidenceLevels.unverified`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      control: t(`${p}.faq.control`),
      controlAnswer: t(`${p}.faq.controlAnswer`),
      delete: t(`${p}.faq.delete`),
      deleteAnswer: t(`${p}.faq.deleteAnswer`),
    },
  };
}

export default async function CompanionMemoryEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionMemoryEngineDashboardPanel labels={labels} />
    </div>
  );
}
