export type ExecutionSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type AlignmentPrompt = {
  application_key: string;
  application_type: string;
  title: string;
  summary: string;
};

export type ExecutionInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type ExecutionReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ExecutionTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type ExecutionMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type ExecutionSnapshot = {
  snapshot_key: string;
  period_label: string;
  execution_score: number;
  summary: string;
  captured_at: string | null;
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

export type ExecutionSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalPurposefulExecutionCenter = {
  dashboard: {
    execution_score: number;
    execution_health_label: string;
    initiative_progression_pct: number;
    strategic_delivery_pct: number;
    accountability_effectiveness_pct: number;
    sustainable_pacing_pct: number;
    delivery_consistency_pct: number;
    strategic_alignment_pct: number;
    leadership_participation_pct: number;
    initiatives_in_progress: number;
    reviews_completed: number;
  } | null;
  execution_signals: ExecutionSignal[];
  alignment_prompts: AlignmentPrompt[];
  execution_initiatives: ExecutionInitiative[];
  execution_reviews: ExecutionReview[];
  timeline: ExecutionTimelineEvent[];
  execution_milestones: ExecutionMilestone[];
  snapshots: ExecutionSnapshot[];
  insights: ExecutionInsight[];
  recommendations: ExecutionRecommendation[];
  execution_sessions: ExecutionSession[];
  executive_view: {
    strategic_delivery: string;
    leadership_accountability: string;
    initiative_momentum: string;
    execution_improvement_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
