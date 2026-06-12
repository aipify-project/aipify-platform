export type RelationshipProfile = {
  id?: string;
  organization_id?: string;
  category?: string;
  subject_key?: string;
  display_name?: string;
  relationship_strength?: string;
  interaction_frequency?: string;
  sentiment_hint?: string;
  status?: string;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  interaction_count?: number;
  open_insight_count?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type RelationshipInteraction = {
  id?: string;
  profile_id?: string;
  interaction_type?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type RelationshipInsight = {
  id?: string;
  profile_id?: string;
  insight_type?: string;
  category?: string;
  summary?: string;
  recommended_action?: string;
  confidence?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type RelationshipCategoryInfo = {
  key?: string;
  label?: string;
  description?: string;
  context_fields?: string[];
  [key: string]: unknown;
};

export type RelationshipIntelligenceSettings = {
  organization_id?: string;
  enable_insight_generation?: boolean;
  ethical_guardrails_enabled?: boolean;
  notify_on_at_risk?: boolean;
  default_confidence_threshold?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type RelationshipIntelligenceEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  total_profiles?: number;
  open_insights?: number;
  at_risk_profiles?: number;
  [key: string]: unknown;
};

export type RelationshipIntelligenceEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  self_love_note?: string;
  relationship_categories?: RelationshipCategoryInfo[];
  ethical_boundaries?: string[];
  summary?: Record<string, unknown>;
  settings?: RelationshipIntelligenceSettings;
  profiles?: RelationshipProfile[];
  sample_insights?: RelationshipInsight[];
  recent_interactions?: RelationshipInteraction[];
  integration_links?: Record<string, Record<string, unknown>>;
  [key: string]: unknown;
};

export type RelationshipIntelligenceExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: RelationshipIntelligenceSettings;
  summary?: Record<string, unknown>;
  profiles?: RelationshipProfile[];
  insights?: RelationshipInsight[];
  integration_links?: Record<string, Record<string, unknown>>;
  ethical_boundaries?: string[];
  [key: string]: unknown;
};
