/**
 * Aipify Hosts — Property Health Score (Phase Airbnb 29).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsPropertyHealthDashboard(
  supabase: RpcClient,
  section = "portfolio_overview",
  propertyId?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_property_health_dashboard", {
    p_section: section,
    p_property_id: propertyId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsPropertyHealthCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_property_health_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsPropertyHealthAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    propertyId?: string | null;
    recommendationId?: string | null;
    riskId?: string | null;
    notes?: string | null;
    overrideScore?: number | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_property_health_action", {
    p_action_type: params.actionType,
    p_property_id: params.propertyId ?? null,
    p_recommendation_id: params.recommendationId ?? null,
    p_risk_id: params.riskId ?? null,
    p_notes: params.notes ?? null,
    p_override_score: params.overrideScore ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
