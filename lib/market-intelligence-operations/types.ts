export type MarketObservatoryTab =
  | "overview"
  | "markets"
  | "competitors"
  | "industries"
  | "trends"
  | "opportunities"
  | "threats"
  | "companion"
  | "executive"
  | "reports";

export type MarketRow = {
  id: string;
  market_key?: string;
  market_name: string;
  region_label?: string;
  industry_label?: string;
  growth_rate_pct?: number;
  market_status?: string;
  health_score?: number;
  summary?: string;
};

export type MarketObservatoryCenter = {
  found: boolean;
  principle?: string;
  ethics_note?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  market_observatory?: MarketRow[];
  competitor_intelligence?: Record<string, unknown>[];
  industry_intelligence?: Record<string, unknown>[];
  trend_detection?: Record<string, unknown>[];
  opportunity_engine?: Record<string, unknown>[];
  threat_detection?: Record<string, unknown>[];
  external_signals_dashboard?: Record<string, unknown>[];
  executive_briefings?: Record<string, unknown>[];
  competitive_positioning?: Record<string, unknown>;
  business_pack_intelligence?: Record<string, unknown>[];
  growth_partner_intelligence?: Record<string, unknown>[];
  domain_intelligence?: Record<string, unknown>[];
  digital_twin_integration?: Record<string, unknown>;
  companion_market_advisor?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type MarketObservatoryLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  ethicsNote: string;
  emptyState: string;
  accessDenied: string;
  tabs: Record<MarketObservatoryTab, string>;
  overview: {
    marketsTracked: string;
    competitorsTracked: string;
    industriesTracked: string;
    activeTrends: string;
    openOpportunities: string;
    activeThreats: string;
    externalSignals: string;
    avgMarketHealth: string;
  };
  actions: {
    generateBriefing: string;
    addCompetitor: string;
    identifyTrend: string;
    detectOpportunity: string;
    flagThreat: string;
    refreshMarketHealth: string;
    openMarkets: string;
    openSimulation: string;
    openLegacyCenter: string;
  };
  marketStatuses: Record<string, string>;
  threatSeverities: Record<string, string>;
  marketsPage: { title: string; subtitle: string };
};
