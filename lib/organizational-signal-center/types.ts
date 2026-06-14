export type OrganizationalSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type InterpretationPrompt = {
  question_key: string;
  question_type: string;
  title: string;
  summary: string;
};

export type SignalInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type SignalReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type SignalTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type SignalMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type SignalSnapshot = {
  snapshot_key: string;
  period_label: string;
  signal_score: number;
  summary: string;
  captured_at: string | null;
};

export type SignalInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type SignalRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type SignalSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalSignalCenter = {
  dashboard: {
    signal_score: number;
    signal_health_label: string;
    emerging_themes_detected: number;
    significant_trends_pct: number;
    executive_attention_pct: number;
    observation_effectiveness_pct: number;
    reflection_participation_pct: number;
    response_readiness_pct: number;
    pattern_awareness_pct: number;
    learning_integration_pct: number;
    initiatives_in_progress: number;
    reviews_completed: number;
  } | null;
  organizational_signals: OrganizationalSignal[];
  interpretation_prompts: InterpretationPrompt[];
  signal_initiatives: SignalInitiative[];
  signal_reviews: SignalReview[];
  timeline: SignalTimelineEvent[];
  signal_milestones: SignalMilestone[];
  snapshots: SignalSnapshot[];
  insights: SignalInsight[];
  recommendations: SignalRecommendation[];
  signal_sessions: SignalSession[];
  executive_view: {
    emerging_themes: string;
    strategic_observation: string;
    response_readiness: string;
    opportunity_awareness: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
