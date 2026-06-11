import type {
  CalendarPurpose,
  CalendarProvider,
  ContextMode,
  EventType,
} from "./dimensions";

export type ContextSettings = {
  context_mode: ContextMode;
  proactive_assistance: string;
  notification_frequency: string;
  daily_briefing_enabled: boolean;
  evening_review_enabled: boolean;
  conflict_detection_enabled: boolean;
  cognitive_load_alerts_enabled: boolean;
  privacy_settings: Record<string, unknown>;
  planning_preferences: Record<string, unknown>;
};

export type CalendarConnection = {
  id: string;
  provider: CalendarProvider;
  display_name: string;
  calendar_purpose: CalendarPurpose;
  connection_status: string;
  sync_enabled: boolean;
  permissions?: Record<string, unknown>;
  last_synced_at: string | null;
  created_at?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  event_type: EventType;
  calendar_purpose: CalendarPurpose;
  starts_at: string;
  ends_at: string | null;
  all_day?: boolean;
  status: string;
  source: string;
  connection_id?: string | null;
  linked_memory_id?: string | null;
};

export type ContextAnalysis = {
  context_mode?: string;
  active_tasks?: number;
  workload_score?: number;
  workload_level?: string;
  conflicts?: Array<{ type: string; message: string; event_ids?: string[] }>;
  cognitive_load?: {
    active_tasks: number;
    postponed_high_priority: number;
    message: string | null;
    alert: boolean;
  } | null;
  suggested_actions?: Array<{ id: string; message: string }>;
  proactive_assistance?: string[];
};

export type ContextSummary = {
  enabled?: boolean;
  type?: string;
  greeting?: string;
  context_mode?: string;
  today_events?: Array<{ id: string; title: string; starts_at: string }>;
  follow_ups?: Array<{ id: string; title: string }>;
  upcoming_reminders?: Array<{ id: string; title: string; memory_date: string }>;
  completed_today?: Array<{ id: string; title: string }>;
  still_outstanding?: Array<{ id: string; title: string }>;
  prompt?: string;
};

export type ContextCenterBundle = {
  has_customer: boolean;
  user_name?: string;
  settings?: ContextSettings;
  connected_calendars?: CalendarConnection[];
  upcoming_events?: CalendarEvent[];
  priority_tasks?: Array<{
    id: string;
    title: string;
    memory_date: string | null;
    priority: string;
    life_area: string;
  }>;
  daily_briefing?: ContextSummary | null;
  evening_review?: ContextSummary | null;
  analysis?: ContextAnalysis;
  conflicts?: ContextAnalysis["conflicts"];
  cognitive_load?: ContextAnalysis["cognitive_load"];
  suggested_actions?: Array<{ id: string; message: string }>;
  proactive_assistance?: string[];
  workload?: { score: number; level: string };
  privacy_note?: string;
  context_sources?: Record<string, string>;
};

export type CalendarCenterBundle = {
  has_customer: boolean;
  privacy_note?: string;
  supported_providers?: string[];
  connections?: CalendarConnection[];
  recent_events?: CalendarEvent[];
  sync_history?: Array<{
    id: string;
    connection_id: string | null;
    sync_status: string;
    events_synced: number;
    message: string;
    created_at: string;
  }>;
  purposes_by_connection?: Record<string, string>;
};

export type SchedulingProposal = {
  detected: boolean;
  title: string;
  event_date: string | null;
  suggested_purpose: CalendarPurpose;
  suggested_calendar_name: string;
  prompt: string;
  follow_up_options?: string[];
};

export type EventDraft = {
  title: string;
  description: string;
  event_type: EventType;
  calendar_purpose: CalendarPurpose;
  starts_at: string | null;
  all_day: boolean;
  connection_id?: string | null;
};
