export type AdaptiveIntelligenceSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type LearningApplicationPrompt = {
  application_key: string;
  application_type: string;
  title: string;
  summary: string;
};

export type AdaptiveIntelligenceInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type AdaptiveIntelligenceReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type AdaptiveIntelligenceTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type AdaptiveIntelligenceMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type AdaptiveIntelligenceSnapshot = {
  snapshot_key: string;
  period_label: string;
  adaptive_intelligence_score: number;
  summary: string;
  captured_at: string | null;
};

export type AdaptiveIntelligenceInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type AdaptiveIntelligenceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type AdaptiveIntelligenceSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalAdaptiveIntelligenceCenter = {
  dashboard: {
    adaptive_intelligence_score: number;
    adaptive_intelligence_health_label: string;
    learning_integration_pct: number;
    responsiveness_trends_pct: number;
    future_readiness_pct: number;
    initiatives_in_progress: number;
    learning_effectiveness_pct: number;
    reflection_participation_pct: number;
    strategic_responsiveness_pct: number;
    capability_evolution_pct: number;
    decision_adaptability_pct: number;
    reviews_completed: number;
  } | null;
  adaptive_intelligence_signals: AdaptiveIntelligenceSignal[];
  learning_application_prompts: LearningApplicationPrompt[];
  adaptive_intelligence_initiatives: AdaptiveIntelligenceInitiative[];
  adaptive_intelligence_reviews: AdaptiveIntelligenceReview[];
  timeline: AdaptiveIntelligenceTimelineEvent[];
  adaptive_intelligence_milestones: AdaptiveIntelligenceMilestone[];
  snapshots: AdaptiveIntelligenceSnapshot[];
  insights: AdaptiveIntelligenceInsight[];
  recommendations: AdaptiveIntelligenceRecommendation[];
  adaptive_intelligence_sessions: AdaptiveIntelligenceSession[];
  executive_view: {
    leadership_learning: string;
    strategic_responsiveness: string;
    capability_evolution: string;
    future_readiness: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
