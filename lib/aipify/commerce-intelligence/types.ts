export type ProductOpportunity = {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  opportunity_score: number;
  recommendation_type: string;
  recommendation_summary: string;
  trend_confidence: string;
  competition_level: string;
  margin_classification: string;
  store_fit_score?: number | null;
  on_watchlist?: boolean;
};

export type TrendSignal = {
  id: string;
  product_name?: string | null;
  signal_type: string;
  signal_strength: string;
  summary: string;
};

export type MarginCandidate = {
  id: string;
  product_id: string;
  product_name: string;
  estimated_net_margin_percent: number;
  margin_classification: string;
  recommended_price_min: number;
  recommended_price_max: number;
  risk_note?: string | null;
};

export type SupplierInsight = {
  id: string;
  supplier_name: string;
  insight_score: number;
  risk_level: string;
  strengths: string;
  risks?: string | null;
  recommendation: string;
};

export type ProductToAvoid = {
  id: string;
  product_id: string;
  product_name: string;
  opportunity_score: number;
  recommendation_summary: string;
  risk_flags?: Array<{ title: string; explanation: string; severity: string }>;
};

export type SeasonalOpportunity = {
  id: string;
  season_label: string;
  title: string;
  summary: string;
  product_name?: string | null;
};

export type StoreFitRecommendation = {
  id: string;
  product_id: string;
  product_name: string;
  fit_score: number;
  fit_summary: string;
  audience_match?: string | null;
  category_alignment?: string | null;
};

export type CommerceIntelligenceCard = {
  has_customer: boolean;
  intelligence_score?: number;
  opportunities_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type CommerceIntelligenceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_import_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  engine_enabled?: boolean;
  margin_threshold_percent?: number;
  discovery_mode?: string;
  intelligence_score?: number;
  opportunities_count?: number;
  avg_opportunity_score?: number;
  trending_signals?: number;
  products_to_avoid?: number;
  watchlist_count?: number;
  best_opportunities: ProductOpportunity[];
  trending_now: TrendSignal[];
  high_margin_candidates: MarginCandidate[];
  supplier_watchlist: SupplierInsight[];
  products_to_avoid_list: ProductToAvoid[];
  seasonal_opportunities: SeasonalOpportunity[];
  store_fit_recommendations: StoreFitRecommendation[];
  commerce_recommendations: Array<{ id: string; section: string; title: string; summary: string; action_type: string }>;
  discovery_runs: Array<{ id: string; discovery_mode: string; products_found: number; summary?: string; completed_at?: string }>;
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type CommerceActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};

export type CommerceBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
