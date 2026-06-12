export type DiscoveryCategoryInfo = {
  key?: string;
  label?: string;
  bullets?: string[] | unknown[];
  [key: string]: unknown;
};

export type DiscoveryQuestionExample = {
  key?: string;
  question?: string;
  [key: string]: unknown;
};

export type DiscoveryPrompt = {
  id?: string;
  category?: string;
  prompt?: string;
  context_summary?: string | null;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type DiscoverySignal = {
  id?: string;
  category?: string;
  summary?: string;
  confidence?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type CuriosityDiscoveryEngineSettings = {
  organization_id?: string;
  enabled?: boolean;
  encourage_experimentation?: boolean;
  prompt_cadence?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type CuriosityDiscoveryEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  prompt_count?: number;
  pending_prompts?: number;
  signal_count?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type CuriosityDiscoveryEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  discovery_categories?: DiscoveryCategoryInfo[];
  question_examples?: DiscoveryQuestionExample[];
  self_love_note?: string;
  trust_note?: string;
  settings?: CuriosityDiscoveryEngineSettings;
  recent_prompts?: DiscoveryPrompt[];
  recent_signals?: DiscoverySignal[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type CuriosityDiscoveryEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  discovery_categories?: DiscoveryCategoryInfo[];
  question_examples?: DiscoveryQuestionExample[];
  trust_note?: string;
  self_love_note?: string;
  settings?: CuriosityDiscoveryEngineSettings;
  recent_prompts?: DiscoveryPrompt[];
  recent_signals?: DiscoverySignal[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
