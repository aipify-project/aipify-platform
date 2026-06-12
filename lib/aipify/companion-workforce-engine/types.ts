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
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type WorkforceMember = {
  id: string;
  companion_key?: string;
  display_name?: string;
  department?: string;
  role_description?: string;
  governance_tier?: string;
  status?: string;
  purpose?: string;
  authority_boundaries?: unknown;
  escalation_path?: unknown;
  knowledge_sources?: unknown;
  operational_scope?: unknown;
  performance_indicators?: unknown;
  restrictions?: unknown;
  route_href?: string | null;
};

export type WorkforceCollaboration = {
  id: string;
  collaboration_key?: string;
  companion_a?: string;
  companion_b?: string;
  collaboration_type?: string;
  title?: string;
  summary?: string;
  status?: string;
};

export type WorkforceRoutingRule = {
  id: string;
  rule_key?: string;
  rule_type?: string;
  title?: string;
  summary?: string;
  target_companion_key?: string | null;
  priority?: number;
  status?: string;
};

export type WorkforceConflict = {
  id: string;
  conflict_key?: string;
  conflict_type?: string;
  title?: string;
  summary?: string;
  human_review_status?: string;
  severity?: string;
};

export type CompanionWorkforceBlueprint = {
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
  companion_workforce_center?: Record<string, unknown>[];
  companion_roles?: Record<string, unknown>[];
  collaboration_model?: Record<string, unknown>[];
  workforce_orchestration?: Record<string, unknown>[];
  responsibility_framework?: Record<string, unknown>[];
  human_collaboration_model?: Record<string, unknown>[];
  companion_directory_schema?: Record<string, unknown>;
  companion_health_engine?: Record<string, unknown>;
  conflict_management?: Record<string, unknown>[];
  companion_limitations?: Record<string, unknown>[];
  self_love_connection?: Record<string, unknown>[];
  security_requirements?: Record<string, unknown>[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: CompanionWorkforceEngagementSummary;
  privacy_note?: string;
};

export type CompanionWorkforceEngagementSummary = {
  workforce_score?: number;
  members_active?: number;
  collaborations_active?: number;
  routing_rules_active?: number;
  conflicts_pending?: number;
  objectives_count?: number;
  workforce_center_capabilities?: number;
  companion_roles_count?: number;
  collaboration_pairs_count?: number;
  orchestration_dimensions?: number;
  integration_links_count?: number;
  privacy_note?: string;
};

export type CompanionWorkforceCard = {
  has_customer: boolean;
  workforce_score?: number;
  members_active?: number;
  collaborations_active?: number;
  conflicts_pending?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  workforce_center_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  companion_workforce_mission?: string;
  companion_workforce_abos_principle?: string;
  companion_workforce_engagement_summary?: CompanionWorkforceEngagementSummary;
  companion_workforce_note?: string;
  companion_workforce_vision_note?: string;
};

export type CompanionWorkforceDashboard = {
  has_customer: boolean;
  workforce_center_enabled?: boolean;
  collaboration_enabled?: boolean;
  conflict_review_required?: boolean;
  human_oversight_required?: boolean;
  default_governance_tier?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  workforce_score?: number;
  members_active?: number;
  collaborations_active?: number;
  routing_rules_active?: number;
  conflicts_pending?: number;
  members: WorkforceMember[];
  collaborations: WorkforceCollaboration[];
  routing_rules: WorkforceRoutingRule[];
  conflicts: WorkforceConflict[];
  companion_workforce_center: Record<string, unknown>[];
  companion_roles_meta: Record<string, unknown>[];
  collaboration_model: Record<string, unknown>[];
  workforce_orchestration: Record<string, unknown>[];
  responsibility_framework: Record<string, unknown>[];
  human_collaboration_model: Record<string, unknown>[];
  companion_health_engine: Record<string, unknown>;
  conflict_management: Record<string, unknown>[];
  companion_limitations: Record<string, unknown>[];
  self_love_connection: Record<string, unknown>[];
  security_requirements: Record<string, unknown>[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: CompanionWorkforceBlueprint;
  companion_workforce_blueprint?: CompanionWorkforceBlueprint;
  companion_workforce_mission?: string;
  companion_workforce_philosophy?: string;
  companion_workforce_abos_principle?: string;
  companion_workforce_objectives?: BlueprintObjective[];
  companion_workforce_engagement_summary?: CompanionWorkforceEngagementSummary;
  companion_workforce_success_criteria?: AbosSuccessCriterion[];
  ccwfbp132_cross_links?: IntegrationLink[];
  companion_workforce_vision?: string;
  companion_workforce_vision_phrases?: string[];
  companion_workforce_privacy_note?: string;
  companion_workforce_engine_note?: string;
};
