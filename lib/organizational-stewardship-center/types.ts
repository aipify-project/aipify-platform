export type StewardshipIndicator = {
  indicator_key: string;
  domain: string;
  title: string;
  summary: string;
  indicator_score: number;
};

export type StewardshipReflectionPrompt = {
  reflection_key: string;
  prompt: string;
  domain: string;
};

export type StewardshipReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ImpactHighlight = {
  highlight_key: string;
  domain: string;
  title: string;
  summary: string;
};

export type StewardshipMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type StewardshipSnapshot = {
  snapshot_key: string;
  period_label: string;
  stewardship_score: number;
  summary: string;
  captured_at: string | null;
};

export type StewardshipInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type StewardshipRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type StewardshipSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type SuccessionIntegrationLink = {
  key: string;
  label: string;
  route: string;
};

export type OrganizationalStewardshipCenter = {
  dashboard: {
    stewardship_score: number;
    stewardship_health_label: string;
    leadership_participation_pct: number;
    resource_stewardship_pct: number;
    knowledge_continuity_pct: number;
    governance_participation_pct: number;
    reflection_frequency_pct: number;
    sustainable_decisions_pct: number;
    succession_preparedness_pct: number;
    leadership_confidence: number;
    reviews_completed: number;
    sessions_completed: number;
  } | null;
  stewardship_indicators: StewardshipIndicator[];
  reflection_prompts: StewardshipReflectionPrompt[];
  stewardship_reviews: StewardshipReview[];
  impact_highlights: ImpactHighlight[];
  stewardship_milestones: StewardshipMilestone[];
  snapshots: StewardshipSnapshot[];
  insights: StewardshipInsight[];
  recommendations: StewardshipRecommendation[];
  stewardship_sessions: StewardshipSession[];
  executive_view: {
    leadership_continuity: string;
    long_term_readiness: string;
    responsibility_measures: string;
    stewardship_opportunities: string;
  } | null;
  succession_integration: SuccessionIntegrationLink[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
