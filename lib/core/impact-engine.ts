/**
 * Impact Engine helpers (Phase A.85).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const IMPACT_DIMENSIONS = [
  "operational",
  "customer",
  "human",
  "knowledge",
  "strategic",
] as const;
export type ImpactDimension = (typeof IMPACT_DIMENSIONS)[number];

export const IMPACT_CONFIDENCE_LEVELS = ["low", "moderate", "high"] as const;
export type ImpactConfidence = (typeof IMPACT_CONFIDENCE_LEVELS)[number];

export const IMPACT_REPORTING_CADENCES = ["weekly", "monthly", "quarterly"] as const;
export type ImpactReportingCadence = (typeof IMPACT_REPORTING_CADENCES)[number];

export const IMPACT_REPORT_STATUSES = ["draft", "published", "archived"] as const;
export type ImpactReportStatus = (typeof IMPACT_REPORT_STATUSES)[number];

export const IMPACT_ENGINE_PERMISSION_KEYS = [
  "impact_engine.view",
  "impact_engine.manage",
  "impact_engine.export",
  "impact_engine.reports.generate",
] as const;
export type ImpactEnginePermissionKey = (typeof IMPACT_ENGINE_PERMISSION_KEYS)[number];

export const IMPACT_ENGINE_MODULE_KEY = "impact_engine" as const;

export async function getImpactEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_impact_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getImpactEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_impact_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createImpactEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
