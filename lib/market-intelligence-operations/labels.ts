import type { Translator } from "@/lib/i18n/translate";
import type { MarketObservatoryLabels, MarketObservatoryTab } from "./types";
import { MARKET_STATUSES, THREAT_SEVERITIES } from "./constants";

const TAB_KEYS: MarketObservatoryTab[] = [
  "overview",
  "markets",
  "competitors",
  "industries",
  "trends",
  "opportunities",
  "threats",
  "companion",
  "executive",
  "reports",
];

export function buildMarketObservatoryLabels(t: Translator): MarketObservatoryLabels {
  const p = "marketIntelligenceOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    ethicsNote: t(`${p}.ethicsNote`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as MarketObservatoryLabels["tabs"],
    overview: {
      marketsTracked: t(`${p}.overview.marketsTracked`),
      competitorsTracked: t(`${p}.overview.competitorsTracked`),
      industriesTracked: t(`${p}.overview.industriesTracked`),
      activeTrends: t(`${p}.overview.activeTrends`),
      openOpportunities: t(`${p}.overview.openOpportunities`),
      activeThreats: t(`${p}.overview.activeThreats`),
      externalSignals: t(`${p}.overview.externalSignals`),
      avgMarketHealth: t(`${p}.overview.avgMarketHealth`),
    },
    actions: {
      generateBriefing: t(`${p}.actions.generateBriefing`),
      addCompetitor: t(`${p}.actions.addCompetitor`),
      identifyTrend: t(`${p}.actions.identifyTrend`),
      detectOpportunity: t(`${p}.actions.detectOpportunity`),
      flagThreat: t(`${p}.actions.flagThreat`),
      refreshMarketHealth: t(`${p}.actions.refreshMarketHealth`),
      openMarkets: t(`${p}.actions.openMarkets`),
      openSimulation: t(`${p}.actions.openSimulation`),
      openLegacyCenter: t(`${p}.actions.openLegacyCenter`),
    },
    marketStatuses: Object.fromEntries(
      MARKET_STATUSES.map((key) => [key, t(`${p}.marketStatuses.${key}`)])
    ) as MarketObservatoryLabels["marketStatuses"],
    threatSeverities: Object.fromEntries(
      THREAT_SEVERITIES.map((key) => [key, t(`${p}.threatSeverities.${key}`)])
    ) as MarketObservatoryLabels["threatSeverities"],
    marketsPage: {
      title: t(`${p}.marketsPage.title`),
      subtitle: t(`${p}.marketsPage.subtitle`),
    },
  };
}
