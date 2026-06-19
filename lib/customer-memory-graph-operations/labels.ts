import type { Translator } from "@/lib/i18n/translate";
import type { MemoryGraphLabels, MemoryGraphTab } from "./types";
import { MEMORY_GRAPH_TABS } from "./constants";

export function buildMemoryGraphLabels(t: Translator): MemoryGraphLabels {
  const p = "memoryGraphOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      MEMORY_GRAPH_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<MemoryGraphTab, string>,
    overview: {
      totalEntities: t(`${p}.overview.totalEntities`),
      totalRelationships: t(`${p}.overview.totalRelationships`),
      totalConnections: t(`${p}.overview.totalConnections`),
      knowledgeAssets: t(`${p}.overview.knowledgeAssets`),
      customerNetworks: t(`${p}.overview.customerNetworks`),
      projectNetworks: t(`${p}.overview.projectNetworks`),
      decisionLinks: t(`${p}.overview.decisionLinks`),
      activeDependencies: t(`${p}.overview.activeDependencies`),
    },
    sections: {
      executiveDashboard: t(`${p}.sections.executiveDashboard`),
      customerIntelligence: t(`${p}.sections.customerIntelligence`),
      dependencyMapping: t(`${p}.sections.dependencyMapping`),
      knowledgeMap: t(`${p}.sections.knowledgeMap`),
      businessPacks: t(`${p}.sections.businessPacks`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshGraph: t(`${p}.actions.refreshGraph`),
      generateContextBriefing: t(`${p}.actions.generateContextBriefing`),
      addRelationship: t(`${p}.actions.addRelationship`),
      identifyDependency: t(`${p}.actions.identifyDependency`),
      connectDecision: t(`${p}.actions.connectDecision`),
    },
    relationshipStrength: {
      weak: t(`${p}.relationshipStrength.weak`),
      moderate: t(`${p}.relationshipStrength.moderate`),
      strong: t(`${p}.relationshipStrength.strong`),
      critical: t(`${p}.relationshipStrength.critical`),
    },
    dependencyRisk: {
      low: t(`${p}.dependencyRisk.low`),
      moderate: t(`${p}.dependencyRisk.moderate`),
      high: t(`${p}.dependencyRisk.high`),
      critical: t(`${p}.dependencyRisk.critical`),
    },
  };
}
