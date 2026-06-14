export type RenewalOpportunity = {
  opportunity_key: string;
  domain: string;
  opportunity_type: string;
  title: string;
  summary: string;
  opportunity_tone: string;
};

export type BalancePrompt = {
  balance_key: string;
  balance_type: string;
  title: string;
  summary: string;
};

export type RenewalInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type RenewalReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type RenewalTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type RenewalMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type RenewalSnapshot = {
  snapshot_key: string;
  period_label: string;
  renewal_score: number;
  summary: string;
  captured_at: string | null;
};

export type RenewalInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type RenewalRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type RenewalSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalRenewalCenter = {
  dashboard: {
    renewal_score: number;
    renewal_health_label: string;
    strategic_reassessment_pct: number;
    initiatives_in_progress: number;
    learning_integration_pct: number;
    strategic_adaptability_pct: number;
    learning_participation_pct: number;
    leadership_reflection_pct: number;
    capability_development_pct: number;
    improvement_momentum_pct: number;
    executive_confidence: number;
    reviews_completed: number;
  } | null;
  renewal_opportunities: RenewalOpportunity[];
  balance_prompts: BalancePrompt[];
  renewal_initiatives: RenewalInitiative[];
  renewal_reviews: RenewalReview[];
  timeline: RenewalTimelineEvent[];
  renewal_milestones: RenewalMilestone[];
  snapshots: RenewalSnapshot[];
  insights: RenewalInsight[];
  recommendations: RenewalRecommendation[];
  renewal_sessions: RenewalSession[];
  executive_view: {
    strategic_evolution: string;
    leadership_development: string;
    capability_readiness: string;
    renewal_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
