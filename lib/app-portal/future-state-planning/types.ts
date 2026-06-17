export type FutureStateCategory =
  | "organizational_growth" | "leadership_evolution" | "workforce_development"
  | "customer_experience" | "market_expansion" | "operational_excellence"
  | "technology_advancement" | "governance_maturity" | "business_innovation"
  | "enterprise_transformation";

export type FutureStateStatus =
  | "draft" | "active" | "under_review" | "on_track" | "at_risk" | "completed" | "archived";

export type PlanningHorizon = "1_year" | "3_years" | "5_years" | "10_years" | "custom";
export type StrategicPriority = "low" | "moderate" | "high" | "strategic";
export type MilestoneStatus = "planned" | "completed" | "delayed" | "upcoming";

export type FutureStatePlan = {
  id: string;
  plan_key: string;
  title: string;
  description: string;
  category: FutureStateCategory | string;
  status: FutureStateStatus | string;
  time_horizon: PlanningHorizon | string;
  custom_horizon_label?: string;
  current_state: string;
  desired_future_state: string;
  vision_statement: string;
  desired_outcomes?: unknown[];
  strategic_priorities?: unknown[];
  executive_sponsors?: unknown[];
  departments_involved?: unknown[];
  estimated_timeline: string;
  key_dependencies?: unknown[];
  risks?: unknown[];
  opportunities?: unknown[];
  success_indicators?: unknown[];
  strategic_objectives?: unknown[];
  initiatives?: unknown[];
  progress_score: number;
  alignment_score: number;
  completeness_score: number;
  executive_owner: string;
  department: string;
  strategic_priority: StrategicPriority | string;
  review_date?: string | null;
  next_review_date?: string | null;
  last_reviewed_at?: string | null;
  updated_at?: string;
};

export type FutureStateMilestone = {
  id: string;
  plan_id?: string;
  plan_title?: string;
  milestone_key?: string;
  title: string;
  description?: string;
  status: MilestoneStatus | string;
  target_date?: string | null;
  success_indicator?: string;
  owner?: string;
};

export type FutureStateAlignment = {
  id: string;
  department: string;
  current_alignment: number;
  target_alignment: number;
  progress: number;
  owner: string;
  review_date?: string | null;
};

export type FutureStateReview = {
  id: string;
  review_notes: string;
  reviewed_at?: string;
};

export type FutureStateRecommendation = { id: string; key: string };

export type FutureStateTimelineEvent = {
  id: string;
  plan_id?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type FutureStateBriefing = {
  found: boolean;
  current_position?: string;
  future_state_vision?: string;
  progress_status?: string;
  key_opportunities?: unknown[];
  key_risks?: unknown[];
  recommended_actions?: FutureStateRecommendation[];
  next_review_date?: string | null;
  advisory_note?: string;
};

export type FutureStatePlanningOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_create?: boolean;
  can_review?: boolean;
  has_plan_data?: boolean;
  future_state_readiness_score?: number;
  strategic_alignment_score?: number;
  future_state_progress_score?: number;
  planning_completeness_score?: number;
  executive_summary?: string;
  active_plans?: { id: string; title: string }[];
  upcoming_reviews?: { id: string; title: string; date?: string }[];
  plans?: FutureStatePlan[];
  recommendations?: FutureStateRecommendation[];
  advisory_note?: string;
  principle?: string;
};

export type FutureStatePlanDetail = FutureStatePlan & {
  found: boolean;
  can_create?: boolean;
  can_review?: boolean;
  milestones?: FutureStateMilestone[];
  alignment?: FutureStateAlignment[];
  reviews?: FutureStateReview[];
  advisory_note?: string;
};

export type FutureStateActionResult = {
  found: boolean;
  plan_id?: string;
  message?: string;
};

export type FutureStatePlanningLabels = {
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
    strategicPriority: string;
    timeHorizon: string;
    executiveOwner: string;
    status: string;
    all: string;
  };
  dashboard: {
    readinessScore: string;
    alignmentScore: string;
    progressScore: string;
    completenessScore: string;
    executiveSummary: string;
    activePlans: string;
    upcomingReviews: string;
    allPlans: string;
    recommendations: string;
    milestones: string;
    timeline: string;
    briefing: string;
    alignmentView: string;
    blueprint: string;
    planningQuestions: string;
    viewPlan: string;
    createPlan: string;
  };
  blueprint: {
    visionStatement: string;
    desiredOutcomes: string;
    strategicPriorities: string;
    executiveSponsors: string;
    departmentsInvolved: string;
    estimatedTimeline: string;
    keyDependencies: string;
    risks: string;
    opportunities: string;
    currentState: string;
    desiredFutureState: string;
    strategicObjectives: string;
    initiatives: string;
    successIndicators: string;
    reviewSchedule: string;
  };
  alignment: {
    department: string;
    currentAlignment: string;
    targetAlignment: string;
    progress: string;
    owner: string;
    reviewDate: string;
  };
  milestone: {
    planned: string;
    completed: string;
    delayed: string;
    upcoming: string;
    successIndicator: string;
    owner: string;
    targetDate: string;
  };
  briefing: {
    currentPosition: string;
    futureVision: string;
    progressStatus: string;
    keyOpportunities: string;
    keyRisks: string;
    recommendedActions: string;
    nextReviewDate: string;
  };
  detail: {
    back: string;
    blueprint: string;
    alignment: string;
    milestones: string;
    reviewHistory: string;
    advisoryNote: string;
  };
  create: {
    title: string;
    description: string;
    category: string;
    horizon: string;
    vision: string;
    submit: string;
    success: string;
  };
  categories: Record<string, string>;
  statuses: Record<string, string>;
  horizons: Record<string, string>;
  priorities: Record<string, string>;
  milestoneStatuses: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  planningQuestions: string[];
  successIndicators: string[];
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    createsStrategy: string;
    createsStrategyAnswer: string;
    whoShouldUse: string;
    whoShouldUseAnswer: string;
  };
};

export const FUTURE_STATE_CATEGORIES: FutureStateCategory[] = [
  "organizational_growth","leadership_evolution","workforce_development",
  "customer_experience","market_expansion","operational_excellence",
  "technology_advancement","governance_maturity","business_innovation",
  "enterprise_transformation",
];

export const PLANNING_HORIZONS: PlanningHorizon[] = [
  "1_year","3_years","5_years","10_years","custom",
];

export const FUTURE_STATE_STATUSES: FutureStateStatus[] = [
  "draft","active","under_review","on_track","at_risk","completed","archived",
];

export const STRATEGIC_PRIORITIES: StrategicPriority[] = [
  "low","moderate","high","strategic",
];

export const MILESTONE_STATUSES: MilestoneStatus[] = [
  "planned","completed","delayed","upcoming",
];
