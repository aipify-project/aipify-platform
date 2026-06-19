import type { RpcClient } from "@/lib/core/rpc-client";

export async function getInstallDiscoveryCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_install_discovery_data_connection_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performInstallDiscoveryAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_install_discovery_data_connection_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionInstallDiscoveryContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_install_discovery_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyInstallDiscoverySummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_install_discovery_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildInstallDiscoveryLabels } from "./labels";
export type { InstallDiscoveryLabels } from "./labels";
