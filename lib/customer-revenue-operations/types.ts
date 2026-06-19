export type CustomerRevenueOperationsTab =
  | "overview"
  | "pipeline"
  | "revenue"
  | "forecasts"
  | "renewals"
  | "expansion"
  | "partners"
  | "business_packs"
  | "companion"
  | "executive"
  | "reports";

export type PipelineRow = {
  id: string;
  pipeline_key?: string;
  title: string;
  stage?: string;
  record_type?: string;
  revenue_potential?: number;
  source_label?: string;
  summary?: string;
  status?: string;
};

export type CustomerRevenueOperationsCenter = {
  found: boolean;
  principle?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  pipeline_engine?: PipelineRow[];
  revenue_lifecycle?: Record<string, unknown>[];
  subscription_intelligence?: Record<string, unknown>[];
  expansion_engine?: Record<string, unknown>[];
  renewal_operations?: Record<string, unknown>[];
  forecast_engine?: Record<string, unknown>[];
  revenue_health?: Record<string, unknown>;
  growth_partner_intelligence?: Record<string, unknown>[];
  marketing_attribution?: Record<string, unknown>[];
  business_pack_revenue?: Record<string, unknown>[];
  domain_revenue?: Record<string, unknown>[];
  revenue_risk_engine?: Record<string, unknown>[];
  companion_revenue_advisor?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type CustomerRevenueOperationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  accessDenied: string;
  tabs: Record<CustomerRevenueOperationsTab, string>;
  overview: {
    monthlyRevenue: string;
    annualRevenue: string;
    recurringRevenue: string;
    renewalRevenue: string;
    expansionRevenue: string;
    partnerRevenue: string;
    forecastRevenue: string;
    revenueHealthScore: string;
    pipelineOpen: string;
    renewalsDue90d: string;
    expansionOpportunities: string;
    activeRisks: string;
  };
  actions: {
    generateForecast: string;
    createOpportunity: string;
    planRenewal: string;
    identifyExpansion: string;
    detectRisk: string;
    openPipeline: string;
    openRevenueGrowth: string;
  };
  healthStatuses: Record<string, string>;
  riskSeverities: Record<string, string>;
  pipelinePage: { title: string; subtitle: string };
};
