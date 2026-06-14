export type ImpactReflection = {
  reflection_key: string;
  question: string;
  status: string;
};

export type ImpactIndicator = {
  indicator_key: string;
  domain: string;
  indicator_type: string;
  title: string;
  summary: string;
  indicator_tone: string;
};

export type ImpactInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type ImpactReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ImpactTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type ImpactMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type ImpactSnapshot = {
  snapshot_key: string;
  period_label: string;
  impact_profile_score: number;
  summary: string;
  captured_at: string | null;
};

export type ImpactInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ImpactRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ImpactSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalImpactCenter = {
  dashboard: {
    impact_profile_score: number;
    impact_health_label: string;
    positive_outcome_trend_pct: number;
    initiatives_in_progress: number;
    customer_outcome_pct: number;
    employee_development_pct: number;
    community_engagement_pct: number;
    purpose_alignment_pct: number;
    mission_fulfillment_pct: number;
    executive_confidence: number;
    reviews_completed: number;
    stakeholder_summaries: number;
  } | null;
  reflection_questions: ImpactReflection[];
  impact_indicators: ImpactIndicator[];
  impact_initiatives: ImpactInitiative[];
  impact_reviews: ImpactReview[];
  timeline: ImpactTimelineEvent[];
  impact_milestones: ImpactMilestone[];
  snapshots: ImpactSnapshot[];
  insights: ImpactInsight[];
  recommendations: ImpactRecommendation[];
  impact_sessions: ImpactSession[];
  executive_view: {
    stakeholder_indicators: string;
    mission_fulfillment: string;
    contribution_opportunities: string;
    organizational_influence: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
