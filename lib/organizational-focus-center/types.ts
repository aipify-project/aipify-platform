export type FocusInitiative = {
  initiative_key: string;
  domain: string;
  title: string;
  owner_label: string;
  summary: string;
  focus_score: number;
  status: string;
};

export type PriorityDistribution = {
  priority_key: string;
  domain: string;
  label: string;
  weight_pct: number;
};

export type FocusOverload = {
  overload_key: string;
  overload_type: string;
  message: string;
  priority: string;
  status: string;
};

export type FocusTimelineEvent = {
  timeline_key: string;
  event_type: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type FocusSnapshot = {
  snapshot_key: string;
  initiative_label: string;
  focus_score: number;
  summary: string;
  captured_at: string | null;
};

export type PrioritizationFactor = {
  factor_key: string;
  label: string;
  guidance: string;
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

export type FocusReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalFocusCenter = {
  dashboard: {
    focus_score: number;
    focus_health_label: string;
    active_initiatives: number;
    strong_focus_count: number;
    focus_risks: number;
    overload_open: number;
    initiative_concentration_pct: number;
    priority_clarity_pct: number;
    review_discipline_pct: number;
    leadership_confidence: number;
  } | null;
  initiatives: FocusInitiative[];
  priority_distribution: PriorityDistribution[];
  overloads: FocusOverload[];
  timeline: FocusTimelineEvent[];
  snapshots: FocusSnapshot[];
  prioritization_factors: PrioritizationFactor[];
  insights: FocusInsight[];
  recommendations: FocusRecommendation[];
  focus_reviews: FocusReview[];
  executive_view: {
    attention_trends: string;
    strategic_concentration: string;
    overload_risks: string;
    priority_alignment: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
