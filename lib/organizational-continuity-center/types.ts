export type DependencySignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
  status: string;
};

export type SuccessionItem = {
  succession_key: string;
  domain: string;
  succession_type: string;
  title: string;
  summary: string;
  status: string;
};

export type ContinuityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ContinuityTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type ContinuityMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type ContinuitySnapshot = {
  snapshot_key: string;
  period_label: string;
  continuity_score: number;
  summary: string;
  captured_at: string | null;
};

export type ContinuityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ContinuityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ContinuitySession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalContinuityCenter = {
  dashboard: {
    continuity_score: number;
    continuity_health_label: string;
    leadership_preparedness_pct: number;
    knowledge_continuity_pct: number;
    operational_resilience_pct: number;
    strategic_stability_pct: number;
    succession_readiness_pct: number;
    documentation_maturity_pct: number;
    process_resilience_pct: number;
    cultural_preservation_pct: number;
    dependency_risks: number;
    executive_confidence: number;
    reviews_completed: number;
  } | null;
  dependency_signals: DependencySignal[];
  succession_items: SuccessionItem[];
  continuity_reviews: ContinuityReview[];
  timeline: ContinuityTimelineEvent[];
  continuity_milestones: ContinuityMilestone[];
  snapshots: ContinuitySnapshot[];
  insights: ContinuityInsight[];
  recommendations: ContinuityRecommendation[];
  continuity_sessions: ContinuitySession[];
  executive_view: {
    leadership_continuity: string;
    strategic_consistency: string;
    knowledge_preservation: string;
    resilience_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
