/**
 * Foundation 08 — Business Pack Marketplace Engine.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getBusinessPackMarketplaceHome(
  supabase: RpcClient,
  locale = "en",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_marketplace_home", { p_locale: locale });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackMarketplaceListing(
  supabase: RpcClient,
  packKey: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_marketplace_listing", { p_pack_key: packKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackMarketplaceInstall(
  supabase: RpcClient,
  packKey: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_marketplace_install", { p_pack_key: packKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackMarketplaceEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_marketplace_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackMarketplaceEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_marketplace_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performBusinessPackMarketplaceAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    packKey?: string | null;
    payload?: Record<string, unknown>;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_business_pack_marketplace_action", {
    p_action_type: params.actionType,
    p_pack_key: params.packKey ?? null,
    p_payload: params.payload ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
