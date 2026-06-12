export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  boundary_note?: string;
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type DecisionWorkspace = {
  id?: string;
  workspace_key?: string;
  title?: string;
  decision_statement?: string;
  status?: string;
  cross_link_route?: string;
};

export type DecisionJournal = {
  id?: string;
  journal_key?: string;
  workspace_key?: string;
  title?: string;
  decision_date?: string;
  status?: string;
  rationale_summary?: string;
};

export type AssumptionReview = {
  id?: string;
  assumption_key?: string;
  assumption_type?: string;
  title?: string;
  summary?: string;
  confidence?: string;
  status?: string;
};

export type OutcomeLearning = {
  id?: string;
  learning_key?: string;
  title?: string;
  what_worked_summary?: string;
  change_summary?: string;
  captured_at?: string;
  status?: string;
};

export type EngagementSummary = {
  decision_quality_score?: number;
  active_workspaces?: number;
  journal_entries?: number;
  assumption_reviews?: number;
  outcome_learnings?: number;
  intelligence_center_capabilities_count?: number;
  cross_links_count?: number;
  heritage_archives?: number;
  outcome_reviews?: number;
  executive_reflections?: number;
  pattern_snapshots?: number;
  privacy_note?: string;
  phase153_privacy_note?: string;
  [key: string]: unknown;
};

export type HeritageArchive = {
  id?: string;
  archive_key?: string;
  title?: string;
  decision_summary?: string;
  status?: string;
  visibility?: string;
};

export type HeritageOutcomeReview = {
  id?: string;
  review_key?: string;
  title?: string;
  what_happened_summary?: string;
  status?: string;
};

export type HeritageExecutiveReflection = {
  id?: string;
  reflection_key?: string;
  reflection_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
};

export type HeritagePatternSnapshot = {
  id?: string;
  snapshot_key?: string;
  pattern_type?: string;
  title?: string;
  theme_summary?: string;
  status?: string;
};

export type DecisionHeritageBlueprint = {
  phase?: string;
  doc?: string;
  spec_doc?: string;
  engine_phase?: string;
  era?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  decision_heritage_center?: Record<string, unknown>;
  decision_journal_engine?: Record<string, unknown>;
  outcome_review_engine?: Record<string, unknown>;
  executive_reflection_engine?: Record<string, unknown>;
  wisdom_companion?: Record<string, unknown>;
  decision_pattern_engine?: Record<string, unknown>;
  institutional_wisdom_library?: Record<string, unknown>;
  future_leader_preparation_engine?: Record<string, unknown>;
  companion_limitations?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
  security_requirements?: Array<Record<string, unknown>>;
  integration_links?: IntegrationLink[];
  dogfooding?: Record<string, unknown>;
  success_metrics?: Array<Record<string, unknown>>;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: EngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type Phase153HeritageSections = {
  heritage_archives?: HeritageArchive[];
  outcome_reviews?: HeritageOutcomeReview[];
  executive_reflections?: HeritageExecutiveReflection[];
  pattern_snapshots?: HeritagePatternSnapshot[];
};

export type Phase153HeritageMetrics = {
  heritage_archives?: number;
  outcome_reviews?: number;
  executive_reflections?: number;
  pattern_snapshots?: number;
  [key: string]: unknown;
};

export type DecisionIntelligenceBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  decision_intelligence_center?: Record<string, unknown>;
  decision_workspaces?: Record<string, unknown>;
  executive_advisory_companion?: Record<string, unknown>;
  assumption_intelligence?: Record<string, unknown>;
  tradeoff_analysis?: Record<string, unknown>;
  stakeholder_impact?: Record<string, unknown>;
  decision_journal?: Record<string, unknown>;
  outcome_learning?: Record<string, unknown>;
  executive_reflection?: Record<string, unknown>;
  companion_limitations?: Record<string, unknown>;
  self_love_in_decisions?: SelfLoveConnection;
  decision_knowledge_library?: Record<string, unknown>;
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: Record<string, unknown>;
  success_metrics?: Array<Record<string, unknown>>;
  engagement_summary?: EngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
};

export type DecisionIntelligenceCard = {
  has_customer: boolean;
  decision_quality_score?: number;
  active_workspaces?: number;
  journal_entries?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  intelligence_center_enabled?: boolean;
  implementation_blueprint_phase125?: ImplementationBlueprintMeta;
  decision_intelligence_mission?: string;
  decision_intelligence_abos_principle?: string;
  decision_intelligence_engagement_summary?: EngagementSummary;
  decision_intelligence_vision_note?: string;
  implementation_blueprint_phase153?: ImplementationBlueprintMeta;
  phase153_mission?: string;
  phase153_abos_principle?: string;
  phase153_vision?: string;
  phase153_engagement_summary?: EngagementSummary;
  phase153_heritage_archives?: number;
  phase153_note?: string;
  phase153_distinction_note?: string;
  [key: string]: unknown;
};

