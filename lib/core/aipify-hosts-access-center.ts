/**
 * Aipify Hosts — Access Center (Phase Airbnb 16).
 * Authoritative enforcement lives in Supabase RPCs (_ahostaccess_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyHostsAccessCenterDashboard(
  supabase: RpcClient,
  section = "access_overview",
  filter = "all_properties",
  propertyId?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_access_center_dashboard", {
    p_section: section,
    p_filter: filter,
    p_property_id: propertyId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsAccessCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_access_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsPropertyAccessProfile(
  supabase: RpcClient,
  params: {
    property_id: string;
    access_method?: string;
    access_instructions?: string;
    emergency_access_procedure?: string;
    backup_contact?: string;
    access_ready?: boolean;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_property_access_profile", {
    p_property_id: params.property_id,
    p_access_method: params.access_method ?? null,
    p_access_instructions: params.access_instructions ?? null,
    p_emergency_access_procedure: params.emergency_access_procedure ?? null,
    p_backup_contact: params.backup_contact ?? null,
    p_access_ready: params.access_ready ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsAccessInstructions(
  supabase: RpcClient,
  params: {
    property_id: string;
    check_in_guidance?: string;
    parking_guidance?: string;
    building_entry_instructions?: string;
    wifi_information?: string;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_access_instructions", {
    p_property_id: params.property_id,
    p_check_in_guidance: params.check_in_guidance ?? null,
    p_parking_guidance: params.parking_guidance ?? null,
    p_building_entry_instructions: params.building_entry_instructions ?? null,
    p_wifi_information: params.wifi_information ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function revokeAipifyHostsAccessCode(
  supabase: RpcClient,
  codeId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("revoke_aipify_hosts_access_code", {
    p_code_id: codeId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
