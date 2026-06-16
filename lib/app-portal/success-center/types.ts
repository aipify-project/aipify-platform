export type HealthStatus = "excellent" | "healthy" | "attention_needed" | "at_risk";
export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export type SuccessOverview = {
  customer_health_score: number;
  adoption_score: number;
  team_engagement_score: number;
  feature_utilization_score: number;
  health_status: HealthStatus;
  risk_level: RiskLevel;
};

export type SuccessRecommendation = {
  id: string;
  key: string;
  priority: string;
  module?: string;
};

export type SuccessTimelineEvent = {
  id: string;
  type: string;
  title: string;
  description: string;
  occurred_at: string;
};

export type SuccessCenterResponse = {
  found: boolean;
  has_activity?: boolean;
  organization_name?: string;
  overview?: SuccessOverview;
  health_factors?: Array<{ key: string; value: number; weight: string }>;
  recommendations?: SuccessRecommendation[];
  timeline?: SuccessTimelineEvent[];
  growth_opportunities?: Array<{ key: string; available: boolean }>;
  adoption_insights?: Array<{ key: string; label_key: string; value: number }>;
  principle?: string;
};

export type SuccessRecommendationsResponse = {
  found: boolean;
  recommendations: SuccessRecommendation[];
  advisory_only?: boolean;
};

export type SuccessCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  emptyTitle: string;
  emptyBody: string;
  principle: string;
  sections: {
    overview: string;
    recommendations: string;
    timeline: string;
    growth: string;
    adoption: string;
    factors: string;
  };
  overview: {
    healthScore: string;
    adoptionScore: string;
    engagementScore: string;
    utilizationScore: string;
    healthStatus: string;
    riskLevel: string;
    advisory: string;
  };
  healthStatuses: Record<HealthStatus, string>;
  riskLevels: Record<RiskLevel, string>;
  recommendations: Record<string, string>;
  growth: Record<string, string>;
  adoption: Record<string, string>;
  factors: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    healthScore: string;
    healthScoreAnswer: string;
    predictRisk: string;
    predictRiskAnswer: string;
  };
};
