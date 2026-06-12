/**
 * Wonder Engine helpers (Phase A.88).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const WONDER_MOMENT_TYPES = [
  "milestone",
  "challenge_overcome",
  "customer_impact",
  "team_extraordinary",
  "vision_becoming_reality",
] as const;
export type WonderMomentType = (typeof WONDER_MOMENT_TYPES)[number];

export const WONDER_REFLECTION_STATUSES = ["pending", "acknowledged", "dismissed"] as const;
export type WonderReflectionStatus = (typeof WONDER_REFLECTION_STATUSES)[number];

export const WONDER_CELEBRATION_CADENCES = ["low", "normal"] as const;
export type WonderCelebrationCadence = (typeof WONDER_CELEBRATION_CADENCES)[number];

export const WONDER_ENGINE_PERMISSION_KEYS = [
  "wonder_engine.view",
  "wonder_engine.manage",
  "wonder_engine.export",
  "wonder_engine.reflections.acknowledge",
] as const;
export type WonderEnginePermissionKey = (typeof WONDER_ENGINE_PERMISSION_KEYS)[number];

export const WONDER_ENGINE_MODULE_KEY = "wonder_engine" as const;

export async function getWonderEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_wonder_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getWonderEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_wonder_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createWonderEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
