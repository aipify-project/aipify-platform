export type CommerceStore = {
  id?: string;
  store_key?: string;
  store_name?: string;
  platform?: string;
  domain?: string;
  country?: string;
  language?: string;
  currency?: string;
  status?: string;
  performance_label?: string;
  portfolio_id?: string | null;
  [key: string]: unknown;
};

export type CommerceProduct = {
  id?: string;
  product_key?: string;
  name?: string;
  category?: string;
  supplier_cost?: number;
  recommended_price_min?: number;
  recommended_price_max?: number;
  currency?: string;
  [key: string]: unknown;
};

export type CommerceSupplier = {
  id?: string;
  supplier_key?: string;
  supplier_name?: string;
  reliability_score?: number;
  lead_time_days?: number;
  [key: string]: unknown;
};

export type CommerceProductOpportunity = {
  id?: string;
  opportunity_score?: number;
  recommendation_type?: string;
  recommendation_summary?: string;
  margin_classification?: string;
  status?: string;
  [key: string]: unknown;
};

export type CommercePlatform = {
  id?: string;
  platform_key?: string;
  status?: string;
  [key: string]: unknown;
};

export type CommerceAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type CommerceRetailOperationsCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  industry_packs_route?: string;
  commerce_intelligence_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  settings?: Record<string, unknown>;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  stores?: CommerceStore[];
  products?: CommerceProduct[];
  suppliers?: CommerceSupplier[];
  product_opportunities?: CommerceProductOpportunity[];
  platforms?: CommercePlatform[];
  portfolios?: Array<Record<string, unknown>>;
  advisor_signals?: CommerceAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  legacy_module_cross_links?: Array<{ key?: string; route?: string }>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
