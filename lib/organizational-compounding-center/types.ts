export type CompoundingSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type LeveragePrompt = {
  leverage_key: string;
  leverage_type: string;
  title: string;
  summary: string;
};

export type CompoundingInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type CompoundingReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type CompoundingTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type CompoundingMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type CompoundingSnapshot = {
  snapshot_key: string;
  period_label: string;
  compounding_score: number;
  summary: string;
  captured_at: string | null;
};

export type CompoundingInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type CompoundingRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type CompoundingSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalCompoundingCenter = {
  dashboard: {
    compounding_score: number;
    compounding_health_label: string;
    positive_momentum_pct: number;
    long_term_improvement_pct: number;
    compounding_opportunities: number;
    initiatives_in_progress: number;
    consistency_execution_pct: number;
    learning_integration_pct: number;
    leadership_participation_pct: number;
    relationship_stability_pct: number;
    improvement_sustainability_pct: number;
    reviews_completed: number;
  } | null;
  compounding_signals: CompoundingSignal[];
  leverage_prompts: LeveragePrompt[];
  compounding_initiatives: CompoundingInitiative[];
  compounding_reviews: CompoundingReview[];
  timeline: CompoundingTimelineEvent[];
  compounding_milestones: CompoundingMilestone[];
  snapshots: CompoundingSnapshot[];
  insights: CompoundingInsight[];
  recommendations: CompoundingRecommendation[];
  compounding_sessions: CompoundingSession[];
  executive_view: {
    long_term_value: string;
    leadership_consistency: string;
    growth_trends: string;
    patience_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
