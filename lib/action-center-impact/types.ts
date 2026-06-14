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

export type ActionRiskAnalysis = {
  risk_level: RiskLevel;
  potential_side_effects: string;
  mitigation_strategy: string;
};

export type ActionConfidence = {
  score: number;
  reasoning_key: string;
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
  risk_analysis?: ActionRiskAnalysis;
  confidence?: ActionConfidence;
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

export type ActionImpactLabels = {
  sections: {
    summary: string;
    businessImpact: string;
    riskAnalysis: string;
    confidence: string;
    rollback: string;
    affectedSystems: string;
    approvalChain: string;
    auditPreview: string;
    relatedActions: string;
    timeline: string;
    postExecution: string;
  };
  summary: {
    status: string;
    recommendedBy: string;
    priority: string;
  };
  businessImpact: {
    expectedBenefits: string;
    timeSavings: string;
    affectedTeams: string;
    customerImpact: string;
  };
  riskAnalysis: {
    riskLevel: string;
    sideEffects: string;
    mitigation: string;
  };
  confidence: {
    score: string;
    reasoning: string;
    historicalSuccess: string;
    operatingConditions: string;
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
