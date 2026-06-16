/**
 * Aipify Hosts — Upgrade Signals (Phase Airbnb 32).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsUpgradeSignalsDashboard(
  supabase: RpcClient,
  surface = "upgrade_signals",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_upgrade_signals_dashboard", { p_surface: surface });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsUpgradeSignalsCard(
  supabase: RpcClient,
  surface = "embed",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_upgrade_signals_card", { p_surface: surface });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsUpgradeSignalAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    recommendationKey?: string | null;
    signalKey?: string | null;
    payload?: Record<string, unknown>;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_upgrade_signal_action", {
    p_action_type: params.actionType,
    p_recommendation_key: params.recommendationKey ?? null,
    p_signal_key: params.signalKey ?? null,
    p_payload: params.payload ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
