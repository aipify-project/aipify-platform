export type HostsExpansionModuleKey =
  | "property_opportunity_scanner"
  | "property_evaluation_engine"
  | "market_intelligence_center"
  | "portfolio_performance_engine"
  | "expansion_readiness_score"
  | "scenario_simulation_lab"
  | "competitive_positioning_engine"
  | "executive_growth_dashboard"
  | "investment_decision_playbooks"
  | "hospitality_strategic_knowledge";

export type HostsExpansionModule = {
  key: HostsExpansionModuleKey;
  label: string;
  description: string;
};

export type HostsExpansionPlaybook = {
  key: string;
  label: string;
  steps: string[];
};

export type HostsExpansionOpportunity = {
  key: string;
  label: string;
  score: number;
  type: "market" | "property" | "optimization" | string;
};

export type HostsGrowthSnapshot = {
  expansion_readiness_score: number;
  opportunity_score: number;
  portfolio_quality_index: number;
  markets_on_watchlist: number;
  underperforming_properties: number;
};

export type HostsExecutiveMetric = {
  key: string;
  label: string;
  value: string | number;
};

export type AipifyHostsExpansionIntelligenceDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  property_count: number;
  human_oversight_required: boolean;
  positioning: string;
  vision: string;
  modules: HostsExpansionModule[];
  playbooks: HostsExpansionPlaybook[];
  simulation_examples: string[];
  governance: {
    principle: string;
    approval_required: boolean;
    audit_required: boolean;
    recommendations_only: boolean;
  };
  success_metrics: { key: string; label: string }[];
  knowledge_categories: string[];
  growth_snapshot: HostsGrowthSnapshot;
  opportunities: HostsExpansionOpportunity[];
  executive_questions: string[];
  executive_metrics: HostsExecutiveMetric[];
};

export type AipifyHostsExpansionIntelligenceCard = {
  has_customer: boolean;
  enabled?: boolean;
  package_key?: string;
  property_count?: number;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};
