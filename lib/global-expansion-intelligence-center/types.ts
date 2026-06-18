import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type ExpansionSectionKey =
  | "expansion_overview"
  | "country_intelligence"
  | "localization_intelligence"
  | "regulatory_intelligence"
  | "market_entry_analysis"
  | "expansion_opportunities"
  | "expansion_roadmaps";

export type ExpansionSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: ExpansionSectionKey;
  itemType: "section";
};

export type ExpansionSettings = {
  intelligenceEnabled: boolean;
  humanControlRequired: boolean;
};

export type CountryProfile = {
  id: string;
  countryKey: string;
  countryName: string;
  profileType: string;
  marketSizeLabel: string;
  languageLabel: string;
  businessEnvironmentLabel: string;
  growthPotentialLabel: string;
  competitionLevelLabel: string;
  riskLevelLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "country";
};

export type LocalizationItem = {
  id: string;
  localizationType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  riskLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "localization";
};

export type MarketEntryItem = {
  id: string;
  marketKey: string;
  marketName: string;
  demandLabel: string;
  competitionLabel: string;
  regulationsLabel: string;
  operationalComplexityLabel: string;
  investmentLabel: string;
  revenuePotentialLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  riskLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "market_entry";
};

export type ReadinessItem = {
  id: string;
  readinessDimension: string;
  dimensionName: string;
  scoreLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "readiness";
};

export type RegulatoryItem = {
  id: string;
  regulatoryType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  riskLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "regulatory";
};

export type OperationsItem = {
  id: string;
  operationsType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  riskLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "operations";
};

export type ExpansionOpportunityItem = {
  id: string;
  opportunityTitle: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  riskLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "expansion_opportunity";
};

export type ExecutiveExpansionMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionExpansionItem = {
  id: string;
  advisorType: string;
  question: string;
  insight: string;
  reasoningLabel: string;
  evidenceLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  riskLabel: string;
  status: string;
  itemType: "companion";
};

export type SimulationItem = {
  id: string;
  marketKey: string;
  marketName: string;
  bestCaseLabel: string;
  expectedCaseLabel: string;
  worstCaseLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "simulation";
};

export type GlobalExpansionIntelligenceCenter = {
  found: boolean;
  error?: string;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  expansionReadinessScore?: string;
  intelligenceSettings: ExpansionSettings;
  countryIntelligenceEngine: CountryProfile[];
  localizationIntelligence: LocalizationItem[];
  marketEntryAnalysis: MarketEntryItem[];
  expansionReadinessEngine: ReadinessItem[];
  regulatoryIntelligence: RegulatoryItem[];
  internationalOperationsIntelligence: OperationsItem[];
  expansionOpportunities: ExpansionOpportunityItem[];
  executiveExpansionDashboard: ExecutiveExpansionMetric[];
  companionExpansionAdvisor: CompanionExpansionItem[];
  expansionSimulationEngine: SimulationItem[];
  sections: Record<ExpansionSectionKey, ExpansionSectionItem[]>;
  statistics: {
    countryCount: number;
    localizationCount: number;
    marketEntryCount: number;
    regulatoryCount: number;
    opportunityCount: number;
    companionCount: number;
  };
};
