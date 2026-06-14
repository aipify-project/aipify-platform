export type FlourishingCondition = {
  condition_key: string;
  domain: string;
  condition_type: string;
  title: string;
  summary: string;
  condition_tone: string;
};

export type MeaningPrompt = {
  meaning_key: string;
  meaning_type: string;
  title: string;
  summary: string;
};

export type FlourishingInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type FlourishingReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type FlourishingTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type FlourishingMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type FlourishingSnapshot = {
  snapshot_key: string;
  period_label: string;
  flourishing_score: number;
  summary: string;
  captured_at: string | null;
};

export type FlourishingInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type FlourishingRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type FlourishingSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalFlourishingCenter = {
  dashboard: {
    flourishing_score: number;
    flourishing_health_label: string;
    positive_momentum_pct: number;
    initiatives_in_progress: number;
    learning_participation_pct: number;
    collaboration_effectiveness_pct: number;
    leadership_consistency_pct: number;
    organizational_resilience_pct: number;
    purpose_alignment_pct: number;
    sustainability_pct: number;
    executive_confidence: number;
    reviews_completed: number;
  } | null;
  flourishing_conditions: FlourishingCondition[];
  meaning_prompts: MeaningPrompt[];
  flourishing_initiatives: FlourishingInitiative[];
  flourishing_reviews: FlourishingReview[];
  timeline: FlourishingTimelineEvent[];
  flourishing_milestones: FlourishingMilestone[];
  snapshots: FlourishingSnapshot[];
  insights: FlourishingInsight[];
  recommendations: FlourishingRecommendation[];
  flourishing_sessions: FlourishingSession[];
  executive_view: {
    sustainability_indicators: string;
    resilience_measures: string;
    leadership_participation: string;
    flourishing_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
