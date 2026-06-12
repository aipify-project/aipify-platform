/**
 * Companion Identity Engine helpers (Phase A.84).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const COMPANION_IDENTITY_MODULE_KEYS = [
  "support",
  "admin_assistant",
  "knowledge_center",
  "companion",
  "commerce",
  "executive",
] as const;
export type CompanionIdentityModuleKey = (typeof COMPANION_IDENTITY_MODULE_KEYS)[number];

export const COMPANION_IDENTITY_PERMISSION_KEYS = [
  "companion_identity.view",
  "companion_identity.manage",
  "companion_identity.export",
] as const;
export type CompanionIdentityPermissionKey = (typeof COMPANION_IDENTITY_PERMISSION_KEYS)[number];

export const COMPANION_IDENTITY_MODULE_KEY = "companion_identity_engine" as const;

export async function getCompanionIdentityEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_identity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionIdentityEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_identity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCompanionIdentityAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
