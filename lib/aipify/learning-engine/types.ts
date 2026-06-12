export const LEARNING_EVENT_TYPES = [
  "suggestion_approved",
  "suggestion_rejected",
  "action_completed",
  "action_dismissed",
  "automation_success",
  "automation_failed",
  "incident_false_positive",
  "support_answer_helpful",
  "support_answer_unhelpful",
  "knowledge_gap_resolved",
  "notification_muted",
  "brief_item_opened",
  "feedback_positive",
  "feedback_negative",
] as const;

export type LearningEvent = {
  id: string;
  source_module: string;
  source_id?: string | null;
  event_type: string;
  user_decision?: string | null;
  outcome?: string | null;
  explanation: string;
  created_at: string;
};

export type LearningPattern = {
  pattern_key: string;
  source_module: string;
  current_score: number;
  positive_count: number;
  negative_count: number;
  explanation: string;
};

export type LearningObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type LearningSourceCategory = {
  domain?: string;
  label?: string;
  signals?: string[];
};

export type LearningSourcesBlueprint = {
  principle?: string;
  categories?: LearningSourceCategory[];
};

export type AdaptationPrinciples = {
  principle?: string;
  should?: string[];
  should_not?: string[];
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_know?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  focus?: string[];
};

export type LearningEngagementSummary = {
  learning_events_total?: number;
  learning_events_last_30d?: number;
  feedback_total?: number;
  positive_feedback?: number;
  negative_feedback?: number;
  learning_scores_total?: number;
  improved_scores?: number;
  active_learning_memory?: number;
  active_learned_rules?: number;
  source_modules_used?: number;
  privacy_note?: string;
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
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: number | string;
  title?: string;
  engine_phase?: string;
  doc?: string;
  route?: string;
  review_route?: string;
  mapping_note?: string;
  core_principle?: string;
};

export type LearningEngineCard = {
  has_customer: boolean;
  enabled?: boolean;
  total_events?: number;
  positive_feedback?: number;
  negative_feedback?: number;
  philosophy?: string;
  privacy_note?: string;
  mission?: string;
  abos_principle?: string;
  core_principle?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  engagement_summary?: LearningEngagementSummary;
  blueprint_note?: string;
};

export type LearningEngineDashboard = {
  has_customer: boolean;
  metrics: {
    total_events: number;
    positive_feedback: number;
    negative_feedback: number;
    false_positives_reduced: number;
    suggestions_improved: number;
    automations_improved: number;
    noisy_notifications_reduced: number;
  };
  top_patterns: LearningPattern[];
  recent_priority_adjustments: LearningEvent[];
  recent_events: LearningEvent[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  core_principle?: string;
  vision?: string;
  learning_engine_note?: string;
  distinction_note?: string;
  learning_objectives?: LearningObjective[];
  learning_sources?: LearningSourcesBlueprint;
  adaptation_principles?: AdaptationPrinciples;
  companion_examples?: CompanionExample[];
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  integration_links?: IntegrationLink[];
  engagement_summary?: LearningEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  principles?: string[];
};

export type LearningEngineSettings = {
  enabled: boolean;
  allow_support_learning: boolean;
  allow_quality_learning: boolean;
  allow_automation_learning: boolean;
  allow_notification_learning: boolean;
  allow_briefing_learning: boolean;
  allow_action_learning: boolean;
  require_admin_review_rules: boolean;
  retention_days: number;
};

export type LearningRule = {
  id: string;
  rule_key: string;
  source_module: string;
  title: string;
  description: string;
  requires_review: boolean;
  is_active: boolean;
  updated_at: string;
};

export type LearningAuditEntry = {
  id: string;
  action_type: string;
  action_summary: string;
  created_at: string;
};
