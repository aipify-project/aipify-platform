import type { HealthState } from "@/lib/design/semantic-status-system";

export type LegacyHealthStatus = "excellent" | "healthy" | "attention_needed" | "at_risk";
export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export type SuccessMetrics = {
  team_count: number;
  active_users: number;
  business_packs: number;
  active_capabilities: number;
  integrations: number;
  operations_activity: number;
};

export type SuccessOverview = {
  customer_health_score: number;
  adoption_score: number;
  team_engagement_score: number;
  feature_utilization_score: number;
  health_status: LegacyHealthStatus;
  health_state: HealthState;
  risk_level: RiskLevel;
  explanation?: string;
  last_updated_at?: string;
};

export type SuccessRecommendation = {
  id: string;
  key: string;
  priority: string;
  module?: string;
  status?: "open" | "completed" | "in_progress";
};

export type SuccessTimelineEvent = {
  id: string;
  type: string;
  title: string;
  description: string;
  occurred_at: string;
  status?: string;
  href?: string;
};

export type SuccessGrowthOpportunity = {
  key: string;
  available: boolean;
  title_key?: string;
  description_key?: string;
};

export type SuccessAdoptionInsight = {
  key: string;
  label_key: string;
  value: number;
  unit?: "count" | "score";
};

export type SuccessHealthFactor = {
  key: string;
  value: number;
  weight: string;
  impact?: "positive" | "neutral" | "negative";
  action_href?: string;
};

export type SuccessCenterResponse = {
  found: boolean;
  has_activity?: boolean;
  organization_name?: string;
  overview?: SuccessOverview;
  metrics?: SuccessMetrics;
  health_factors?: SuccessHealthFactor[];
  recommendations?: SuccessRecommendation[];
  timeline?: SuccessTimelineEvent[];
  growth_opportunities?: SuccessGrowthOpportunity[];
  adoption_insights?: SuccessAdoptionInsight[];
};

export type SuccessRecommendationsResponse = {
  found: boolean;
  recommendations: SuccessRecommendation[];
  advisory_only?: boolean;
};

export type SuccessCenterLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  breadcrumbSupport: string;
  breadcrumbSuccessCenter: string;
  backToSupport: string;
  purposeSummary: Record<"healthy" | "moderate" | "poor" | "critical", string>;
  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  sections: {
    overview: string;
    recommendations: string;
    timeline: string;
    growth: string;
    adoption: string;
    factors: string;
    understandingScore: string;
    completedRecommendations: string;
  };
  overview: {
    organizationOverview: string;
    healthScore: string;
    adoptionScore: string;
    engagementScore: string;
    utilizationScore: string;
    healthStatus: string;
    riskLevel: string;
    advisory: string;
    lastUpdated: string;
    recommendedNextAction: string;
  };
  scoreExplanations: {
    adoption: string;
    engagement: string;
    utilization: string;
  };
  healthStates: Record<HealthState, string>;
  riskLevels: Record<RiskLevel, string>;
  priorities: Record<string, string>;
  recommendationStatus: Record<string, string>;
  recommendations: Record<
    string,
    { title: string; reason: string; benefit: string; action: string }
  >;
  growth: Record<string, { title: string; description: string; action: string }>;
  adoption: Record<string, string>;
  factors: Record<string, { label: string; impact: string }>;
  factorActions: Record<string, string>;
  timelineStatus: Record<string, string>;
  understandingScore: {
    adoptionTitle: string;
    adoptionBody: string;
    engagementTitle: string;
    engagementBody: string;
    utilizationTitle: string;
    utilizationBody: string;
    methodologyLink: string;
  };
};
