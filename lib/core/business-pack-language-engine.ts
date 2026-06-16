/**
 * Foundation 03 — Business Pack Language Engine.
 */

import type { RpcClient } from "./rpc-client";

export async function getBusinessPackLanguageCenter(
  supabase: RpcClient,
  packKey: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_language_center", { p_pack_key: packKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackLanguageEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_language_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackLanguageEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_language_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performBusinessPackLanguageAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    packKey?: string | null;
    payload?: Record<string, unknown>;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_business_pack_language_action", {
    p_action_type: params.actionType,
    p_pack_key: params.packKey ?? null,
    p_payload: params.payload ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
