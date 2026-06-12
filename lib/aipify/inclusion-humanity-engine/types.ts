export type InclusionPrinciple = {
  id?: string;
  principle_key?: string;
  label?: string;
  description?: string;
  sort_order?: number;
  active?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type InappropriateBehaviorGuidance = {
  situation?: string;
  guidance?: string;
  example_phrases?: string[] | unknown[];
  [key: string]: unknown;
};

export type InclusionReflection = {
  id?: string;
  prompt?: string;
  context_summary?: string | null;
  suggested_response?: Record<string, unknown>;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type InclusionHumanitySettings = {
  organization_id?: string;
  enabled?: boolean;
  de_escalation_enabled?: boolean;
  boundary_firmness?: string;
  celebrate_inclusive_wins?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type IncidentsSummary = {
  total_30_days?: number;
  by_type?: Record<string, number>;
  by_status?: Record<string, number>;
  de_escalated_count?: number;
  [key: string]: unknown;
};

export type KcFaqTopic = {
  topic?: string;
  summary?: string;
  [key: string]: unknown;
};

export type InclusionHumanityEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_principles?: number;
  pending_reflections?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type InclusionHumanityEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  communication_principles?: string[];
  inclusion_principles?: InclusionPrinciple[] | Record<string, unknown>[];
  inappropriate_behavior_guidance?: InappropriateBehaviorGuidance[];
  boundary_principles?: string[];
  self_love_note?: string;
  trust_engine_note?: string;
  purpose_values_note?: string;
  kc_faq_topics?: KcFaqTopic[];
  settings?: InclusionHumanitySettings;
  stated_principles?: InclusionPrinciple[];
  recent_incidents_summary?: IncidentsSummary;
  pending_reflections?: InclusionReflection[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type InclusionHumanityExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  settings?: InclusionHumanitySettings;
  communication_principles?: string[];
  inclusion_principles?: InclusionPrinciple[] | Record<string, unknown>[];
  boundary_principles?: string[];
  stated_principles?: InclusionPrinciple[];
  recent_incidents_summary?: IncidentsSummary;
  pending_reflections?: InclusionReflection[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
