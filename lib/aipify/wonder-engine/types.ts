export type WonderMomentTypeInfo = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type WonderReflectionPromptExample = {
  key?: string;
  prompt?: string;
  context?: string;
  [key: string]: unknown;
};

export type WonderBoundaries = {
  principle?: string;
  should_avoid?: string[] | unknown[];
  [key: string]: unknown;
};

export type WonderMoment = {
  id?: string;
  moment_type?: string;
  title?: string;
  summary?: string;
  significance_note?: string | null;
  acknowledged?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type WonderReflection = {
  id?: string;
  prompt?: string;
  context_summary?: string | null;
  status?: string;
  suggested_pause_note?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type WonderEngineSettings = {
  organization_id?: string;
  enabled?: boolean;
  wonder_moments_enabled?: boolean;
  reflection_prompts_enabled?: boolean;
  celebration_cadence?: string;
  authenticity_guardrails?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type WonderEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  moment_count?: number;
  pending_reflections?: number;
  unacknowledged_moments?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type WonderEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  moments_of_wonder_types?: WonderMomentTypeInfo[];
  reflection_prompt_examples?: WonderReflectionPromptExample[];
  self_love_note?: string;
  impact_note?: string;
  legacy_note?: string;
  companion_note?: string;
  boundaries?: WonderBoundaries;
  settings?: WonderEngineSettings;
  recent_moments?: WonderMoment[];
  pending_reflections?: WonderReflection[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type WonderEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  moments_of_wonder_types?: WonderMomentTypeInfo[];
  reflection_prompt_examples?: WonderReflectionPromptExample[];
  self_love_note?: string;
  impact_note?: string;
  legacy_note?: string;
  companion_note?: string;
  boundaries?: WonderBoundaries;
  settings?: WonderEngineSettings;
  recent_moments?: WonderMoment[];
  pending_reflections?: WonderReflection[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
