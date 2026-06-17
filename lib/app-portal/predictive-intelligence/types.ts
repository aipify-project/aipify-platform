export type PredictionCategory =
  | "operational"
  | "capacity"
  | "strategic"
  | "customer_success"
  | "learning"
  | "governance"
  | "risk"
  | "business_pack";

export type ConfidenceLevel =
  | "exploratory"
  | "emerging_pattern"
  | "moderate_confidence"
  | "high_confidence";

export type TimeHorizon =
  | "next_30_days"
  | "next_quarter"
  | "next_6_months"
  | "next_12_months";

export type PotentialImpact = "low" | "moderate" | "high" | "critical";

export type ReviewStatus = "pending" | "reviewed" | "needs_follow_up";

export type OutcomeReviewResult =
  | "confirmed"
  | "partially_confirmed"
  | "not_observed"
  | "insufficient_evidence";

export type PredictionCard = {
  id: string;
  prediction_key: string;
  title: string;
  category: PredictionCategory | string;
  summary: string;
  confidence_level: ConfidenceLevel | string;
  time_horizon: TimeHorizon | string;
  potential_impact: PotentialImpact | string;
  organizational_area: string;
  review_status: ReviewStatus | string;
  recommended_actions?: string[];
  related_areas?: string[];
  last_reviewed_at?: string | null;
  generated_at?: string;
};

export type EarlyWarning = {
  id: string;
  warning_key: string;
  title: string;
  signal_type: string;
  description: string;
  severity: string;
  organizational_area: string;
};

export type PredictionInsightItem = {
  id: string;
  title: string;
};

export type PredictiveRecommendation = {
  id: string;
  key: string;
};

export type PredictiveTimelineEvent = {
  id: string;
  prediction_id?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type OutcomeReview = {
  id: string;
  outcome: OutcomeReviewResult | string;
  review_notes: string;
  reviewed_at?: string;
};

export type PredictiveOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_generate?: boolean;
  can_review?: boolean;
  has_predictive_data?: boolean;
  forecast_summary?: string;
  executive_summary?: string;
  emerging_opportunities?: PredictionInsightItem[];
  emerging_risks?: PredictionInsightItem[];
  areas_requiring_attention?: PredictionInsightItem[];
  predictive_confidence_note?: string;
  predictions?: PredictionCard[];
  early_warnings?: EarlyWarning[];
  recommendations?: PredictiveRecommendation[];
  principle?: string;
};

export type PredictiveDetail = PredictionCard & {
  found: boolean;
  can_review?: boolean;
  outcome_reviews?: OutcomeReview[];
  probability_note?: string;
};

export type PredictiveReviewResult = {
  found: boolean;
  review_id?: string;
  prediction_id?: string;
  outcome?: string;
  message?: string;
};

export type PredictiveIntelligenceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  probabilityNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    category: string;
    confidenceLevel: string;
    timeHorizon: string;
    organizationalArea: string;
    potentialImpact: string;
    reviewStatus: string;
    timePeriod: string;
    all: string;
  };
  dashboard: {
    forecastSummary: string;
    executiveSummary: string;
    emergingOpportunities: string;
    emergingRisks: string;
    areasRequiringAttention: string;
    confidenceLevels: string;
    preventiveActions: string;
    predictions: string;
    earlyWarnings: string;
    recommendations: string;
    timeline: string;
    viewPrediction: string;
  };
  card: {
    category: string;
    confidence: string;
    timeHorizon: string;
    impact: string;
    relatedAreas: string;
    lastReviewed: string;
    recommendedActions: string;
  };
  detail: {
    back: string;
    outcomeReview: string;
    reviewNotes: string;
    submitReview: string;
    reviewSuccess: string;
    probabilityNote: string;
    priorReviews: string;
  };
  generate: {
    success: string;
    governanceNote: string;
  };
  categories: Record<string, string>;
  confidenceLevels: Record<string, string>;
  timeHorizons: Record<string, string>;
  impactLevels: Record<string, string>;
  reviewStatuses: Record<string, string>;
  outcomes: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    predictFuture: string;
    predictFutureAnswer: string;
    whyReview: string;
    whyReviewAnswer: string;
  };
};

export const PREDICTION_CATEGORIES: PredictionCategory[] = [
  "operational", "capacity", "strategic", "customer_success",
  "learning", "governance", "risk", "business_pack",
];

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = [
  "exploratory", "emerging_pattern", "moderate_confidence", "high_confidence",
];

export const TIME_HORIZONS: TimeHorizon[] = [
  "next_30_days", "next_quarter", "next_6_months", "next_12_months",
];

export const IMPACT_LEVELS: PotentialImpact[] = ["low", "moderate", "high", "critical"];

export const REVIEW_STATUSES: ReviewStatus[] = ["pending", "reviewed", "needs_follow_up"];

export const OUTCOME_RESULTS: OutcomeReviewResult[] = [
  "confirmed", "partially_confirmed", "not_observed", "insufficient_evidence",
];

export const ORGANIZATIONAL_AREAS = [
  "executive", "operations", "governance", "learning", "customer",
  "business_packs", "strategy", "risk", "automation", "intelligence",
] as const;
