/**
 * Aipify Hosts — Property Center (Phase Airbnb 14).
 * Authoritative enforcement lives in Supabase RPCs (_ahostprop_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsPropertyCenterDashboard(
  supabase: RpcClient,
  propertyId?: string | null,
  section = "overview",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_property_center_dashboard", {
    p_property_id: propertyId ?? null,
    p_section: section,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsPropertyCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_property_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsPropertyProfile(
  supabase: RpcClient,
  propertyId: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_property_profile", {
    p_property_id: propertyId,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function archiveAipifyHostsProperty(
  supabase: RpcClient,
  propertyId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("archive_aipify_hosts_property", {
    p_property_id: propertyId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function assignAipifyHostsPropertyTeam(
  supabase: RpcClient,
  propertyId: string,
  roleKey: string,
  assigneeName: string,
  assigneeContact?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("assign_aipify_hosts_property_team", {
    p_property_id: propertyId,
    p_role_key: roleKey,
    p_assignee_name: assigneeName,
    p_assignee_contact: assigneeContact ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
