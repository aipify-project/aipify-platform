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

export type CatalogItem = {
  id: string;
  catalog_key?: string;
  category?: string;
  name?: string;
  role_title?: string;
  description?: string;
  risk_classification?: string;
  maturity_level?: string;
  approval_status?: string;
  version?: string;
};

export type CompanionDirectoryEntry = {
  id: string;
  companion_name?: string;
  assigned_team?: string | null;
  status?: string;
  governance_level?: number;
  employee_type?: string | null;
  usage_frequency?: string | null;
  satisfaction_score?: number | null;
  escalation_rate?: number | null;
  security_status?: string;
  version_status?: string;
  category?: string;
  risk_classification?: string;
};

export type HealthSnapshot = {
  recommendation_quality?: number;
  escalation_frequency?: number;
  response_accuracy?: number;
  user_satisfaction?: number;
  adoption_rate?: number;
  support_reduction?: number;
  workflow_efficiency?: number;
  knowledge_utilization?: number;
  policy_compliance?: number;
  error_recovery_success?: number;
  aggregate_score?: number;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
  boundary_note?: string;
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionMarketplaceBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  categories?: Record<string, unknown>;
  profile_fields?: Record<string, unknown>;
  digital_employee_model?: Record<string, unknown>;
  employee_types?: Record<string, unknown>;
  deployment_flow?: Record<string, unknown>;
  governance_layers?: Record<string, unknown>;
  directory_fields?: Record<string, unknown>;
  health_metrics?: Record<string, unknown>;
  collaboration_rules?: Record<string, unknown>;
  lifecycle_states?: Record<string, unknown>;
  enterprise_center?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  success_metrics?: Record<string, unknown>;
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: { examples?: CompanionAdaptationExample[]; principle?: string; boundary_note?: string };
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  integration_links?: IntegrationLink[];
  engagement_summary?: CompanionMarketplaceEngagementSummary;
  privacy_note?: string;
};

export type CompanionMarketplaceEngagementSummary = {
  marketplace_score?: number;
  deployments_count?: number;
  active_deployments_count?: number;
  catalog_items_count?: number;
  categories_documented?: number;
  deployment_steps?: number;
  governance_layers?: number;
  health_metrics?: number;
  employee_types?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type CompanionMarketplaceCard = {
  has_customer: boolean;
  marketplace_score?: number;
  active_deployments_count?: number;
  catalog_items_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  human_approval_required?: boolean;
  default_governance_level?: number;
  implementation_blueprint?: ImplementationBlueprintMeta;
  companion_marketplace_mission?: string;
  companion_marketplace_abos_principle?: string;
  companion_marketplace_engagement_summary?: CompanionMarketplaceEngagementSummary;
  companion_marketplace_note?: string;
  companion_marketplace_vision_note?: string;
};

export type CompanionMarketplaceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  human_approval_required?: boolean;
  marketplace_enabled?: boolean;
  default_governance_level?: number;
  enterprise_center_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  marketplace_score?: number;
  deployments_count?: number;
  active_deployments_count?: number;
  catalog_items_count?: number;
  recommendation_quality?: number;
  escalation_frequency?: number;
  user_satisfaction?: number;
  adoption_rate?: number;
  policy_compliance?: number;
  catalog_by_category: CatalogItem[];
  companion_directory: CompanionDirectoryEntry[];
  health_snapshot: HealthSnapshot;
  deployment_flow?: Record<string, unknown>;
  governance_layers?: Record<string, unknown>;
  collaboration_rules?: Record<string, unknown>;
  enterprise_center?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links: IntegrationLink[];
  implementation_blueprint?: CompanionMarketplaceBlueprint;
  companion_marketplace_engine_note?: string;
  companion_marketplace_blueprint?: CompanionMarketplaceBlueprint;
  companion_marketplace_distinction_note?: string;
  companion_marketplace_mission?: string;
  companion_marketplace_philosophy?: string;
  companion_marketplace_abos_principle?: string;
  companion_marketplace_objectives?: BlueprintObjective[];
  companion_marketplace_categories?: Record<string, unknown>;
  companion_marketplace_digital_employee_model?: Record<string, unknown>;
  companion_marketplace_employee_types?: Record<string, unknown>;
  companion_marketplace_directory_fields?: Record<string, unknown>;
  companion_marketplace_health_metrics?: Record<string, unknown>;
  companion_marketplace_lifecycle_states?: Record<string, unknown>;
  companion_marketplace_limitation_principles?: LimitationPrinciples;
  companion_marketplace_companion_adaptation?: CompanionMarketplaceBlueprint["companion_adaptation"];
  companion_marketplace_success_metrics?: Record<string, unknown>;
  cmbp113_integration_links?: IntegrationLink[];
  companion_marketplace_engagement_summary?: CompanionMarketplaceEngagementSummary;
  companion_marketplace_success_criteria?: AbosSuccessCriterion[];
  companion_marketplace_vision?: string;
  companion_marketplace_privacy_note?: string;
};
