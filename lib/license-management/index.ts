import type { RpcClient } from "@/lib/core/rpc-client";

export async function getLicenseSubscriptionCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_license_subscription_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performLicenseSubscriptionAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_license_subscription_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionLicenseContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_license_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildLicenseManagementLabels } from "./labels";
export type { LicenseManagementLabels } from "./labels";
