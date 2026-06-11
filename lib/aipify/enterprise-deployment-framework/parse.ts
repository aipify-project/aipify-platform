import type {
  EnterpriseDeploymentFrameworkActionResult,
  EnterpriseDeploymentFrameworkBriefingResult,
  EnterpriseDeploymentFrameworkCard,
  EnterpriseDeploymentFrameworkDashboard,
} from "./types";

export function parseEnterpriseDeploymentFrameworkCard(data: unknown): EnterpriseDeploymentFrameworkCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    framework_score: Number(d.framework_score ?? 0),
    readiness_score: Number(d.readiness_score ?? 0),
    current_stage: typeof d.current_stage === "string" ? d.current_stage : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseEnterpriseDeploymentFrameworkDashboard(data: unknown): EnterpriseDeploymentFrameworkDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    framework_enabled: Boolean(d.framework_enabled ?? true),
    pilot_recommended: Boolean(d.pilot_recommended ?? true),
    sso_enabled: Boolean(d.sso_enabled),
    mfa_required: Boolean(d.mfa_required),
    support_tier: typeof d.support_tier === "string" ? d.support_tier : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    framework_score: Number(d.framework_score ?? 0),
    deployment_readiness: Number(d.deployment_readiness ?? 0),
    current_stage: typeof d.current_stage === "string" ? d.current_stage : undefined,
    current_stage_label: typeof d.current_stage_label === "string" ? d.current_stage_label : undefined,
    governance_policies_active: Number(d.governance_policies_active ?? 0),
    security_controls_enabled: Number(d.security_controls_enabled ?? 0),
    user_adoption_pct: Number(d.user_adoption_pct ?? 0),
    deployment_mode: typeof d.deployment_mode === "string" ? d.deployment_mode : undefined,
    data_residency_mode: typeof d.data_residency_mode === "string" ? d.data_residency_mode : undefined,
    enterprise_governance_enabled: Boolean(d.enterprise_governance_enabled),
    deployment_models: Array.isArray(d.deployment_models)
      ? (d.deployment_models as EnterpriseDeploymentFrameworkDashboard["deployment_models"])
      : [],
    iam_capabilities: Array.isArray(d.iam_capabilities) ? (d.iam_capabilities as string[]) : [],
    project: typeof d.project === "object" && d.project
      ? (d.project as EnterpriseDeploymentFrameworkDashboard["project"])
      : undefined,
    deployment_stages: Array.isArray(d.deployment_stages)
      ? (d.deployment_stages as EnterpriseDeploymentFrameworkDashboard["deployment_stages"])
      : [],
    readiness_assessments: Array.isArray(d.readiness_assessments)
      ? (d.readiness_assessments as EnterpriseDeploymentFrameworkDashboard["readiness_assessments"])
      : [],
    enterprise_roles: Array.isArray(d.enterprise_roles)
      ? (d.enterprise_roles as EnterpriseDeploymentFrameworkDashboard["enterprise_roles"])
      : [],
    security_policies: Array.isArray(d.security_policies)
      ? (d.security_policies as EnterpriseDeploymentFrameworkDashboard["security_policies"])
      : [],
    governance_policies: Array.isArray(d.governance_policies)
      ? (d.governance_policies as EnterpriseDeploymentFrameworkDashboard["governance_policies"])
      : [],
    integrations: Array.isArray(d.integrations)
      ? (d.integrations as EnterpriseDeploymentFrameworkDashboard["integrations"])
      : [],
    change_initiatives: Array.isArray(d.change_initiatives)
      ? (d.change_initiatives as EnterpriseDeploymentFrameworkDashboard["change_initiatives"])
      : [],
    continuity_plans: Array.isArray(d.continuity_plans)
      ? (d.continuity_plans as EnterpriseDeploymentFrameworkDashboard["continuity_plans"])
      : [],
    success_metrics: Array.isArray(d.success_metrics)
      ? (d.success_metrics as EnterpriseDeploymentFrameworkDashboard["success_metrics"])
      : [],
    support_tiers: Array.isArray(d.support_tiers)
      ? (d.support_tiers as EnterpriseDeploymentFrameworkDashboard["support_tiers"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as EnterpriseDeploymentFrameworkDashboard["briefings"]) : [],
    integrations_map: typeof d.integrations_map === "object" && d.integrations_map
      ? (d.integrations_map as Record<string, string>)
      : undefined,
  };
}

export function parseEnterpriseDeploymentFrameworkActionResult(data: unknown): EnterpriseDeploymentFrameworkActionResult {
  return (data ?? {}) as EnterpriseDeploymentFrameworkActionResult;
}

export function parseEnterpriseDeploymentFrameworkBriefingResult(data: unknown): EnterpriseDeploymentFrameworkBriefingResult {
  return (data ?? {}) as EnterpriseDeploymentFrameworkBriefingResult;
}
