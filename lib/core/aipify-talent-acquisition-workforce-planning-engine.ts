/**
 * Aipify Talent Acquisition & Workforce Planning Engine helpers (Phase 221).
 * Authoritative enforcement lives in Supabase RPCs (_atawpe_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyTalentAcquisitionWorkforcePlanningEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_talent_acquisition_workforce_planning_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyTalentAcquisitionWorkforcePlanningEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_talent_acquisition_workforce_planning_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyTalentAcquisitionWorkforcePlanningEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
