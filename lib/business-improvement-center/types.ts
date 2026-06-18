import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type ScoreLevel = "low" | "medium" | "high" | "critical";

export type ImprovementSectionKey =
  | "improvement_opportunities"
  | "recommended_actions"
  | "revenue_opportunities"
  | "cost_savings"
  | "process_improvements"
  | "customer_experience_improvements"
  | "completed_improvements";

export type ImprovementSectionItem = {
  id: string;
  title: string;
  summary: string;
  suggestedAction: string;
  impactScore: ScoreLevel;
  riskScore: ScoreLevel;
  complexityScore: ScoreLevel;
  priorityLevel: ScoreLevel;
  estimatedBenefit: string;
  statusKey: OperationsStatusKey;
  sectionKey: ImprovementSectionKey;
  itemType: "section";
};

export type DiscoverySignal = {
  id: string;
  analysisDomain: string;
  signalType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "discovery";
};

export type RevenueItem = {
  id: string;
  opportunityType: string;
  title: string;
  summary: string;
  suggestedAction: string;
  customerCount: number;
  statusKey: OperationsStatusKey;
  itemType: "revenue";
};

export type CostItem = {
  id: string;
  costType: string;
  title: string;
  summary: string;
  potentialSavingsLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "cost";
};

export type ProcessItem = {
  id: string;
  workflowType: string;
  title: string;
  summary: string;
  timeReductionLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "process";
};

export type CustomerExperienceItem = {
  id: string;
  metricType: string;
  title: string;
  summary: string;
  benchmarkLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "cx";
};

export type ImprovementPlan = {
  id: string;
  problem: string;
  cause: string;
  recommendedSolution: string;
  expectedOutcome: string;
  estimatedBenefit: string;
  impactScore: ScoreLevel;
  riskScore: ScoreLevel;
  complexityScore: ScoreLevel;
  priorityLevel: ScoreLevel;
  status: string;
  itemType: "plan";
};

export type CompanionAdvisorItem = {
  id: string;
  recommendationType: string;
  recommendation: string;
  reason: string;
  status: string;
  itemType: "advisor";
};

export type ExecutiveImprovementDashboard = {
  totalOpportunities: number;
  estimatedRevenueGain: string;
  estimatedCostSavings: string;
  completedImprovements: number;
  pendingImprovements: number;
};

export type BusinessImprovementCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  executiveDashboard: ExecutiveImprovementDashboard;
  sections: {
    improvementOpportunities: ImprovementSectionItem[];
    recommendedActions: ImprovementSectionItem[];
    revenueOpportunities: ImprovementSectionItem[];
    costSavings: ImprovementSectionItem[];
    processImprovements: ImprovementSectionItem[];
    customerExperienceImprovements: ImprovementSectionItem[];
    completedImprovements: ImprovementSectionItem[];
  };
  opportunityDiscovery: DiscoverySignal[];
  revenueIntelligence: RevenueItem[];
  costOptimization: CostItem[];
  processOptimization: ProcessItem[];
  customerExperience: CustomerExperienceItem[];
  improvementPlans: ImprovementPlan[];
  companionAdvisor: CompanionAdvisorItem[];
  statistics: {
    opportunityCount: number;
    discoveryCount: number;
    revenueCount: number;
    costCount: number;
    planCount: number;
    advisorCount: number;
    completedCount: number;
  };
  error?: string;
};
