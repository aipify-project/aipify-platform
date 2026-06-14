export type ExcellenceSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type BestPractice = {
  practice_key: string;
  domain: string;
  practice_type: string;
  title: string;
  summary: string;
  status: string;
};

export type ExcellenceInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type ExcellenceReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ExcellenceTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type ExcellenceMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type ExcellenceSnapshot = {
  snapshot_key: string;
  period_label: string;
  excellence_score: number;
  summary: string;
  captured_at: string | null;
};

export type ExcellenceInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ExcellenceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ExcellenceSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalExcellenceCenter = {
  dashboard: {
    excellence_score: number;
    excellence_health_label: string;
    improvement_momentum_pct: number;
    initiatives_in_progress: number;
    continuous_improvement_pct: number;
    execution_consistency_pct: number;
    leadership_maturity_pct: number;
    customer_satisfaction_trend_pct: number;
    learning_integration_pct: number;
    capability_strengths: number;
    executive_confidence: number;
    reviews_completed: number;
  } | null;
  excellence_signals: ExcellenceSignal[];
  best_practices: BestPractice[];
  excellence_initiatives: ExcellenceInitiative[];
  excellence_reviews: ExcellenceReview[];
  timeline: ExcellenceTimelineEvent[];
  excellence_milestones: ExcellenceMilestone[];
  snapshots: ExcellenceSnapshot[];
  insights: ExcellenceInsight[];
  recommendations: ExcellenceRecommendation[];
  excellence_sessions: ExcellenceSession[];
  executive_view: {
    organizational_strengths: string;
    improvement_momentum: string;
    leadership_maturity: string;
    strategic_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
