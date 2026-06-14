export type ConfidenceFactor = {
  factor_key: string;
  domain: string;
  factor_type: string;
  title: string;
  summary: string;
  factor_tone: string;
};

export type UncertaintyItem = {
  uncertainty_key: string;
  uncertainty_type: string;
  title: string;
  summary: string;
};

export type ConfidenceInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type ConfidenceReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ConfidenceTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type ConfidenceMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type ConfidenceSnapshot = {
  snapshot_key: string;
  period_label: string;
  confidence_score: number;
  summary: string;
  captured_at: string | null;
};

export type ConfidenceInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ConfidenceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ConfidenceSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalConfidenceCenter = {
  dashboard: {
    confidence_score: number;
    confidence_health_label: string;
    confidence_trend_pct: number;
    initiatives_in_progress: number;
    preparedness_effectiveness_pct: number;
    capability_maturity_pct: number;
    leadership_consistency_pct: number;
    learning_participation_pct: number;
    recovery_readiness_pct: number;
    executive_confidence: number;
    reviews_completed: number;
    preparedness_indicators: number;
  } | null;
  confidence_factors: ConfidenceFactor[];
  uncertainty_items: UncertaintyItem[];
  confidence_initiatives: ConfidenceInitiative[];
  confidence_reviews: ConfidenceReview[];
  timeline: ConfidenceTimelineEvent[];
  confidence_milestones: ConfidenceMilestone[];
  snapshots: ConfidenceSnapshot[];
  insights: ConfidenceInsight[];
  recommendations: ConfidenceRecommendation[];
  confidence_sessions: ConfidenceSession[];
  executive_view: {
    leadership_indicators: string;
    preparedness_measures: string;
    resilience_trends: string;
    building_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
