export type LegacySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type LegacyQuestion = {
  question_key: string;
  question_type: string;
  title: string;
  summary: string;
};

export type LegacyInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type LegacyReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type LegacyTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type LegacyMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type LegacySnapshot = {
  snapshot_key: string;
  period_label: string;
  legacy_score: number;
  summary: string;
  captured_at: string | null;
};

export type LegacyInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type LegacyRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type LegacySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalLegacyCenter = {
  dashboard: {
    legacy_score: number;
    legacy_health_label: string;
    positive_impact_pct: number;
    stewardship_quality_pct: number;
    knowledge_preservation_pct: number;
    leadership_succession_pct: number;
    customer_trust_pct: number;
    cultural_resilience_pct: number;
    values_consistency_pct: number;
    initiatives_in_progress: number;
    reviews_completed: number;
  } | null;
  legacy_signals: LegacySignal[];
  legacy_questions: LegacyQuestion[];
  legacy_initiatives: LegacyInitiative[];
  legacy_reviews: LegacyReview[];
  timeline: LegacyTimelineEvent[];
  legacy_milestones: LegacyMilestone[];
  snapshots: LegacySnapshot[];
  insights: LegacyInsight[];
  recommendations: LegacyRecommendation[];
  legacy_sessions: LegacySession[];
  executive_view: {
    stewardship_indicators: string;
    leadership_continuity: string;
    knowledge_preservation: string;
    contribution_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
