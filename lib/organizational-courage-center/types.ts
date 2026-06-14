export type CourageSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type ConversationPrompt = {
  conversation_key: string;
  conversation_type: string;
  title: string;
  summary: string;
};

export type CourageInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type CourageReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type CourageTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type CourageMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type CourageSnapshot = {
  snapshot_key: string;
  period_label: string;
  courage_score: number;
  summary: string;
  captured_at: string | null;
};

export type CourageInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type CourageRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type CourageSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalCourageCenter = {
  dashboard: {
    courage_score: number;
    courage_health_label: string;
    values_aligned_decisions_pct: number;
    leadership_reflection_pct: number;
    innovation_participation_pct: number;
    initiatives_in_progress: number;
    leadership_transparency_pct: number;
    reflection_participation_pct: number;
    ethical_consistency_pct: number;
    learning_integration_pct: number;
    responsible_innovation_pct: number;
    reviews_completed: number;
  } | null;
  courage_signals: CourageSignal[];
  conversation_prompts: ConversationPrompt[];
  courage_initiatives: CourageInitiative[];
  courage_reviews: CourageReview[];
  timeline: CourageTimelineEvent[];
  courage_milestones: CourageMilestone[];
  snapshots: CourageSnapshot[];
  insights: CourageInsight[];
  recommendations: CourageRecommendation[];
  courage_sessions: CourageSession[];
  executive_view: {
    leadership_integrity: string;
    innovation_confidence: string;
    ethical_consistency: string;
    values_based_decisions: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
