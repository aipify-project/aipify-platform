export type AwarenessSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type ObservationPrompt = {
  observation_key: string;
  observation_type: string;
  title: string;
  summary: string;
};

export type AwarenessInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type AwarenessReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type AwarenessTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type AwarenessMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type AwarenessSnapshot = {
  snapshot_key: string;
  period_label: string;
  awareness_score: number;
  summary: string;
  captured_at: string | null;
};

export type AwarenessInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type AwarenessRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type AwarenessSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalAwarenessCenter = {
  dashboard: {
    awareness_score: number;
    awareness_health_label: string;
    emerging_themes_pct: number;
    strategic_observations_pct: number;
    environmental_developments_pct: number;
    initiatives_in_progress: number;
    reflection_participation_pct: number;
    review_discipline_pct: number;
    environmental_scanning_pct: number;
    insight_utilization_pct: number;
    leadership_responsiveness_pct: number;
    reviews_completed: number;
  } | null;
  awareness_signals: AwarenessSignal[];
  observation_prompts: ObservationPrompt[];
  awareness_initiatives: AwarenessInitiative[];
  awareness_reviews: AwarenessReview[];
  timeline: AwarenessTimelineEvent[];
  awareness_milestones: AwarenessMilestone[];
  snapshots: AwarenessSnapshot[];
  insights: AwarenessInsight[];
  recommendations: AwarenessRecommendation[];
  awareness_sessions: AwarenessSession[];
  executive_view: {
    leadership_attentiveness: string;
    strategic_observation: string;
    environmental_awareness: string;
    insight_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
