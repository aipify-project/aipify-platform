export type PresenceSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type AttentivenessPrompt = {
  application_key: string;
  application_type: string;
  title: string;
  summary: string;
};

export type PresenceInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type PresenceReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type PresenceTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type PresenceMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type PresenceSnapshot = {
  snapshot_key: string;
  period_label: string;
  presence_score: number;
  summary: string;
  captured_at: string | null;
};

export type PresenceInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type PresenceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type PresenceSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalPresenceCenter = {
  dashboard: {
    presence_score: number;
    presence_health_label: string;
    initiatives_in_progress: number;
    engagement_indicators_pct: number;
    leadership_attentiveness_pct: number;
    customer_responsiveness_pct: number;
    communication_quality_pct: number;
    leadership_participation_pct: number;
    responsiveness_consistency_pct: number;
    reflection_engagement_pct: number;
    relationship_investment_pct: number;
    reviews_completed: number;
  } | null;
  presence_signals: PresenceSignal[];
  attentiveness_prompts: AttentivenessPrompt[];
  presence_initiatives: PresenceInitiative[];
  presence_reviews: PresenceReview[];
  timeline: PresenceTimelineEvent[];
  presence_milestones: PresenceMilestone[];
  snapshots: PresenceSnapshot[];
  insights: PresenceInsight[];
  recommendations: PresenceRecommendation[];
  presence_sessions: PresenceSession[];
  executive_view: {
    leadership_engagement: string;
    communication_effectiveness: string;
    relationship_quality: string;
    connection_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
