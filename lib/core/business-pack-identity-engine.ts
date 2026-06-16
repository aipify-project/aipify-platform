/**
 * Foundation 01 — Business Pack Identity Engine.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getBusinessPackIdentityLanding(
  supabase: RpcClient,
  packKey: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_identity_landing", { p_pack_key: packKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackIdentityEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_identity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackIdentityEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_identity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performBusinessPackIdentityAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    packKey?: string | null;
    payload?: Record<string, unknown>;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_business_pack_identity_action", {
    p_action_type: params.actionType,
    p_pack_key: params.packKey ?? null,
    p_payload: params.payload ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
