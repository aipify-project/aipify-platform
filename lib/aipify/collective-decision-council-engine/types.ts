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
  relationship?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type CouncilWorkspace = {
  id: string;
  workspace_key?: string;
  title?: string;
  context_summary?: string;
  status?: string;
  governance_tier?: string;
  cross_link_route?: string | null;
};

export type CouncilPerspective = {
  id: string;
  perspective_key?: string;
  workspace_key?: string;
  contributor_type?: string;
  role?: string;
  summary?: string;
  perspective_type?: string;
  status?: string;
};

export type StakeholderImpact = {
  id: string;
  impact_key?: string;
  workspace_key?: string;
  stakeholder_group?: string;
  impact_summary?: string;
  impact_level?: string;
  status?: string;
};

export type TransparencyRecord = {
  id: string;
  transparency_key?: string;
  workspace_key?: string;
  alternatives_summary?: string;
  rationale_summary?: string;
  expected_outcomes_summary?: string;
  status?: string;
};

export type CouncilMemoryEntry = {
  id: string;
  memory_key?: string;
  workspace_key?: string;
  lesson_summary?: string;
  outcome_summary?: string;
  reflection_summary?: string;
  captured_at?: string;
  status?: string;
};

export type CollectiveDecisionCouncilBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  vision_phrases?: string[];
  objectives?: BlueprintObjective[];
  collective_decision_center?: Record<string, unknown>;
  human_companion_council_model?: Record<string, unknown>;
  decision_perspective_engine?: Record<string, unknown>;
  companion_advisory_engine?: Record<string, unknown>;
  stakeholder_impact_review?: Record<string, unknown>;
  disagreement_framework?: Record<string, unknown>;
  decision_transparency_engine?: Record<string, unknown>;
  council_memory_engine?: Record<string, unknown>;
  companion_limitations?: Record<string, unknown>;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: CollectiveDecisionCouncilEngagementSummary;
  privacy_note?: string;
};

export type CollectiveDecisionCouncilEngagementSummary = {
  council_wisdom_score?: number;
  active_workspaces?: number;
  perspectives?: number;
  human_perspectives?: number;
  companion_perspectives?: number;
  stakeholder_impacts?: number;
  transparency_records?: number;
  council_memory_entries?: number;
  council_center_capabilities_count?: number;
  integration_links_count?: number;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type CollectiveDecisionCouncilCard = {
  has_customer: boolean;
  council_wisdom_score?: number;
  active_workspaces?: number;
  perspectives?: number;
  human_perspectives?: number;
  companion_perspectives?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  council_center_enabled?: boolean;
  implementation_blueprint_phase137?: ImplementationBlueprintMeta;
  collective_decision_council_mission?: string;
  collective_decision_council_abos_principle?: string;
  collective_decision_council_engagement_summary?: CollectiveDecisionCouncilEngagementSummary;
  collective_decision_council_vision_note?: string;
};

export type CollectiveDecisionCouncilDashboard = {
  has_customer: boolean;
  council_center_enabled?: boolean;
  disagreement_framework_enabled?: boolean;
  companion_advisory_enabled?: boolean;
  stakeholder_mapping_enabled?: boolean;
  transparency_records_enabled?: boolean;
  council_memory_enabled?: boolean;
  human_oversight_required?: boolean;
  default_governance_tier?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  council_wisdom_score?: number;
  active_workspaces?: number;
  perspectives?: number;
  human_perspectives?: number;
  companion_perspectives?: number;
  stakeholder_impacts?: number;
  transparency_records?: number;
  council_memory_entries?: number;
  workspaces: CouncilWorkspace[];
  perspectives_list: CouncilPerspective[];
  stakeholder_impacts_list: StakeholderImpact[];
  transparency_records_list: TransparencyRecord[];
  council_memory_list: CouncilMemoryEntry[];
  perspective_type_scaffolds: Record<string, unknown>[];
  stakeholder_group_scaffolds: Record<string, unknown>[];
  disagreement_principles: Record<string, unknown>[];
  council_participant_roles: Record<string, unknown>[];
  integration_links: IntegrationLink[];
  implementation_blueprint_phase137?: ImplementationBlueprintMeta;
  collective_decision_council_blueprint?: CollectiveDecisionCouncilBlueprint;
  collective_decision_council_mission?: string;
  collective_decision_council_philosophy?: string;
  collective_decision_council_abos_principle?: string;
  collective_decision_council_objectives?: BlueprintObjective[];
  collective_decision_center?: Record<string, unknown>;
  human_companion_council_model?: Record<string, unknown>;
  decision_perspective_engine?: Record<string, unknown>;
  companion_advisory_engine?: Record<string, unknown>;
  stakeholder_impact_review?: Record<string, unknown>;
  disagreement_framework?: Record<string, unknown>;
  decision_transparency_engine?: Record<string, unknown>;
  council_memory_engine?: Record<string, unknown>;
  companion_limitations?: Record<string, unknown>;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>[];
  cdccbp137_integration_links?: IntegrationLink[];
  engagement_summary?: CollectiveDecisionCouncilEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  success_metrics?: Record<string, unknown>[];
  vision_phrases?: string[];
  collective_decision_council_vision?: string;
  dogfooding?: string;
  privacy_note?: string;
};
