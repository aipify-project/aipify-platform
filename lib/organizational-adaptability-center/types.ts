export type ChangeSignal = {
  signal_key: string;
  signal_type: string;
  domain: string;
  message: string;
  priority: string;
  status: string;
};

export type AdaptationOpportunity = {
  opportunity_key: string;
  domain: string;
  title: string;
  summary: string;
  adaptability_score: number;
};

export type ResponsivenessIndicator = {
  indicator_key: string;
  domain: string;
  label: string;
  value_label: string;
  trend: string;
};

export type ExecutivePriority = {
  priority_key: string;
  title: string;
  owner_label: string;
  summary: string;
};

export type AdaptationHistoryEntry = {
  history_key: string;
  history_type: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type AdaptabilitySnapshot = {
  snapshot_key: string;
  period_label: string;
  adaptability_score: number;
  summary: string;
  captured_at: string | null;
};

export type AdaptabilityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type AdaptabilityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type AdaptabilityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalAdaptabilityCenter = {
  dashboard: {
    adaptability_score: number;
    adaptability_health_label: string;
    adaptation_opportunities: number;
    emerging_changes: number;
    strong_adaptability_count: number;
    responsiveness_pct: number;
    learning_integration_pct: number;
    change_readiness_pct: number;
    recovery_flexibility_pct: number;
    leadership_confidence: number;
  } | null;
  change_signals: ChangeSignal[];
  adaptation_opportunities: AdaptationOpportunity[];
  responsiveness_indicators: ResponsivenessIndicator[];
  executive_priorities: ExecutivePriority[];
  adaptation_history: AdaptationHistoryEntry[];
  snapshots: AdaptabilitySnapshot[];
  insights: AdaptabilityInsight[];
  recommendations: AdaptabilityRecommendation[];
  adaptability_reviews: AdaptabilityReview[];
  executive_view: {
    strategic_flexibility: string;
    responsiveness_trends: string;
    learning_integration: string;
    adaptation_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
