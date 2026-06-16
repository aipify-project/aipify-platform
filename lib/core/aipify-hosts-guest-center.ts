/**
 * Aipify Hosts — Guest Center (Phase Airbnb 15).
 * Authoritative enforcement lives in Supabase RPCs (_ahostguest_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsGuestCenterDashboard(
  supabase: RpcClient,
  section = "active_guests",
  filter = "active_guests",
  guestId?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_guest_center_dashboard", {
    p_section: section,
    p_filter: filter,
    p_guest_id: guestId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsGuestCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_guest_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function addAipifyHostsGuestNote(
  supabase: RpcClient,
  guestId: string,
  noteText: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("add_aipify_hosts_guest_note", {
    p_guest_id: guestId,
    p_note_text: noteText,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsGuestRequestStatus(
  supabase: RpcClient,
  requestId: string,
  status: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_guest_request_status", {
    p_request_id: requestId,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
