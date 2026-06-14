export type MomentumSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type MilestoneRecognition = {
  recognition_key: string;
  domain: string;
  recognition_type: string;
  title: string;
  summary: string;
  status: string;
};

export type MomentumReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type MomentumTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type ArchivedAchievement = {
  achievement_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type MomentumSnapshot = {
  snapshot_key: string;
  period_label: string;
  momentum_score: number;
  summary: string;
  captured_at: string | null;
};

export type MomentumInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type MomentumRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type MomentumSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalMomentumCenter = {
  dashboard: {
    momentum_score: number;
    momentum_health_label: string;
    progress_trend_pct: number;
    positive_momentum_pct: number;
    initiative_progression_pct: number;
    review_participation_pct: number;
    strategic_consistency_pct: number;
    learning_integration_pct: number;
    cross_functional_collaboration_pct: number;
    leadership_confidence: number;
    pending_recognitions: number;
    reviews_completed: number;
  } | null;
  momentum_signals: MomentumSignal[];
  milestone_recognitions: MilestoneRecognition[];
  momentum_reviews: MomentumReview[];
  timeline: MomentumTimelineEvent[];
  archived_achievements: ArchivedAchievement[];
  snapshots: MomentumSnapshot[];
  insights: MomentumInsight[];
  recommendations: MomentumRecommendation[];
  momentum_sessions: MomentumSession[];
  executive_view: {
    strategic_progress: string;
    leadership_consistency: string;
    organizational_confidence: string;
    long_term_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
