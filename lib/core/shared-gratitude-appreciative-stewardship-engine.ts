/**
 * Humanity's Shared Gratitude & Appreciative Stewardship Engine helpers (Phase 188).
 * Authoritative enforcement lives in Supabase RPCs (_hsgas_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getSharedGratitudeAppreciativeStewardshipEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_gratitude_appreciative_stewardship_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSharedGratitudeAppreciativeStewardshipEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_gratitude_appreciative_stewardship_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createSharedGratitudeAppreciativeStewardshipEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
