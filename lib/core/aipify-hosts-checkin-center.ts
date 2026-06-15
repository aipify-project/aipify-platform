/**
 * Aipify Hosts — Check-In Center (Phase Airbnb 27).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsCheckinCenterDashboard(
  supabase: RpcClient,
  section = "upcoming_check_ins",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_checkin_center_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsCheckinCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_checkin_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsCheckinAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    recordType?: string;
    recordId?: string | null;
    notes?: string | null;
    departureOutcome?: string | null;
    damage?: boolean | null;
    missing?: boolean | null;
    maintenance?: boolean | null;
    exceptional?: boolean | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_checkin_action", {
    p_action_type: params.actionType,
    p_record_type: params.recordType ?? "checkin",
    p_record_id: params.recordId ?? null,
    p_notes: params.notes ?? null,
    p_departure_outcome: params.departureOutcome ?? null,
    p_damage: params.damage ?? null,
    p_missing: params.missing ?? null,
    p_maintenance: params.maintenance ?? null,
    p_exceptional: params.exceptional ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
