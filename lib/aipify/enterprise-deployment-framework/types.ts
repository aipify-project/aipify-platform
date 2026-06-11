export const DEPLOYMENT_MODELS = [
  "multi_tenant_saas",
  "dedicated_tenant_cloud",
  "enterprise_private_cloud",
  "hybrid_deployment",
  "on_premise",
] as const;

export const DEPLOYMENT_STAGES = [
  "discovery_assessment",
  "solution_design",
  "pilot_deployment",
  "enterprise_rollout",
  "optimization",
] as const;

export type DeploymentProject = {
  id: string;
  project_name: string;
  deployment_model: string;
  deployment_model_label?: string;
  current_stage: string;
  current_stage_label?: string;
  readiness_score: number;
  status: string;
};

export type DeploymentStage = {
  id: string;
  stage_key: string;
  stage_label?: string;
  status: string;
  progress_pct: number;
  started_at?: string | null;
  completed_at?: string | null;
};

export type ReadinessAssessment = {
  id: string;
  assessment_area: string;
  score: number;
  status: string;
  notes?: string | null;
};

export type EnterpriseRole = {
  id: string;
  role_key: string;
  title: string;
  description: string;
};

export type SecurityPolicy = {
  id: string;
  policy_key: string;
  title: string;
  description: string;
  control_type: string;
  enabled: boolean;
};

export type GovernancePolicy = {
  id: string;
  policy_key: string;
  title: string;
  description: string;
  policy_type: string;
  status: string;
};

export type FrameworkIntegration = {
  id: string;
  integration_key: string;
  display_name: string;
  category: string;
  status: string;
  requires_agent?: boolean;
};

export type ChangeInitiative = {
  id: string;
  title: string;
  description: string;
  initiative_type: string;
  status: string;
};

export type ContinuityPlan = {
  id: string;
  plan_key: string;
  title: string;
  description: string;
  rto_hours?: number | null;
  rpo_hours?: number | null;
  status: string;
};

export type SuccessMetric = {
  id: string;
  metric_key: string;
  title: string;
  current_value: number;
  target_value?: number | null;
  unit: string;
};

export type EnterpriseDeploymentFrameworkCard = {
  has_customer: boolean;
  framework_score?: number;
  readiness_score?: number;
  current_stage?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type EnterpriseDeploymentFrameworkDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  framework_enabled?: boolean;
  pilot_recommended?: boolean;
  sso_enabled?: boolean;
  mfa_required?: boolean;
  support_tier?: string;
  philosophy?: string;
  safety_note?: string;
  framework_score?: number;
  deployment_readiness?: number;
  current_stage?: string;
  current_stage_label?: string;
  governance_policies_active?: number;
  security_controls_enabled?: number;
  user_adoption_pct?: number;
  deployment_mode?: string;
  data_residency_mode?: string;
  enterprise_governance_enabled?: boolean;
  deployment_models?: Array<{ key: string; label: string; description: string }>;
  iam_capabilities?: string[];
  project?: DeploymentProject;
  deployment_stages: DeploymentStage[];
  readiness_assessments: ReadinessAssessment[];
  enterprise_roles: EnterpriseRole[];
  security_policies: SecurityPolicy[];
  governance_policies: GovernancePolicy[];
  integrations: FrameworkIntegration[];
  change_initiatives: ChangeInitiative[];
  continuity_plans: ContinuityPlan[];
  success_metrics: SuccessMetric[];
  support_tiers?: Array<{ tier: string; label: string }>;
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations_map?: Record<string, string>;
};

export type EnterpriseDeploymentFrameworkActionResult = {
  status?: string;
  current_stage?: string;
  current_stage_label?: string;
  error?: string;
};

export type EnterpriseDeploymentFrameworkBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
