/**
 * Aipify Hosts — Guest Experience Center (Phase Airbnb 30).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsGuestExperienceDashboard(
  supabase: RpcClient,
  section = "experience_overview",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_guest_experience_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsGuestExperienceCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_guest_experience_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsGuestExperienceAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    recoveryId?: string | null;
    propertyId?: string | null;
    assignedOwner?: string | null;
    notes?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_guest_experience_action", {
    p_action_type: params.actionType,
    p_recovery_id: params.recoveryId ?? null,
    p_property_id: params.propertyId ?? null,
    p_assigned_owner: params.assignedOwner ?? null,
    p_notes: params.notes ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
