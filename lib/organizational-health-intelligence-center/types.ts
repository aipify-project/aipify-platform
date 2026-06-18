import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type HealthLevel = "healthy" | "stable" | "requires_attention" | "critical";

export type HealthSectionKey =
  | "health_overview"
  | "risk_signals"
  | "performance_trends"
  | "team_health"
  | "customer_health"
  | "operational_health"
  | "financial_health";

export type HealthCategoryKey =
  | "operations"
  | "customers"
  | "revenue"
  | "support"
  | "employees"
  | "projects"
  | "security"
  | "compliance";

export type TrendWindow = "7d" | "30d" | "90d" | "12m" | "";
export type TrendDirection = "improvement" | "stability" | "decline" | "";

export type OrganizationHealthScore = {
  scoreValue: number;
  healthLevel: HealthLevel;
  statusKey: OperationsStatusKey;
};

export type HealthCategoryScore = {
  categoryKey: HealthCategoryKey;
  scoreValue: number;
  healthLevel: HealthLevel;
  statusKey: OperationsStatusKey;
  contributingFactors: string;
  itemType: "score";
};

export type HealthSectionItem = {
  id: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  detailLabel: string;
  trendWindow: TrendWindow;
  trendDirection: TrendDirection;
  sectionKey: HealthSectionKey;
  itemType: "section";
};

export type EarlyWarningSignal = {
  id: string;
  signalType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  trendPctLabel: string;
  itemType: "signal";
};

export type ProjectHealthItem = {
  id: string;
  title: string;
  projectStatus: string;
  timelineHealth: string;
  dependencyHealth: string;
  resourceHealth: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "project";
};

export type ExecutiveWarningItem = {
  id: string;
  warningTier: "critical" | "emerging" | "opportunity";
  title: string;
  summary: string;
  impactLevel: string;
  priorityRank: number;
  statusKey: OperationsStatusKey;
  itemType: "warning";
};

export type CompanionIntervention = {
  id: string;
  recommendation: string;
  reason: string;
  interventionType: string;
  status: string;
  itemType: "intervention";
};

export type PredictiveRiskItem = {
  id: string;
  riskLabel: string;
  probability: string;
  impact: string;
  urgency: string;
  summary: string;
  contributingFactors: string;
  statusKey: OperationsStatusKey;
  itemType: "predictive";
};

export type OrganizationalHealthIntelligenceCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  organizationHealthScore: OrganizationHealthScore;
  healthScores: HealthCategoryScore[];
  earlyWarningSignals: EarlyWarningSignal[];
  sections: {
    healthOverview: HealthSectionItem[];
    riskSignals: HealthSectionItem[];
    performanceTrends: HealthSectionItem[];
    teamHealth: HealthSectionItem[];
    customerHealth: HealthSectionItem[];
    operationalHealth: HealthSectionItem[];
    financialHealth: HealthSectionItem[];
  };
  projectHealth: ProjectHealthItem[];
  executiveWarnings: ExecutiveWarningItem[];
  companionInterventions: CompanionIntervention[];
  predictiveRisks: PredictiveRiskItem[];
  statistics: {
    scoreCount: number;
    signalCount: number;
    warningCount: number;
    interventionCount: number;
    projectCount: number;
    predictiveCount: number;
  };
  error?: string;
};
