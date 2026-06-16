export type RiskCategory =
  | "operational"
  | "financial"
  | "security"
  | "compliance"
  | "customer"
  | "vendor"
  | "strategic"
  | "technology"
  | "reputational"
  | "workforce";

export type RiskStatus =
  | "identified"
  | "under_review"
  | "mitigation_in_progress"
  | "monitoring"
  | "accepted"
  | "resolved"
  | "archived";

export type Likelihood = "very_low" | "low" | "moderate" | "high" | "very_high";
export type ImpactLevel = "negligible" | "minor" | "moderate" | "major" | "critical";
export type OverallRiskLevel = "low" | "medium" | "high" | "critical";

import type { ReviewFrequency } from "../responsibilities/types";

export type RiskItem = {
  id: string;
  title: string;
  description: string;
  description_full?: string;
  category: RiskCategory;
  owner_id?: string | null;
  owner_name: string;
  contributor_ids?: string[];
  shared_with_ids?: string[];
  status: RiskStatus;
  likelihood: Likelihood;
  impact: ImpactLevel;
  overall_level: OverallRiskLevel;
  risk_score: number;
  identified_date: string;
  review_frequency?: ReviewFrequency | null;
  next_review_date?: string | null;
  mitigation_strategy?: string;
  mitigation_strategy_full?: string;
  contingency_plan?: string;
  contingency_plan_full?: string;
  related_modules?: string[];
  notes?: string;
  notes_full?: string;
  needs_review?: boolean;
  created_at: string;
  updated_at: string;
};

export type RiskMitigation = {
  id: string;
  action_taken: string;
  effectiveness_review: string;
  residual_likelihood?: Likelihood | null;
  residual_impact?: ImpactLevel | null;
  residual_level?: OverallRiskLevel | null;
  next_review_date?: string | null;
  escalation_required: boolean;
  created_at: string;
  performed_by: string;
};

export type RiskRecommendation = {
  id: string;
  key: string;
  priority: string;
  risk_id?: string;
};

export type RisksDashboard = {
  active: number;
  high_risk: number;
  needs_review: number;
  without_owner: number;
  approaching_review: number;
  recently_resolved: RiskItem[];
};

export type RiskListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: RiskItem[];
  dashboard?: RisksDashboard;
  recommendations?: RiskRecommendation[];
  principle?: string;
};

export type RiskDetail = {
  found: boolean;
  can_manage?: boolean;
  risk?: RiskItem;
  mitigations?: RiskMitigation[];
  contributors?: Array<{ user_id: string; name: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  related_decisions?: Array<{ id: string; title: string; status: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: RiskRecommendation[];
};

export type RisksLabels = {
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
    overallLevel: string;
    recentlyUpdated: string;
    all: string;
    yes: string;
    no: string;
  };
  dashboard: {
    active: string;
    highRisk: string;
    needsReview: string;
    withoutOwner: string;
    approachingReview: string;
    recentlyResolved: string;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    category: string;
    owner: string;
    likelihood: string;
    impact: string;
    mitigationStrategy: string;
    contingencyPlan: string;
    reviewFrequency: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    level: string;
    likelihood: string;
    impact: string;
    nextReview: string;
    view: string;
  };
  detail: {
    overview: string;
    mitigation: string;
    contingency: string;
    mitigations: string;
    contributors: string;
    relatedFollowUps: string;
    relatedDecisions: string;
    activity: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    addMitigation: string;
    actionTaken: string;
    effectivenessReview: string;
    residualLikelihood: string;
    residualImpact: string;
    escalationRequired: string;
    submitMitigation: string;
  };
  categories: Record<RiskCategory, string>;
  statuses: Record<RiskStatus, string>;
  likelihoods: Record<Likelihood, string>;
  impacts: Record<ImpactLevel, string>;
  overallLevels: Record<OverallRiskLevel, string>;
  frequencies: Record<ReviewFrequency, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    howCalculated: string;
    howCalculatedAnswer: string;
    eliminate: string;
    eliminateAnswer: string;
  };
};
