/**
 * Aipify Hosts — Referral & Growth Engine (Phase Airbnb 10).
 * Authoritative enforcement lives in Supabase RPCs (_ahostref_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsReferralDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_referral_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsReferralCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_referral_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function generateAipifyHostsReferralLink(
  supabase: RpcClient,
  referralRole: "host" | "service_provider" | "growth_partner" = "host",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("generate_aipify_hosts_referral_link", {
    p_referral_role: referralRole,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
