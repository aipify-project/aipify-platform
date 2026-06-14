export type HopeSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type ProgressPrompt = {
  progress_key: string;
  progress_type: string;
  title: string;
  summary: string;
};

export type HopeInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type HopeReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type HopeTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type HopeMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type HopeSnapshot = {
  snapshot_key: string;
  period_label: string;
  hope_score: number;
  summary: string;
  captured_at: string | null;
};

export type HopeInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type HopeRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type HopeSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalHopeCenter = {
  dashboard: {
    hope_score: number;
    hope_health_label: string;
    progress_indicators_pct: number;
    future_confidence_pct: number;
    leadership_participation_pct: number;
    initiatives_in_progress: number;
    progress_recognition_pct: number;
    leadership_communication_pct: number;
    purpose_alignment_pct: number;
    learning_participation_pct: number;
    organizational_resilience_pct: number;
    reviews_completed: number;
  } | null;
  hope_signals: HopeSignal[];
  progress_prompts: ProgressPrompt[];
  hope_initiatives: HopeInitiative[];
  hope_reviews: HopeReview[];
  timeline: HopeTimelineEvent[];
  hope_milestones: HopeMilestone[];
  snapshots: HopeSnapshot[];
  insights: HopeInsight[];
  recommendations: HopeRecommendation[];
  hope_sessions: HopeSession[];
  executive_view: {
    leadership_confidence: string;
    organizational_resilience: string;
    progress_recognition: string;
    future_opportunity: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
