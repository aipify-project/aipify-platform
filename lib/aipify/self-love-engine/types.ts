export type SelfLoveCategoryKey =
  | "user_wellbeing"
  | "team_health"
  | "organization_health"
  | "system_health";

export type SelfLoveRecommendation = {
  id?: string;
  category?: SelfLoveCategoryKey | string;
  title?: string;
  explanation?: string;
  confidence?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type SelfLoveApplicationArea = {
  key?: string;
  label?: string;
  description?: string;
  examples?: string[];
  [key: string]: unknown;
};

export type SelfLoveCommunicationExample = {
  phrase?: string;
  emoji?: string;
  [key: string]: unknown;
};

export type SelfLoveOrgSettings = {
  organization_id?: string;
  enabled?: boolean;
  reminder_frequency?: string;
  quiet_hours?: Record<string, unknown>;
  reminder_tone?: string;
  dashboard_insights_enabled?: boolean;
  workspace_settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type SelfLoveUserPreferences = {
  organization_id?: string;
  user_id?: string;
  reminder_prefs?: Record<string, unknown>;
  tone?: string;
  channels?: string[];
  pause_suggestions_enabled?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type SelfLoveSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
  [key: string]: unknown;
};

export type SelfLoveEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  pending_recommendations?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type SelfLoveEngineDashboard = {
  has_organization: boolean;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  application_areas?: SelfLoveApplicationArea[];
  communication_examples?: SelfLoveCommunicationExample[];
  boundaries?: string[];
  org_settings?: SelfLoveOrgSettings;
  user_preferences?: SelfLoveUserPreferences;
  preference_summary?: Record<string, unknown>;
  recent_recommendations?: SelfLoveRecommendation[];
  system_health_signals?: Record<string, unknown>;
  success_criteria?: SelfLoveSuccessCriterion[];
  dogfooding?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
