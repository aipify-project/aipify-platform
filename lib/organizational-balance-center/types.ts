export type BalanceSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type RecalibrationPrompt = {
  application_key: string;
  application_type: string;
  title: string;
  summary: string;
};

export type BalanceInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type BalanceReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type BalanceTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type BalanceMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type BalanceSnapshot = {
  snapshot_key: string;
  period_label: string;
  balance_score: number;
  summary: string;
  captured_at: string | null;
};

export type BalanceInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type BalanceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type BalanceSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalBalanceCenter = {
  dashboard: {
    balance_score: number;
    balance_health_label: string;
    initiatives_in_progress: number;
    sustainability_indicators_pct: number;
    strategic_pacing_pct: number;
    leadership_consistency_pct: number;
    workforce_resilience_pct: number;
    governance_effectiveness_pct: number;
    reviews_completed: number;
  } | null;
  balance_signals: BalanceSignal[];
  recalibration_prompts: RecalibrationPrompt[];
  balance_initiatives: BalanceInitiative[];
  balance_reviews: BalanceReview[];
  timeline: BalanceTimelineEvent[];
  balance_milestones: BalanceMilestone[];
  snapshots: BalanceSnapshot[];
  insights: BalanceInsight[];
  recommendations: BalanceRecommendation[];
  balance_sessions: BalanceSession[];
  executive_view: {
    sustainability_indicators: string;
    strategic_pacing: string;
    leadership_consistency: string;
    equilibrium_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
