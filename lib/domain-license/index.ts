import type { RpcClient } from "@/lib/core/rpc-client";

export async function getDomainLicenseCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_domain_license_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performDomainLicenseAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_domain_license_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionDomainContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_domain_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildDomainLicenseLabels } from "./labels";
export type { DomainLicenseLabels } from "./labels";
