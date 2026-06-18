import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type IndustrySectionKey =
  | "industry_overview"
  | "market_trends"
  | "regulatory_changes"
  | "competitive_intelligence"
  | "emerging_opportunities"
  | "industry_risks"
  | "industry_benchmarks";

export type IndustrySectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: IndustrySectionKey;
  itemType: "section";
};

export type IntelligenceSettings = {
  intelligenceEnabled: boolean;
  humanControlRequired: boolean;
};

export type IndustryProfile = {
  id: string;
  industryKey: string;
  industryName: string;
  signalLabel: string;
  benchmarkLabel: string;
  trendLabel: string;
  riskLabel: string;
  opportunityLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "profile";
};

export type MarketMonitoringItem = {
  id: string;
  monitoringType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  relevanceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "market_monitoring";
};

export type CompetitiveItem = {
  id: string;
  competitiveType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  relevanceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "competitive";
};

export type RegulatoryItem = {
  id: string;
  regulatoryType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  relevanceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "regulatory";
};

export type BenchmarkItem = {
  id: string;
  benchmarkType: string;
  title: string;
  comparisonLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "benchmark";
};

export type OpportunityItem = {
  id: string;
  opportunityType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  relevanceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "opportunity";
};

export type ExecutiveIndustryMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionIndustryItem = {
  id: string;
  advisorType: string;
  question: string;
  insight: string;
  evidenceLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  status: string;
  itemType: "companion";
};

export type BusinessPackItem = {
  id: string;
  packKey: string;
  packName: string;
  enrichmentLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "business_pack";
};

export type IndustryIntelligenceCenter = {
  found: boolean;
  error?: string;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  intelligenceSettings: IntelligenceSettings;
  industryProfiles: IndustryProfile[];
  marketMonitoringEngine: MarketMonitoringItem[];
  competitiveIntelligence: CompetitiveItem[];
  regulatoryIntelligence: RegulatoryItem[];
  industryBenchmarkEngine: BenchmarkItem[];
  opportunityDetection: OpportunityItem[];
  executiveIndustryDashboard: ExecutiveIndustryMetric[];
  companionIndustryAdvisor: CompanionIndustryItem[];
  businessPackAwareness: BusinessPackItem[];
  sections: Record<IndustrySectionKey, IndustrySectionItem[]>;
  statistics: {
    profileCount: number;
    marketCount: number;
    competitiveCount: number;
    regulatoryCount: number;
    opportunityCount: number;
    companionCount: number;
  };
};
