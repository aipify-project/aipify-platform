/**
 * Purpose & Values Engine helpers (Phase A.82).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const VALUES_SIGNAL_TYPES = [
  "alignment",
  "drift",
  "celebration",
  "tension",
  "opportunity",
] as const;
export type ValuesSignalType = (typeof VALUES_SIGNAL_TYPES)[number];

export const VALUES_REFLECTION_STATUSES = ["pending", "dismissed", "acknowledged"] as const;
export type ValuesReflectionStatus = (typeof VALUES_REFLECTION_STATUSES)[number];

export const PURPOSE_VALUES_PERMISSION_KEYS = [
  "purpose_values.view",
  "purpose_values.manage",
  "purpose_values.values.edit",
  "purpose_values.export",
] as const;
export type PurposeValuesPermissionKey = (typeof PURPOSE_VALUES_PERMISSION_KEYS)[number];

export const PURPOSE_VALUES_MODULE_KEY = "purpose_values_engine" as const;

export async function getPurposeValuesEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_purpose_values_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPurposeValuesEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_purpose_values_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function listOrganizationStatedValues(
  supabase: RpcClient,
  activeOnly = true
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("list_organization_stated_values", {
    p_active_only: activeOnly,
  });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export function createPurposeValuesAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
