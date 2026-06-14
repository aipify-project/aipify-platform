export type DomainMetric = {
  metric_key: string;
  domain: string;
  label: string;
  value_label: string;
  trend: string;
  status: string;
};

export type ServiceSignal = {
  signal_key: string;
  service_name: string;
  signal_type: string;
  availability_pct: number;
  status: string;
  last_checked_at: string | null;
};

export type ObservabilityAlert = {
  alert_key: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  domain: string | null;
  created_at: string | null;
};

export type EventCorrelation = {
  correlation_key: string;
  summary: string;
  confidence: string;
  systems_involved: string[];
  status: string;
};

export type Investigation = {
  investigation_key: string;
  title: string;
  impact_assessment: string;
  timeline_summary: string;
  recovery_recommendation: string;
  status: string;
};

export type ObservabilityFeed = {
  feed_key: string;
  feed_type: string;
  message: string;
  occurred_at: string | null;
};

export type ObservabilityInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ObservabilityRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ObservabilityReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type ExecutiveObservabilityView = {
  organizational_impact: string;
  service_reliability: string;
  operational_maturity: string;
  customer_experience_trend: string;
  strategic_implication: string;
};

export type PlatformObservabilityCenter = {
  dashboard: {
    platform_health_score: number;
    platform_health_band: string;
    critical_alerts: number;
    open_alerts: number;
    service_availability_pct: number;
    degraded_services: number;
    self_healing_events: number;
    mean_time_to_understanding_minutes: number;
    incident_detection_speed_minutes: number;
    alert_usefulness_score: number;
    operational_confidence: number;
    executive_trust_score: number;
  } | null;
  domain_metrics: DomainMetric[];
  service_signals: ServiceSignal[];
  alerts: ObservabilityAlert[];
  correlations: EventCorrelation[];
  investigations: Investigation[];
  feeds: ObservabilityFeed[];
  insights: ObservabilityInsight[];
  recommendations: ObservabilityRecommendation[];
  governance_reviews: ObservabilityReview[];
  executive_view: ExecutiveObservabilityView | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
