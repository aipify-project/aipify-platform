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

export type JointPartnership = {
  id: string;
  partnership_key?: string;
  partner_type?: string;
  partner_display_name?: string;
  status?: string;
  governance_tier?: string;
  created_at?: string;
};

export type JointSharedWorkspace = {
  id: string;
  workspace_key?: string;
  title?: string;
  status?: string;
  governance_tier?: string;
  participating_org_count?: number;
  owner_tenant_id?: string;
  created_at?: string;
};

export type JointSharedObjective = {
  id: string;
  objective_key?: string;
  title?: string;
  outcome_summary?: string | null;
  time_horizon?: string | null;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type JointOperationsEngagementSummary = {
  collaboration_score?: number;
  enabled?: boolean;
  default_governance_tier?: string;
  partnerships_count?: number;
  active_partnerships_count?: number;
  shared_workspaces_count?: number;
  active_workspaces_count?: number;
  shared_objectives_count?: number;
  cross_links_count?: number;
  framework_domains_count?: number;
  privacy_note?: string;
  opt_in_required?: boolean;
};

export type JointOperationsBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  joint_operations_center?: Record<string, unknown>;
  collaboration_framework_engine?: Record<string, unknown>;
  shared_workspace_engine?: Record<string, unknown>;
  joint_governance_engine?: Record<string, unknown>;
  cross_organizational_companion_engine?: Record<string, unknown>;
  partner_experience_engine?: Record<string, unknown>;
  shared_objectives_framework?: Record<string, unknown>;
  collaboration_memory_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: JointOperationsEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type JointOperationsCard = {
  has_customer: boolean;
  collaboration_score?: number;
  enabled?: boolean;
  default_governance_tier?: string;
  partnerships_count?: number;
  active_workspaces_count?: number;
  philosophy?: string;
  executive_approval_required?: boolean;
  participation_opt_in_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  joint_operations_mission?: string;
  joint_operations_abos_principle?: string;
  joint_operations_engagement_summary?: JointOperationsEngagementSummary;
  joint_operations_note?: string;
  joint_operations_vision_note?: string;
};

export type JointOperationsDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  default_governance_tier?: string;
  executive_approval_required?: boolean;
  participation_opt_in_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  collaboration_score?: number;
  partnerships_count?: number;
  active_partnerships_count?: number;
  shared_workspaces_count?: number;
  active_workspaces_count?: number;
  shared_objectives_count?: number;
  partnerships: JointPartnership[];
  shared_workspaces: JointSharedWorkspace[];
  shared_objectives: JointSharedObjective[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  joint_operations_blueprint?: JointOperationsBlueprint;
  joint_operations_mission?: string;
  joint_operations_philosophy?: string;
  joint_operations_abos_principle?: string;
  joint_operations_objectives?: BlueprintObjective[];
  joint_operations_center_meta?: Record<string, unknown>;
  collaboration_framework_engine_meta?: Record<string, unknown>;
  shared_workspace_engine_meta?: Record<string, unknown>;
  joint_governance_engine_meta?: Record<string, unknown>;
  cross_organizational_companion_engine_meta?: Record<string, unknown>;
  partner_experience_engine_meta?: Record<string, unknown>;
  shared_objectives_framework_meta?: Record<string, unknown>;
  collaboration_memory_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  cojobp143_integration_links?: IntegrationLink[];
  joint_operations_engagement_summary?: JointOperationsEngagementSummary;
  joint_operations_success_criteria?: AbosSuccessCriterion[];
  joint_operations_vision?: string;
  joint_operations_vision_phrases?: string[];
  joint_operations_privacy_note?: string;
  joint_operations_dogfooding?: string;
  joint_operations_engine_note?: string;
  joint_operations_distinction_note?: string;
};
