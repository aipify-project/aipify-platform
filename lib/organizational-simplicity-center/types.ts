export type SimplicitySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type FrictionPrompt = {
  question_key: string;
  question_type: string;
  title: string;
  summary: string;
};

export type SimplificationInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type SimplicityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type SimplicityTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type SimplicityMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type SimplicitySnapshot = {
  snapshot_key: string;
  period_label: string;
  simplicity_score: number;
  summary: string;
  captured_at: string | null;
};

export type SimplicityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type SimplicityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type SimplicitySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalSimplicityCenter = {
  dashboard: {
    simplicity_score: number;
    simplicity_health_label: string;
    complexity_reduction_pct: number;
    workflow_efficiency_pct: number;
    process_clarity_pct: number;
    navigation_simplicity_pct: number;
    communication_effectiveness_pct: number;
    bureaucratic_burden_pct: number;
    accessibility_pct: number;
    initiatives_in_progress: number;
    reviews_completed: number;
  } | null;
  simplicity_signals: SimplicitySignal[];
  friction_prompts: FrictionPrompt[];
  simplification_initiatives: SimplificationInitiative[];
  simplicity_reviews: SimplicityReview[];
  timeline: SimplicityTimelineEvent[];
  simplicity_milestones: SimplicityMilestone[];
  snapshots: SimplicitySnapshot[];
  insights: SimplicityInsight[];
  recommendations: SimplicityRecommendation[];
  simplicity_sessions: SimplicitySession[];
  executive_view: {
    complexity_reduction: string;
    workflow_efficiency: string;
    leadership_communication: string;
    simplification_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
