/**
 * Governance & Policy Engine helpers (Phase A.14).
 * Authoritative enforcement lives in Supabase RPCs (_gpe_*).
 */

export const POLICY_CATEGORIES = [
  "ai_autonomy",
  "approval",
  "support",
  "access",
  "knowledge_publishing",
  "integration",
  "retention",
] as const;
export type PolicyCategory = (typeof POLICY_CATEGORIES)[number];

export const POLICY_STATUSES = ["draft", "active", "archived"] as const;
export type PolicyStatus = (typeof POLICY_STATUSES)[number];

export const AI_AUTONOMY_LEVELS = [
  "advisory_only",
  "approval_required",
  "limited_automation",
  "organization_defined",
] as const;
export type AiAutonomyLevel = (typeof AI_AUTONOMY_LEVELS)[number];

export const VIOLATION_SEVERITIES = ["informational", "moderate", "high", "critical"] as const;
export type ViolationSeverity = (typeof VIOLATION_SEVERITIES)[number];

type GovernanceRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function canManageGovernance(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canReviewGovernance(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export function governanceRequiresHumanApproval(riskLevel: string, autonomyLevel?: AiAutonomyLevel): boolean {
  if (riskLevel === "critical" || riskLevel === "high") return true;
  if (autonomyLevel === "advisory_only" || autonomyLevel === "approval_required") return true;
  if (autonomyLevel === "limited_automation" && riskLevel === "low") return false;
  return riskLevel === "medium";
}

export async function getPolicy(
  supabase: GovernanceRpcClient,
  policyKey: string
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase.rpc("get_organization_policies");
  if (error) throw new Error(error.message);
  const policies = (data as Array<Record<string, unknown>>) ?? [];
  return policies.find((p) => p.policy_key === policyKey) ?? null;
}

export async function validatePolicy(
  supabase: GovernanceRpcClient,
  category: PolicyCategory,
  configuration: Record<string, unknown>
): Promise<{ valid: boolean; errors?: string[] }> {
  if (category === "ai_autonomy") {
    const level = configuration.autonomy_level as string;
    if (!AI_AUTONOMY_LEVELS.includes(level as AiAutonomyLevel)) {
      return { valid: false, errors: ["Invalid ai_autonomy level"] };
    }
  }
  if (category === "approval") {
    const risk = configuration.risk_level as string;
    if (!["low", "medium", "high"].includes(risk)) {
      return { valid: false, errors: ["Approval policy requires risk_level low|medium|high"] };
    }
    if (!configuration.required_approvers) {
      return { valid: false, errors: ["Approval policy requires required_approvers"] };
    }
  }
  if (category === "retention") {
    const days = Number(configuration.retention_days ?? 0);
    if (days < 30) return { valid: false, errors: ["Retention must be at least 30 days"] };
  }
  return { valid: true };
}

export async function checkApprovalRequirements(
  supabase: GovernanceRpcClient,
  riskLevel: string = "medium",
  actionKey?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_governance_policy_engine_dashboard");
  if (error) throw new Error(error.message);
  const dashboard = data as Record<string, unknown>;
  const requirements = dashboard.approval_requirements as Record<string, Record<string, unknown>>;
  const key = riskLevel === "low" || riskLevel === "medium" || riskLevel === "high" ? riskLevel : "medium";
  const result = requirements?.[key] ?? {};
  if (actionKey) return { ...result, action_key: actionKey };
  return result;
}

export async function detectPolicyViolations(
  supabase: GovernanceRpcClient
): Promise<Array<Record<string, unknown>>> {
  const { data, error } = await supabase.rpc("detect_policy_violations");
  if (error) throw new Error(error.message);
  return (data as Array<Record<string, unknown>>) ?? [];
}

export async function schedulePolicyReview(
  supabase: GovernanceRpcClient,
  policyId: string,
  scheduledAt?: string,
  ownerUserId?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("schedule_policy_review", {
    p_policy_id: policyId,
    p_scheduled_at: scheduledAt ?? null,
    p_owner_user_id: ownerUserId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function acknowledgePolicyViolation(
  supabase: GovernanceRpcClient,
  violationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("acknowledge_policy_violation", {
    p_violation_id: violationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function activateOrganizationPolicy(
  supabase: GovernanceRpcClient,
  policyId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("activate_organization_policy", {
    p_policy_id: policyId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function archiveOrganizationPolicy(
  supabase: GovernanceRpcClient,
  policyId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("archive_organization_policy", {
    p_policy_id: policyId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createGovernanceAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
