export type ProactiveCompanionCategoryKey =
  | "operational"
  | "support"
  | "knowledge"
  | "executive"
  | "team_awareness";

export type ProactiveCompanionNudge = {
  id?: string;
  category?: ProactiveCompanionCategoryKey | string;
  summary?: string;
  suggested_action?: string;
  priority?: string;
  status?: string;
  snoozed_until?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionSettings = {
  organization_id?: string;
  enabled?: boolean;
  enabled_categories?: string[];
  default_frequency?: string;
  default_communication_style?: string;
  default_channels?: string[];
  max_nudges_per_day?: number;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionUserPreferences = {
  organization_id?: string;
  user_id?: string;
  frequency?: string;
  channels?: string[];
  quiet_hours?: Record<string, unknown>;
  enabled_categories?: string[];
  communication_style?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionAssistanceCategory = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionStyleExample = {
  style?: string;
  example?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  pending_nudges?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type ProactiveCompanionEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  self_love_note?: string;
  distinction_note?: string;
  assistance_categories?: ProactiveCompanionAssistanceCategory[];
  companion_style_examples?: ProactiveCompanionStyleExample[];
  boundaries?: string[];
  settings?: ProactiveCompanionSettings;
  user_preferences?: ProactiveCompanionUserPreferences;
  preference_summary?: Record<string, unknown>;
  active_nudges?: ProactiveCompanionNudge[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ProactiveCompanionExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: ProactiveCompanionSettings;
  preference_summary?: Record<string, unknown>;
  assistance_categories?: ProactiveCompanionAssistanceCategory[];
  boundaries?: string[];
  active_nudges?: ProactiveCompanionNudge[];
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
