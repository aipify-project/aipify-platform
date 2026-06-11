/**
 * Quality Guardian Engine helpers (Phase A.13).
 * Authoritative enforcement lives in Supabase RPCs (_qge_*).
 */

export const QUALITY_CHECK_CATEGORIES = [
  "support_quality",
  "knowledge_quality",
  "ai_recommendation_quality",
  "approval_workflow",
  "integration_reliability",
  "onboarding_effectiveness",
  "operational_responsiveness",
] as const;

export const QUALITY_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export const QUALITY_CHECK_STATUSES = ["open", "investigating", "resolved", "ignored"] as const;
export const QUALITY_RECOMMENDATION_URGENCIES = ["low", "moderate", "high", "critical"] as const;

export type QualityCheckCategory = (typeof QUALITY_CHECK_CATEGORIES)[number];
export type QualitySeverity = (typeof QUALITY_SEVERITIES)[number];
export type QualityCheckStatus = (typeof QUALITY_CHECK_STATUSES)[number];
export type QualityRecommendationUrgency = (typeof QUALITY_RECOMMENDATION_URGENCIES)[number];

type QualityRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isCriticalQualitySeverity(severity?: string): boolean {
  return severity === "critical" || severity === "high";
}

export function canManageQuality(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canResolveQuality(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function runQualityScan(
  supabase: QualityRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("run_quality_scan");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function resolveQualityCheck(
  supabase: QualityRpcClient,
  checkId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("resolve_quality_check", {
    p_check_id: checkId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function ignoreQualityFinding(
  supabase: QualityRpcClient,
  checkId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("ignore_quality_finding", {
    p_check_id: checkId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function acceptQualityRecommendation(
  supabase: QualityRpcClient,
  recommendationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("accept_quality_recommendation", {
    p_recommendation_id: recommendationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function rejectQualityRecommendation(
  supabase: QualityRpcClient,
  recommendationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("reject_quality_recommendation", {
    p_recommendation_id: recommendationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createQualityAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
