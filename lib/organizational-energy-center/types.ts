export type EnergySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type BalancePrompt = {
  question_key: string;
  question_type: string;
  title: string;
  summary: string;
};

export type EnergyInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type EnergyReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type EnergyTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type EnergyMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type EnergySnapshot = {
  snapshot_key: string;
  period_label: string;
  energy_score: number;
  summary: string;
  captured_at: string | null;
};

export type EnergyInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type EnergyRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type EnergySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalEnergyCenter = {
  dashboard: {
    energy_score: number;
    energy_health_label: string;
    momentum_indicators_pct: number;
    recovery_awareness_pct: number;
    engagement_trends_pct: number;
    sustainable_pacing_pct: number;
    collaboration_quality_pct: number;
    leadership_consistency_pct: number;
    operational_friction_pct: number;
    recovery_effectiveness_pct: number;
    initiatives_in_progress: number;
    reviews_completed: number;
  } | null;
  energy_signals: EnergySignal[];
  balance_prompts: BalancePrompt[];
  energy_initiatives: EnergyInitiative[];
  energy_reviews: EnergyReview[];
  timeline: EnergyTimelineEvent[];
  energy_milestones: EnergyMilestone[];
  snapshots: EnergySnapshot[];
  insights: EnergyInsight[];
  recommendations: EnergyRecommendation[];
  energy_sessions: EnergySession[];
  executive_view: {
    organizational_momentum: string;
    leadership_sustainability: string;
    collaboration_effectiveness: string;
    capacity_preservation_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
