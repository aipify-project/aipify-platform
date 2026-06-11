import type { MemoryCategory, MemoryVisibilityLevel } from "./dimensions";

export type MemoryEntry = {
  id: string;
  category: MemoryCategory;
  title: string;
  summary: string;
  detailed_notes: string;
  created_by?: string | null;
  memory_date: string;
  tags_json: string[];
  visibility_level: MemoryVisibilityLevel;
  created_at: string;
  updated_at: string;
  entry_type?: "memory";
};

export type DecisionRecord = {
  id: string;
  decision_title: string;
  decision_summary: string;
  rationale: string;
  alternatives_considered: string;
  expected_outcome: string;
  actual_outcome: string;
  decision_owner?: string | null;
  decision_date: string;
  visibility_level: string;
  created_at: string;
  updated_at: string;
  entry_type?: "decision";
};

export type LessonLearned = {
  id: string;
  related_project: string;
  what_worked: string;
  what_did_not_work: string;
  future_recommendations: string;
  recorded_by?: string | null;
  lesson_date: string;
  visibility_level: string;
  created_at: string;
  entry_type?: "lesson";
};

export type OrganizationalMemoryCenter = {
  has_customer: boolean;
  has_access?: boolean;
  plan?: string;
  starter_mode?: boolean;
  business_features?: boolean;
  enterprise_features?: boolean;
  briefing?: string;
  since_last_login?: MemoryEntry[];
  entry_count?: number;
  recent_entries?: MemoryEntry[];
  decisions?: DecisionRecord[];
  lessons?: LessonLearned[];
  integration_context?: {
    completed_goals?: Array<{ title: string; completed_at?: string | null }>;
    implemented_friction?: Array<{ text: string; implemented_at?: string | null }>;
    pulse_history?: Array<{ date: string; summary: string }>;
  };
  privacy_note?: string;
};

export type CreateMemoryInput = {
  title: string;
  summary?: string;
  detailed_notes?: string;
  category?: MemoryCategory;
  memory_date?: string;
  tags_json?: string[];
  visibility_level?: MemoryVisibilityLevel;
};
