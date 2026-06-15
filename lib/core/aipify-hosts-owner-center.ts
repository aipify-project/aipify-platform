/**
 * Aipify Hosts — Owner Center (Phase Airbnb 28).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsOwnerCenterDashboard(
  supabase: RpcClient,
  section = "owner_stays",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_owner_center_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsOwnerCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_owner_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsOwnerAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    blockId?: string | null;
    propertyId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    blockType?: string | null;
    notes?: string | null;
    overrideType?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_owner_action", {
    p_action_type: params.actionType,
    p_block_id: params.blockId ?? null,
    p_property_id: params.propertyId ?? null,
    p_start_date: params.startDate ?? null,
    p_end_date: params.endDate ?? null,
    p_block_type: params.blockType ?? null,
    p_notes: params.notes ?? null,
    p_override_type: params.overrideType ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
