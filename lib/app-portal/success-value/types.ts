export type SuccessCategory =
  | "financial_value"
  | "operational_value"
  | "customer_value"
  | "employee_value"
  | "strategic_value"
  | "productivity_value"
  | "quality_improvement"
  | "risk_reduction"
  | "innovation_value"
  | "custom_value_category";

export type SuccessStatus =
  | "planned"
  | "in_progress"
  | "measuring"
  | "successful"
  | "partially_successful"
  | "did_not_meet_expectations"
  | "archived";

export type SuccessValueLevel =
  | "emerging_value"
  | "moderate_value"
  | "significant_value"
  | "transformational_value";

export type SuccessInitiativeItem = {
  id: string;
  title: string;
  description?: string;
  description_full?: string;
  category: SuccessCategory;
  initiative_owner_id?: string | null;
  initiative_owner_name: string;
  executive_sponsor_id?: string | null;
  executive_sponsor_name: string;
  status: SuccessStatus;
  value_level: SuccessValueLevel;
  expected_outcomes?: string;
  expected_outcomes_full?: string;
  actual_outcomes?: string;
  actual_outcomes_full?: string;
  value_hypothesis?: string;
  value_hypothesis_full?: string;
  measurement_method?: string;
  measurement_method_full?: string;
  start_date?: string | null;
  completion_date?: string | null;
  review_date?: string | null;
  missing_measurement?: boolean;
  goals_achieved?: string;
  goals_missed?: string;
  unexpected_benefits?: string;
  unexpected_consequences?: string;
  recommended_adjustments?: string;
  replication_opportunities?: string;
  lessons_learned?: string;
  notes?: string;
  notes_full?: string;
  created_at: string;
  updated_at: string;
};

export type SuccessValueRecommendation = {
  id: string;
  key: string;
  priority: string;
  initiative_id?: string;
};

export type SuccessDashboard = {
  active: number;
  recently_realized: SuccessInitiativeItem[];
  under_review: number;
  highest_impact: number;
  missing_measurements: number;
  success_trends: SuccessInitiativeItem[];
};

export type SuccessListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: SuccessInitiativeItem[];
  dashboard?: SuccessDashboard;
  recommendations?: SuccessValueRecommendation[];
  principle?: string;
};

export type SuccessDetail = {
  found: boolean;
  can_manage?: boolean;
  initiative?: SuccessInitiativeItem;
  related_decisions?: Array<{ id: string; title: string; status: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  review_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: SuccessValueRecommendation[];
};

export type SuccessValueLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  filters: {
    search: string;
    category: string;
    status: string;
    owner: string;
    sponsor: string;
    valueLevel: string;
    reviewFrom: string;
    reviewTo: string;
    all: string;
  };
  dashboard: {
    active: string;
    recentlyRealized: string;
    underReview: string;
    highestImpact: string;
    missingMeasurements: string;
    successTrends: string;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    category: string;
    valueLevel: string;
    expectedOutcomes: string;
    valueHypothesis: string;
    measurementMethod: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    sponsor: string;
    valueLevel: string;
    expected: string;
    actual: string;
    reviewDate: string;
    view: string;
  };
  detail: {
    overview: string;
    expectedVsActual: string;
    ownership: string;
    outcomeAnalysis: string;
    goalsAchieved: string;
    goalsMissed: string;
    unexpectedBenefits: string;
    unexpectedConsequences: string;
    recommendedAdjustments: string;
    replicationOpportunities: string;
    lessonsLearned: string;
    relatedDecisions: string;
    relatedFollowUps: string;
    reviewTimeline: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
  };
  categories: Record<SuccessCategory, string>;
  statuses: Record<SuccessStatus, string>;
  valueLevels: Record<SuccessValueLevel, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    whyMeasure: string;
    whyMeasureAnswer: string;
    autoDetermine: string;
    autoDetermineAnswer: string;
  };
};
