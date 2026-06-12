export const MEMORY_RECORD_CATEGORIES = [
  "operational_decisions",
  "resolved_incidents",
  "support_learnings",
  "approval_precedents",
  "strategic_decisions",
  "onboarding_lessons",
  "process_improvements",
] as const;

export const MEMORY_LEVELS = [
  "session",
  "workspace",
  "organization",
  "strategic",
] as const;

export const KNOWLEDGE_SOURCE_TYPES = [
  "knowledge_center",
  "internal_documentation",
  "faq",
  "support_conversation",
  "meeting_notes",
  "policy_procedure",
  "case_resolution",
  "manual_entry",
  "other",
] as const;

export const MEMORY_VISIBILITY_LEVELS = ["private", "internal", "leadership"] as const;

export const MEMORY_RECORD_STATUSES = ["active", "archived", "superseded"] as const;

export const DECISION_REGISTER_STATUSES = ["active", "under_review", "archived", "superseded"] as const;

export const MEMORY_REVIEW_TYPES = ["quarterly", "annual", "event_triggered"] as const;

export const MEMORY_REVIEW_STATUSES = ["scheduled", "completed", "skipped", "overdue"] as const;

export type MemoryRecordCategory = (typeof MEMORY_RECORD_CATEGORIES)[number];
export type MemoryLevel = (typeof MEMORY_LEVELS)[number];
export type KnowledgeSourceType = (typeof KNOWLEDGE_SOURCE_TYPES)[number];
export type MemoryVisibility = (typeof MEMORY_VISIBILITY_LEVELS)[number];
export type MemoryRecordStatus = (typeof MEMORY_RECORD_STATUSES)[number];
export type DecisionRegisterStatus = (typeof DECISION_REGISTER_STATUSES)[number];
export type MemoryReviewType = (typeof MEMORY_REVIEW_TYPES)[number];
export type MemoryReviewStatus = (typeof MEMORY_REVIEW_STATUSES)[number];

export type OrganizationMemoryRecord = {
  id: string;
  organization_id?: string;
  workspace_id?: string | null;
  memory_level?: MemoryLevel | string;
  knowledge_source_type?: KnowledgeSourceType | string | null;
  category?: MemoryRecordCategory | string;
  title?: string;
  summary?: string;
  detailed_context?: Record<string, unknown>;
  source_reference?: string | null;
  visibility?: MemoryVisibility | string;
  status?: MemoryRecordStatus | string;
  reference_count?: number;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type OrganizationDecisionRegisterEntry = {
  id: string;
  organization_id?: string;
  memory_record_id?: string | null;
  decision_title?: string;
  rationale?: string;
  alternatives?: string;
  expected_outcomes?: string;
  review_date?: string | null;
  status?: DecisionRegisterStatus | string;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type OrganizationMemoryReview = {
  id: string;
  organization_id?: string;
  memory_record_id?: string | null;
  decision_id?: string | null;
  review_type?: MemoryReviewType | string;
  scheduled_at?: string;
  completed_at?: string | null;
  review_outcome?: string | null;
  status?: MemoryReviewStatus | string;
  created_at?: string;
};

export type OrganizationMemorySettings = {
  retention_days?: number;
  capture_rules?: Record<string, boolean>;
  auto_capture_enabled?: boolean;
  review_reminder_days?: number;
};

export type OrganizationalMemorySummary = {
  active_records?: number;
  archived_records?: number;
  active_decisions?: number;
  pending_reviews?: number;
};

export type RecurringTheme = {
  category?: string;
  count?: number;
};

export type OrganizationalMemoryEngineCard = {
  has_organization: boolean;
  active_records?: number;
  pending_reviews?: number;
  philosophy?: string;
};

export type MemoryLevelSummary = {
  level?: string;
  label?: string;
  description?: string;
};

export type OrganizationalMemoryEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  self_love_note?: string;
  memory_levels?: MemoryLevelSummary[];
  knowledge_domains?: string[];
  approved_sources?: string[];
  principles?: string[];
  settings?: OrganizationMemorySettings;
  summary?: OrganizationalMemorySummary & { by_memory_level?: Record<string, number> };
  recent_learnings: OrganizationMemoryRecord[];
  recurring_themes: RecurringTheme[];
  frequently_referenced: OrganizationMemoryRecord[];
  archived_decisions: OrganizationDecisionRegisterEntry[];
  recommended_reviews: OrganizationMemoryReview[];
  privacy_note?: string;
};
