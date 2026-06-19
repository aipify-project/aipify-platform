import type { Translator } from "@/lib/i18n/translate";
import type { CompanionMemoryEvolutionLabels, CompanionMemoryEvolutionTab } from "./types";
import { MEMORY_EVOLUTION_TABS } from "./constants";

export function buildCompanionMemoryEvolutionLabels(t: Translator): CompanionMemoryEvolutionLabels {
  const p = "companionMemoryEvolution";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      MEMORY_EVOLUTION_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<CompanionMemoryEvolutionTab, string>,
    overview: {
      memoryItems: t(`${p}.overview.memoryItems`),
      activeMemory: t(`${p}.overview.activeMemory`),
      reviewRequired: t(`${p}.overview.reviewRequired`),
      contextSnapshots: t(`${p}.overview.contextSnapshots`),
      relationshipEntries: t(`${p}.overview.relationshipEntries`),
      evolutionEvents: t(`${p}.overview.evolutionEvents`),
      departmentMemory: t(`${p}.overview.departmentMemory`),
      memoryHealthScore: t(`${p}.overview.memoryHealthScore`),
    },
    actions: {
      refreshHealth: t(`${p}.actions.refreshHealth`),
      exportMemory: t(`${p}.actions.exportMemory`),
      approveMemory: t(`${p}.actions.approveMemory`),
      openAssistantMemory: t(`${p}.actions.openAssistantMemory`),
      openContext: t(`${p}.actions.openContext`),
    },
    sections: {
      workingStyle: t(`${p}.sections.workingStyle`),
      contextSnapshots: t(`${p}.sections.contextSnapshots`),
      conversationContext: t(`${p}.sections.conversationContext`),
      relationshipMemory: t(`${p}.sections.relationshipMemory`),
      memoryEvolution: t(`${p}.sections.memoryEvolution`),
      departmentMemory: t(`${p}.sections.departmentMemory`),
      decisionMemory: t(`${p}.sections.decisionMemory`),
      meetingMemory: t(`${p}.sections.meetingMemory`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      governancePolicies: t(`${p}.sections.governancePolicies`),
      contextAdvisor: t(`${p}.sections.contextAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    memoryStatuses: {
      active: t(`${p}.memoryStatuses.active`),
      review_required: t(`${p}.memoryStatuses.review_required`),
      restricted: t(`${p}.memoryStatuses.restricted`),
      disabled: t(`${p}.memoryStatuses.disabled`),
    },
  };
}
