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

export type MemoryCategoryBlock = {
  key?: string;
  label?: string;
  examples?: string[];
  record_categories?: string[];
};

export type MemoryCapability = {
  key?: string;
  label?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  key?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: number | string;
  title?: string;
  engine_phase?: string;
  doc?: string;
  route?: string;
  mapping_note?: string;
};

export type ContinuityObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type ContinuityMemoryCategory = {
  key?: string;
  label?: string;
  description?: string;
  maps_to?: string;
  record_categories?: string[];
  emoji?: string;
  learning_route?: string;
  rsi_route?: string;
  companion_device_route?: string;
};

export type ContinuityCompanionExample = {
  emoji?: string;
  key?: string;
  text?: string;
  example?: string;
};

export type ContinuityBlueprintSection = {
  emoji?: string;
  label?: string;
  principle?: string;
  examples?: ContinuityCompanionExample[] | string[];
  companion_examples?: ContinuityCompanionExample[];
  controls?: Array<{ key?: string; label?: string; route?: string; permission?: string; maps_to?: string }>;
  retention_options?: Array<{ key?: string; label?: string }>;
  practices?: string[];
  commitments?: string[];
  qualities?: string[];
  settings_keys?: string[];
  settings_key?: string;
  settings_table?: string;
  org_settings_table?: string;
  pame_route?: string;
  pame_boundary?: string;
  identity_note?: string;
  boundary?: string;
  route?: string;
  phase?: string;
  trust_note?: string;
  companion_identity_route?: string;
  human_moments_route?: string;
  human_moments_phase?: number;
  [key: string]: unknown;
};

export type MemoryContinuitySettings = {
  id?: string;
  organization_id?: string;
  user_id?: string;
  operational_continuity_enabled?: boolean;
  relationship_continuity_enabled?: boolean;
  learning_continuity_enabled?: boolean;
  companion_continuity_enabled?: boolean;
  cross_device_continuity_enabled?: boolean;
  pame_cross_link_enabled?: boolean;
  retention_policy_preference?: string;
  proactive_reminders_enabled?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
};

export type ContinuitySummary = {
  operational_memory_count?: number;
  relationship_memory_count?: number;
  learning_memory_count?: number;
  companion_continuity_opt_in_count?: number;
  pame_cross_link_opt_in_count?: number;
  cross_device_opt_in_count?: number;
  pending_review_count?: number;
  pame_active_memory_count?: number;
  privacy_note?: string;
  summary_text?: string;
};

export type OrganizationalMemoryEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  knowledge_vs_memory_note?: string;
  core_philosophy?: string[];
  memory_categories?: MemoryCategoryBlock[];
  memory_capabilities?: MemoryCapability[];
  capability_examples?: string[];
  self_love_note?: string;
  trust_connection?: {
    principle?: string;
    organizations_should_understand?: string[];
  };
  distinction_note?: string;
  success_criteria?: AbosSuccessCriterion[];
  integration_links?: IntegrationLink[];
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
  implementation_blueprint_phase55?: ImplementationBlueprintMeta;
  continuity_mission?: string;
  continuity_philosophy?: string;
  continuity_abos_principle?: string;
  continuity_objectives?: ContinuityObjective[];
  continuity_memory_categories?: ContinuityMemoryCategory[];
  organizational_continuity?: ContinuityBlueprintSection;
  individual_continuity?: ContinuityBlueprintSection;
  memory_management?: ContinuityBlueprintSection;
  continuity_self_love_connection?: ContinuityBlueprintSection;
  continuity_trust_privacy?: ContinuityBlueprintSection;
  continuity_companion_principles?: ContinuityBlueprintSection;
  continuity_settings?: MemoryContinuitySettings;
  continuity_summary?: ContinuitySummary;
  continuity_dogfooding?: Record<string, unknown>;
  mcebp_integration_links?: IntegrationLink[];
  continuity_success_criteria?: AbosSuccessCriterion[];
  continuity_vision_phrases?: string[];
  continuity_distinction_note?: string;
};
