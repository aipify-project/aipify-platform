import type { RpcClient } from "@/lib/core/rpc-client";

export async function getAssetManagementCenter(
  supabase: RpcClient,
  params: { category?: string; assetType?: string } = {},
) {
  const { data, error } = await supabase.rpc("get_asset_management_center", {
    p_category: params.category ?? null,
    p_asset_type: params.assetType ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAssetManagementAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_asset_management_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionAssetContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_asset_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyAssignedAssets(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_assigned_assets");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildAssetManagementLabels } from "./labels";
export type { AssetManagementLabels } from "./labels";
