export type SteadfastnessSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type PersistencePrompt = {
  persistence_key: string;
  persistence_type: string;
  title: string;
  summary: string;
};

export type SteadfastnessInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type SteadfastnessReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type SteadfastnessTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type SteadfastnessMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type SteadfastnessSnapshot = {
  snapshot_key: string;
  period_label: string;
  steadfastness_score: number;
  summary: string;
  captured_at: string | null;
};

export type SteadfastnessInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type SteadfastnessRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type SteadfastnessSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalSteadfastnessCenter = {
  dashboard: {
    steadfastness_score: number;
    steadfastness_health_label: string;
    resilience_indicators_pct: number;
    commitment_consistency_pct: number;
    leadership_steadiness_pct: number;
    initiatives_in_progress: number;
    values_consistency_pct: number;
    leadership_reliability_pct: number;
    recovery_effectiveness_pct: number;
    strategic_persistence_pct: number;
    organizational_resilience_pct: number;
    reviews_completed: number;
  } | null;
  steadfastness_signals: SteadfastnessSignal[];
  persistence_prompts: PersistencePrompt[];
  steadfastness_initiatives: SteadfastnessInitiative[];
  steadfastness_reviews: SteadfastnessReview[];
  timeline: SteadfastnessTimelineEvent[];
  steadfastness_milestones: SteadfastnessMilestone[];
  snapshots: SteadfastnessSnapshot[];
  insights: SteadfastnessInsight[];
  recommendations: SteadfastnessRecommendation[];
  steadfastness_sessions: SteadfastnessSession[];
  executive_view: {
    leadership_consistency: string;
    strategic_resilience: string;
    values_continuity: string;
    confidence_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
