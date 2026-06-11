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
