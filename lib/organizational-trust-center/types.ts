export type TrustSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type AccountabilityCommitment = {
  commitment_key: string;
  domain: string;
  title: string;
  owner_label: string;
  summary: string;
  status: string;
};

export type TrustReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type TrustTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type TrustMilestone = {
  milestone_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type TrustSnapshot = {
  snapshot_key: string;
  period_label: string;
  trust_score: number;
  summary: string;
  captured_at: string | null;
};

export type TrustInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type TrustRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type TrustSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalTrustCenter = {
  dashboard: {
    trust_score: number;
    trust_health_label: string;
    trust_building_trend_pct: number;
    reliability_pct: number;
    accountability_participation_pct: number;
    commitment_fulfillment_pct: number;
    communication_consistency_pct: number;
    governance_participation_pct: number;
    resolution_effectiveness_pct: number;
    transparency_practices_pct: number;
    leadership_confidence: number;
    open_commitments: number;
    reviews_completed: number;
  } | null;
  trust_signals: TrustSignal[];
  accountability_commitments: AccountabilityCommitment[];
  trust_reviews: TrustReview[];
  timeline: TrustTimelineEvent[];
  trust_milestones: TrustMilestone[];
  snapshots: TrustSnapshot[];
  insights: TrustInsight[];
  recommendations: TrustRecommendation[];
  trust_sessions: TrustSession[];
  executive_view: {
    leadership_consistency: string;
    reliability_trends: string;
    governance_confidence: string;
    stakeholder_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
