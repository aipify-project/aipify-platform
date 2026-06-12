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

export type LearningSignal = {
  key?: string;
  label?: string;
  description?: string;
  cross_link?: string;
};

export type LearningSignalsBlueprint = {
  principle?: string;
  signals?: LearningSignal[];
};

export type CapabilityQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  description?: string;
};

export type CapabilityQuestionsBlueprint = {
  principle?: string;
  questions?: CapabilityQuestion[];
  reflection_note?: string;
};

export type AdaptiveLearningPathway = {
  key?: string;
  title?: string;
  description?: string;
  designed_for?: string[];
  topics?: string[];
  cross_link?: string;
  cross_link_note?: string;
  companion_name?: string;
  not_label?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidanceBlueprint = {
  principle?: string;
  companion_name?: string;
  not_label?: string;
  examples?: CompanionGuidanceExample[];
  boundary_note?: string;
};

export type KnowledgeReinforcementBlueprint = {
  principle?: string;
  practices?: string[];
  knowledge_center_route?: string;
  organizational_memory_route?: string;
  eke_route?: string;
  boundary_note?: string;
};

export type CommunityLearningConnection = {
  principle?: string;
  practices?: string[];
  community_route?: string;
  boundary_note?: string;
};

export type LeadershipInsight = {
  key?: string;
  label?: string;
  description?: string;
};

export type LeadershipInsightsBlueprint = {
  principle?: string;
  insights?: LeadershipInsight[];
  boundary_note?: string;
};

export type PrivacyPrinciplesBlueprint = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
};

export type AdaptiveOrganizationalEngagementSummary = {
  learning_signals?: number;
  capability_questions?: number;
  adaptive_pathways?: number;
  companion_guidance_examples?: number;
  leadership_insight_dimensions?: number;
  privacy_forbidden_count?: number;
  integration_links?: number;
  operational_engagement?: LearningEngagementSummary;
  privacy_note?: string;
};

export type AdaptiveLearningOrganizationalCapabilityBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: LearningObjective[];
  learning_signals?: LearningSignalsBlueprint;
  capability_questions?: CapabilityQuestionsBlueprint;
  adaptive_learning_pathways?: AdaptiveLearningPathway[];
  companion_guidance?: CompanionGuidanceBlueprint;
  knowledge_reinforcement?: KnowledgeReinforcementBlueprint;
  community_learning_connection?: CommunityLearningConnection;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: LeadershipInsightsBlueprint;
  trust_connection?: TrustConnection;
  privacy_principles?: PrivacyPrinciplesBlueprint;
  dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: AdaptiveOrganizationalEngagementSummary;
  privacy_note?: string;
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
  implementation_blueprint_phase93?: ImplementationBlueprintMeta;
  adaptive_organizational_mission?: string;
  adaptive_organizational_abos_principle?: string;
  adaptive_organizational_engagement_summary?: AdaptiveOrganizationalEngagementSummary;
  adaptive_organizational_note?: string;
  adaptive_organizational_vision_note?: string;
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
  implementation_blueprint_phase93?: ImplementationBlueprintMeta;
  adaptive_learning_organizational_capability_engine_note?: string;
  adaptive_learning_organizational_capability_blueprint?: AdaptiveLearningOrganizationalCapabilityBlueprint;
  adaptive_organizational_distinction_note?: string;
  adaptive_organizational_mission?: string;
  adaptive_organizational_philosophy?: string;
  adaptive_organizational_abos_principle?: string;
  adaptive_organizational_objectives?: LearningObjective[];
  adaptive_organizational_learning_signals?: LearningSignalsBlueprint;
  adaptive_organizational_capability_questions?: CapabilityQuestionsBlueprint;
  adaptive_organizational_pathways?: AdaptiveLearningPathway[];
  adaptive_organizational_companion_guidance?: CompanionGuidanceBlueprint;
  adaptive_organizational_knowledge_reinforcement?: KnowledgeReinforcementBlueprint;
  adaptive_organizational_community_learning?: CommunityLearningConnection;
  adaptive_organizational_self_love_connection?: SelfLoveConnection;
  adaptive_organizational_leadership_insights?: LeadershipInsightsBlueprint;
  adaptive_organizational_trust_connection?: TrustConnection;
  adaptive_organizational_privacy_principles?: PrivacyPrinciplesBlueprint;
  adaptive_organizational_dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  adaptive_organizational_integration_links?: IntegrationLink[];
  adaptive_organizational_engagement_summary?: AdaptiveOrganizationalEngagementSummary;
  adaptive_organizational_success_criteria?: AbosSuccessCriterion[];
  adaptive_organizational_vision?: string;
  adaptive_organizational_vision_phrases?: string[];
  adaptive_organizational_privacy_note?: string;
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
