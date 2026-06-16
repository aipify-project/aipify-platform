import type { RiskLevel } from "@/lib/aipify/execution/types";

export type InitiativeCategory =
  | "revenue_growth"
  | "customer_experience"
  | "operational_efficiency"
  | "compliance"
  | "risk_reduction"
  | "product_development"
  | "employee_experience"
  | "market_expansion"
  | "cost_optimization"
  | "innovation";

export type PortfolioHealth = "on_track" | "at_risk" | "blocked" | "overdue" | "completed";

export type InitiativePriority = "critical" | "high" | "medium" | "low" | "optional";

export type ConfidenceLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export type InitiativeItem = {
  id: string;
  title: string;
  description?: string;
  category?: InitiativeCategory;
  status?: string;
  portfolio_health?: PortfolioHealth;
  lifecycle_stage?: string;
  priority?: InitiativePriority;
  risk_level?: RiskLevel;
  alignment_score?: number;
  confidence_score?: number;
  confidence_level?: ConfidenceLevel;
  expected_strategic_value?: string;
  owner?: string;
  executive_sponsor?: string | null;
  department?: string;
  business_goal?: string;
  created_at?: string;
  scheduled_for?: string;
  executed_at?: string;
  requires_executive_decision?: boolean;
};

export type PortfolioHealthSummary = {
  on_track: number;
  at_risk: number;
  blocked: number;
  overdue: number;
  completed: number;
};

export type ExecutivePriorityView = {
  top_strategic?: InitiativeItem[];
  highest_risk?: InitiativeItem[];
  highest_value?: InitiativeItem[];
  most_delayed?: InitiativeItem[];
  executive_decisions?: InitiativeItem[];
};

export type PortfolioRiskAnalysis = {
  high_risk_concentration: number;
  unresolved_blockers: number;
  missing_owners: number;
  unclear_outcomes: number;
  low_confidence: number;
};

export type StrategicInitiativePortfolio = {
  found: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  portfolio_health_summary?: PortfolioHealthSummary;
  executive_priority?: ExecutivePriorityView;
  risk_analysis?: PortfolioRiskAnalysis;
  active?: InitiativeItem[];
  awaiting_approval?: InitiativeItem[];
  in_execution?: InitiativeItem[];
  blocked?: InitiativeItem[];
  completed?: InitiativeItem[];
  cancelled?: InitiativeItem[];
  executive_priority_list?: InitiativeItem[];
  principle?: string;
};

export type StrategicAlignment = {
  business_goal: string;
  department: string;
  executive_sponsor?: string | null;
  alignment_score: number;
  expected_strategic_value: string;
  confidence_level: ConfidenceLevel;
  confidence_score: number;
};

export type DecisionSupport = {
  why_it_matters: string;
  if_succeeds: string;
  if_fails: string;
  if_delayed: string;
  who_involved: string[];
  decision_needed_now: string;
};

export type ResourceAwareness = {
  required_teams: string[];
  required_roles: string[];
  estimated_workload: string;
  capacity_concerns: string[];
  overloaded_owners: string[];
};

export type InitiativeDetail = {
  found: boolean;
  initiative?: InitiativeItem;
  portfolio_health?: PortfolioHealth;
  strategic_alignment?: StrategicAlignment;
  timeline?: {
    planned_start?: string;
    actual_start?: string;
    estimated_completion?: string;
    actual_completion?: string;
    schedule_deviation_hours?: number;
  };
  expected_outcome?: string;
  actual_outcome?: string | null;
  linked_actions?: Array<{ id: string; title: string; status: string; relationship: string }>;
  linked_approvals?: Array<Record<string, unknown>>;
  linked_risks?: Array<{ key: string; label: string; level: string }>;
  linked_dependencies?: Array<{ id?: string; type: string; label: string; status: string; resolved: boolean }>;
  resource_awareness?: ResourceAwareness;
  decision_support?: DecisionSupport;
  portfolio_risk?: {
    has_unresolved_blockers: boolean;
    missing_owner: boolean;
    unclear_outcome: boolean;
    low_confidence: boolean;
  };
  audit_trail?: Array<{
    id: string;
    event_type: string;
    event_description: string;
    performed_by?: string;
    created_at: string;
  }>;
  principle?: string;
};

export type PortfolioDashboardWidget = {
  id: string;
  titleKey: keyof StrategicInitiativePortfolioLabels["widgets"];
  items: InitiativeItem[];
};

export type StrategicInitiativePortfolioLabels = {
  centerTitle: string;
  centerSubtitle: string;
  tabImpact: string;
  tabApprovals: string;
  tabExecution: string;
  tabPortfolio: string;
  humanOversight: string;
  sections: {
    dashboard: string;
    categories: string;
    alignment: string;
    health: string;
    executive: string;
    details: string;
    riskAnalysis: string;
    resources: string;
    decisionSupport: string;
    learning: string;
    knowledgeCenter: string;
    audit: string;
  };
  categories: Record<InitiativeCategory, string>;
  health: Record<PortfolioHealth, string>;
  priority: { level: string; levels: Record<InitiativePriority, string> };
  confidence: {
    level: string;
    disclaimer: string;
    levels: Record<ConfidenceLevel, string>;
  };
  widgets: {
    active: string;
    awaitingApproval: string;
    inExecution: string;
    blocked: string;
    completed: string;
    cancelled: string;
    executivePriority: string;
    empty: string;
    viewInitiative: string;
  };
  executive: {
    topStrategic: string;
    highestRisk: string;
    highestValue: string;
    mostDelayed: string;
    executiveDecisions: string;
    healthSummary: string;
  };
  healthSummary: {
    onTrack: string;
    atRisk: string;
    blocked: string;
    overdue: string;
    completed: string;
  };
  riskAnalysis: {
    title: string;
    highRiskConcentration: string;
    unresolvedBlockers: string;
    missingOwners: string;
    unclearOutcomes: string;
    lowConfidence: string;
  };
  alignment: {
    businessGoal: string;
    department: string;
    executiveSponsor: string;
    alignmentScore: string;
    expectedValue: string;
  };
  details: {
    owner: string;
    timeline: string;
    plannedStart: string;
    estimatedCompletion: string;
    expectedOutcome: string;
    actualOutcome: string;
    linkedActions: string;
    linkedApprovals: string;
    linkedRisks: string;
    linkedDependencies: string;
  };
  resources: {
    requiredTeams: string;
    requiredRoles: string;
    estimatedWorkload: string;
    capacityConcerns: string;
    overloadedOwners: string;
  };
  decisionSupport: {
    title: string;
    whyItMatters: string;
    ifSucceeds: string;
    ifFails: string;
    ifDelayed: string;
    whoInvolved: string;
    decisionNeeded: string;
  };
  learning: {
    intro: string;
    expectedResult: string;
    actualResult: string;
    timelineAccuracy: string;
    businessImpact: string;
    lessonsLearned: string;
    improvements: string;
    submit: string;
    submitted: string;
  };
  faq: {
    title: string;
    whatIsInitiative: string;
    whatIsInitiativeAnswer: string;
    howPrioritize: string;
    howPrioritizeAnswer: string;
    whatIsAlignment: string;
    whatIsAlignmentAnswer: string;
    portfolioHealth: string;
    portfolioHealthAnswer: string;
    whoOwns: string;
    whoOwnsAnswer: string;
    howEstimateRisk: string;
    howEstimateRiskAnswer: string;
    canAipifyDecide: string;
    canAipifyDecideAnswer: string;
  };
  empty: string;
  principle: string;
  actions: { back: string };
};
