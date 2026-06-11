import type { MemoryConfidenceLevel } from "./confidence";
import type { PameMemoryStatus, PameMemoryType } from "./categories";
import type { AssistantIntent } from "./intent";

export type PersonalMemory = {
  id: string;
  category: PameMemoryType;
  title: string;
  description: string;
  memory_date: string | null;
  recurring: boolean;
  recurrence_rule: string | null;
  status: PameMemoryStatus;
  confidence_level: MemoryConfidenceLevel;
  reminder_offsets: string[];
  created_at: string;
  updated_at: string;
};

export type ImportantPerson = {
  id: string;
  name: string;
  relationship: string | null;
  birthday: string | null;
  notes: string | null;
};

export type MemoryDashboard = {
  important_people: PersonalMemory[];
  upcoming_events: PersonalMemory[];
  active_tasks: PersonalMemory[];
  recurring_reminders: PersonalMemory[];
  completed_items: PersonalMemory[];
  recently_added: PersonalMemory[];
};

export type AssistantCenterBundle = {
  has_customer: boolean;
  ask_before_remembering?: boolean;
  categories_enabled?: Record<PameMemoryType, boolean>;
  memories?: PersonalMemory[];
  dashboard?: MemoryDashboard;
  important_people?: ImportantPerson[];
  proactive_suggestions?: Array<{ id: string; message: string }>;
  pending_count?: number;
};

/** @deprecated */
export type AssistantMemory = PersonalMemory & {
  summary?: string;
  event_date?: string | null;
  intent_key?: string;
  confidence_score?: number;
  source?: string;
};

export type AssistantMemoryDraft = {
  category: PameMemoryType;
  title: string;
  summary: string;
  event_date?: string | null;
  intent_key?: AssistantIntent;
  reminder_offsets?: string[];
  expires_at?: string | null;
  recurrence?: string | null;
  source?: "explicit" | "inferred";
  confidence_level?: MemoryConfidenceLevel;
  person_name?: string | null;
  relationship?: string | null;
};
