export type HostsPropertyHealthSectionKey =
  | "portfolio_overview"
  | "property_scores"
  | "open_risks"
  | "recommended_actions";

export type HostsPropertyHealthInputs = {
  occupancy_status: number;
  guest_satisfaction: number;
  cleaning_completion: number;
  maintenance_status: number;
  incident_history: number;
  inspection_results: number;
  supply_readiness: number;
  access_readiness: number;
  document_readiness: number;
};

export type HostsPropertyScoreRow = {
  id: string;
  score_key: string;
  property_id: string;
  property: string;
  overall_score: number;
  score_level: string;
  score_trend: number;
  guest_experience_score: number;
  operations_score: number;
  safety_score: number;
  maintenance_score: number;
  finance_score: number;
  compliance_score: number;
  inputs: HostsPropertyHealthInputs;
  top_strengths: string[];
  computed_at: string;
};

export type HostsPropertyHealthRiskRow = {
  id: string;
  risk_key: string;
  property_id: string;
  property: string;
  risk_indicator: string;
  severity: string;
  summary: string;
  is_resolved: boolean;
  unresolved_since: string;
  hours_unresolved: number;
};

export type HostsPropertyHealthRecommendationRow = {
  id: string;
  recommendation_key: string;
  property_id: string;
  property: string;
  action_summary: string;
  action_category: string;
  priority: string;
  is_completed: boolean;
};

export type HostsPropertyHealthStats = {
  overall_score: number;
  portfolio_level: string;
  excellent_count: number;
  good_count: number;
  attention_count: number;
  critical_count: number;
  open_risks: number;
  pending_actions: number;
  avg_score_trend: number;
};

export type HostsPropertyHealthTrendPoint = {
  date: string;
  score: number;
  level: string;
};

export type HostsPropertyHealthDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  selected_property_id: string | null;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  score_levels: string[];
  stats: HostsPropertyHealthStats;
  score_trend: HostsPropertyHealthTrendPoint[];
  top_strengths: string[];
  property_scores: HostsPropertyScoreRow[];
  open_risks: HostsPropertyHealthRiskRow[];
  recommended_actions: HostsPropertyHealthRecommendationRow[];
  property_detail: HostsPropertyScoreRow | null;
};

export type HostsPropertyHealthActionResult = {
  success: boolean;
  action_type?: string;
  summary?: string;
};
