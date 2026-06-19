import type { Translator } from "@/lib/i18n/translate";

export function buildStrategyCenterLabels(t: Translator) {
  const p = "customerApp.strategyCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    strategicHealthScore: t(`${p}.strategicHealthScore`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    generateBriefing: t(`${p}.generateBriefing`),
    alignmentChain: t(`${p}.alignmentChain`),
    decisionSupport: t(`${p}.decisionSupport`),
    sections: {
      overview: t(`${p}.sections.overview`),
      objectives: t(`${p}.sections.objectives`),
      initiatives: t(`${p}.sections.initiatives`),
      risks: t(`${p}.sections.risks`),
      opportunities: t(`${p}.sections.opportunities`),
      board: t(`${p}.sections.board`),
      forecasts: t(`${p}.sections.forecasts`),
      reports: t(`${p}.sections.reports`),
    },
    riskBand: {
      managed: t(`${p}.riskBand.managed`),
      monitor: t(`${p}.riskBand.monitor`),
      strategic_risk: t(`${p}.riskBand.strategicRisk`),
    },
    stats: {
      activeObjectives: t(`${p}.stats.activeObjectives`),
      openRisks: t(`${p}.stats.openRisks`),
      openOpportunities: t(`${p}.stats.openOpportunities`),
      boardPending: t(`${p}.stats.boardPending`),
      planningCycles: t(`${p}.stats.planningCycles`),
    },
  };
}
