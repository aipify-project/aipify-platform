export type GrowthEvolutionDimensionKey =
  | "operational"
  | "knowledge"
  | "human"
  | "customer"
  | "strategic";

export type GrowthEvolutionSignal = {
  id?: string;
  dimension?: GrowthEvolutionDimensionKey | string;
  signal_type?: string;
  summary?: string;
  trend_direction?: string;
  confidence?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type GrowthEvolutionRecommendation = {
  id?: string;
  dimension?: GrowthEvolutionDimensionKey | string;
  title?: string;
  summary?: string;
  evidence_summary?: string;
  trade_offs?: string;
  risk_level?: string;
  status?: string;
  requires_review?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type GrowthEvolutionSettings = {
  organization_id?: string;
  enabled?: boolean;
  focus_dimensions?: string[];
  learning_cycle_cadence?: string;
  celebrate_progress?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type GrowthDimension = {
  key?: string;
  label?: string;
  description?: string;
  examples?: string[];
  [key: string]: unknown;
};

export type LearningCycleStep = {
  step?: number;
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type EvolutionCapability = {
  key?: string;
  label?: string;
  description?: string;
  example_phrases?: string[];
  [key: string]: unknown;
};

export type GrowthEvolutionEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  pending_recommendations?: number;
  recent_signals?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type GrowthEvolutionEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  self_love_note?: string;
  proactive_companion_note?: string;
  trust_engine_note?: string;
  growth_dimensions?: GrowthDimension[];
  learning_cycle_steps?: LearningCycleStep[];
  evolution_capabilities?: EvolutionCapability[];
  settings?: GrowthEvolutionSettings;
  recent_signals?: GrowthEvolutionSignal[];
  pending_recommendations?: GrowthEvolutionRecommendation[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type GrowthEvolutionExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  settings?: GrowthEvolutionSettings;
  growth_dimensions?: GrowthDimension[];
  learning_cycle_steps?: LearningCycleStep[];
  evolution_capabilities?: EvolutionCapability[];
  recent_signals?: GrowthEvolutionSignal[];
  recommendations?: GrowthEvolutionRecommendation[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
