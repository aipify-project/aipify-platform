export type WisdomSourceInfo = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ThoughtfulGuidanceExample = {
  scenario?: string;
  guidance?: string;
  trade_off?: string;
  [key: string]: unknown;
};

export type WisdomInsight = {
  id?: string;
  source_type?: string;
  summary?: string;
  trade_offs?: unknown[] | Record<string, unknown>;
  humility_note?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type WisdomGuidancePrompt = {
  id?: string;
  prompt?: string;
  context_summary?: string | null;
  considerations?: unknown[] | Record<string, unknown>;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type WisdomEngineSettings = {
  organization_id?: string;
  enabled?: boolean;
  humility_mode_enabled?: boolean;
  trade_off_prompts_enabled?: boolean;
  pause_before_major_decisions?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type WisdomEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  insight_count?: number;
  pending_prompts?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type WisdomEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  wisdom_sources?: WisdomSourceInfo[];
  wisdom_principles?: string[];
  thoughtful_guidance_examples?: ThoughtfulGuidanceExample[];
  humility_examples?: string[];
  self_love_note?: string;
  trust_note?: string;
  growth_note?: string;
  settings?: WisdomEngineSettings;
  recent_insights?: WisdomInsight[];
  pending_prompts?: WisdomGuidancePrompt[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type WisdomEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  wisdom_sources?: WisdomSourceInfo[];
  wisdom_principles?: string[];
  thoughtful_guidance_examples?: ThoughtfulGuidanceExample[];
  humility_examples?: string[];
  self_love_note?: string;
  trust_note?: string;
  growth_note?: string;
  settings?: WisdomEngineSettings;
  recent_insights?: WisdomInsight[];
  pending_prompts?: WisdomGuidancePrompt[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
