/**
 * Aipify Hosts — Trust, Compliance & Neighborhood Intelligence (Phase Airbnb 05).
 * Authoritative enforcement lives in Supabase RPCs (_ahosttrust_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsTrustComplianceDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_trust_compliance_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsTrustComplianceCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_trust_compliance_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
