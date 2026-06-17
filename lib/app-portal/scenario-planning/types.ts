export type ScenarioCategory =
  | "strategic"
  | "operational"
  | "capacity"
  | "market"
  | "governance"
  | "risk";

export type ScenarioType = "best_case" | "expected" | "challenging" | "custom";

export type PlanningStatus = "draft" | "active" | "simulated" | "reviewed" | "archived";

export type ScenarioTimeHorizon =
  | "next_30_days"
  | "next_quarter"
  | "next_6_months"
  | "next_12_months";

export type ScenarioCard = {
  id: string;
  scenario_key: string;
  title: string;
  category: ScenarioCategory | string;
  scenario_type: ScenarioType | string;
  summary: string;
  assumptions?: string[];
  variables?: string[];
  projected_outcomes?: string[];
  organizational_area: string;
  planning_status: PlanningStatus | string;
  confidence_level?: string;
  time_horizon: ScenarioTimeHorizon | string;
  last_simulated_at?: string | null;
  updated_at?: string;
};

export type ScenarioSimulation = {
  id: string;
  simulation_key: string;
  title: string;
  summary: string;
  outcome_summary: string;
  risk_notes?: string[];
  opportunity_notes?: string[];
  simulated_at?: string;
};

export type ScenarioComparison = {
  id: string;
  comparison_key: string;
  title: string;
  comparison_summary: string;
  scenario_ids?: string[];
};

export type ScenarioInsightItem = {
  id: string;
  title: string;
};

export type ScenarioRecommendation = {
  id: string;
  key: string;
};

export type ScenarioTimelineEvent = {
  id: string;
  scenario_id?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type ScenarioOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_simulate?: boolean;
  can_compare?: boolean;
  can_review?: boolean;
  has_scenario_data?: boolean;
  planning_summary?: string;
  executive_summary?: string;
  strategic_priorities?: ScenarioInsightItem[];
  risk_scenarios?: ScenarioInsightItem[];
  simulation_isolation_note?: string;
  simulation_lab_route?: string;
  scenarios?: ScenarioCard[];
  comparisons?: ScenarioComparison[];
  recommendations?: ScenarioRecommendation[];
  principle?: string;
};

export type ScenarioDetail = ScenarioCard & {
  found: boolean;
  can_simulate?: boolean;
  can_review?: boolean;
  simulations?: ScenarioSimulation[];
  isolation_note?: string;
};

export type ScenarioActionResult = {
  found: boolean;
  message?: string;
  simulation_id?: string;
  comparison_id?: string;
  scenario_id?: string;
};

export type ScenarioPlanningLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  isolationNote: string;
  simulationLabLink: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    category: string;
    scenarioType: string;
    planningStatus: string;
    timeHorizon: string;
    organizationalArea: string;
    timePeriod: string;
    all: string;
  };
  dashboard: {
    planningSummary: string;
    executiveSummary: string;
    strategicPriorities: string;
    riskScenarios: string;
    scenarios: string;
    comparisons: string;
    recommendations: string;
    timeline: string;
    viewScenario: string;
    runSimulation: string;
    compareScenarios: string;
    markReviewed: string;
  };
  card: {
    category: string;
    scenarioType: string;
    planningStatus: string;
    timeHorizon: string;
    lastSimulated: string;
    assumptions: string;
    variables: string;
    projectedOutcomes: string;
  };
  detail: {
    back: string;
    simulations: string;
    outcomeSummary: string;
    riskNotes: string;
    opportunityNotes: string;
    reviewNotes: string;
    submitReview: string;
    reviewSuccess: string;
    simulateSuccess: string;
    isolationNote: string;
  };
  initialize: {
    success: string;
    governanceNote: string;
  };
  categories: Record<string, string>;
  scenarioTypes: Record<string, string>;
  planningStatuses: Record<string, string>;
  timeHorizons: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    executesActions: string;
    executesActionsAnswer: string;
    whoCanAccess: string;
    whoCanAccessAnswer: string;
  };
};

export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  "strategic", "operational", "capacity", "market", "governance", "risk",
];

export const SCENARIO_TYPES: ScenarioType[] = [
  "best_case", "expected", "challenging", "custom",
];

export const PLANNING_STATUSES: PlanningStatus[] = [
  "draft", "active", "simulated", "reviewed", "archived",
];

export const SCENARIO_TIME_HORIZONS: ScenarioTimeHorizon[] = [
  "next_30_days", "next_quarter", "next_6_months", "next_12_months",
];

export const ORGANIZATIONAL_AREAS = [
  "executive", "operations", "governance", "learning", "customer",
  "business_packs", "strategy", "risk", "automation", "intelligence",
] as const;
