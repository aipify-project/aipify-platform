import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type CustomerSuccessSection =
  | "overview"
  | "adoption"
  | "health"
  | "expansion"
  | "plans"
  | "training"
  | "engagement"
  | "businessPacks"
  | "journey"
  | "reviews"
  | "tasks"
  | "executive"
  | "governance";

export type HealthDimension = {
  id: string;
  dimensionKey: string;
  title: string;
  scoreLabel: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "health_dimension";
};

export type AdoptionMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "adoption_metric";
};

export type SuccessPlan = {
  id: string;
  planKey: string;
  title: string;
  goalSummary: string;
  milestoneLabel: string;
  targetOutcome: string;
  reviewDateLabel: string;
  ownerLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "success_plan";
};

export type ExpansionOpportunity = {
  id: string;
  opportunityKey: string;
  title: string;
  insight: string;
  opportunityType: string;
  statusKey: OperationsStatusKey;
  itemType: "expansion";
};

export type TrainingItem = {
  id: string;
  moduleKey: string;
  moduleTitle: string;
  trainingCategory: string;
  progressLabel: string;
  statusKey: OperationsStatusKey;
  sortOrder: number;
  itemType: "training";
};

export type EngagementItem = {
  id: string;
  engagementKey: string;
  title: string;
  summary: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  itemType: "engagement";
};

export type BusinessPackUsage = {
  id: string;
  packKey: string;
  packName: string;
  utilizationCategory: string;
  summary: string;
  usageLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "business_pack";
};

export type JourneyStage = {
  id: string;
  journeyStage: string;
  title: string;
  summary: string;
  progressLabel: string;
  statusKey: OperationsStatusKey;
  sortOrder: number;
  itemType: "journey";
};

export type SuccessReview = {
  id: string;
  reviewKey: string;
  title: string;
  achievements: string;
  challenges: string;
  recommendations: string;
  reviewDateLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "review";
};

export type RetentionRisk = {
  id: string;
  riskKey: string;
  title: string;
  insight: string;
  riskType: string;
  statusKey: OperationsStatusKey;
  itemType: "retention_risk";
};

export type SuccessTask = {
  id: string;
  taskKey: string;
  title: string;
  taskType: string;
  summary: string;
  dueLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "task";
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

export type ExecutiveMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
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

export type CustomerSuccessAdoptionCenter = {
  found: boolean;
  error?: string;
  organizationName?: string;
  planLabel?: string;
  healthScore?: number;
  healthBand?: string;
  healthStatusKey?: OperationsStatusKey;
  healthBandLabel?: string;
  adoptionScore?: number;
  engagementScore?: number;
  retentionRiskLevel?: string;
  canManage?: boolean;
  canExecutive?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  healthDimensions: HealthDimension[];
  adoptionMetrics: AdoptionMetric[];
  successPlans: SuccessPlan[];
  expansionOpportunities: ExpansionOpportunity[];
  trainingCenter: TrainingItem[];
  engagement: EngagementItem[];
  businessPackUsage: BusinessPackUsage[];
  customerJourney: JourneyStage[];
  successReviews: SuccessReview[];
  retentionRisks: RetentionRisk[];
  successTasks: SuccessTask[];
  companionAdvice: CompanionAdvice[];
  executiveOverview: ExecutiveMetric[];
  topRecommendations: RecommendationItem[];
  auditHistory: AuditItem[];
  statistics: {
    healthDimensionCount: number;
    expansionCount: number;
    riskCount: number;
    taskCount: number;
  };
};
