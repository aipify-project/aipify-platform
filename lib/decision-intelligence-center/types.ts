import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type DecisionSectionKey =
  | "active_decisions"
  | "recommended_decisions"
  | "strategic_reviews"
  | "risk_analysis"
  | "decision_history"
  | "outcome_tracking";

export type DecisionWorkspaceItem = {
  id: string;
  title: string;
  description: string;
  owner: string;
  businessArea: string;
  priority: string;
  statusKey: OperationsStatusKey;
  sectionKey: DecisionSectionKey;
  reasoning?: string;
  decisionDate?: string | null;
  outcomeSummary?: string;
  expectedResult?: string;
  actualResult?: string;
  itemType: "decision";
};

export type DecisionOption = {
  id: string;
  decisionId: string;
  optionKey: string;
  label: string;
  benefits: string;
  risks: string;
  costLabel: string;
  complexity: string;
  expectedOutcome: string;
  itemType: "option";
};

export type ExecutiveAdvisorRecommendation = {
  id: string;
  decisionId?: string;
  recommendation: string;
  reason: string;
  supportingEvidence: string;
  confidenceLevel: string;
  potentialRisks: string;
  status: string;
  itemType: "advisor";
};

export type DecisionRiskItem = {
  id: string;
  riskCategory: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  suggestedAction?: string;
  itemType: "risk";
};

export type ExecutiveBriefing = {
  id: string;
  briefingType: string;
  title: string;
  whatChanged: string;
  requiresAttention: string;
  recommendedActions: string;
  generatedAt?: string;
  itemType: "briefing";
};

export type DecisionIntelligenceCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  sections: {
    activeDecisions: DecisionWorkspaceItem[];
    recommendedDecisions: DecisionWorkspaceItem[];
    strategicReviews: DecisionWorkspaceItem[];
    riskAnalysis: DecisionRiskItem[];
    decisionHistory: DecisionWorkspaceItem[];
    outcomeTracking: DecisionWorkspaceItem[];
  };
  optionAnalysis: DecisionOption[];
  executiveAdvisor: ExecutiveAdvisorRecommendation[];
  executiveBriefings: ExecutiveBriefing[];
  statistics: {
    activeCount: number;
    recommendedCount: number;
    reviewCount: number;
    riskCount: number;
    historyCount: number;
    outcomeCount: number;
    advisorCount: number;
  };
  error?: string;
};
