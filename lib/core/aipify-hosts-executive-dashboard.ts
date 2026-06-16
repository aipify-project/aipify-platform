/**
 * Aipify Hosts — Executive Dashboard (Phase Airbnb 36).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsExecutiveDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_executive_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsExecutiveDashboardCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_executive_dashboard_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsExecutiveAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    preferences?: Record<string, unknown> | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_executive_action", {
    p_action_type: params.actionType,
    p_preferences: params.preferences ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
