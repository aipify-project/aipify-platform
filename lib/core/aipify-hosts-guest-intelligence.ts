/**
 * Aipify Hosts — Guest Intelligence & Loyalty (Phase Airbnb 04).
 * Authoritative enforcement lives in Supabase RPCs (_ahostguest_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsGuestIntelligenceDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_guest_intelligence_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsGuestIntelligenceCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_guest_intelligence_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
