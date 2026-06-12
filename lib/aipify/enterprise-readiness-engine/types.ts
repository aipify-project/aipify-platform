export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type BlueprintIntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type DeploymentModel = {
  key?: string;
  label?: string;
  status?: string;
  description?: string;
  responsibilities?: {
    aipify?: string[];
    customer?: string[];
  };
};

export type IamCapability = {
  key?: string;
  label?: string;
  status?: string;
  note?: string;
};

export type HierarchyLevel = {
  level?: number;
  key?: string;
  label?: string;
  description?: string;
};

export type ExecutiveCapability = {
  emoji?: string;
  key?: string;
  label?: string;
  description?: string;
};

export type EnterpriseSummary = {
  overall_readiness_score?: number;
  health_status?: string;
  delegated_admin_count?: number;
  active_approval_chains?: number;
  pending_milestones?: number;
  governance_score?: number;
  sso_scaffold_documented?: boolean;
  sso_connected?: boolean;
  privacy_note?: string;
};

export type ImplementationBlueprintPhase37 = {
  phase?: number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type EnterpriseReadinessEngineCard = {
  has_organization: boolean;
  overall_readiness_score?: number;
  health_status?: string;
  philosophy?: string;
  implementation_blueprint_phase37?: ImplementationBlueprintPhase37;
  enterprise_deployment_governance_phase?: number;
  enterprise_abos_principle?: string;
  enterprise_summary?: EnterpriseSummary;
  blueprint_note?: string;
  [key: string]: unknown;
};

export type EnterpriseReadinessSummary = {
  overall_readiness_score?: number;
  health_status?: string;
  delegated_admin_count?: number;
  active_approval_chains?: number;
  pending_milestones?: number;
  integration_connected_count?: number;
};

export type EnterpriseReadinessEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: EnterpriseReadinessSummary;
  health_overview?: Record<string, unknown>;
  approval_bottlenecks: Array<Record<string, unknown>>;
  security_posture?: Record<string, unknown>;
  integration_landscape?: Record<string, unknown>;
  operational_risks: Array<Record<string, unknown>>;
  delegated_admins: Array<Record<string, unknown>>;
  approval_chains: Array<Record<string, unknown>>;
  onboarding_milestones: Array<Record<string, unknown>>;
  enterprise_settings?: Record<string, unknown>;
  deployment_readiness?: Record<string, unknown>;
  reports_available?: string[];
  implementation_blueprint_phase37?: ImplementationBlueprintPhase37;
  enterprise_deployment_governance_mission?: string;
  enterprise_deployment_governance_philosophy?: string;
  enterprise_objectives?: BlueprintObjective[];
  deployment_models?: {
    principle?: string;
    models?: DeploymentModel[];
    framework_route?: string;
    deployment_route?: string;
    device_rollout_route?: string;
    safety_note?: string;
  };
  identity_access_management?: {
    principle?: string;
    capabilities?: IamCapability[];
    identity_route?: string;
    device_rollout_route?: string;
    organization_workspace_route?: string;
    boundary?: string;
  };
  multi_entity_support?: {
    principle?: string;
    hierarchy?: HierarchyLevel[];
    organization_workspace_route?: string;
    cross_link_note?: string;
  };
  governance_controls?: {
    principle?: string;
    controls?: BlueprintObjective[];
    governance_policy_route?: string;
    compliance_route?: string;
    human_oversight_route?: string;
    cross_link_note?: string;
  };
  executive_capabilities?: {
    principle?: string;
    capabilities?: ExecutiveCapability[];
    executive_insights_route?: string;
    boundary?: string;
  };
  enterprise_self_love_connection?: {
    principle?: string;
    connections?: string[];
    self_love_route?: string;
    boundary?: string;
  };
  enterprise_trust_connection?: {
    principle?: string;
    users_should_understand?: string[];
    operators_should_understand?: string[];
    security_route?: string;
    license_route?: string;
    metadata_only?: boolean;
  };
  enterprise_dogfooding?: {
    principle?: string;
    aipify_group?: { slug?: string; role?: string; focus?: string[] };
    unonight?: { slug?: string; role?: string; focus?: string[] };
  };
  enterprise_success_criteria?: BlueprintSuccessCriterion[];
  enterprise_vision_phrases?: string[];
  enterprise_abos_principle?: string;
  enterprise_distinction_note?: string;
  enterprise_integration_links?: BlueprintIntegrationLink[];
  enterprise_summary?: EnterpriseSummary;
  [key: string]: unknown;
};

export type EnterpriseReport = {
  report_type?: string;
  generated_at?: string;
  privacy_note?: string;
  [key: string]: unknown;
};
