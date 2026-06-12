export const DESKTOP_MODES = ["silent", "balanced", "active_assistant", "focus"] as const;
export type DesktopModeKey = (typeof DESKTOP_MODES)[number];

export const DESKTOP_SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;
export type DesktopSeverity = (typeof DESKTOP_SEVERITIES)[number];

export const REMINDER_TYPES = [
  "one_time",
  "recurring",
  "business",
  "approval",
  "knowledge_review",
  "personal",
] as const;
export type ReminderType = (typeof REMINDER_TYPES)[number];

export type DesktopNotification = {
  id: string;
  title: string;
  body?: string | null;
  severity: string;
  status?: string;
  source_module: string;
  category?: string;
  action_url?: string | null;
  recommendation?: string | null;
  explanation?: string | null;
  created_at: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type BlueprintLabeledItem = {
  key?: string;
  label?: string;
  description?: string;
  emoji?: string;
  scenario?: string;
  example?: string;
  route?: string;
  note?: string;
};

export type DesktopEngagementSummary = {
  preferences_configured?: boolean;
  companion_enabled?: boolean;
  mode_key?: string;
  mode_name?: string;
  available_modes?: number;
  unread_notifications?: number;
  notifications_last_24h?: number;
  notifications_delivered_today?: number;
  max_notifications_per_day?: number;
  dedupe_window_minutes?: number;
  quiet_hours_enabled?: boolean;
  reminders_scheduled?: number;
  reminders_due_24h?: number;
  include_briefing?: boolean;
  mini_chat_enabled?: boolean;
};

export type SinceLastTimeSummary = {
  since?: string;
  since_source?: string;
  assumption_note?: string;
  support_cases_resolved?: number;
  kc_articles_updated?: number;
  high_priority_tasks_completed?: number;
  bottlenecks_open?: number;
  bell_moments?: number;
  recognition_moments?: number;
  trend_summary?: string;
};

export type DesktopCompanionCard = {
  has_customer: boolean;
  enabled?: boolean;
  mode_key?: string;
  mode_name?: string;
  unread_count?: number;
  upcoming_reminders?: number;
  notifications?: DesktopNotification[];
  briefing_summary?: string;
  briefing_greeting?: string;
  mini_chat_enabled?: boolean;
  privacy_note?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  abos_principle?: string;
  engagement_summary?: DesktopEngagementSummary;
  blueprint_note?: string;
};

export type DesktopCompanionEngineDashboard = {
  has_customer: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  desktop_companion_engine_note?: string;
  distinction_note?: string;
  companion_objectives?: BlueprintLabeledItem[];
  companion_experiences?: BlueprintLabeledItem[];
  mini_panel_capabilities?: BlueprintLabeledItem[];
  notification_principles?: Record<string, unknown>;
  self_love_connection?: Record<string, unknown>;
  self_love_note?: string;
  trust_connection?: Record<string, unknown>;
  configuration_options?: Record<string, unknown>;
  dogfooding?: Record<string, unknown>;
  success_criteria?: BlueprintSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: BlueprintLabeledItem[];
  engagement_summary?: DesktopEngagementSummary;
  since_last_time?: SinceLastTimeSummary | null;
  preferences?: Record<string, unknown>;
  modes?: DesktopMode[];
  safety_note?: string;
  principles?: string[];
};

export type DesktopReminder = {
  id: string;
  reminder_type: string;
  title: string;
  body?: string | null;
  due_at: string;
  recurrence_rule?: string | null;
  status: string;
  action_url?: string | null;
  created_at: string;
};

export type DesktopChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  intent?: string | null;
  action_href?: string | null;
  created_at: string;
};

export type DesktopMode = {
  mode_key: string;
  name: string;
  description: string;
  min_severity: string;
  include_daily_brief: boolean;
  include_mini_chat: boolean;
  include_suggestions: boolean;
  include_reminders: boolean;
};

export type DesktopPreferences = {
  has_customer: boolean;
  enabled: boolean;
  mode_key: string;
  focus_categories: string[];
  quiet_hours: Record<string, unknown>;
  timezone: string;
  include_briefing: boolean;
  include_governance: boolean;
  include_quality: boolean;
  include_support: boolean;
  include_knowledge: boolean;
  include_integrations: boolean;
  include_security: boolean;
  max_notifications_per_day: number;
  dedupe_window_minutes: number;
};

export type NormalizedDesktopEvent = {
  source_module: string;
  source_type: string;
  source_id?: string;
  event_key: string;
  category: string;
  title: string;
  summary: string;
  severity: DesktopSeverity;
  requires_action: boolean;
  action_url?: string;
  recommendation?: string;
  occurred_at?: string;
  metadata?: Record<string, unknown>;
};

export type ChatIntentResult = {
  intent: string;
  reply: string;
  action_href?: string;
  reminder?: { title: string; due_at: string; reminder_type: string };
};
