/**
 * Enterprise Readiness Engine helpers (Phase A.30).
 * Authoritative enforcement lives in Supabase RPCs (_ere_*).
 * Integrates Governance (A.14), Deployment (A.20), and Enterprise Deployment Framework (Phase 92).
 */

export const ENTERPRISE_READINESS_DIMENSIONS = [
  "governance",
  "security",
  "integrations",
  "operations",
  "deployment",
] as const;

export const DELEGATED_ADMIN_SCOPES = ["team", "department", "division", "region"] as const;

export const APPROVAL_CHAIN_TYPES = [
  "department",
  "executive",
  "emergency_override",
  "integration",
  "deployment",
] as const;

export const DEPLOYMENT_MODELS = [
  "multi_tenant_saas",
  "dedicated_tenant_cloud",
  "hybrid_deployment",
  "on_premise",
] as const;

export type EnterpriseReadinessDimension = (typeof ENTERPRISE_READINESS_DIMENSIONS)[number];
export type DelegatedAdminScope = (typeof DELEGATED_ADMIN_SCOPES)[number];
export type ApprovalChainType = (typeof APPROVAL_CHAIN_TYPES)[number];
export type DeploymentModel = (typeof DEPLOYMENT_MODELS)[number];

type EnterpriseRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function canManageEnterprise(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canExportEnterpriseReports(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export function canApplyEnterpriseOverride(role: string): boolean {
  return role === "owner";
}

export async function getEnterpriseReadinessEngineDashboard(
  supabase: EnterpriseRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_enterprise_readiness_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function saveEnterpriseSetting(
  supabase: EnterpriseRpcClient,
  settingKey: string,
  settingValue: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("save_enterprise_setting", {
    p_setting_key: settingKey,
    p_setting_value: settingValue,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function assignEnterpriseDelegatedAdmin(
  supabase: EnterpriseRpcClient,
  userId: string,
  scope: DelegatedAdminScope = "team",
  permissions: unknown[] = []
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("assign_enterprise_delegated_admin", {
    p_user_id: userId,
    p_scope: scope,
    p_permissions: permissions,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getEnterpriseReport(
  supabase: EnterpriseRpcClient,
  reportType: "executive" | "operational" | "governance" | "audit_preparation"
): Promise<Record<string, unknown>> {
  const rpcMap = {
    executive: "get_enterprise_executive_report",
    operational: "get_enterprise_operational_report",
    governance: "get_enterprise_governance_report",
    audit_preparation: "get_enterprise_audit_preparation_report",
  } as const;

  const { data, error } = await supabase.rpc(rpcMap[reportType]);
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createEnterpriseReadinessAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
