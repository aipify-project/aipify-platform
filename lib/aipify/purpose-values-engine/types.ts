export type OrganizationStatedValue = {
  id?: string;
  value_key?: string;
  label?: string;
  description?: string;
  operational_hints?: string[] | unknown[];
  sort_order?: number;
  active?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ValuesAlignmentSignal = {
  id?: string;
  value_key?: string;
  signal_type?: string;
  summary?: string;
  alignment_score?: number | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type ValuesReflection = {
  id?: string;
  prompt?: string;
  context_summary?: string | null;
  suggested_considerations?: string[] | unknown[];
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type PurposeValuesSettings = {
  organization_id?: string;
  enabled?: boolean;
  purpose_statement?: string | null;
  purpose_questions?: string[] | unknown[];
  celebrate_value_aligned_wins?: boolean;
  reflection_enabled?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type PurposeFrameworkItem = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ExampleValue = {
  value_key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ValuesAssistanceExample = {
  value_key?: string;
  example?: string;
  [key: string]: unknown;
};

export type DecisionSupportExample = {
  prompt?: string;
  consideration?: string;
  [key: string]: unknown;
};

export type PurposeValuesEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_values?: number;
  pending_reflections?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type PurposeValuesEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  purpose_framework?: PurposeFrameworkItem[];
  example_values?: ExampleValue[];
  values_aware_assistance_examples?: ValuesAssistanceExample[];
  decision_support_examples?: DecisionSupportExample[];
  culture_support_areas?: string[];
  self_love_note?: string;
  trust_engine_note?: string;
  growth_evolution_note?: string;
  settings?: PurposeValuesSettings;
  stated_values?: OrganizationStatedValue[];
  recent_signals?: ValuesAlignmentSignal[];
  pending_reflections?: ValuesReflection[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PurposeValuesExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: PurposeValuesSettings;
  purpose_framework?: PurposeFrameworkItem[];
  stated_values?: OrganizationStatedValue[];
  recent_signals?: ValuesAlignmentSignal[];
  pending_reflections?: ValuesReflection[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
