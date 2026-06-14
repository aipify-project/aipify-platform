export type SustainabilityConcern = {
  concern_key: string;
  domain: string;
  concern_type: string;
  title: string;
  summary: string;
  concern_tone: string;
};

export type GrowthPrompt = {
  growth_key: string;
  growth_type: string;
  title: string;
  summary: string;
};

export type SustainabilityInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type SustainabilityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type SustainabilityTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type SustainabilityMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type SustainabilitySnapshot = {
  snapshot_key: string;
  period_label: string;
  sustainability_score: number;
  summary: string;
  captured_at: string | null;
};

export type SustainabilityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type SustainabilityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type SustainabilitySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalSustainabilityCenter = {
  dashboard: {
    sustainability_score: number;
    sustainability_health_label: string;
    sustainability_trend_pct: number;
    capacity_indicators_pct: number;
    initiatives_in_progress: number;
    workforce_resilience_pct: number;
    operational_maintainability_pct: number;
    strategic_consistency_pct: number;
    leadership_preparedness_pct: number;
    financial_stability_pct: number;
    resilience_measures_pct: number;
    reviews_completed: number;
  } | null;
  sustainability_concerns: SustainabilityConcern[];
  growth_prompts: GrowthPrompt[];
  sustainability_initiatives: SustainabilityInitiative[];
  sustainability_reviews: SustainabilityReview[];
  timeline: SustainabilityTimelineEvent[];
  sustainability_milestones: SustainabilityMilestone[];
  snapshots: SustainabilitySnapshot[];
  insights: SustainabilityInsight[];
  recommendations: SustainabilityRecommendation[];
  sustainability_sessions: SustainabilitySession[];
  executive_view: {
    long_term_viability: string;
    leadership_preparedness: string;
    resilience_trends: string;
    sustainability_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
