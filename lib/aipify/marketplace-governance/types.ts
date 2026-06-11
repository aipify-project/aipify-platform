export type GovernanceScore = {
  id: string;
  entity_type: string;
  entity_name: string;
  governance_score: number;
  risk_level: string;
  trust_band?: string;
  trust_band_label?: string;
  recommendation?: string | null;
};

export type QualityIncident = {
  id: string;
  incident_type: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  requires_approval?: boolean;
  created_at?: string;
};

export type FraudAlert = {
  id: string;
  alert_type: string;
  title: string;
  description: string;
  severity: string;
  status: string;
};

export type SupplierScore = {
  supplier_name: string;
  supplier_type: string;
  status: string;
  overall_score?: number;
  delivery_reliability?: number;
  product_consistency?: number;
};

export type PolicyRule = {
  id: string;
  rule_key: string;
  title: string;
  description: string;
  rule_type: string;
  threshold_value?: number | null;
  status: string;
};

export type QualityRecommendation = {
  id: string;
  title: string;
  description: string;
  recommendation_type: string;
  priority: string;
  status: string;
};

export type RootCauseReport = {
  id: string;
  summary: string;
  potential_cause: string;
  created_at?: string;
};

export type MarketplaceGovernanceCard = {
  has_customer: boolean;
  governance_score?: number;
  open_incidents?: number;
  open_fraud_alerts?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type MarketplaceGovernanceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  automated_actions_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  governance_score?: number;
  governance_band?: string;
  governance_band_label?: string;
  refund_rate_pct?: number;
  customer_satisfaction?: number;
  support_burden?: number;
  incident_frequency?: number;
  fraud_risk_score?: number;
  supplier_performance?: number;
  governance_scores: GovernanceScore[];
  quality_incidents: QualityIncident[];
  fraud_alerts: FraudAlert[];
  supplier_scores: SupplierScore[];
  policy_rules: PolicyRule[];
  recommendations: QualityRecommendation[];
  root_cause_reports: RootCauseReport[];
  pre_publish_controls?: string[];
  post_publish_monitoring?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type MarketplaceGovernanceActionResult = {
  status?: string;
  human_oversight_required?: boolean;
  error?: string;
};

export type MarketplaceGovernanceBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
