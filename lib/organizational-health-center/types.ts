export type HealthDomainScore = {
  domain_key: string;
  score: number;
  health_band: string;
  trend_direction: string;
  summary: string;
  updated_at: string | null;
};

export type HealthIndicator = {
  indicator_key: string;
  domain_key: string;
  title: string;
  message: string;
  trend_direction: string;
};

export type HealthInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type HealthRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type HealthEarlyWarning = {
  warning_key: string;
  category: string;
  message: string;
  severity: string;
  status: string;
};

export type HealthReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  scheduled_for: string | null;
  completed_at: string | null;
};

export type HealthTimelineEvent = {
  event_key: string;
  period_label: string;
  event_type: string;
  summary: string;
};

export type OrganizationalHealthCenter = {
  dashboard: {
    overall_health_score: number;
    overall_health_band: string;
    domains_improving: number;
    domains_needing_attention: number;
    open_warnings: number;
    reviews_pending: number;
    executive_confidence: number;
    review_completion_rate: number;
    recommendation_usefulness: number;
    leadership_satisfaction: number;
  } | null;
  domain_scores: HealthDomainScore[];
  indicators: HealthIndicator[];
  insights: HealthInsight[];
  recommendations: HealthRecommendation[];
  early_warnings: HealthEarlyWarning[];
  health_reviews: HealthReview[];
  timeline: HealthTimelineEvent[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
