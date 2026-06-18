import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type GrowthPartnerOpsSection =
  | "dashboard"
  | "leads"
  | "opportunities"
  | "customers"
  | "commissions"
  | "payouts"
  | "resources"
  | "training"
  | "certifications"
  | "performance"
  | "support";

export type DashboardMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "dashboard_metric";
};

export type LeadItem = {
  id: string;
  leadKey: string;
  companyName: string;
  contactName: string;
  leadStatus: string;
  leadSource: string;
  partnerNotes: string;
  followUpTask: string;
  statusKey: OperationsStatusKey;
  itemType: "lead";
};

export type OpportunityItem = {
  id: string;
  opportunityKey: string;
  title: string;
  stage: string;
  forecastValueLabel: string;
  expectedCloseDate: string;
  statusKey: OperationsStatusKey;
  itemType: "opportunity";
};

export type CustomerItem = {
  id: string;
  customerKey: string;
  customerName: string;
  planLabel: string;
  monthlyRevenueLabel: string;
  commissionValueLabel: string;
  renewalStatus: string;
  healthLabel: string;
  supportStatus: string;
  statusKey: OperationsStatusKey;
  itemType: "customer";
};

export type CommissionItem = {
  id: string;
  periodKey: string;
  periodLabel: string;
  amountLabel: string;
  commissionType: string;
  rulesSummary: string;
  statusKey: OperationsStatusKey;
  itemType: "commission";
};

export type PayoutItem = {
  id: string;
  payoutKey: string;
  amountLabel: string;
  payoutStatus: string;
  bankVerificationLabel: string;
  settlementDateLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "payout";
};

export type ResourceItem = {
  id: string;
  resourceType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "resource";
};

export type TrainingModuleItem = {
  moduleKey: string;
  moduleTitle: string;
  status: string;
  sortOrder: number;
  itemType: "training_module";
};

export type PerformanceMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "performance";
};

export type RecommendationItem = {
  id: string;
  recommendationType: string;
  title: string;
  insight: string;
  statusKey: OperationsStatusKey;
  itemType: "recommendation";
};

export type ActivityItem = {
  id: string;
  activityKey: string;
  title: string;
  summary: string;
  dateLabel: string;
  auditRef: string;
  statusKey: OperationsStatusKey;
  itemType: "activity";
};

export type PartnerLinkInfo = {
  partnerPublicId?: string;
  slug?: string;
  partnerUrl?: string;
  linkStatus?: string;
  marketingRoute?: string;
};

export type GrowthPartnerOperationsCenter = {
  found: boolean;
  error?: string;
  partnerStatus?: string;
  certificationStatus?: string;
  certificationStatusKey?: string;
  certificationStatusLabel?: string;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  trainingProgressPct?: number;
  trainingCompletedCount?: number;
  trainingTotalCount?: number;
  partnerLink?: PartnerLinkInfo;
  dashboardMetrics: DashboardMetric[];
  leadManagement: LeadItem[];
  opportunityPipeline: OpportunityItem[];
  customerPortfolio: CustomerItem[];
  commissionCenter: CommissionItem[];
  payoutCenter: PayoutItem[];
  marketingResources: ResourceItem[];
  trainingCenter: TrainingModuleItem[];
  performanceCenter: PerformanceMetric[];
  growthRecommendations: RecommendationItem[];
  recentActivity: ActivityItem[];
  statistics: {
    leadCount: number;
    opportunityCount: number;
    customerCount: number;
    resourceCount: number;
  };
};
