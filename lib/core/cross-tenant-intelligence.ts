/**
 * Cross-Tenant Intelligence Engine helpers (Phase A.71).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const CROSS_TENANT_PARTICIPATION_STATUSES = [
  "disabled",
  "internal_only",
  "anonymized_contributor",
] as const;
export type CrossTenantParticipationStatus = (typeof CROSS_TENANT_PARTICIPATION_STATUSES)[number];

export const CROSS_TENANT_INSIGHT_CATEGORIES = [
  "industry_trends",
  "adoption",
  "support",
  "workflow",
  "training",
  "maturity",
  "improvement",
] as const;
export type CrossTenantInsightCategory = (typeof CROSS_TENANT_INSIGHT_CATEGORIES)[number];

export const CROSS_TENANT_CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;
export type CrossTenantConfidenceLevel = (typeof CROSS_TENANT_CONFIDENCE_LEVELS)[number];

export const CROSS_TENANT_ANONYMIZATION_LEVELS = ["standard", "enhanced"] as const;
export type CrossTenantAnonymizationLevel = (typeof CROSS_TENANT_ANONYMIZATION_LEVELS)[number];

export const CROSS_TENANT_OUTCOME_STATUSES = [
  "pending",
  "approved",
  "implemented",
  "dismissed",
] as const;
export type CrossTenantOutcomeStatus = (typeof CROSS_TENANT_OUTCOME_STATUSES)[number];

export async function getCrossTenantIntelligenceEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_cross_tenant_intelligence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCrossTenantIntelligenceEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_cross_tenant_intelligence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveCrossTenantSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_cross_tenant_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCrossTenantIntelligenceAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