export type DecisionIntelligenceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  intelligence_center_enabled?: boolean;
  advisory_briefings_enabled?: boolean;
  assumption_reviews_enabled?: boolean;
  tradeoff_analysis_enabled?: boolean;
  outcome_tracking_enabled?: boolean;
  reflection_sessions_enabled?: boolean;
  philosophy?: string;
  distinction_note?: string;
  safety_note?: string;
  decision_quality_score?: number;
  active_workspaces?: number;
  journal_entries?: number;
  assumption_reviews?: number;
  outcome_learnings?: number;
  intelligence_center_capabilities_count?: number;
  workspace_fields_count?: number;
  assumption_types_count?: number;
  workspaces: DecisionWorkspace[];
  journals: DecisionJournal[];
  assumptions: AssumptionReview[];
  outcome_learnings_list: OutcomeLearning[];
  workspace_field_scaffolds?: Array<Record<string, unknown>>;
  assumption_type_scaffolds?: Array<Record<string, unknown>>;
  tradeoff_question_scaffolds?: Array<Record<string, unknown>>;
  stakeholder_group_scaffolds?: Array<Record<string, unknown>>;
  integration_links?: IntegrationLink[];
  implementation_blueprint_phase125?: ImplementationBlueprintMeta;
  decision_intelligence_blueprint?: DecisionIntelligenceBlueprint;
  decision_intelligence_mission?: string;
  decision_intelligence_philosophy?: string;
  decision_intelligence_abos_principle?: string;
  decision_intelligence_objectives?: BlueprintObjective[];
  decision_intelligence_center?: Record<string, unknown>;
  decision_workspaces?: Record<string, unknown>;
  executive_advisory_companion?: Record<string, unknown>;
  assumption_intelligence?: Record<string, unknown>;
  tradeoff_analysis?: Record<string, unknown>;
  stakeholder_impact?: Record<string, unknown>;
  decision_journal?: Record<string, unknown>;
  outcome_learning?: Record<string, unknown>;
  executive_reflection?: Record<string, unknown>;
  companion_limitations?: Record<string, unknown>;
  self_love_in_decisions?: SelfLoveConnection;
  decision_knowledge_library?: Record<string, unknown>;
  deibp125_cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: Record<string, unknown>;
  engagement_summary?: EngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  success_metrics?: Array<Record<string, unknown>>;
  decision_intelligence_vision?: string;
  privacy_note?: string;
  implementation_blueprint_phase153?: ImplementationBlueprintMeta;
  decision_heritage_blueprint?: DecisionHeritageBlueprint;
  phase153_distinction_note?: string;
  phase153_mission?: string;
  phase153_philosophy?: string;
  phase153_abos_principle?: string;
  phase153_vision?: string;
  phase153_objectives?: BlueprintObjective[];
  phase153_decision_heritage_center?: Record<string, unknown>;
  phase153_decision_journal_engine?: Record<string, unknown>;
  phase153_outcome_review_engine?: Record<string, unknown>;
  phase153_executive_reflection_engine?: Record<string, unknown>;
  phase153_wisdom_companion?: Record<string, unknown>;
  phase153_decision_pattern_engine?: Record<string, unknown>;
  phase153_institutional_wisdom_library?: Record<string, unknown>;
  phase153_future_leader_preparation_engine?: Record<string, unknown>;
  phase153_companion_limitations?: Record<string, unknown>;
  phase153_self_love_connection?: SelfLoveConnection;
  phase153_security_requirements?: Array<Record<string, unknown>>;
  iwdhbp153_integration_links?: IntegrationLink[];
  phase153_dogfooding?: Record<string, unknown>;
  phase153_success_metrics?: Array<Record<string, unknown>>;
  phase153_success_criteria?: AbosSuccessCriterion[];
  phase153_engagement_summary?: EngagementSummary;
  phase153_vision_phrases?: string[];
  phase153_heritage_metrics?: Phase153HeritageMetrics;
  decision_heritage_note?: string;
  phase153_privacy_note?: string;
  phase153_sections?: Phase153HeritageSections;
  [key: string]: unknown;
};
