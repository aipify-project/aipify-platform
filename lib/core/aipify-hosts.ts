/**
 * Aipify Hosts — Hospitality Business Pack (Phase Airbnb 01).
 * Authoritative enforcement lives in Supabase RPCs (_ahost_* / _ahostlic_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function assertAipifyHostsPropertyCapacity(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("assert_aipify_hosts_property_capacity");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsProperty(
  supabase: RpcClient,
  params: { display_name: string; platform_source?: string; property_key?: string },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_property", {
    p_display_name: params.display_name,
    p_platform_source: params.platform_source ?? "direct",
    p_property_key: params.property_key ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function addAipifyHostsPropertyLicense(
  supabase: RpcClient,
  count = 1,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("add_aipify_hosts_property_license", { p_count: count });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
