/**
 * Foundation 02 — Business Pack License Engine.
 */

import type { RpcClient } from "./rpc-client";

export async function getBusinessPackLicenseCenter(
  supabase: RpcClient,
  packKey: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_license_center", { p_pack_key: packKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackLicenseEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_license_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackLicenseEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_license_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performBusinessPackLicenseAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    packKey?: string | null;
    payload?: Record<string, unknown>;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_business_pack_license_action", {
    p_action_type: params.actionType,
    p_pack_key: params.packKey ?? null,
    p_payload: params.payload ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
