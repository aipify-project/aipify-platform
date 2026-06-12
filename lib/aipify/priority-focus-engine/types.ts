export type PriorityFocusDimensionKey =
  | "operational"
  | "strategic"
  | "human"
  | "knowledge"
  | "relationship";

export type PriorityFocusItem = {
  id?: string;
  dimension?: PriorityFocusDimensionKey | string;
  priority_level?: number;
  title?: string;
  summary?: string;
  status?: string;
  due_hint?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type FocusRecommendation = {
  id?: string;
  recommendation_type?: string;
  summary?: string;
  priority_level?: number | null;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type PriorityFocusDimension = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type PriorityFocusLevel = {
  level?: number;
  code?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type PriorityFocusSettings = {
  organization_id?: string;
  enabled?: boolean;
  enabled_dimensions?: string[];
  default_priority_level?: number;
  focus_mode_enabled?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type PriorityFocusEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_items?: number;
  p1_count?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type PriorityFocusEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  self_love_note?: string;
  distinction_note?: string;
  priority_dimensions?: PriorityFocusDimension[];
  priority_levels?: PriorityFocusLevel[];
  focus_support?: string[];
  proactive_companion_examples?: Array<{ example?: string; [key: string]: unknown }>;
  executive_insights_summary?: Record<string, unknown>;
  active_items_by_level?: Record<string, number>;
  settings?: PriorityFocusSettings;
  active_items?: PriorityFocusItem[];
  focus_recommendations?: FocusRecommendation[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PriorityFocusExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: PriorityFocusSettings;
  priority_dimensions?: PriorityFocusDimension[];
  priority_levels?: PriorityFocusLevel[];
  focus_support?: string[];
  executive_insights_summary?: Record<string, unknown>;
  active_items_by_level?: Record<string, number>;
  active_items?: PriorityFocusItem[];
  focus_recommendations?: FocusRecommendation[];
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
