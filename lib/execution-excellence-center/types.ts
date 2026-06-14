export type ExecutionInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  owner_label: string;
  sponsor_label: string;
  workflow_stage: string;
  progress_pct: number;
  risk_status: string;
};

export type ExecutionDependency = {
  dependency_key: string;
  initiative_key: string;
  dependency_type: string;
  message: string;
  status: string;
};

export type ExecutionMilestone = {
  milestone_key: string;
  initiative_key: string;
  label: string;
  milestone_status: string;
  due_at: string | null;
};

export type ExecutionRisk = {
  risk_key: string;
  risk_type: string;
  message: string;
  priority: string;
};

export type ExecutionInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ExecutionRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ExecutionReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type WorkflowStage = {
  stage: string;
  label: string;
};

export type ExecutionExcellenceCenter = {
  dashboard: {
    initiatives_in_progress: number;
    objectives_at_risk: number;
    execution_momentum_pct: number;
    momentum_initiatives: number;
    milestones_achieved: number;
    dependency_count: number;
    execution_health_score: number;
    execution_health_label: string;
    completion_trend_pct: number;
    review_consistency_pct: number;
    leadership_confidence: number;
  } | null;
  initiatives: ExecutionInitiative[];
  dependencies: ExecutionDependency[];
  milestones: ExecutionMilestone[];
  execution_risks: ExecutionRisk[];
  insights: ExecutionInsight[];
  recommendations: ExecutionRecommendation[];
  execution_reviews: ExecutionReview[];
  executive_view: {
    execution_capacity: string;
    strategic_progress: string;
    initiative_confidence: string;
    leadership_focus: string;
  } | null;
  execution_workflow: WorkflowStage[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
