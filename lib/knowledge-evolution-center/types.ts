export type KnowledgeAsset = {
  asset_key: string;
  domain: string;
  title: string;
  summary: string;
  lifecycle_stage: string;
  health_status: string;
  usage_count: number;
  days_since_review: number;
  validation_status: string;
};

export type ReviewQueueItem = {
  review_key: string;
  asset_key: string | null;
  review_type: string;
  message: string;
  priority: string;
  status: string;
};

export type VersionHistoryItem = {
  version_key: string;
  asset_key: string;
  version_label: string;
  contributor_label: string;
  change_summary: string;
  approval_status: string;
  recorded_at: string | null;
};

export type SmeAssignment = {
  assignment_key: string;
  asset_key: string;
  sme_label: string;
  validation_type: string;
  status: string;
};

export type EvolutionInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type EvolutionRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type GovernanceReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type DomainMetric = {
  metric_key: string;
  domain: string;
  label: string;
  value_label: string;
  health_status: string;
};

export type LifecycleStage = {
  stage: string;
  label: string;
};

export type KnowledgeEvolutionCenter = {
  dashboard: {
    total_assets: number;
    articles_requiring_review: number;
    outdated_indicators: number;
    recently_improved: number;
    knowledge_health_score: number;
    knowledge_health_label: string;
    review_completion_pct: number;
    search_effectiveness_pct: number;
    utilization_rate_pct: number;
    user_satisfaction: number;
    executive_trust_indicator: number;
  } | null;
  domain_metrics: DomainMetric[];
  assets: KnowledgeAsset[];
  review_queue: ReviewQueueItem[];
  version_history: VersionHistoryItem[];
  sme_assignments: SmeAssignment[];
  insights: EvolutionInsight[];
  recommendations: EvolutionRecommendation[];
  governance_reviews: GovernanceReview[];
  executive_view: {
    knowledge_maturity: string;
    risk_indicators: string;
    validation_participation: string;
    improvement_momentum: string;
  } | null;
  search_optimization: {
    discoverability_score: number;
    related_recommendations_enabled: boolean;
    summary: string;
  } | null;
  knowledge_lifecycle: LifecycleStage[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
