import type { Translator } from "@/lib/i18n/translate";
import type { MaturityEvolutionLabels, MaturityEvolutionTab } from "./types";
import { MATURITY_EVOLUTION_TABS } from "./constants";

export function buildMaturityEvolutionLabels(t: Translator): MaturityEvolutionLabels {
  const p = "maturityEvolutionOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      MATURITY_EVOLUTION_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<MaturityEvolutionTab, string>,
    overview: {
      totalCapabilities: t(`${p}.overview.totalCapabilities`),
      activeAssessments: t(`${p}.overview.activeAssessments`),
      openGaps: t(`${p}.overview.openGaps`),
      activeRoadmaps: t(`${p}.overview.activeRoadmaps`),
      benchmarks: t(`${p}.overview.benchmarks`),
      evolutionItems: t(`${p}.overview.evolutionItems`),
      avgMaturityLevel: t(`${p}.overview.avgMaturityLevel`),
      evolutionScore: t(`${p}.overview.evolutionScore`),
    },
    sections: {
      executiveDashboard: t(`${p}.sections.executiveDashboard`),
      readinessEngine: t(`${p}.sections.readinessEngine`),
      evolutionTracking: t(`${p}.sections.evolutionTracking`),
      capabilityGaps: t(`${p}.sections.capabilityGaps`),
      evolutionScore: t(`${p}.sections.evolutionScore`),
      businessPacks: t(`${p}.sections.businessPacks`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshMaturity: t(`${p}.actions.refreshMaturity`),
      generateMaturityBriefing: t(`${p}.actions.generateMaturityBriefing`),
      generateRoadmap: t(`${p}.actions.generateRoadmap`),
      generateEvolutionReport: t(`${p}.actions.generateEvolutionReport`),
    },
    evolutionStatus: {
      high_maturity: t(`${p}.evolutionStatus.high_maturity`),
      improving: t(`${p}.evolutionStatus.improving`),
      needs_attention: t(`${p}.evolutionStatus.needs_attention`),
      capability_risk: t(`${p}.evolutionStatus.capability_risk`),
    },
    maturityLevel: {
      ad_hoc: t(`${p}.maturityLevel.ad_hoc`),
      developing: t(`${p}.maturityLevel.developing`),
      defined: t(`${p}.maturityLevel.defined`),
      managed: t(`${p}.maturityLevel.managed`),
      optimized: t(`${p}.maturityLevel.optimized`),
    },
    readinessStatus: {
      low: t(`${p}.readinessStatus.low`),
      moderate: t(`${p}.readinessStatus.moderate`),
      high: t(`${p}.readinessStatus.high`),
      ready: t(`${p}.readinessStatus.ready`),
    },
  };
}
