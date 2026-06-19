import type { Translator } from "@/lib/i18n/translate";

export function buildKnowledgeGraphLabels(t: Translator) {
  const p = "customerApp.knowledgeGraphOperations";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    relationships: t(`${p}.relationships`),
    entities: t(`${p}.entities`),
    connections: t(`${p}.connections`),
    insights: t(`${p}.insights`),
    dependencies: t(`${p}.dependencies`),
    timeline: t(`${p}.timeline`),
    memory: t(`${p}.memory`),
    decisions: t(`${p}.decisions`),
    reports: t(`${p}.reports`),
    companion: t(`${p}.companion`),
    entityCount: t(`${p}.entityCount`),
    relationshipCount: t(`${p}.relationshipCount`),
    dependencyCount: t(`${p}.dependencyCount`),
    memoryRecords: t(`${p}.memoryRecords`),
    decisionCount: t(`${p}.decisionCount`),
    relationshipExplorer: t(`${p}.relationshipExplorer`),
    organizationalMemory: t(`${p}.organizationalMemory`),
    organizationalMemoryTitle: t(`${p}.organizationalMemoryTitle`),
    organizationalMemorySubtitle: t(`${p}.organizationalMemorySubtitle`),
    decisionHistory: t(`${p}.decisionHistory`),
    impactAnalysis: t(`${p}.impactAnalysis`),
    runImpactAnalysis: t(`${p}.runImpactAnalysis`),
    domainIntelligence: t(`${p}.domainIntelligence`),
    businessPackIntegration: t(`${p}.businessPackIntegration`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    companionIntegration: t(`${p}.companionIntegration`),
    searchIntegration: t(`${p}.searchIntegration`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    searchGraph: t(`${p}.searchGraph`),
    noItems: t(`${p}.noItems`),
    emptyHint: t(`${p}.emptyHint`),
    viewRecord: t(`${p}.viewRecord`),
    auditLog: t(`${p}.auditLog`),
    mobileReady: t(`${p}.mobileReady`),
    save: t(`${p}.save`),
  };
}

export type KnowledgeGraphLabels = ReturnType<typeof buildKnowledgeGraphLabels>;
