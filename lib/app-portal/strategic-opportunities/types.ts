export type OpportunityCategory =
  | "revenue_growth"
  | "customer_experience"
  | "operational_efficiency"
  | "cost_optimization"
  | "employee_experience"
  | "market_expansion"
  | "product_innovation"
  | "strategic_partnerships"
  | "automation_opportunities"
  | "knowledge_opportunities"
  | "process_improvements"
  | "sustainability_initiatives";

export type OpportunityStatus =
  | "identified"
  | "under_review"
  | "approved"
  | "planning"
  | "in_progress"
  | "completed"
  | "archived";

export type StrategicPriority = "low" | "moderate" | "high" | "strategic";
export type EstimatedImpact   = "low" | "moderate" | "high" | "transformational";
export type EstimatedComplexity = "low" | "moderate" | "high" | "very_high";
export type OrgReadiness       = "not_ready" | "low" | "moderate" | "high";
export type ReviewPriority     = "low" | "normal" | "high" | "immediate";

export type OpportunityTimeHorizon =
  | "30_days"
  | "90_days"
  | "6_months"
  | "12_months"
  | "24_months"
  | "36_months";

export type OpportunityCard = {
  id: string;
  opportunity_key: string;
  title: string;
  description: string;
  category: OpportunityCategory | string;
  status: OpportunityStatus | string;
  strategic_priority: StrategicPriority | string;
  estimated_impact: EstimatedImpact | string;
  estimated_complexity: EstimatedComplexity | string;
  organizational_readiness: OrgReadiness | string;
  cross_department_influence?: boolean;
  recommended_review_priority: ReviewPriority | string;
  leadership_owner: string;
  potential_value: string;
  estimated_effort: string;
  related_departments?: string[];
  suggested_next_steps?: string[];
  time_horizon: OpportunityTimeHorizon | string;
  last_reviewed_at?: string | null;
  updated_at?: string;
};

export type OpportunityReview = {
  id: string;
  review_notes: string;
  new_status?: string;
  reviewed_at?: string;
};

export type OpportunityInsightItem = { id: string; title: string };
export type OpportunityRecommendation = { id: string; key: string };

export type OpportunityTimelineEvent = {
  id: string;
  opportunity_id?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type StrategicOpportunitiesOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  can_create?: boolean;
  has_opportunity_data?: boolean;
  opportunity_health_score?: number;
  executive_summary?: string;
  high_potential_opportunities?: OpportunityInsightItem[];
  opportunities_requiring_exploration?: OpportunityInsightItem[];
  opportunities_under_review?: OpportunityInsightItem[];
  opportunities_in_progress?: OpportunityInsightItem[];
  opportunities_realized?: OpportunityInsightItem[];
  advisory_note?: string;
  opportunities?: OpportunityCard[];
  recommendations?: OpportunityRecommendation[];
  principle?: string;
};

export type OpportunityDetail = OpportunityCard & {
  found: boolean;
  can_review?: boolean;
  can_create?: boolean;
  reviews?: OpportunityReview[];
  supporting_observations?: string[];
  advisory_note?: string;
};

export type OpportunityActionResult = {
  found: boolean;
  opportunity_id?: string;
  message?: string;
};

export type StrategicOpportunitiesLabels = {
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
    status: string;
    department: string;
    strategicPriority: string;
    executiveOwner: string;
    timeHorizon: string;
    all: string;
  };
  dashboard: {
    healthScore: string;
    executiveSummary: string;
    highPotential: string;
    requiresExploration: string;
    underReview: string;
    inProgress: string;
    realized: string;
    opportunities: string;
    recommendations: string;
    timeline: string;
    reviewQuestions: string;
    viewOpportunity: string;
    addOpportunity: string;
    updateStatus: string;
  };
  card: {
    category: string;
    status: string;
    strategicPriority: string;
    estimatedImpact: string;
    estimatedComplexity: string;
    orgReadiness: string;
    reviewPriority: string;
    owner: string;
    timeHorizon: string;
    potentialValue: string;
    estimatedEffort: string;
  };
  detail: {
    back: string;
    scorecard: string;
    nextSteps: string;
    relatedDepartments: string;
    reviewHistory: string;
    reviewNotes: string;
    newStatus: string;
    submitReview: string;
    reviewSuccess: string;
    advisoryNote: string;
  };
  create: {
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    success: string;
  };
  categories: Record<string, string>;
  statuses: Record<string, string>;
  strategicPriorities: Record<string, string>;
  estimatedImpacts: Record<string, string>;
  estimatedComplexities: Record<string, string>;
  orgReadiness: Record<string, string>;
  reviewPriorities: Record<string, string>;
  timeHorizons: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  reviewQuestions: string[];
  faq: {
    title: string;
    whatAre: string;
    whatAreAnswer: string;
    autoImplement: string;
    autoImplementAnswer: string;
    whoShouldUse: string;
    whoShouldUseAnswer: string;
  };
};

export const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  "revenue_growth","customer_experience","operational_efficiency",
  "cost_optimization","employee_experience","market_expansion",
  "product_innovation","strategic_partnerships","automation_opportunities",
  "knowledge_opportunities","process_improvements","sustainability_initiatives",
];

export const OPPORTUNITY_STATUSES: OpportunityStatus[] = [
  "identified","under_review","approved","planning","in_progress","completed","archived",
];

export const STRATEGIC_PRIORITIES: StrategicPriority[] = ["low","moderate","high","strategic"];
export const ESTIMATED_IMPACTS: EstimatedImpact[]       = ["low","moderate","high","transformational"];
export const ESTIMATED_COMPLEXITIES: EstimatedComplexity[] = ["low","moderate","high","very_high"];

export const OPPORTUNITY_TIME_HORIZONS: OpportunityTimeHorizon[] = [
  "30_days","90_days","6_months","12_months","24_months","36_months",
];
