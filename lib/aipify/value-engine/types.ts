export const VALUE_CATEGORIES = [
  "time_saved",
  "support_efficiency",
  "quality",
  "knowledge",
  "automation",
  "risk_reduction",
  "productivity",
  "operational",
] as const;

export const REPORT_TYPES = ["weekly", "monthly", "quarterly", "annual", "custom"] as const;

export type RoiSettings = {
  tenant_id: string;
  support_hourly_rate: number;
  admin_hourly_rate: number;
  management_hourly_rate: number;
  default_hourly_rate: number;
  currency: string;
  enabled: boolean;
};

export type ValueEvent = {
  id: string;
  source_module: string;
  event_type: string;
  category: string;
  estimated_time_saved_minutes: number;
  estimated_value?: number | null;
  evidence?: Record<string, unknown>;
  evidence_ref?: string | null;
  created_at?: string;
};

export type ImpactScore = {
  id: string;
  overall_score: number;
  time_saved_score: number;
  support_score: number;
  quality_score: number;
  knowledge_score: number;
  automation_score: number;
  governance_score: number;
  productivity_score: number;
  operational_score: number;
  trend_delta?: number | null;
  evidence_summary?: Record<string, unknown>;
  generated_at?: string;
};

export type ValueEngineCard = {
  has_customer: boolean;
  impact_score?: number;
  trend_delta?: number | null;
  minutes_saved_30d?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type ValueTimelinePoint = {
  month: string;
  minutes_saved: number;
  event_count: number;
};

export type MarketplaceImpact = {
  pack: string;
  item_key: string;
  minutes_saved: number;
  status: string;
};

export type BlueprintImpact = {
  blueprint_title?: string | null;
  industry_category?: string | null;
  applied_components?: number;
};

export type ValueEngineDashboard = {
  has_customer: boolean;
  impact_score?: ImpactScore;
  roi_enabled?: boolean;
  minutes_saved_30d?: number;
  estimated_value_30d?: number | null;
  currency?: string;
  timeline: ValueTimelinePoint[];
  marketplace_impact: MarketplaceImpact[];
  blueprint_impact?: BlueprintImpact | null;
  category_scores?: Record<string, number>;
};

export type ValueReport = {
  id: string;
  report_type: string;
  title: string;
  summary?: string | null;
  generated_at?: string;
  payload?: Record<string, unknown>;
};

export type ValueOpportunity = {
  type: string;
  title: string;
  summary: string;
  priority: string;
  evidence: string;
};
