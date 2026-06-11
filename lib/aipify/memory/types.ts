export const MEMORY_SCOPES = ["user", "team", "tenant"] as const;
export type MemoryScope = (typeof MEMORY_SCOPES)[number];

export type MemoryProfile = {
  id: string;
  scope_level: string;
  profile_key: string;
  profile_value: Record<string, unknown>;
  explanation?: string | null;
  source_module: string;
  confidence: number;
  last_observed_at: string;
};

export type MemoryPattern = {
  id: string;
  scope_level: string;
  pattern_type: string;
  title: string;
  description: string;
  frequency_count: number;
  confidence: number;
  explanation?: string | null;
  last_seen_at: string;
};

export type MemoryRecommendation = {
  id: string;
  recommendation_type: string;
  title: string;
  summary: string;
  rationale: string;
  action_url?: string | null;
  priority_score: number;
  status: string;
  created_at: string;
};

export type MemoryEngineCard = {
  has_customer: boolean;
  enabled?: boolean;
  auto_learn?: boolean;
  profile_count?: number;
  pattern_count?: number;
  recommendations?: MemoryRecommendation[];
  privacy_note?: string;
  philosophy?: string;
};

export type MemorySettings = {
  enabled: boolean;
  auto_learn: boolean;
  include_user_preferences: boolean;
  include_team_patterns: boolean;
  include_tenant_rules: boolean;
  explainability_required: boolean;
  governance_review_required: boolean;
  retention_days: number;
  excluded_categories: string[];
  max_profiles_per_user: number;
  max_patterns: number;
};

export type NormalizedMemoryObservation = {
  source_module: string;
  source_type: string;
  observation_key: string;
  summary: string;
  scope_level?: MemoryScope;
  metadata?: Record<string, unknown>;
  observed_at?: string;
};
