export type ForecastCategory =
  | "workforce_growth"
  | "customer_growth"
  | "revenue_development"
  | "support_demand"
  | "operational_capacity"
  | "knowledge_growth"
  | "department_expansion"
  | "resource_requirements"
  | "training_requirements"
  | "organizational_complexity";

export type ConfidenceLevel = "low" | "moderate" | "high";
export type TrendDirection  = "improving" | "stable" | "declining" | "emerging";
export type ReviewStatus    = "pending" | "in_review" | "reviewed" | "needs_follow_up";

export type ForecastTimeHorizon =
  | "30_days" | "90_days" | "6_months"
  | "12_months" | "24_months" | "36_months";

export type ForecastCard = {
  id: string;
  forecast_key: string;
  title: string;
  description: string;
  category: ForecastCategory | string;
  forecast_area: string;
  current_state: string;
  projected_state_conservative: string;
  projected_state_expected: string;
  projected_state_optimistic: string;
  confidence_level: ConfidenceLevel | string;
  time_horizon: ForecastTimeHorizon | string;
  trend_direction: TrendDirection | string;
  review_status: ReviewStatus | string;
  leadership_owner: string;
  recommended_action: string;
  last_reviewed_at?: string | null;
  updated_at?: string;
};

export type CapacityAssessment = {
  id: string;
  area: string;
  current_capacity: string;
  estimated_future_capacity: string;
  potential_bottlenecks: string[];
  operational_constraints: string[];
  requires_attention: boolean;
};

export type TrendItem = { id: string; title: string; category?: string };

export type ForecastReview = {
  id: string;
  review_notes: string;
  reviewed_at?: string;
};

export type ForecastTimelineEvent = {
  id: string;
  forecast_id?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type OrgForecastingOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  has_forecast_data?: boolean;
  organizational_forecast_score?: number;
  executive_summary?: string;
  growth_forecast?: ForecastCard;
  capacity_forecast?: ForecastCard;
  workforce_forecast?: ForecastCard;
  customer_forecast?: ForecastCard;
  revenue_forecast?: ForecastCard;
  support_forecast?: ForecastCard;
  improving_trends?: TrendItem[];
  stable_trends?: TrendItem[];
  declining_trends?: TrendItem[];
  emerging_trends?: TrendItem[];
  capacity_assessments?: CapacityAssessment[];
  forecasts?: ForecastCard[];
  advisory_note?: string;
  principle?: string;
};

export type ForecastDetail = ForecastCard & {
  found: boolean;
  can_review?: boolean;
  reviews?: ForecastReview[];
  advisory_note?: string;
};

export type ForecastActionResult = {
  found: boolean;
  message?: string;
  review_id?: string;
};

export type OrgForecastingLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  advisoryNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    category: string;
    department: string;
    timeHorizon: string;
    confidenceLevel: string;
    executiveOwner: string;
    reviewStatus: string;
    all: string;
  };
  dashboard: {
    forecastScore: string;
    executiveSummary: string;
    growthForecast: string;
    capacityForecast: string;
    workforceForecast: string;
    customerForecast: string;
    revenueForecast: string;
    supportForecast: string;
    improvingTrends: string;
    stableTrends: string;
    decliningTrends: string;
    emergingTrends: string;
    capacityView: string;
    forecasts: string;
    timeline: string;
    reviewQuestions: string;
    viewForecast: string;
    beginReview: string;
  };
  forecastCard: {
    currentState: string;
    conservative: string;
    expected: string;
    optimistic: string;
    confidence: string;
    timeHorizon: string;
    trend: string;
    owner: string;
    recommendedAction: string;
  };
  capacityCard: {
    currentCapacity: string;
    estimatedFuture: string;
    bottlenecks: string;
    constraints: string;
    requiresAttention: string;
  };
  detail: {
    back: string;
    models: string;
    reviewHistory: string;
    reviewNotes: string;
    submitReview: string;
    reviewSuccess: string;
    advisoryNote: string;
  };
  beginReview: {
    success: string;
    governanceNote: string;
  };
  categories: Record<string, string>;
  confidenceLevels: Record<string, string>;
  trendDirections: Record<string, string>;
  reviewStatuses: Record<string, string>;
  timeHorizons: Record<string, string>;
  timelineEvents: Record<string, string>;
  reviewQuestions: string[];
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    guaranteed: string;
    guaranteedAnswer: string;
    whoShouldUse: string;
    whoShouldUseAnswer: string;
  };
};

export const FORECAST_CATEGORIES: ForecastCategory[] = [
  "workforce_growth","customer_growth","revenue_development","support_demand",
  "operational_capacity","knowledge_growth","department_expansion",
  "resource_requirements","training_requirements","organizational_complexity",
];

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = ["low","moderate","high"];
export const TREND_DIRECTIONS: TrendDirection[]    = ["improving","stable","declining","emerging"];
export const REVIEW_STATUSES: ReviewStatus[]       = ["pending","in_review","reviewed","needs_follow_up"];

export const FORECAST_TIME_HORIZONS: ForecastTimeHorizon[] = [
  "30_days","90_days","6_months","12_months","24_months","36_months",
];
