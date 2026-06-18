import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type EconomicSectionKey =
  | "economic_overview"
  | "inflation"
  | "interest_rates"
  | "employment"
  | "consumer_trends"
  | "business_climate"
  | "economic_risks"
  | "economic_opportunities";

export type EconomicSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: EconomicSectionKey;
  itemType: "section";
};

export type EconomicSettings = {
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

export type RegionalItem = {
  id: string;
  scopeType: string;
  regionKey: string;
  regionName: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "regional";
};

export type BusinessImpactItem = {
  id: string;
  impactArea: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "business_impact";
};

export type ConsumerSpendingItem = {
  id: string;
  spendingType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "consumer_spending";
};

export type WorkforceItem = {
  id: string;
  workforceType: string;
  title: string;
  summary: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "workforce";
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

export type ExecutiveEconomicMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionEconomicItem = {
  id: string;
  advisorType: string;
  question: string;
  insight: string;
  reasoningLabel: string;
  evidenceLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  impactLabel: string;
  status: string;
  itemType: "companion";
};

export type ScenarioItem = {
  id: string;
  scenarioType: string;
  title: string;
  potentialImpact: string;
  preparationLabel: string;
  sourceLabel: string;
  dateLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "scenario";
};

export type EconomicIntelligenceCenter = {
  found: boolean;
  error?: string;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  intelligenceSettings: EconomicSettings;
  economicMonitoringEngine: MonitoringItem[];
  regionalEconomicIntelligence: RegionalItem[];
  businessImpactEngine: BusinessImpactItem[];
  consumerSpendingIntelligence: ConsumerSpendingItem[];
  hiringWorkforceIntelligence: WorkforceItem[];
  economicOpportunityEngine: OpportunityItem[];
  executiveEconomicDashboard: ExecutiveEconomicMetric[];
  companionEconomicAdvisor: CompanionEconomicItem[];
  scenarioModeling: ScenarioItem[];
  sections: Record<EconomicSectionKey, EconomicSectionItem[]>;
  statistics: {
    monitoringCount: number;
    regionalCount: number;
    impactCount: number;
    opportunityCount: number;
    companionCount: number;
    scenarioCount: number;
  };
};
