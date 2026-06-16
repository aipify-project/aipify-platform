/**
 * Aipify Hosts — Team Center (Phase Airbnb 17).
 * Authoritative enforcement lives in Supabase RPCs (_ahostteam_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsTeamCenterDashboard(
  supabase: RpcClient,
  section = "team_members",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_team_center_dashboard", {
    p_section: section,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsTeamCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_team_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function sendAipifyHostsTeamInvitation(
  supabase: RpcClient,
  email: string,
  roleKey: string,
  propertyIds: string[],
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("send_aipify_hosts_team_invitation", {
    p_email: email,
    p_role_key: roleKey,
    p_property_ids: propertyIds,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsTeamMemberRole(
  supabase: RpcClient,
  memberId: string,
  roleKey: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_team_member_role", {
    p_member_id: memberId,
    p_role_key: roleKey,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsTeamMemberProperties(
  supabase: RpcClient,
  memberId: string,
  propertyIds: string[],
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_team_member_properties", {
    p_member_id: memberId,
    p_property_ids: propertyIds,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function revokeAipifyHostsTeamInvitation(
  supabase: RpcClient,
  invitationId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("revoke_aipify_hosts_team_invitation", {
    p_invitation_id: invitationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function removeAipifyHostsTeamMember(
  supabase: RpcClient,
  memberId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("remove_aipify_hosts_team_member", {
    p_member_id: memberId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
