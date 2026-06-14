export type FocusSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type PriorityPrompt = {
  question_key: string;
  question_type: string;
  title: string;
  summary: string;
};

export type FocusInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  summary: string;
  status: string;
};

export type FocusReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type FocusTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type FocusMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type FocusSnapshot = {
  snapshot_key: string;
  period_label: string;
  focus_score: number;
  summary: string;
  captured_at: string | null;
};

export type FocusInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type FocusRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type FocusSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalFocusCenter = {
  dashboard: {
    focus_score: number;
    focus_health_label: string;
    priority_alignment_pct: number;
    initiative_concentration_pct: number;
    execution_clarity_pct: number;
    priority_clarity_pct: number;
    initiative_overload_risk_pct: number;
    leadership_consistency_pct: number;
    resource_concentration_pct: number;
    strategic_discipline_pct: number;
    initiatives_in_progress: number;
    reviews_completed: number;
  } | null;
  focus_signals: FocusSignal[];
  priority_prompts: PriorityPrompt[];
  focus_initiatives: FocusInitiative[];
  focus_reviews: FocusReview[];
  timeline: FocusTimelineEvent[];
  focus_milestones: FocusMilestone[];
  snapshots: FocusSnapshot[];
  insights: FocusInsight[];
  recommendations: FocusRecommendation[];
  focus_sessions: FocusSession[];
  executive_view: {
    priority_alignment: string;
    strategic_concentration: string;
    leadership_reinforcement: string;
    focus_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
