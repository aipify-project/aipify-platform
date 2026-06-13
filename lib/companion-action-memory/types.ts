import type { ACTION_MEMORY_CATEGORIES, CONFIDENCE_LEVELS } from "./constants";

export type ActionMemoryCategory = (typeof ACTION_MEMORY_CATEGORIES)[number];
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export type ActionMemorySettings = {
  memory_enabled: boolean;
  enabled_categories: string[];
  disabled_categories: string[];
};

export type ActionMemoryEntry = {
  memory_key: string;
  category: ActionMemoryCategory | string;
  description: string;
  origin_event: string | null;
  last_used_at: string | null;
  confidence_level: ConfidenceLevel | string;
  user_confirmed: boolean;
  status: string;
};

export type ActionMemorySuggestion = {
  suggestion_key: string;
  memory_key: string | null;
  message: string;
  status: string;
};

export type ActionMemoryValidation = {
  validation_key: string;
  message: string;
  trigger_type: string;
  status: string;
};

export type CompanionActionMemoryCenter = {
  settings: ActionMemorySettings | null;
  remembered_preferences: ActionMemoryEntry[];
  recent_patterns: ActionMemoryEntry[];
  suggestions: ActionMemorySuggestion[];
  validations: ActionMemoryValidation[];
  categories_enabled: string[];
  blueprint: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  can_delete: boolean;
  privacy_note: string | null;
};
