import type { AipifyAction, RiskLevel } from "@/lib/aipify/execution/types";

export type ActionImpactCategory =
  | "support"
  | "automation"
  | "billing"
  | "installation"
  | "governance"
  | "customer"
  | "growth_partner"
  | "workflow_recovery";

export type TimelineStageKey = "review" | "approve" | "execute" | "verify" | "monitor" | "close";
export type TimelineStageStatus = "pending" | "current" | "complete" | "blocked";

export type ImpactLevel = "none" | "low" | "moderate" | "high";

export type ConfidenceLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export type EffortUnit = "minutes" | "hours" | "days" | "weeks";

export type BusinessImpactCategoryKey =
  | "revenue"
  | "customer_satisfaction"
  | "employee_experience"
  | "operational_efficiency"
  | "compliance"
  | "strategic_goals"
  | "growth"
  | "risk_reduction";

export type ConfidenceFactorKey =
  | "organizational_data"
  | "historical_outcomes"
  | "similar_actions"
  | "knowledge_center"
  | "human_validation";

export type ActionImpactSummary = {
  title: string;
  status: string;
  recommended_by: string;
  priority: string;
  category: ActionImpactCategory;
};

export type ActionBusinessImpact = {
  expected_benefits: string;
  estimated_time_savings: string;
  affected_teams: string;
  customer_impact: string;
};

export type ExpectedOutcomeAnalysis = {
  intended_outcome: string;
  recommendation_rationale: string;
  estimated_value_creation: string;
  strategic_alignment_score: number;
};

export type ActionRiskAnalysis = {
  risk_level: RiskLevel;
  risk_rationale?: string;
  potential_side_effects: string;
  mitigation_strategy: string;
};

export type ActionConfidence = {
  score: number;
  level?: ConfidenceLevel;
  reasoning_key: string;
  influence_factors?: ConfidenceFactorKey[];
};

export type EffortEstimation = {
  amount: number;
  unit: EffortUnit;
  required_stakeholders: string[];
  required_approvals: string[];
  required_integrations: string[];
};

export type BusinessImpactCategoryRating = {
  key: BusinessImpactCategoryKey;
  positive_impact: ImpactLevel;
};

export type DecisionSupport = {
  why_important_now: string;
  if_delayed: string;
  if_ignored: string;
  who_should_be_involved: string;
};

export type ExecutiveSummary = {
  situation: string;
  recommendation: string;
  expected_benefits: string;
  risks: string;
  required_actions: string;
  confidence_score: number;
  confidence_level: ConfidenceLevel;
};

export type HumanOversightCopy = {
  disclaimer_prefix: string;
  estimate_prefix: string;
  review_reminder: string;
};

export type ImpactLearningFeedback = {
  actual_outcome: string;
  user_satisfaction: "very_dissatisfied" | "dissatisfied" | "neutral" | "satisfied" | "very_satisfied";
  goal_achievement: "not_achieved" | "partially" | "mostly" | "fully";
  lessons_learned: string;
};

export type ActionRollback = {
  available: boolean;
  estimated_recovery_time: string;
  steps: string;
};

export type ActionApprovalChain = {
  requested_by: string;
  requires_approval_from: string;
  escalation_path: string;
};

export type ActionAuditPreview = {
  generates_records: boolean;
  records: string[];
};

export type ActionRelatedActions = {
  similar_count: number;
  similar_success_count: number;
  average_success_rate: number;
};

export type ActionTimelineStage = {
  key: TimelineStageKey;
  status: TimelineStageStatus;
};

export type ActionPostExecution = {
  execution_result: string;
  execution_time_seconds: number;
  unexpected_events: string;
  business_outcome: string;
};

export type ActionImpactAnalysis = {
  found: boolean;
  action?: AipifyAction;
  summary?: ActionImpactSummary;
  business_impact?: ActionBusinessImpact;
  expected_outcome?: ExpectedOutcomeAnalysis;
  risk_analysis?: ActionRiskAnalysis;
  effort_estimation?: EffortEstimation;
  business_impact_categories?: BusinessImpactCategoryRating[];
  confidence?: ActionConfidence;
  decision_support?: DecisionSupport;
  executive_summary?: ExecutiveSummary;
  human_oversight?: HumanOversightCopy;
  impact_score?: number;
  rollback?: ActionRollback;
  affected_systems?: string[];
  approval_chain?: ActionApprovalChain;
  audit_preview?: ActionAuditPreview;
  related_actions?: ActionRelatedActions;
  execution_timeline?: ActionTimelineStage[];
  post_execution?: ActionPostExecution | null;
  safety?: { safe: boolean; blocked: boolean; reason: string | null };
  logs?: Array<{
    id: string;
    event_type: string;
    event_description: string;
    performed_by?: string;
    created_at: string;
  }>;
  principle?: string;
};

