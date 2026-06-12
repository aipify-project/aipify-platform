export type LegacyDimensionInfo = {
  key?: string;
  label?: string;
  bullets?: string[] | unknown[];
  [key: string]: unknown;
};

export type LegacyStorytellingExample = {
  key?: string;
  label?: string;
  example?: string;
  [key: string]: unknown;
};

export type LegacyMilestoneExample = {
  key?: string;
  bell_text?: string;
  [key: string]: unknown;
};

export type LegacyStory = {
  id?: string;
  dimension?: string;
  title?: string;
  summary?: string;
  timeline_ref?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type LegacyMilestone = {
  id?: string;
  milestone_key?: string;
  summary?: string;
  achieved_at?: string;
  celebrated?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type LegacyEngineSettings = {
  organization_id?: string;
  enabled?: boolean;
  celebrate_milestones?: boolean;
  preserve_stories?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type LegacyEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  story_count?: number;
  milestone_count?: number;
  uncelebrated_milestones?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type LegacyEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  legacy_dimensions?: LegacyDimensionInfo[];
  storytelling_examples?: LegacyStorytellingExample[];
  milestone_examples?: LegacyMilestoneExample[];
  self_love_note?: string;
  trust_note?: string;
  settings?: LegacyEngineSettings;
  recent_stories?: LegacyStory[];
  recent_milestones?: LegacyMilestone[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type LegacyEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  legacy_dimensions?: LegacyDimensionInfo[];
  storytelling_examples?: LegacyStorytellingExample[];
  milestone_examples?: LegacyMilestoneExample[];
  trust_note?: string;
  self_love_note?: string;
  settings?: LegacyEngineSettings;
  recent_stories?: LegacyStory[];
  recent_milestones?: LegacyMilestone[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
