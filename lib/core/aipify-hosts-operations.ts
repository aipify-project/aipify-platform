/**
 * Aipify Hosts — Operations Center (Phase Airbnb 13).
 * Authoritative enforcement lives in Supabase RPCs (_ahostops_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsOperationsDashboard(
  supabase: RpcClient,
  section = "today",
  filter = "today",
  propertyId?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_operations_dashboard", {
    p_section: section,
    p_filter: filter,
    p_property_id: propertyId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsOperationsCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_operations_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recordAipifyHostsOperationsAction(
  supabase: RpcClient,
  action: "status_change" | "approve" | "decline" | "assign",
  itemId: string,
  board?: string,
  newStatus?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_aipify_hosts_operations_action", {
    p_action: action,
    p_item_id: itemId,
    p_board: board ?? null,
    p_new_status: newStatus ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
