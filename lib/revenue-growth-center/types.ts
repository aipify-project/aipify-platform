import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type RevenueGrowthSection =
  | "overview"
  | "renewals"
  | "expansion"
  | "subscription"
  | "businessPacks"
  | "forecast"
  | "clv"
  | "retention"
  | "recommendations"
  | "executive"
  | "partner"
  | "playbooks"
  | "governance";

export type DashboardMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "dashboard_metric";
};

export type RenewalItem = {
  id: string;
  renewalKey: string;
  customerLabel: string;
  renewalDateLabel: string;
  renewalStatus: string;
  renewalRiskLabel: string;
  healthLabel: string;
  ownerLabel: string;
  pipelineStage: string;
  statusKey: OperationsStatusKey;
  itemType: "renewal";
};

export type ExpansionItem = {
  id: string;
  opportunityKey: string;
  title: string;
  insight: string;
  suggestion: string;
  opportunityType: string;
  potentialRevenueLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "expansion";
};

export type SubscriptionItem = {
  id: string;
  itemKey: string;
  title: string;
  summary: string;
  valueLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "subscription";
};

export type BusinessPackExpansion = {
  id: string;
  packKey: string;
  packName: string;
  packStatus: string;
  departmentUsageLabel: string;
  potentialRevenueLabel: string;
  expectedAdoptionLabel: string;
  confidenceLabel: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "business_pack";
};

export type ForecastItem = {
  id: string;
  forecastPeriod: string;
  renewalsLabel: string;
  expansionRevenueLabel: string;
  newRevenueLabel: string;
  retentionRevenueLabel: string;
  totalForecastLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "forecast";
};

export type ClvItem = {
  id: string;
  clvKey: string;
  title: string;
  valueLabel: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "clv";
};

export type PartnerViewItem = {
  id: string;
  itemKey: string;
  title: string;
  summary: string;
  valueLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "partner";
};

export type ExecutiveMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionAdvice = {
  id: string;
  adviceKey: string;
  title: string;
  insight: string;
  recommendation: string;
  statusKey: OperationsStatusKey;
  itemType: "companion_advice";
};

export type RetentionSignal = {
  id: string;
  signalKey: string;
  title: string;
  insight: string;
  intervention: string;
  signalType: string;
  statusKey: OperationsStatusKey;
  itemType: "retention_signal";
};

export type PlaybookItem = {
  id: string;
  playbookKey: string;
  title: string;
  summary: string;
  stepsSummary: string;
  statusKey: OperationsStatusKey;
  itemType: "playbook";
};

export type RecommendationItem = {
  id: string;
  recommendationKey: string;
  title: string;
  insight: string;
  statusKey: OperationsStatusKey;
  itemType: "recommendation";
};

export type AuditItem = {
  id: string;
  itemType: string;
  action: string;
  description: string;
  createdAt: string;
};

export type RevenueGrowthCenter = {
  found: boolean;
  error?: string;
  organizationName?: string;
  planLabel?: string;
  growthPartnerAttributed?: boolean;
  growthPartnerName?: string;
  canManage?: boolean;
  canExecutive?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  corePrinciple?: string;
  dashboardMetrics: DashboardMetric[];
  renewals: RenewalItem[];
  expansionOpportunities: ExpansionItem[];
  subscriptionGrowth: SubscriptionItem[];
  businessPackExpansion: BusinessPackExpansion[];
  revenueForecasts: ForecastItem[];
  customerLifetimeValue: ClvItem[];
  growthPartnerView: PartnerViewItem[];
  executiveOverview: ExecutiveMetric[];
  companionAdvice: CompanionAdvice[];
  retentionProtection: RetentionSignal[];
  revenuePlaybooks: PlaybookItem[];
  growthRecommendations: RecommendationItem[];
  auditHistory: AuditItem[];
  statistics: {
    renewalCount: number;
    expansionCount: number;
    atRiskRenewals: number;
    playbookCount: number;
  };
};
