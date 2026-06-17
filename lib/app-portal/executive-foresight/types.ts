export type ForesightCategory =
  | "organizational_growth"
  | "workforce_development"
  | "customer_evolution"
  | "technology_trends"
  | "market_dynamics"
  | "governance_evolution"
  | "competitive_awareness"
  | "operational_resilience"
  | "strategic_innovation"
  | "leadership_development";

export type InsightType =
  | "momentum_gain"
  | "momentum_loss"
  | "dependency"
  | "opportunity"
  | "blind_spot"
  | "leadership_observation";

export type StrategicPriority = "low" | "moderate" | "high" | "strategic";

export type ForesightTimeHorizon =
  | "30_days"
  | "90_days"
  | "6_months"
  | "12_months"
  | "24_months"
  | "36_months";

export type ReviewStatus = "pending" | "in_review" | "reviewed" | "needs_follow_up";

export type MomentumDirection = "gaining" | "stable" | "losing";

export type ForesightObservation = {
  id: string;
  observation_key: string;
  title: string;
  category: ForesightCategory | string;
  insight_type: InsightType | string;
  summary: string;
  strategic_priority: StrategicPriority | string;
  time_horizon: ForesightTimeHorizon | string;
  organizational_area: string;
  executive_owner: string;
  review_status: ReviewStatus | string;
  momentum_direction: MomentumDirection | string;
  last_reviewed_at?: string | null;
  updated_at?: string;
};

export type ForesightInsightItem = { id: string; title: string };

export type RecommendedConversation = { id: string; topic: string };

export type ExecutiveQuestion = { key: string; question: string };

export type ForesightRecommendation = { id: string; key: string };

export type ForesightTimelineEvent = {
  id: string;
  observation_id?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type ForesightReview = {
  id: string;
  review_type: string;
  review_notes: string;
  reviewed_at?: string;
};

export type ExecutiveNote = {
  id: string;
  note_text: string;
  created_at?: string;
};

export type ExecutiveForesightOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  can_note?: boolean;
  has_foresight_data?: boolean;
  executive_outlook_score?: number;
  executive_summary?: string;
  emerging_opportunities?: ForesightInsightItem[];
  emerging_risks?: ForesightInsightItem[];
  strategic_topics_requiring_attention?: ForesightInsightItem[];
  long_term_focus_areas?: ForesightInsightItem[];
  areas_gaining_momentum?: ForesightInsightItem[];
  areas_losing_momentum?: ForesightInsightItem[];
  recommended_conversations?: RecommendedConversation[];
  executive_questions?: ExecutiveQuestion[];
  foresight_advisory_note?: string;
  observations?: ForesightObservation[];
  recommendations?: ForesightRecommendation[];
  principle?: string;
};

export type ExecutiveForesightDetail = ForesightObservation & {
  found: boolean;
  can_review?: boolean;
  can_note?: boolean;
  reviews?: ForesightReview[];
  notes?: ExecutiveNote[];
  advisory_note?: string;
};

export type ExecutiveForesightActionResult = {
  found: boolean;
  message?: string;
  review_id?: string;
  note_id?: string;
};

export type ExecutiveForesightLabels = {
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
    timeHorizon: string;
    strategicPriority: string;
    organizationalArea: string;
    executiveOwner: string;
    reviewStatus: string;
    timePeriod: string;
    all: string;
  };
  dashboard: {
    executiveOutlookScore: string;
    executiveSummary: string;
    emergingOpportunities: string;
    emergingRisks: string;
    strategicTopicsRequiringAttention: string;
    longTermFocusAreas: string;
    areasGainingMomentum: string;
    areasLosingMomentum: string;
    recommendedConversations: string;
    executiveQuestions: string;
    foresightInsights: string;
    observations: string;
    recommendations: string;
    timeline: string;
    longTermPlanning: string;
    viewObservation: string;
  };
  card: {
    category: string;
    insightType: string;
    strategicPriority: string;
    timeHorizon: string;
    executiveOwner: string;
    reviewStatus: string;
    momentum: string;
  };
  detail: {
    back: string;
    reviews: string;
    notes: string;
    reviewNotes: string;
    noteText: string;
    submitReview: string;
    addNote: string;
    reviewSuccess: string;
    noteSuccess: string;
    advisoryNote: string;
  };
  beginReview: {
    success: string;
    governanceNote: string;
  };
  categories: Record<string, string>;
  insightTypes: Record<string, string>;
  strategicPriorities: Record<string, string>;
  timeHorizons: Record<string, string>;
  reviewStatuses: Record<string, string>;
  momentumDirections: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    predictFuture: string;
    predictFutureAnswer: string;
    whoShouldUse: string;
    whoShouldUseAnswer: string;
  };
};

export const FORESIGHT_CATEGORIES: ForesightCategory[] = [
  "organizational_growth", "workforce_development", "customer_evolution",
  "technology_trends", "market_dynamics", "governance_evolution",
  "competitive_awareness", "operational_resilience", "strategic_innovation",
  "leadership_development",
];

export const FORESIGHT_TIME_HORIZONS: ForesightTimeHorizon[] = [
  "30_days", "90_days", "6_months", "12_months", "24_months", "36_months",
];

export const STRATEGIC_PRIORITIES: StrategicPriority[] = [
  "low", "moderate", "high", "strategic",
];

export const REVIEW_STATUSES: ReviewStatus[] = [
  "pending", "in_review", "reviewed", "needs_follow_up",
];

export const ORGANIZATIONAL_AREAS = [
  "executive", "operations", "governance", "learning", "customer",
  "business_packs", "strategy", "risk", "automation", "intelligence",
] as const;