export type ImpactDashboardWidget = {
  id: string;
  titleKey: string;
  emptyKey: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    badge?: string;
    score?: number;
  }>;
};

export type ActionImpactLabels = {
  centerTitle: string;
  centerSubtitle: string;
  viewModeFull: string;
  viewModeExecutive: string;
  humanOversight: {
    basedOnAvailableInformation: string;
    aipifyEstimates: string;
    reviewBeforeExecution: string;
  };
  sections: {
    summary: string;
    expectedOutcome: string;
    businessImpact: string;
    impactCategories: string;
    riskAnalysis: string;
    effortEstimation: string;
    confidence: string;
    decisionSupport: string;
    executiveSummary: string;
    rollback: string;
    affectedSystems: string;
    approvalChain: string;
    auditPreview: string;
    relatedActions: string;
    timeline: string;
    postExecution: string;
    learningLoop: string;
    knowledgeCenter: string;
    widgets: string;
  };
  summary: {
    status: string;
    recommendedBy: string;
    priority: string;
    impactScore: string;
  };
  expectedOutcome: {
    intendedOutcome: string;
    recommendationRationale: string;
    estimatedValueCreation: string;
    strategicAlignment: string;
  };
  businessImpact: {
    expectedBenefits: string;
    timeSavings: string;
    affectedTeams: string;
    customerImpact: string;
  };
  impactCategories: Record<BusinessImpactCategoryKey, string>;
  impactLevels: Record<ImpactLevel, string>;
  riskAnalysis: {
    riskLevel: string;
    riskRationale: string;
    sideEffects: string;
    mitigation: string;
  };
  effortEstimation: {
    title: string;
    requiredStakeholders: string;
    requiredApprovals: string;
    requiredIntegrations: string;
    units: Record<EffortUnit, string>;
  };
  confidence: {
    score: string;
    level: string;
    reasoning: string;
    historicalSuccess: string;
    operatingConditions: string;
    levels: Record<ConfidenceLevel, string>;
    factors: Record<ConfidenceFactorKey, string>;
  };
  decisionSupport: {
    whyImportantNow: string;
    ifDelayed: string;
    ifIgnored: string;
    whoInvolved: string;
  };
  executiveSummary: {
    situation: string;
    recommendation: string;
    expectedBenefits: string;
    risks: string;
    requiredActions: string;
    confidenceScore: string;
  };
  learningLoop: {
    intro: string;
    actualOutcome: string;
    userSatisfaction: string;
    goalAchievement: string;
    lessonsLearned: string;
    submit: string;
    submitted: string;
    satisfaction: Record<ImpactLearningFeedback["user_satisfaction"], string>;
    achievement: Record<ImpactLearningFeedback["goal_achievement"], string>;
  };
  widgets: {
    recommendedByImpact: string;
    highImpactOpportunities: string;
    highRiskRecommendations: string;
    recentlyValidatedOutcomes: string;
    awaitingReview: string;
    executiveApproval: string;
    empty: string;
    viewAction: string;
  };
  faq: {
    title: string;
    whatIsImpactAnalysis: string;
    whatIsImpactAnalysisAnswer: string;
    howEstimateOutcomes: string;
    howEstimateOutcomesAnswer: string;
    canPredictFuture: string;
    canPredictFutureAnswer: string;
    confidenceScores: string;
    confidenceScoresAnswer: string;
    whoResponsible: string;
    whoResponsibleAnswer: string;
  };
  rollback: {
    available: string;
    notAvailable: string;
    recoveryTime: string;
    steps: string;
    manualRequired: string;
  };
  approvalChain: {
    requestedBy: string;
    requiresApprovalFrom: string;
    escalationPath: string;
  };
  auditPreview: {
    intro: string;
    approvalEvent: string;
    executionEvent: string;
    outcomeEvent: string;
    rollbackEvent: string;
  };
  relatedActions: {
    similarExecuted: string;
    averageSuccess: string;
  };
  timeline: Record<TimelineStageKey, string>;
  timelineStatus: Record<TimelineStageStatus, string>;
  postExecution: {
    result: string;
    executionTime: string;
    unexpectedEvents: string;
    businessOutcome: string;
    successful: string;
    failed: string;
    positive: string;
    reviewRequired: string;
    none: string;
  };
  categories: Record<ActionImpactCategory, string>;
  empty: string;
  emptyMonitoring: string;
  principle: string;
  actions: {
    approve: string;
    reject: string;
    execute: string;
    back: string;
  };
  priority: Record<string, string>;
  customerImpact: Record<string, string>;
};
