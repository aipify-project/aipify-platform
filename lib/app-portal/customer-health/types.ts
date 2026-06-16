export type CustomerHealthStatus =
  | "thriving"
  | "healthy"
  | "stable"
  | "requires_attention"
  | "critical_support_needed";

export type CustomerHealthTrend = "improving" | "stable" | "declining" | "insufficient_data";

export type CustomerHealthPriority = "informational" | "opportunity" | "important" | "high_priority";

export type CustomerHealthRecommendation = {
  id: string;
  key: string;
  priority: CustomerHealthPriority | string;
  category: string;
};

export type CustomerHealthIndicators = {
  platform_engagement: number;
  training_participation: number;
  support_interactions: number;
  adoption_progress: number;
  security_completion: number;
  integration_activity: number;
  recommendation_completion: number;
};

export type CustomerHealthEngagementInsights = {
  active_teams: string[];
  departments_requiring_support: string[];
  underutilized_capabilities: string[];
  positive_momentum: string[];
  declining_activity: string[];
};

export type CustomerHealthSupportInsights = {
  open_requests: number;
  resolved_requests: number;
  resolution_trend: string;
  satisfaction_indicator: number;
  self_service_sessions: number;
  knowledge_engagement: number;
};

export type CustomerHealthTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type CustomerHealthOverview = {
  found: boolean;
  can_manage?: boolean;
  can_admin?: boolean;
  review_started?: boolean;
  overall_health_score?: number;
  engagement_score?: number;
  support_satisfaction_score?: number;
  adoption_score?: number;
  learning_completion_score?: number;
  health_status?: CustomerHealthStatus;
  relationship_trend?: CustomerHealthTrend;
  open_recommendations_count?: number;
  health_indicators?: CustomerHealthIndicators;
  engagement_insights?: CustomerHealthEngagementInsights;
  support_insights?: CustomerHealthSupportInsights;
  recommendations?: CustomerHealthRecommendation[];
  personal_recommendations?: Array<{ id: string; title: string; status: string; due_date?: string | null }>;
  department_reporting?: { department: string; engagement_score: number; learning_participation: number } | null;
  principle?: string;
};

export type CustomerHealthLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    category: string;
    priority: string;
    trend: string;
    periodFrom: string;
    department: string;
    all: string;
  };
  dashboard: {
    overallHealth: string;
    engagement: string;
    supportSatisfaction: string;
    adoption: string;
    learningCompletion: string;
    relationshipTrend: string;
    openRecommendations: string;
    healthStatus: string;
  };
  indicators: {
    title: string;
    platformEngagement: string;
    trainingParticipation: string;
    supportInteractions: string;
    adoptionProgress: string;
    securityCompletion: string;
    integrationActivity: string;
    recommendationCompletion: string;
  };
  engagement: {
    title: string;
    activeTeams: string;
    departmentsSupport: string;
    underutilized: string;
    positiveMomentum: string;
    decliningActivity: string;
  };
  support: {
    title: string;
    openRequests: string;
    resolvedRequests: string;
    resolutionTrend: string;
    satisfaction: string;
    selfService: string;
    knowledgeEngagement: string;
  };
  timeline: { title: string };
  team: { title: string; engagement: string; learning: string };
  statuses: Record<CustomerHealthStatus, string>;
  trends: Record<CustomerHealthTrend, string>;
  priorities: Record<string, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    goodCustomer: string;
    goodCustomerAnswer: string;
    improveOutcomes: string;
    improveOutcomesAnswer: string;
  };
};

export const CUSTOMER_HEALTH_STATUSES: CustomerHealthStatus[] = [
  "thriving", "healthy", "stable", "requires_attention", "critical_support_needed",
];

export const CUSTOMER_HEALTH_TRENDS: CustomerHealthTrend[] = [
  "improving", "stable", "declining", "insufficient_data",
];

export const CUSTOMER_HEALTH_PRIORITIES: CustomerHealthPriority[] = [
  "informational", "opportunity", "important", "high_priority",
];
