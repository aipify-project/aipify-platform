import type { LifeArea } from "./life-areas";
import type { LifePriority } from "./priorities";
import type {
  LifePersonality,
  NotificationFrequency,
  ProactivityLevel,
} from "./personality";

export type LifeOsSettings = {
  proactivity_level: ProactivityLevel;
  notification_frequency: NotificationFrequency;
  personality: LifePersonality;
  life_areas_enabled: Record<LifeArea, boolean>;
  daily_briefing_enabled: boolean;
  evening_review_enabled: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  energy_aware_enabled: boolean;
};

export type LifeMemoryItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  memory_date: string | null;
  priority: LifePriority;
  life_area: LifeArea;
  status?: string;
  postponed_count?: number;
  reschedule_suggested?: boolean;
};

export type LifeChecklistItem = {
  id: string;
  title: string;
  sort_order: number;
  completed_at: string | null;
};

export type LifeChecklist = {
  id: string;
  title: string;
  description: string;
  checklist_type: string;
  status: string;
  items: LifeChecklistItem[];
  progress: number;
};

export type LifeConflict = {
  type: string;
  message: string;
};

export type LifeSuggestion = {
  id: string;
  message: string;
};

export type LifeCenterBundle = {
  has_customer: boolean;
  user_name?: string;
  settings?: LifeOsSettings;
  daily_briefing?: {
    greeting: string;
    highlights: string[];
    prompt: string;
  } | null;
  evening_review?: {
    completed_today: Array<{ id: string; title: string }>;
    still_pending: Array<{ id: string; title: string }>;
    prompt: string;
  } | null;
  today_overview?: LifeMemoryItem[];
  upcoming_events?: LifeMemoryItem[];
  priority_tasks?: LifeMemoryItem[];
  family_reminders?: Array<{
    id: string;
    title: string;
    memory_date: string | null;
    description: string;
  }>;
  suggested_actions?: LifeSuggestion[];
  life_balance?: {
    by_area: Record<string, number>;
    overload_days: Array<{ date: string; count: number; message: string }>;
  };
  conflicts?: LifeConflict[];
  proactive_questions?: LifeSuggestion[];
  checklists?: LifeChecklist[];
  energy_hint?: string | null;
  privacy_note?: string;
};
