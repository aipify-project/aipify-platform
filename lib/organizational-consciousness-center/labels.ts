import type { Translator } from "@/lib/i18n/translate";

export function buildOrganizationalConsciousnessCenterLabels(t: Translator) {
  const p = "customerApp.organizationalConsciousnessCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    evidence: t(`${p}.evidence`),
    signal: t(`${p}.signal`),
    evaluation: t(`${p}.evaluation`),
    alignment: t(`${p}.alignment`),
    sections: {
      organizationalAwareness: t(`${p}.sections.organizationalAwareness`),
      strategicAwareness: t(`${p}.sections.strategicAwareness`),
      operationalAwareness: t(`${p}.sections.operationalAwareness`),
      culturalAwareness: t(`${p}.sections.culturalAwareness`),
      organizationalAlignment: t(`${p}.sections.organizationalAlignment`),
      longTermTrends: t(`${p}.sections.longTermTrends`),
      emergingSignals: t(`${p}.sections.emergingSignals`),
    },
    awarenessEngine: { title: t(`${p}.awarenessEngine.title`) },
    organizationalAlignmentAnalysis: { title: t(`${p}.organizationalAlignmentAnalysis.title`) },
    strategicAwarenessLayer: { title: t(`${p}.strategicAwarenessLayer.title`) },
    organizationalNarrativeEngine: { title: t(`${p}.organizationalNarrativeEngine.title`) },
    emergingSignalDetection: { title: t(`${p}.emergingSignalDetection.title`) },
    organizationalCoherenceEngine: { title: t(`${p}.organizationalCoherenceEngine.title`) },
    executiveAwarenessDashboard: { title: t(`${p}.executiveAwarenessDashboard.title`) },
    companionAdvisor: { title: t(`${p}.companionAdvisor.title`), evidence: t(`${p}.companionAdvisor.evidence`) },
    longTermIntelligenceLayer: { title: t(`${p}.longTermIntelligenceLayer.title`) },
    reflectionEngine: { title: t(`${p}.reflectionEngine.title`) },
    governanceControls: {
      title: t(`${p}.governanceControls.title`),
      enabled: t(`${p}.governanceControls.enabled`),
      disabled: t(`${p}.governanceControls.disabled`),
      humanControl: t(`${p}.governanceControls.humanControl`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      escalate: t(`${p}.actions.escalate`),
      resolve: t(`${p}.actions.resolve`),
    },
    status: {
      completed: t(`${p}.status.completed`),
      notAllowed: t(`${p}.status.notAllowed`),
      requiresAttention: t(`${p}.status.requiresAttention`),
      information: t(`${p}.status.information`),
      restricted: t(`${p}.status.restricted`),
      verified: t(`${p}.status.verified`),
      waiting: t(`${p}.status.waiting`),
    },
    links: {
      corporateBrain: t(`${p}.links.corporateBrain`),
      executiveBoard: t(`${p}.links.executiveBoard`),
      governanceTrust: t(`${p}.links.governanceTrust`),
      strategicIntelligence: t(`${p}.links.strategicIntelligence`),
      legacyConsciousness: t(`${p}.links.legacyConsciousness`),
    },
  };
}

export type OrganizationalConsciousnessCenterLabels = ReturnType<typeof buildOrganizationalConsciousnessCenterLabels>;
