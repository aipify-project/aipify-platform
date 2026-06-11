export type ProfitIntelligenceItem = {
  id: string;
  report_type: string;
  title: string;
  summary: string;
  observation: string;
  impact_level: string;
};

export type ProductProfitability = {
  id: string;
  product_key: string;
  product_name: string;
  category: string;
  revenue_contribution: number;
  gross_margin_percent: number;
  net_margin_percent?: number | null;
  profit_contribution_percent: number;
  profit_classification: string;
  seasonal_pattern?: string | null;
};

export type CustomerValueSignal = {
  id: string;
  observation_type: string;
  title: string;
  summary: string;
  trend_direction: string;
};

export type RevenueTrend = {
  id: string;
  period_label: string;
  revenue_amount: number;
  profit_amount: number;
  margin_percent: number;
  trend_signal: string;
  summary: string;
};

export type PerformanceOpportunity = {
  id: string;
  opportunity_type: string;
  title: string;
  summary: string;
  rationale: string;
  priority: string;
};

export type LossPreventionEvent = {
  id: string;
  event_type: string;
  title: string;
  summary: string;
  severity: string;
  resolved?: boolean;
};

export type StrategicRecommendation = {
  id: string;
  section: string;
  title: string;
  summary: string;
  recommendation_type: string;
  priority: string;
  rationale: string;
};

export type CommercePerformanceCard = {
  has_customer: boolean;
  performance_score?: number;
  performance_classification?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type CommercePerformanceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_actions_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  engine_enabled?: boolean;
  margin_alert_threshold?: number;
  performance_score?: number;
  performance_classification?: string;
  total_revenue?: number;
  estimated_profit?: number;
  avg_net_margin_percent?: number;
  open_risks?: number;
  opportunity_count?: number;
  products_tracked?: number;
  profit_risk_products?: number;
  profit_intelligence: ProfitIntelligenceItem[];
  product_profitability: ProductProfitability[];
  customer_value_signals: CustomerValueSignal[];
  revenue_trends: RevenueTrend[];
  performance_opportunities: PerformanceOpportunity[];
  loss_prevention: LossPreventionEvent[];
  strategic_recommendations: StrategicRecommendation[];
  executive_reports: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type CommercePerformanceActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};

export type CommercePerformanceBriefingResult = {
  report_id?: string;
  summary?: string;
  error?: string;
};
