export type ComplexityDetection = {
  complexity_key: string;
  domain: string;
  detection_type: string;
  title: string;
  summary: string;
  severity: string;
};

export type SimplificationOpportunity = {
  opportunity_key: string;
  domain: string;
  title: string;
  summary: string;
  impact_score: number;
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
    complexity_indicators: number;
    simplification_opportunities: number;
    improvement_momentum_pct: number;
    process_complexity_pct: number;
    approval_layers_avg: number;
    workflow_efficiency_pct: number;
    information_overload_pct: number;
    organizational_clarity_pct: number;
    executive_focus_pct: number;
    leadership_confidence: number;
    reviews_completed: number;
  } | null;
  complexity_detection: ComplexityDetection[];
  simplification_opportunities: SimplificationOpportunity[];
  simplicity_reviews: SimplicityReview[];
  timeline: SimplicityTimelineEvent[];
  simplicity_milestones: SimplicityMilestone[];
  snapshots: SimplicitySnapshot[];
  insights: SimplicityInsight[];
  recommendations: SimplicityRecommendation[];
  simplicity_sessions: SimplicitySession[];
  executive_view: {
    complexity_trends: string;
    executive_focus: string;
    governance_efficiency: string;
    simplification_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
