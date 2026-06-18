import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type MarketSectionKey =
  | "market_overview"
  | "customer_trends"
  | "opportunity_detection"
  | "market_gaps"
  | "expansion_opportunities"
  | "emerging_demand"
  | "market_forecasts";

export type MarketSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: MarketSectionKey;
  itemType: "section";
};

export type MarketSettings = {
  intelligenceEnabled: boolean;
  humanControlRequired: boolean;
};

export type MonitoringItem = {
  id: string;
  monitoringType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "monitoring";
};

export type CustomerBehaviorItem = {
  id: string;
  behaviorType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "customer_behavior";
};

export type OpportunityItem = {
  id: string;
  opportunityType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "opportunity";
};

export type MarketGapItem = {
  id: string;
  gapType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "market_gap";
};

export type GeographicItem = {
  id: string;
  geoType: string;
  geoKey: string;
  geoName: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "geographic";
};

export type RevenueOpportunityItem = {
  id: string;
  opportunityTitle: string;
  opportunityScoreLabel: string;
  potentialRevenueLabel: string;
  adoptionPotentialLabel: string;
  marketSizeLabel: string;
  competitionLevelLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "revenue_opportunity";
};

export type ExecutiveMarketMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionMarketItem = {
  id: string;
  advisorType: string;
  question: string;
  insight: string;
  evidenceLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  status: string;
  itemType: "companion";
};

export type ForecastItem = {
  id: string;
  forecastHorizon: string;
  horizonLabel: string;
  forecastSummary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "forecast";
};

export type MarketIntelligenceCenter = {
  found: boolean;
  error?: string;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  intelligenceSettings: MarketSettings;
  marketMonitoringEngine: MonitoringItem[];
  customerBehaviorIntelligence: CustomerBehaviorItem[];
  opportunityDiscoveryEngine: OpportunityItem[];
  marketGapDetection: MarketGapItem[];
  geographicExpansionIntelligence: GeographicItem[];
  revenueOpportunityEngine: RevenueOpportunityItem[];
  executiveMarketDashboard: ExecutiveMarketMetric[];
  companionMarketAdvisor: CompanionMarketItem[];
  forecastingEngine: ForecastItem[];
  sections: Record<MarketSectionKey, MarketSectionItem[]>;
  statistics: {
    monitoringCount: number;
    behaviorCount: number;
    opportunityCount: number;
    gapCount: number;
    revenueCount: number;
    companionCount: number;
  };
};
