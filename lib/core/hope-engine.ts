/**
 * Hope Engine helpers (Phase A.92).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const HOPE_CONTEXT_TYPES = [
  "change",
  "setback",
  "demanding_project",
  "failed_attempt",
  "uncertainty",
  "invisible_progress",
  "personal_challenge",
] as const;
export type HopeContextType = (typeof HOPE_CONTEXT_TYPES)[number];

export const HOPE_REFLECTION_STATUSES = ["pending", "acknowledged", "dismissed"] as const;
export type HopeReflectionStatus = (typeof HOPE_REFLECTION_STATUSES)[number];

export const HOPE_ENGINE_PERMISSION_KEYS = [
  "hope_engine.view",
  "hope_engine.manage",
  "hope_engine.export",
  "hope_engine.reflections.acknowledge",
] as const;
export type HopeEnginePermissionKey = (typeof HOPE_ENGINE_PERMISSION_KEYS)[number];

export const HOPE_ENGINE_MODULE_KEY = "hope_engine" as const;

export async function getHopeEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_hope_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getHopeEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_hope_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createHopeEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
