export type StoreSummary = {
  id: string;
  store_key: string;
  store_name: string;
  platform_type: string;
  brand_group?: string | null;
  region: string;
  ownership_label?: string | null;
  status_level: string;
  revenue_amount: number;
  profit_margin_percent?: number | null;
  performance_score?: number | null;
};

export type CrossStoreInsight = {
  id: string;
  insight_type: string;
  title: string;
  summary: string;
  affected_stores?: string[];
  trend_direction: string;
};

export type ProductSyncGuidance = {
  id: string;
  product_key: string;
  product_name: string;
  source_store_key: string;
  target_store_keys?: string[];
  recommendation_summary: string;
  rationale: string;
  requires_approval?: boolean;
};

export type OpportunityDistribution = {
  id: string;
  opportunity_type: string;
  title: string;
  summary: string;
  applicable_stores?: string[];
  rationale: string;
  priority: string;
};

export type GovernanceCoordination = {
  id: string;
  coordination_type: string;
  title: string;
  summary: string;
  consistency_level: string;
  affected_stores?: string[];
  recommendation: string;
};

export type RegionalExpansion = {
  id: string;
  region_key: string;
  region_name: string;
  readiness_score: number;
  readiness_status: string;
  localization_notes?: string | null;
  market_observation: string;
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

export type PortfolioNotification = {
  id: string;
  title: string;
  message: string;
  priority: string;
};

export type MultiStoreOrchestrationCard = {
  has_customer: boolean;
  portfolio_score?: number;
  portfolio_classification?: string;
  stores_connected?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type MultiStoreOrchestrationDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_sync_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  orchestration_enabled?: boolean;
  portfolio_score?: number;
  portfolio_classification?: string;
  stores_connected?: number;
  portfolio_revenue?: number;
  avg_profit_margin_percent?: number;
  stores_needing_attention?: number;
  opportunity_count?: number;
  governance_gaps?: number;
  regions_tracked?: number;
  store_summaries: StoreSummary[];
  cross_store_insights: CrossStoreInsight[];
  product_sync_guidance: ProductSyncGuidance[];
  opportunity_distributions: OpportunityDistribution[];
  governance_coordination: GovernanceCoordination[];
  regional_expansion: RegionalExpansion[];
  strategic_recommendations: StrategicRecommendation[];
  portfolio_notifications: PortfolioNotification[];
  executive_reports: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type MultiStoreActionResult = {
  status?: string;
  error?: string;
  requires_approval?: boolean;
  [key: string]: unknown;
};

export type MultiStoreBriefingResult = {
  report_id?: string;
  summary?: string;
  error?: string;
};
