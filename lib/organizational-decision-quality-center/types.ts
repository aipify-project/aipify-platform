export type DecisionReflection = {
  reflection_key: string;
  question: string;
  status: string;
};

export type MajorDecision = {
  decision_key: string;
  domain: string;
  title: string;
  summary: string;
  workflow_status: string;
};

export type BiasAwarenessItem = {
  bias_key: string;
  bias_type: string;
  title: string;
  summary: string;
};

export type DecisionReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type DecisionTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type DecisionMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type DecisionSnapshot = {
  snapshot_key: string;
  period_label: string;
  decision_quality_score: number;
  summary: string;
  captured_at: string | null;
};

export type DecisionInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type DecisionRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type DecisionSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type WorkflowStep = {
  key: string;
  label: string;
};

export type OrganizationalDecisionQualityCenter = {
  dashboard: {
    decision_quality_score: number;
    decision_health_label: string;
    decisions_under_review: number;
    reflection_participation_pct: number;
    context_consideration_pct: number;
    stakeholder_involvement_pct: number;
    learning_utilization_pct: number;
    governance_alignment_pct: number;
    executive_confidence: number;
    reviews_completed: number;
    decisions_documented: number;
  } | null;
  reflection_questions: DecisionReflection[];
  major_decisions: MajorDecision[];
  bias_awareness: BiasAwarenessItem[];
  decision_reviews: DecisionReview[];
  timeline: DecisionTimelineEvent[];
  decision_milestones: DecisionMilestone[];
  snapshots: DecisionSnapshot[];
  insights: DecisionInsight[];
  recommendations: DecisionRecommendation[];
  decision_sessions: DecisionSession[];
  workflow_steps: WorkflowStep[];
  executive_view: {
    strategic_trends: string;
    reflection_participation: string;
    learning_integration: string;
    quality_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
