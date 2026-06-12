export type HopeContextInfo = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type HopeExamplePhrase = {
  phrase?: string;
  intent?: string;
  [key: string]: unknown;
};

export type HopeBoundaryPhrases = {
  avoid?: string[] | unknown[];
  prefer?: string[] | unknown[];
  [key: string]: unknown;
};

export type HopeSignal = {
  id?: string;
  context_type?: string;
  summary?: string;
  encouragement_note?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type HopeReflection = {
  id?: string;
  prompt?: string;
  balanced_message?: string | null;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type HopeEngineSettings = {
  organization_id?: string;
  enabled?: boolean;
  realistic_encouragement_enabled?: boolean;
  highlight_progress?: boolean;
  balance_with_self_love?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type HopeEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  signal_count?: number;
  pending_reflections?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type HopeEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  when_hope_matters?: HopeContextInfo[];
  communication_principles?: string[];
  example_phrases?: HopeExamplePhrase[];
  self_love_note?: string;
  dedication_note?: string;
  impact_note?: string;
  boundary_phrases?: HopeBoundaryPhrases;
  settings?: HopeEngineSettings;
  recent_signals?: HopeSignal[];
  pending_reflections?: HopeReflection[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type HopeEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  when_hope_matters?: HopeContextInfo[];
  communication_principles?: string[];
  example_phrases?: HopeExamplePhrase[];
  self_love_note?: string;
  dedication_note?: string;
  impact_note?: string;
  boundary_phrases?: HopeBoundaryPhrases;
  settings?: HopeEngineSettings;
  recent_signals?: HopeSignal[];
  pending_reflections?: HopeReflection[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
