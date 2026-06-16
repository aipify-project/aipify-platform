export type CultureDimension =
  | "trust"
  | "collaboration"
  | "communication"
  | "recognition"
  | "accountability"
  | "inclusion"
  | "psychological_safety"
  | "leadership_confidence"
  | "organizational_alignment"
  | "learning_mindset";

export type CultureTrendDirection = "improving" | "stable" | "declining" | "insufficient_data";

export type CheckInFrequency = "weekly" | "monthly" | "quarterly" | "on_demand";

export type QuestionType = "rating_scale" | "multiple_choice" | "free_text" | "agreement_scale";

export type DimensionAggregate = {
  dimension: CultureDimension;
  score: number | null;
  response_count: number;
  suppressed: boolean;
  trend_direction: CultureTrendDirection;
  anonymity_note?: string;
};

export type CultureSnapshot = {
  culture_score: number | null;
  trust_score: number | null;
  participation_rate: number;
  participation_count: number;
  eligible_count: number;
  trend_direction: CultureTrendDirection;
  improvement_momentum: string;
  areas_requiring_attention: DimensionAggregate[];
  anonymity_threshold: number;
};

export type CultureCheckIn = {
  id: string;
  title: string;
  frequency: CheckInFrequency;
  status: string;
  starts_at?: string;
  ends_at?: string | null;
  questions?: Array<{ id: string; dimension: string; type: string; text: string }>;
  voluntary_note?: string;
  created_at?: string;
};

export type CultureRecommendation = {
  id: string;
  key: string;
  priority: string;
  dimension?: string;
};

export type CultureOverviewResponse = {
  found: boolean;
  can_manage?: boolean;
  snapshot?: CultureSnapshot;
  dimensions?: DimensionAggregate[];
  check_ins?: CultureCheckIn[];
  recommendations?: CultureRecommendation[];
  principle?: string;
  privacy_note?: string;
};

export type CultureDimensionDetail = {
  found: boolean;
  can_manage?: boolean;
  dimension?: DimensionAggregate;
  historical_trends?: Array<{ period: string; score: number; response_count: number }>;
  participation_history?: Array<{ check_in_id: string; title: string; response_count: number }>;
  strengths?: Array<{ id: string; text: string }>;
  improvement_opportunities?: Array<{ id: string; text: string }>;
  recommended_actions?: CultureRecommendation[];
  review_history?: Array<{ id: string; event_type: string; description: string; created_at: string }>;
  privacy_note?: string;
};

export type TrustCultureLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  privacyNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  accessDenied: string;
  filters: {
    dimension: string;
    periodFrom: string;
    periodTo: string;
    department: string;
    trend: string;
    all: string;
  };
  snapshot: {
    cultureScore: string;
    trustScore: string;
    participationRate: string;
    trendDirection: string;
    improvementMomentum: string;
    areasAttention: string;
    suppressed: string;
  };
  dashboard: {
    trustIndicators: string;
    collaborationIndicators: string;
    communicationIndicators: string;
    recognitionTrends: string;
    psychologicalSafetyTrends: string;
    leadershipConfidenceTrends: string;
    checkIns: string;
  };
  checkIn: {
    launchTitle: string;
    title: string;
    description: string;
    frequency: string;
    submit: string;
    cancel: string;
    voluntaryNote: string;
    submitResponse: string;
    responseThanks: string;
  };
  detail: {
    historicalTrends: string;
    participationHistory: string;
    strengths: string;
    improvementOpportunities: string;
    recommendedActions: string;
    reviewHistory: string;
    recommendations: string;
  };
  dimensions: Record<CultureDimension, string>;
  trends: Record<CultureTrendDirection, string>;
  frequencies: Record<CheckInFrequency, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    anonymous: string;
    anonymousAnswer: string;
    goodCulture: string;
    goodCultureAnswer: string;
  };
};

export const CULTURE_DIMENSIONS: CultureDimension[] = [
  "trust", "collaboration", "communication", "recognition", "accountability",
  "inclusion", "psychological_safety", "leadership_confidence",
  "organizational_alignment", "learning_mindset",
];
