export type CapacityIndicator = {
  capacity_key: string;
  domain: string;
  label: string;
  value_label: string;
  trend: string;
};

export type EnergyPattern = {
  pattern_key: string;
  pattern_type: string;
  message: string;
  priority: string;
  status: string;
};

export type RecoveryOpportunity = {
  recovery_key: string;
  label: string;
  guidance: string;
  priority: string;
  status: string;
};

export type LoadTrend = {
  trend_key: string;
  label: string;
  load_pct: number;
  period_label: string;
};

export type EnergyTimelineEvent = {
  timeline_key: string;
  event_type: string;
  label: string;
  summary: string;
  recorded_at: string | null;
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

export type EnergyReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalEnergyCenter = {
  dashboard: {
    energy_score: number;
    energy_health_label: string;
    capacity_indicators: number;
    recovery_opportunities: number;
    focus_alerts: number;
    initiative_load_pct: number;
    review_intensity_pct: number;
    change_saturation_pct: number;
    recovery_headroom: number;
    leadership_confidence: number;
  } | null;
  capacity_indicators: CapacityIndicator[];
  energy_patterns: EnergyPattern[];
  recovery_opportunities: RecoveryOpportunity[];
  load_trends: LoadTrend[];
  timeline: EnergyTimelineEvent[];
  snapshots: EnergySnapshot[];
  insights: EnergyInsight[];
  recommendations: EnergyRecommendation[];
  energy_reviews: EnergyReview[];
  executive_view: {
    leadership_demand: string;
    strategic_pacing: string;
    recovery_opportunities: string;
    sustainable_execution: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
