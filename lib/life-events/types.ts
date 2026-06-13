import type { IMPORTANCE_LEVELS, LIFE_EVENT_CATEGORIES } from "./constants";

export type LifeEventCategory = (typeof LIFE_EVENT_CATEGORIES)[number];
export type ImportanceLevel = (typeof IMPORTANCE_LEVELS)[number];

export type LifeEventSettings = {
  enabled_categories: string[];
  proactivity_level: string;
  suggest_actions_allowed: boolean;
  execute_actions_allowed: boolean;
  reminder_timing_default: string;
  opt_out_all: boolean;
};

export type LifeEventEntry = {
  event_key: string;
  title: string;
  category: LifeEventCategory | string;
  event_date: string;
  importance_level: ImportanceLevel | string;
  status: string;
  days_until: number | null;
  requires_preparation: boolean;
};

export type LifeEventReminder = {
  reminder_key: string;
  event_key: string;
  message: string;
  timing_option: string;
  scheduled_for: string;
  status: string;
};

export type LifeEventSuggestedAction = {
  action_key: string;
  event_key: string;
  action_type: string;
  message: string;
  status: string;
  requires_approval: boolean;
};

export type LifeEventCareInsight = {
  insight_key: string;
  message: string;
  insight_type: string;
  status: string;
};

export type LifeEventsCenter = {
  settings: LifeEventSettings | null;
  upcoming_events: LifeEventEntry[];
  suggested_actions: LifeEventSuggestedAction[];
  preparation_needed: LifeEventEntry[];
  recently_completed: Array<{ action_key: string; event_key: string; action_type: string; completed_at: string }>;
  care_insights: LifeEventCareInsight[];
  reminders: LifeEventReminder[];
  blueprint: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
